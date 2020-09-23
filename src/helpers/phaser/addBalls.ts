export default function(scene: Phaser.Scene, x: number, y: number) {
  for (let i = 0; i < 5; i++) {
    const rangeX = x + Phaser.Math.RND.integerInRange(-5, 5);
    const rangeY = y + Phaser.Math.RND.integerInRange(-5, 5);
    const frame = Phaser.Math.RND.integerInRange(0, 5);
    scene.matter.add.image(rangeX, rangeY, 'balls', frame, {
      restitution: 1,
      label: 'ball'
    });
  }
}
