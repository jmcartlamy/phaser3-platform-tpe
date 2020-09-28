import { IEnemy } from '../types';
import SmoothedHorizontalControl from './helpers/SmoothedHorizontalControl';
import { ENEMY_COLLECTION, Characters } from '../constants';

export default class Enemy {
  private readonly currentScene: Phaser.Scene;
  private readonly x: number;
  private readonly y: number;

  public collection: IEnemy;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.currentScene = scene;
    this.x = x;
    this.y = y;

    this.collection = {
      ...ENEMY_COLLECTION,
      matterSprite: this.currentScene.matter.add.sprite(0, 0, Characters.Enemy, 1)
    };

    // Create a collection's bodies to be a compound body.
    this.createCompoundBody();
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

  private createCompoundBody() {
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
      .setPosition(this.x, this.y);
  }
}
