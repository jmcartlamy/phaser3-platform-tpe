export default function(scene: Phaser.Scene) {
  return function(event: Phaser.Physics.Matter.Events.CollisionActiveEvent) {
    for (let i = 0; i < event.pairs.length; i++) {
      // The tile bodies in this example are a mixture of compound bodies and simple rectangle
      // bodies. The "label" property was set on the parent body, so we will first make sure
      // that we have the top level body instead of a part of a larger compound body.
      const bodyA = getRootBody(event.pairs[i].bodyA);
      const bodyB = getRootBody(event.pairs[i].bodyB);

      if (
        (bodyA.label === 'ball' && bodyB.label === 'dangerousTile') ||
        (bodyB.label === 'ball' && bodyA.label === 'dangerousTile')
      ) {
        const ballBody = bodyA.label === 'ball' ? bodyA : bodyB;
        const ball = ballBody.gameObject;

        // A body may collide with multiple other bodies in a step, so we'll use a flag to
        // only tween & destroy the ball once.
        if (ball.isBeingDestroyed) {
          continue;
        }
        ball.isBeingDestroyed = true;

        scene.matter.world.remove(ballBody, false);

        scene.tweens.add({
          targets: ball,
          alpha: { value: 0, duration: 150, ease: 'Power1' },
          onComplete: function(ball: Phaser.Tweens.TweenManager) {
            ball.destroy();
          }.bind(scene, ball)
        });
      }
    }
  };
}

function getRootBody(body: any) {
  if (body.parent === body) {
    return body;
  }
  while (body.parent !== body) {
    body = body.parent;
  }
  return body;
}
