import { IEnemy } from '../types';
import { ENEMY_COLLECTION, Characters } from '../constants';
import SceneFactory from '../scenes/SceneFactory';

export default class Enemy {
  private readonly currentScene: SceneFactory;
  public timer: NodeJS.Timeout;
  public timeout: NodeJS.Timeout;
  public collection: IEnemy;

  constructor(
    scene: SceneFactory,
    x: number,
    y: number,
    direction: 'left' | 'right',
    username: string | null,
    id: string
  ) {
    this.throwBallInInterval = this.throwBallInInterval.bind(this, direction, id);
    this.destroyCompoundBody = this.destroyCompoundBody.bind(this);
    this.currentScene = scene;
    this.collection = {
      ...ENEMY_COLLECTION,
      matterContainer: this.currentScene.add.container(0, 0),
      sprite: this.currentScene.add.sprite(0, 0, Characters.Enemy, direction === 'left' ? 1 : 8)
    };

    // Create a collection's bodies to be a compound body.
    this.createCompoundBody(x, y, username);

    // Throw ball with interval
    this.timer = setInterval(this.throwBallInInterval, 500);

    // Destroy after 60s
    this.timeout = setTimeout(this.destroyCompoundBody, 60000);
  }

  public update(time: number, delta: number) {
    if (!this.collection.matterContainer) {
      return;
    }
  }

  public destroyCompoundBody() {
    // Enemy death
    clearInterval(this.timer);
    clearTimeout(this.timeout);
    if (this.collection.matterContainer) {
      this.collection.matterContainer.destroy();
      this.collection.matterContainer = null;
    }
  }

  private createCompoundBody(x: number, y: number, username: string | null) {
    // Add text and sprite to container
    const text = this.currentScene.add
      .text(0, -45, username || 'Anonyme', {
        font: '18px Arial',
        fill: '#00ff00'
      })
      .setOrigin(0.5, 0);

    this.collection.matterContainer.add([this.collection.sprite, text]);

    // Enable matter physics
    const width = this.collection.sprite.width;
    const height = this.collection.sprite.height;
    let bodies: any = this.currentScene.matter.bodies;

    // @ts-ignore
    const matterEnabledContainer = this.currentScene.matter.add.gameObject(
      this.collection.matterContainer
    );

    this.collection.body = bodies.rectangle(0, 0, width * 0.75, height, {
      chamfer: { radius: 10 },
      label: Characters.Enemy
    });

    // @ts-ignore
    const compoundBody = this.currentScene.matter.body.create({
      parts: [this.collection.body],
      restitution: 0.05 // Prevent body from sticking against a wall
    });

    matterEnabledContainer
      // @ts-ignore
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(x, y);
  }

  private throwBallInInterval(direction: 'left' | 'right', id: string) {
    const frame = Phaser.Math.RND.integerInRange(0, 5);
    const velocityX = Phaser.Math.RND.integerInRange(1, 4);
    const velocityY = Phaser.Math.RND.integerInRange(1, 3);
    // @ts-ignore
    const positionX =
      direction === 'left'
        ? this.collection.matterContainer.body.position.x - 20
        : this.collection.matterContainer.body.position.x + 20;
    // @ts-ignore
    const ball = this.currentScene.matter.add
      .image(positionX, this.collection.matterContainer.body.position.y - 20, 'balls', frame, {
        restitution: 0.8,
        label: 'ball',
        density: 0.001,
        frictionAir: 0
      })
      .setVelocity(direction === 'left' ? -velocityX : velocityX, -velocityY);

    if (id === 'action-npc-2') {
      ball.setScale(2);
    }

    // TODO REFACTO
    if (!this.currentScene.balls) {
      this.currentScene.balls = [];
    }

    this.currentScene.balls.push(ball.body);
    if (this.currentScene.balls.length > 150) {
      const ballBody = this.currentScene.balls[0];
      const b = ballBody.gameObject;
      this.currentScene.matter.world.remove(ballBody, false);
      if (b) {
        b.destroy();
      }
      this.currentScene.balls.shift();
    }
  }
}
