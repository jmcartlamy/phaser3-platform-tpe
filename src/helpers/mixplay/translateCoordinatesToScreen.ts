import { GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT } from '../../constants';

export default function(scene: Phaser.Scene, x: number, y: number) {
  return {
    x: scene.cameras.main.scrollX + GAME_SCREEN_WIDTH * x,
    y: scene.cameras.main.scrollY + (GAME_SCREEN_HEIGHT - GAME_SCREEN_HEIGHT * y)
  };
}
