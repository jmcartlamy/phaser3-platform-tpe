export default function(scene: Phaser.Scene, button?: Phaser.GameObjects.Image) {
  return function() {
    if (scene.scale.isFullscreen) {
      //button.setFrame(0);
      this.scale.stopFullscreen();
    } else {
      //button.setFrame(1);
      scene.scale.startFullscreen();
    }
  };
}
