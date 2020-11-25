import settings from '../assets/sprites/settings.png';

import { SceneKeys } from '../constants';
import Enemy from '../objects/Enemy';
import { PhaserGame } from '../types';

export default class PauseScene extends Phaser.Scene {
  private backgroundSceneKey: string;
  public game: PhaserGame;

  constructor() {
    super({
      key: SceneKeys.Pause
    });
  }

  public init(data: { backgroundSceneKey: string }) {
    this.backgroundSceneKey = data.backgroundSceneKey;
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

    const innerWidth = this.registry.get('innerWidth');
    const innerHeight = this.registry.get('innerHeight');

    const resumeButton = this.add
      .text(innerWidth / 2, innerHeight / 2 - 132, 'Resume', styles)
      .setPadding(48, 16, 48, 16)
      .setOrigin(0.5)
      .setInteractive();

    const labelFS = this.scale.isFullscreen ? 'Disable fullscreen' : 'Enable fullscreen';
    const fullScreenButton = this.add
      .text(innerWidth / 2, innerHeight / 2 - 44, labelFS, styles)
      .setPadding(48, 16, 48, 16)
      .setOrigin(0.5)
      .setInteractive();

    const labelInteractive =
      this.game.interactive.status === 1 ? 'Interactive game ✅' : 'Solo game ⚠️';
    this.add
      .text(innerWidth / 2, innerHeight / 2 + 44, labelInteractive, styles)
      .setPadding(48, 16, 48, 16)
      .setOrigin(0.5);

    const exitButton = this.add
      .text(innerWidth / 2, innerHeight / 2 + 132, 'Exit', styles)
      .setPadding(48, 16, 48, 16)
      .setOrigin(0.5)
      .setInteractive();

    resumeButton.on(
      'pointerup',
      function() {
        this.scene.stop(SceneKeys.Pause);
        this.scene.resume(this.backgroundSceneKey);
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
        this.scene.stop(SceneKeys.Pause);
        this.scene.stop(this.backgroundSceneKey);
        this.scene.start(SceneKeys.Menu);

        const gameScene = this.scene.manager.getScene(this.backgroundSceneKey);

        if (gameScene.textTimer) {
          clearInterval(gameScene.textTimer);
        }
        if (gameScene.blob) {
          gameScene.blob.forEach(function(b: Enemy) {
            b.destroyCompoundBody();
          });
          gameScene.blob = [];
        }
      },
      this
    );
  }
}
