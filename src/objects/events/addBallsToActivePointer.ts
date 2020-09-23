import addBalls from '../../helpers/phaser/addBalls';

export default function(scene: Phaser.Scene) {
  return function() {
    const { x, y } = this.input.activePointer.positionToCamera(
      this.cameras.main
    );
    addBalls(scene, x, y);
  };
}
