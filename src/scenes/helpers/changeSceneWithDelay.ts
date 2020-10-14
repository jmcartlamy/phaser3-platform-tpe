import GameScene from "../GameScene";

export default function(currentScene: GameScene, nextScene: string, delay: number = 500) {
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
    currentScene.blob.forEach(function (b) { 
      clearInterval(b.timer);
    })
    currentScene.blob = [];
  }
  
  // @ts-ignore -> type game is "PhaserGame" from './types.ts'
  if (currentScene.game.socket) {
    currentScene.game.socket.removeListener('mouse');
    currentScene.game.socket.removeListener('action');
  }
}
