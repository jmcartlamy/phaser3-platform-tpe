import SceneFactory from '../SceneFactory';

export default function(currentScene: SceneFactory, nextScene: string, delay: number = 500) {
  currentScene.time.addEvent({
    delay: delay,
    callback: () => {
      // Stop the current scene
      currentScene.scene.stop();
      currentScene.scene.start(nextScene);
    },
    callbackScope: this
  });

  // Reinitialize enemies
  if (currentScene.blob) {
    currentScene.blob.forEach(function(b) {
      b.destroyCompoundBody();
    });
    currentScene.blob = [];
  }

  if (currentScene.game.interactive.status === 1) {
    currentScene.game.interactive.socket.removeEventListener('message', currentScene.handleWebSocketMessage, true);
  }

  // Clear interval timer
  if (currentScene.textTimer) {
    clearInterval(currentScene.textTimer);
  }
}
