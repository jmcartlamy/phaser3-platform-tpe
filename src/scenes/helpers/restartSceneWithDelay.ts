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

  // @ts-ignore -> type game is "PhaserGame" from './types.ts'
  if (currentScene.game.socket) {
    currentScene.game.socket.removeEventListener('message', currentScene.handleMessage, true);
  }

  // Clear interval timer
  if (currentScene.textTimer) {
    clearInterval(currentScene.textTimer);
  }
}
