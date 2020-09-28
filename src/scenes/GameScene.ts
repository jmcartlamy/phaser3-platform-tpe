import balls from '../assets/sprites/balls.png';
import settings from '../assets/sprites/settings.png';
import player from '../assets/sprites/player.png';
import map from '../assets/tilemaps/tileset-collision-shapes.json';
import tileMaps from '../assets/tilemaps/kenny_platformer_64x64.png';

import TileMap from '../objects/TileMap';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';

import addBallsToActivePointer from '../objects/events/addBallsToActivePointer';
import handleBallsCollision from '../objects/events/handleBallsCollision';
import { Characters, GAME_SCREEN_WIDTH, GameScenes } from '../constants';
import handlePlayerCollision from '../objects/events/handlePlayerCollision';
import { PhaserGame, PayloadMousedown } from '../types';
import addBalls from '../helpers/phaser/addBalls';
import translateCoordinatesToScreen from '../helpers/twitch/translateCoordinatesToScreen';

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
  }

  public create() {
    // TODO Update interactive scene
    // this.game.interactive?.onGame(this);

    // Create map following json loaded
    const tilemap = new TileMap(this, 'map');

    // Create player and init his position
    this.player = new Player(this, tilemap.map);

    // Create enemy
    this.blob.push(new Enemy(this, 1050, 300));
    this.blob.push(new Enemy(this, 1635, 200));

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
      .image(GAME_SCREEN_WIDTH - 16, 16, 'settings', 0)
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

    // Add balls when we receive a message on mousedown from EBS
    this.game.socket.on('mousedown', (function (evt: PayloadMousedown) {
      const { x, y } = translateCoordinatesToScreen(this, evt);
      addBalls(this, x, y);
    }).bind(this));

    // TODO NPC
  }

  public update(time: number, delta: number) {
    this.player.update(time, delta);
  }
}
