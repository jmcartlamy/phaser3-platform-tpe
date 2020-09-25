export default function(currentScene: Phaser.Scene, delay: number = 500) {
  currentScene.time.addEvent({
    delay: delay,
    callback: () => {
      currentScene.scene.restart();
    },
    callbackScope: this
  });
  
  // @ts-ignore -> type game is "PhaserGame" from './types.ts'
  currentScene.game.socket.removeListener('mousedown');
}
