import { IEnemy } from '../types';
import SmoothedHorizontalControl from './helpers/SmoothedHorizontalControl';
import { ENEMY_COLLECTION, Characters } from '../constants';

export default class Enemy {
  private readonly currentScene: Phaser.Scene;
  public timer: NodeJS.Timeout

  public collection: IEnemy;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: 'left' | 'right') {
    this.currentScene = scene;
    this.collection = {
      ...ENEMY_COLLECTION,
      matterSprite: this.currentScene.matter.add.sprite(0, 0, Characters.Enemy, direction === 'left' ? 1 : 8)
    };

    // Create a collection's bodies to be a compound body.
    this.createCompoundBody(x, y);

    this.timer = setInterval(() => {
      const frame = Phaser.Math.RND.integerInRange(0, 5);
      const velocityX = Phaser.Math.RND.integerInRange(1, 3);
      const velocityY = Phaser.Math.RND.integerInRange(1, 3);
      const positionX = direction === 'left' ? this.collection.matterSprite.body.position.x - 20 : this.collection.matterSprite.body.position.x + 20
      scene.matter.add.image(positionX, this.collection.matterSprite.body.position.y - 20, 'balls', frame, {
        restitution: 1,
        label: 'ball'
      }).setVelocity(direction === 'left' ? -velocityX : velocityX, -velocityY);
    }, 500)
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
}
