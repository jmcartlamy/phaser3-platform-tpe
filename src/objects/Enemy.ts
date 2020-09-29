import { IEnemy } from '../types';
import { ENEMY_COLLECTION, Characters } from '../constants';
import GameScene from '../scenes/GameScene';

export default class Enemy {
  private readonly currentScene: GameScene;
  public timer: NodeJS.Timeout
  public collection: IEnemy;

  constructor(scene: GameScene, x: number, y: number, direction: 'left' | 'right') {
    this.throwBallInInterval = this.throwBallInInterval.bind(this, direction);
    this.currentScene = scene;
    this.collection = {
      ...ENEMY_COLLECTION,
      matterSprite: this.currentScene.matter.add.sprite(0, 0, Characters.Enemy, direction === 'left' ? 1 : 8)
    };

    // Create a collection's bodies to be a compound body.
    this.createCompoundBody(x, y);

    // Throw ball with interval
    this.timer = setInterval(this.throwBallInInterval, 500)
  }

  public update(time: number, delta: number) {
    if (!this.collection.matterSprite) {
      return;
    }
  }

  public destroyCompoundBody() {
    // Enemy death
    this.collection.matterSprite.destroy();
    this.collection.matterSprite = null;
  }

  private createCompoundBody(x: number, y: number) {
    const width = this.collection.matterSprite.width;
    const height = this.collection.matterSprite.height;
    let bodies: any = this.currentScene.matter.bodies;

    this.collection.body = bodies.rectangle(0, 0, width * 0.75, height, {
      chamfer: { radius: 10 },
      label: Characters.Enemy
    });

    // @ts-ignore
    const compoundBody = this.currentScene.matter.body.create({
      parts: [
        this.collection.body
      ],
      restitution: 0.05 // Prevent body from sticking against a wall
    });

    this.collection.matterSprite.setExistingBody(compoundBody);
    this.collection.matterSprite
      .setFixedRotation() // Sets max inertia to prevent rotation
      .setPosition(x, y);
  }

  private throwBallInInterval(direction: 'left' | 'right') {
    const frame = Phaser.Math.RND.integerInRange(0, 5);
    const velocityX = Phaser.Math.RND.integerInRange(1, 4);
    const velocityY = Phaser.Math.RND.integerInRange(1, 3);
    // @ts-ignore
    const positionX = direction === 'left' ? this.collection.matterSprite.body.position.x - 20 : this.collection.matterSprite.body.position.x + 20
    // @ts-ignore
    this.currentScene.matter.add.image(positionX, this.collection.matterSprite.body.position.y - 20, 'balls', frame, {
      restitution: 1,
      label: 'ball'
    }).setVelocity(direction === 'left' ? -velocityX : velocityX, -velocityY);
  }
}
