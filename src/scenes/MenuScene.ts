import settings from '../assets/sprites/settings.png';

import { GameScenes } from '../constants';
import { PhaserGame } from '../types';

export default class MenuScene extends Phaser.Scene {
  public game: PhaserGame;

  constructor() {
    super({
      key: GameScenes.Menu
    });
  }

  public preload() {
    this.add.text(10, 10, 'Press 1 to launch', { font: '16px Courier', fill: '#00ff00' });

    this.load.spritesheet('settings', settings, {
      frameWidth: 48,
      frameHeight: 48
    });
  }

  public create() {
    // Update interactive scene (mixplay)
    this.game.interactive?.onMenu();

    // On press to key '1', we start the next scene
    this.input.keyboard.on('keyup_ONE', () => {
      this.scene.start(GameScenes.Game);
    });
  }
}
