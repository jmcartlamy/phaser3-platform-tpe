import { GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT } from '../../constants';
import { PayloadMousedown } from '../../types';

export default function (scene: Phaser.Scene, evt: PayloadMousedown) {
  return {
    x: scene.cameras.main.scrollX + evt.clientX * GAME_SCREEN_WIDTH / evt.clientWidth,
    y: scene.cameras.main.scrollY + evt.clientY * GAME_SCREEN_HEIGHT / evt.clientHeight
  };
}
