import settings from '../assets/sprites/settings.png';
import buttonBG from '../assets/sprites/button-bg.png';

import { GAME_CONFIG, SceneKeys } from '../constants';
import { PhaserGame } from '../types';
import userInterface from './userInterface/MenuScene.json';

export default class MenuScene extends Phaser.Scene {
  public game: PhaserGame;
  private connectText: Phaser.GameObjects.Text;
  private label: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: SceneKeys.Menu
    });
    this.messageConnectionListener = this.messageConnectionListener.bind(this);
  }

  public preload() {
    this.load.image('buttonBG', buttonBG);

    this.load.spritesheet('settings', settings, {
      frameWidth: 48,
      frameHeight: 48
    });
  }

  public create() {
    if (!this.registry.has('isInteractive')) {
      // @ts-ignore => 2nd argument is optional
      this.registry.set(GAME_CONFIG);
    }
    if (this.game.socket) {
      this.game.socket.send(JSON.stringify({ context: 'user_interface', data: userInterface }));
    }
    this.label = this.add.text(10, 10, '', {
      font: '24px Arial',
      fill: '#00ff00'
    });

    const playBG = this.add.image(0, 0, 'buttonBG');
    const playText = this.add
      .text(0, 0, 'Jouer', {
        font: '40px Arial',
        fill: '#aace27'
      })
      .setOrigin(0.5, 0.5);

    const connectBG = this.add.image(0, 0, 'buttonBG');
    this.connectText = this.add
      .text(0, 0, this.registry.get('isInteractive') ? 'Ready ✅' : 'Se connecter', {
        font: '34px Arial',
        fill: '#aace27'
      })
      .setOrigin(0.5, 0.5);

    const playButton = this.add.container(
      this.registry.get('innerWidth') / 2,
      this.registry.get('innerHeight') / 2 - 80,
      [playBG, playText]
    );
    playButton.setInteractive(
      new Phaser.Geom.Rectangle(-150, -55, 300, 110),
      Phaser.Geom.Rectangle.Contains
    );
    playButton.on('pointerover', function() {
      playBG.setTint(0x44ff44);
    });
    playButton.on('pointerout', function() {
      playBG.clearTint();
    });
    playButton.once(
      'pointerup',
      function() {
        this.game.socket?.removeEventListener('message', this.messageConnectionListener);
        this.scene.start(SceneKeys.Map1);
      }.bind(this)
    );

    const connectButton = this.add.container(
      this.registry.get('innerWidth') / 2,
      this.registry.get('innerHeight') / 2 + 80,
      [connectBG, this.connectText]
    );
    connectButton.setInteractive(
      new Phaser.Geom.Rectangle(-150, -55, 300, 110),
      Phaser.Geom.Rectangle.Contains
    );
    connectButton.on('pointerover', function() {
      connectBG.setTint(0x44ff44);
    });
    connectButton.on('pointerout', function() {
      connectBG.clearTint();
    });
    connectButton.on(
      'pointerup',
      function() {
        if (this.registry.get('isInteractive')) {
          this.game.socket.close();
          this.registry.set('isInteractive', false);
          this.label.text = 'Vous avez bien été déconnecté.';
          this.connectText.text = 'Se connecter';
        } else {
          location.href =
            'https://id.twitch.tv/oauth2/authorize' +
            '?client_id=' +
            process.env.EXT_CLIENT_ID +
            '&redirect_uri=http://localhost:8080' +
            '&response_type=token' +
            '&scope=user:read:email';
        }
      }.bind(this)
    );

    if (window.location.hash) {
      this.connectText.text = 'Connecting...';
      this.label.text = 'Create an interactive game session...';

      const match = window.location.hash.match(new RegExp('access_token=([^&]*)'));
      if (match && match[1]) {
        const protocolWS = process.env.NODE_ENV === 'production' ? 'wss:' : 'ws:';
        const host =
          process.env.NODE_ENV === 'production'
            ? '//interactive-sync-ebs.azurewebsites.net/'
            : '//localhost:8081/';
        const accessToken = match[1];

        try {
          // @ts-ignore WebSocket
          window.WebSocket = window.WebSocket || window.MozWebSocket;
          this.game.socket = new WebSocket(protocolWS + host, [
            process.env.EXT_CLIENT_ID,
            accessToken
          ]);
        } catch (err) {
          throw Error(err);
        }
        this.game.socket?.addEventListener('message', this.messageConnectionListener);
      } else {
        this.label.text = 'Websocket failed...';
      }
    }
  }

  private messageConnectionListener(event: { data: string }) {
    const body = JSON.parse(event.data);
    if (body?.context === 'connection') {
      if (body?.status === 'error') {
        this.label.text = 'Failed...\n\n' + body.message;
        this.connectText.text = 'Se connecter';
      } else if (body?.status === 'ok') {
        this.registry.set('isInteractive', true);
        this.label.text = body.message + ' "' + body.data.displayName + '"';
        this.connectText.text = 'Ready ✅';
        window.location.hash = '';
        this.game.socket.send(JSON.stringify({ context: 'user_interface', data: userInterface }));
      }
    }
  }

  // TODO Update interactive scene (mixplay)
  // this.game.interactive?.onMenu();
}
