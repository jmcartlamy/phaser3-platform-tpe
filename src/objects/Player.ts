import { IPlayer } from '../types';
import SmoothedHorizontalControl from './helpers/SmoothedHorizontalControl';
import smoothMoveCameraTowards from './helpers/smoothMoveCameraTowards';
import { Characters, PLAYER_COLLECTION } from '../constants';
import restartSceneWithDelay from '../scenes/helpers/restartSceneWithDelay';
import SceneFactory from '../scenes/SceneFactory';

export default class Player {
  private readonly currentScene: SceneFactory;
  private currentMap: Phaser.Tilemaps.Tilemap;

  public collection: IPlayer;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private smoothedControls: SmoothedHorizontalControl;
  private readonly camera: Phaser.Cameras.Scene2D.Camera;

  constructor(
    scene: SceneFactory,
    map: Phaser.Tilemaps.Tilemap,
    positionX: number,
    positionY: number
  ) {
    this.currentScene = scene;
    this.currentMap = map;
    this.camera = this.currentScene.cameras.main;

    this.collection = {
      ...PLAYER_COLLECTION,
      matterSprite: this.currentScene.matter.add.sprite(0, 0, Characters.Player, 4)
    };

    // Create cursor keys for camera
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();
    this.smoothedControls = new SmoothedHorizontalControl(0.001);

    // Create a collection's bodies to be a compound body.
    this.createCompoundBody(positionX, positionY);
    this.animateCompoundBody();

    // Position Camera
    this.camera.setBounds(0, 0, this.currentMap.widthInPixels, this.currentMap.heightInPixels);
    smoothMoveCameraTowards(this.collection.matterSprite, this.camera);
    this.collection.matterSprite.setSleepThreshold(0);
  }

  public update(time: number, delta: number) {
    if (!this.collection.matterSprite) {
      return;
    }

    // Horizontal movement
    this.processHorizontalMovement(delta);

    // Jump
    this.processVerticalMovement(time);

    // Follow body with camera
    smoothMoveCameraTowards(this.collection.matterSprite, this.camera, 0.9);
  }

  public destroyCompoundBody() {
    // Player death
    this.collection.matterSprite.destroy();
    this.collection.matterSprite = null;

    this.camera.fade(500, 0, 0, 0);
    this.camera.shake(250, 0.01);

    // Reset Scene
    restartSceneWithDelay(this.currentScene);
  }

  private createCompoundBody(positionX: number, positionY: number) {
    const width = this.collection.matterSprite.width;
    const height = this.collection.matterSprite.height;
    let bodies: any = this.currentScene.matter.bodies;

    this.collection.body = bodies.rectangle(0, 0, width * 0.75, height, {
      chamfer: { radius: 10 },
      label: Characters.Player
    });
    this.collection.sensors.bottom = bodies.rectangle(0, height * 0.5, width * 0.5, 5, {
      isSensor: true
    });
    this.collection.sensors.left = bodies.rectangle(-width * 0.45, 0, 5, height * 0.25, {
      isSensor: true
    });
    this.collection.sensors.right = bodies.rectangle(width * 0.45, 0, 5, height * 0.25, {
      isSensor: true
    });

    // @ts-ignore
    const compoundBody = this.currentScene.matter.body.create({
      parts: [
        this.collection.body,
        this.collection.sensors.bottom,
        this.collection.sensors.left,
        this.collection.sensors.right
      ],
      restitution: 0.05 // Prevent body from sticking against a wall
    });

    this.collection.matterSprite.setExistingBody(compoundBody);
    this.collection.matterSprite
      .setFixedRotation() // Sets max inertia to prevent rotation
      .setPosition(positionX, positionY);
  }

  private animateCompoundBody() {
    this.currentScene.anims.create({
      key: 'left',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'right',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });
    this.currentScene.anims.create({
      key: 'idle',
      frames: this.currentScene.anims.generateFrameNumbers(Characters.Player, {
        start: 4,
        end: 4
      }),
      frameRate: 10,
      repeat: -1
    });
  }

  private processHorizontalMovement(delta: number) {
    if (this.cursors.left.isDown && !this.collection.blocked.left) {
      this.smoothedControls.moveLeft(delta);
      this.collection.matterSprite.anims.play('left', true);

      this.simulateControlledAcceleration('left');
    } else if (this.cursors.right.isDown && !this.collection.blocked.right) {
      this.smoothedControls.moveRight(delta);
      this.collection.matterSprite.anims.play('right', true);

      this.simulateControlledAcceleration('right');
    } else {
      this.smoothedControls.reset();
      this.collection.matterSprite.anims.play('idle', true);
    }
  }

  private processVerticalMovement(time: number) {
    // Add a slight delay between jumps since the collection will still collide
    // for a few frames after a jump is initiated
    const canJump = time - this.collection.lastJumpedAt > 500;
    const didPressJump = Phaser.Input.Keyboard.JustDown(this.cursors.up);

    if (canJump && !this.collection.canDoubleJump && this.collection.blocked.bottom) {
      this.collection.canDoubleJump = true;
    }

    if (didPressJump) {
      if (this.collection.blocked.bottom) {
        // Jump
        this.collection.matterSprite.setVelocityY(-this.collection.speed.jump);
        this.collection.lastJumpedAt = time;
      } else if (this.collection.blocked.left) {
        // Jump up and away from the wall
        this.collection.matterSprite.setVelocityY(-this.collection.speed.jump);
        this.collection.matterSprite.setVelocityX(this.collection.speed.run);
        this.collection.lastJumpedAt = time;
      } else if (this.collection.blocked.right) {
        // Jump up and away from the wall
        this.collection.matterSprite.setVelocityY(-this.collection.speed.jump);
        this.collection.matterSprite.setVelocityX(-this.collection.speed.run);
        this.collection.lastJumpedAt = time;
      } else if (this.collection.canDoubleJump) {
        // Double Jump
        this.collection.matterSprite.setVelocityY(-this.collection.speed.jump);
        this.collection.canDoubleJump = false;
        this.collection.lastJumpedAt = time;
      }
    }
  }

  private simulateControlledAcceleration(direction: 'left' | 'right') {
    // Linear interpolation of the velocity towards the max run using the smoothed controls.
    // This simulates a player controlled acceleration.
    const directionX = direction === 'left' ? -1 : 1;
    // @ts-ignore
    const oldVelocityX = this.collection.matterSprite.body.velocity.x;
    const targetVelocityX = this.collection.speed.run * directionX;
    const smoothedVelocityX = this.smoothedControls.value * directionX;

    const newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, smoothedVelocityX);

    this.collection.matterSprite.setVelocityX(newVelocityX);
  }
}
