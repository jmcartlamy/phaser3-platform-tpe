import settings from '../assets/sprites/settings.png';

import { GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH, GameScenes } from '../constants';

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({
      key: GameScenes.Pause
    });
  }

  public preload() {
    this.load.spritesheet('settings', settings, {
      frameWidth: 48,
      frameHeight: 48
    });
  }

  public create() {
    this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.70)');
    const styles = {
      font: '16px Courier',
      fill: '#ffffff',
      backgroundColor: '#2980b9'
    };

    const resumeButton = this.add
      .text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2 - 132, 'Resume', styles)
      .setPadding(48, 16, 48, 16)
      .setOrigin(0.5)
      .setInteractive();

    const labelFS = this.scale.isFullscreen ? 'Disable fullscreen' : 'Enable fullscreen';
    const fullScreenButton = this.add
      .text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2 - 44, labelFS, styles)
      .setPadding(48, 16, 48, 16)
      .setOrigin(0.5)
      .setInteractive();

    const labelInteractive = this.registry.get('isInteractive') ? 'Interactive game ✅' : 'Solo game ⚠️';
    this.add
      .text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2 + 44, labelInteractive, styles)
      .setPadding(48, 16, 48, 16)
      .setOrigin(0.5);

    const exitButton = this.add
      .text(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2 + 132, 'Exit', styles)
      .setPadding(48, 16, 48, 16)
      .setOrigin(0.5)
      .setInteractive();

    resumeButton.on(
      'pointerup',
      function() {
        this.scene.stop(GameScenes.Pause);
        this.scene.resume(GameScenes.Game);
        this.game.interactive?.resume();
      },
      this
    );

    fullScreenButton.on(
      'pointerup',
      function() {
        if (this.scale.isFullscreen) {
          fullScreenButton.text = 'Enable fullscreen';
          this.scale.stopFullscreen();
        } else {
          fullScreenButton.text = 'Disable fullscreen';
          this.scale.startFullscreen();
        }
      },
      this
    );

    exitButton.on(
      'pointerup',
      function() {
        this.scene.stop(GameScenes.Pause);
        this.scene.stop(GameScenes.Game);
        this.scene.start(GameScenes.Menu);
      },
      this
    );
  }
}
