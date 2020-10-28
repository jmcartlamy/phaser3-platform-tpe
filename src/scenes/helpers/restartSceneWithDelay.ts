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
      clearInterval(b.timer);
    });
    currentScene.blob = [];
  }

  // @ts-ignore -> type game is "PhaserGame" from './types.ts'
  if (currentScene.game.socket) {
    currentScene.game.socket.removeListener('mouse');
    currentScene.game.socket.removeListener('action');
  }

  // Clear interval timer
  if (currentScene.textTimer) {
    clearInterval(currentScene.textTimer);
  }
}
