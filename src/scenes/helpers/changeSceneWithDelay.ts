export default function(currentScene: Phaser.Scene, nextScene: string, delay: number = 500) {
  currentScene.time.addEvent({
    delay: delay,
    callback: () => {
      // Stop the current scene
      currentScene.scene.stop();
      currentScene.scene.start(nextScene);
    },
    callbackScope: this
  });
}
