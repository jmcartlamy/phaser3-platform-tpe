import { PayloadMouseEvent } from '../../types';

export default function(scene: Phaser.Scene, evt: PayloadMouseEvent) {
  const innerWidth = scene.registry.get('innerWidth');
  const innerHeight = scene.registry.get('innerHeight');

  return {
    x: scene.cameras.main.scrollX + (evt.clientX * innerWidth) / evt.clientWidth,
    y: scene.cameras.main.scrollY + (evt.clientY * innerHeight) / evt.clientHeight
  };
}
