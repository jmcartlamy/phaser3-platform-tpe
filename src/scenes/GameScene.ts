import axios from 'axios';

import balls from '../assets/sprites/balls.png';
import settings from '../assets/sprites/settings.png';
import player from '../assets/sprites/player.png';
//import map from '../assets/tilemaps/tileset-collision-shapes.json';
import map from '../assets/tilemaps/map3.json';

import tileMaps from '../assets/tilemaps/kenny_platformer_64x64.png';

import TileMap from '../objects/TileMap';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';

import addBallsToActivePointer from '../objects/events/addBallsToActivePointer';
import handleBallsCollision from '../objects/events/handleBallsCollision';
import { Characters, GameScenes, ENEMY_AVAILABLE_POSITION } from '../constants';
import handlePlayerCollision from '../objects/events/handlePlayerCollision';
import { PhaserGame, PayloadMouseEvent, PayloadAction } from '../types';
import addBalls from '../helpers/phaser/addBalls';
import translateCoordinatesToScreen from '../helpers/twitch/translateCoordinatesToScreen';
import userInterface from './userInterface/GameScene.json';

export default class GameScene extends Phaser.Scene {
  public player: Player;
  public blob: Enemy[];
  public game: PhaserGame;

  constructor() {
    super({
      key: GameScenes.Game
    });
    this.blob = [];
  }

  public preload() {
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
    this.load.tilemapTiledJSON('map', map);
    this.load.image('tileMaps', tileMaps);
    this.load.image('tileMapsNC', tileMaps);
  }

  public create() {
    // TODO Update interactive scene
    // this.game.interactive?.onGame(this);
    try {
      axios({
        method: 'POST',
        url: location.protocol + '//localhost:8081/api/user/interface',
        data: {
          channelId: this.registry.get('channelId'),
          userInterface: JSON.stringify(userInterface)
        }
      });
    } catch (err) {
      console.log(err);
    }

    // Create map following json loaded
    const tilemap = new TileMap(this, 'map');

    // Create player and init his position
    this.player = new Player(this, tilemap.map, 17020, 2750);

    // Drop matter balls on pointer down.
    this.input.on('pointerdown', addBallsToActivePointer(this), this);

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
    this.matter.world.on('collisionactive', handlePlayerCollision(this));

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
        this.scene.launch(GameScenes.Pause);
        this.scene.pause(GameScenes.Game);
        this.game.interactive?.pause();
      },
      this
    );

    if (this.game.socket) {
      // Add balls when we receive a message on mouse event from EBS
      this.game.socket.on(
        'mouse',
        function(evt: PayloadMouseEvent) {
          const { x, y } = translateCoordinatesToScreen(this, evt);
          addBalls(this, x, y);
        }.bind(this)
      );

      // Add NPC when we receive a message on action from EBS
      this.game.socket.on(
        'action',
        function(evt: PayloadAction) {
          const position = ENEMY_AVAILABLE_POSITION[Phaser.Math.RND.integerInRange(1, 10)];
          this.blob.push(new Enemy(this, position.x, position.y, position.direction, evt.username));
        }.bind(this)
      );
    }
  }

  public update(time: number, delta: number) {
    this.player.update(time, delta);
  }
}
