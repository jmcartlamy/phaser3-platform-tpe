import SceneFactory from '../SceneFactory';

export default function(currentScene: SceneFactory, delay: number = 500) {
  currentScene.time.addEvent({
    delay: delay,
    callback: () => {
      currentScene.scene.restart();
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
