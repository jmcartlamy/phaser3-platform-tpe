import io from 'socket.io-client';
import axios from 'axios';

import { GAME_CONFIG, SceneKeys } from '../constants';
import { PhaserGame } from '../types';

export default class LoadScene extends Phaser.Scene {
  public game: PhaserGame;

  constructor() {
    super({
      key: SceneKeys.Load
    });
  }

  public init() {
    // @ts-ignore => 2nd argument is optional
    this.registry.set(GAME_CONFIG);
  }

  public async preload() {
    const label = this.add.text(10, 10, 'Connexion...', {
      font: '16px Courier',
      fill: '#00ff00'
    });

    label.text = 'Create an interactive game session...';

    // const token = null; // TODO getToken();
    const protocol = process.env.NODE_ENV === 'production' ? 'https:' : 'http:';
    const host =
      process.env.NODE_ENV === 'production'
        ? '//interactive-sync-ebs.azurewebsites.net/'
        : '//localhost:8081/';
    const path = 'api/channels/search/jihem_';

    try {
      // TODO create input with form
      const {
        data: { channelId },
        status
      } = await axios({
        method: 'GET',
        url: protocol + host + path
      });

      // Socket IO
      this.game.socket = io(protocol + host, {
        query: {
          channelId
        }
      });

      // Set channelId on registry
      this.registry.set('channelId', channelId);
    } catch (err) {
      console.log(err);
    }

    if (this.game.socket) {
      this.registry.set('isInteractive', true);

      this.startMenuScene();
    } else {
      label.text = 'Failed...\n\nLaunch the game without interactive.';
      setTimeout(this.startMenuScene.bind(this), 1500);
    }
  }

  private startMenuScene() {
    this.scene.start(SceneKeys.Menu);
  }
}
