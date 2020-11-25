import balls from '../assets/sprites/balls.png';
import settings from '../assets/sprites/settings.png';
import player from '../assets/sprites/player.png';
import tileMaps from '../assets/tilemaps/kenny_platformer_64x64.png';

import TileMap from '../objects/TileMap';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';

//import addBallsToActivePointer from '../objects/events/addBallsToActivePointer';
import handleBallsCollision from '../objects/events/handleBallsCollision';
import { Characters, SceneKeys } from '../constants';
import handlePlayerCollision from '../objects/events/handlePlayerCollision';
import { PhaserGame, SceneFactoryParams, WebSocketMessageContextEmit } from '../types';
import addBalls from '../helpers/phaser/addBalls';
import translateCoordinatesToScreen from '../helpers/twitch/translateCoordinatesToScreen';
import dispatchEnemyPosition from './helpers/dispatchEnemyPosition';
import restartSceneWithDelay from './helpers/restartSceneWithDelay';

export default class SceneFactory extends Phaser.Scene {
  public player: Player;
  public blob: Enemy[];
  public game: PhaserGame;
  public textScore: Phaser.GameObjects.Text;
  public textTime: Phaser.GameObjects.Text;
  public textTimer: NodeJS.Timeout;
  public isLevelFinished: boolean;
  protected params: SceneFactoryParams;

  constructor(params: SceneFactoryParams) {
    super({
      key: params.key
    });
    this.blob = [];
    this.params = params;
    this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this);
  }

  public preload() {
    this.isLevelFinished = false;

    this.load.spritesheet('balls', balls, { frameWidth: 17, frameHeight: 17 });
    this.load.spritesheet(Characters.Player, player, {
      frameWidth: 32,
      frameHeight: 42
    });
    this.load.spritesheet(Characters.Enemy, player, {
      frameWidth: 32,
      frameHeight: 42
    });
    this.load.spritesheet('settings', settings, {
      frameWidth: 48,
      frameHeight: 48
    });
    // @ts-ignore
    this.load.tilemapTiledJSON(this.params.map.key, this.params.map.tilemap);
    this.load.image('tileMaps', tileMaps);
    this.load.image('tileMapsNC', tileMaps);
  }

  public create() {
    // Attribute score variables
    this.game.score = {
      mouse: 0,
      action: 0,
      time: 0,
      bonus: 0,
      total: 0
    };

    // Send user interface with websocket
    this.game.interactive?.onGame(this.params.user.interface);

    // Create map following json loaded
    const tilemap = new TileMap(this, this.params.map.key);

    // Create player and init his position
    this.player = new Player(
      this,
      tilemap.map,
      this.params.position.player.x,
      this.params.position.player.y
    );

    // Drop matter balls on pointer down.
    //this.input.on('pointerdown', addBallsToActivePointer(this), this);

    // Loop over all the collision pairs that start colliding
    // on each step of the Matter engine.
    this.matter.world.on('collisionstart', handleBallsCollision(this), this);

    // Before matter's update, reset the player's count of what surfaces it is touching.
    this.matter.world.on('beforeupdate', () => {
      this.player.collection.numTouching.left = 0;
      this.player.collection.numTouching.right = 0;
      this.player.collection.numTouching.bottom = 0;
    });

    // Loop over the active colliding pairs and count the surfaces the player is touching.
    this.matter.world.on(
      'collisionactive',
      handlePlayerCollision(this, this.params.map.bestTime, this.params.map.nextMap)
    );

    // Update over, so now we can determine if any direction is blocked
    this.matter.world.on('afterupdate', () => {
      this.player.collection.blocked.right = this.player.collection.numTouching.right > 0;
      this.player.collection.blocked.left = this.player.collection.numTouching.left > 0;
      this.player.collection.blocked.bottom = this.player.collection.numTouching.bottom > 0;
    });

    // Create settings button
    const button = this.add
      .image(this.registry.get('innerWidth') - 16, 16, 'settings', 0)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setInteractive();
    button.on(
      'pointerup',
      function() {
        this.scene.launch(SceneKeys.Pause, { backgroundSceneKey: this.params.key });
        this.scene.pause(this.params.key);
      },
      this
    );

    // Create live score
    this.textScore = this.add
      .text(16, 16, 'Score: 0', {
        font: '22px Arial',
        fill: '#ffffff'
      })
      .setOrigin(0, 0)
      .setScrollFactor(0);
    this.textTime = this.add
      .text(16, 42, 'Time: 0', {
        font: '22px Arial',
        fill: '#ffffff'
      })
      .setOrigin(0, 0)
      .setScrollFactor(0);

    // Timer
    this.textTimer = setInterval(() => {
      if (!this.scene.isPaused() && !this.isLevelFinished) {
        this.game.score.time += 1;
        this.textTime.setText('Time: ' + this.game.score.time.toFixed());
      }
    }, 1000);

    // On press to key '1', we restart the scene
    this.input.keyboard.on('keyup_ONE', () => {
      restartSceneWithDelay(this, 0);
    });

    if (this.game.interactive.status === 1) {
      // Add balls when we receive a message on action or mouse event from EBS
      this.game.interactive.socket.addEventListener('message', this.handleWebSocketMessage, true);
    }
  }

  public handleWebSocketMessage(event: { data: string }) {
    const body: WebSocketMessageContextEmit = JSON.parse(event.data);
    console.log(body);
    if (body?.context === 'emit' && body?.data) {
      const { type, payload } = body.data;
      if (type === 'mouse') {
        const { x, y } = translateCoordinatesToScreen(this, payload);
        this.game.score.mouse += 2;
        this.game.score.total += 2;
        this.textScore.setText('Score: ' + this.game.score.total.toString());
        addBalls(this, x, y);
      }
      if (type === 'action') {
        const position = dispatchEnemyPosition(
          this.params.position.enemy,
          this.player.collection.body.position,
          this.params.map.direction
        );
        this.game.score.action += 15;
        this.game.score.total += 15;
        this.textScore.setText('Score: ' + this.game.score.total.toString());
        this.blob.push(
          new Enemy(this, position.x, position.y, position.direction, payload.username, payload.id)
        );
      }
    }
  }

  public update(time: number, delta: number) {
    this.player.update(time, delta);
  }
}
