export default function(scene: Phaser.Scene, x: number, y: number) {
  for (let i = 0; i < 5; i++) {
    const rangeX = x + Phaser.Math.RND.integerInRange(-5, 5);
    const rangeY = y + Phaser.Math.RND.integerInRange(-5, 5);
    const frame = Phaser.Math.RND.integerInRange(0, 5);
    const ball = scene.matter.add.image(rangeX, rangeY, 'balls', frame, {
      restitution: 0.8,
        label: 'ball',
    });

    // TODO REFACTO
    if (!scene.balls) {
      scene.balls = [];
    }

    scene.balls.push(ball.body);

    if (scene.balls.length > 150) {
      const ballBody = scene.balls[0];
      const b = ballBody.gameObject;
      scene.matter.world.remove(ballBody, false);
      if (b) {
        b.destroy();
      }
      scene.balls.shift();
    }
  }
}
