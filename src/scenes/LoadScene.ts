import io from 'socket.io-client';
import axios from 'axios';

import { GAME_CONFIG, GameScenes } from '../constants';
import { PhaserGame } from '../types';

export default class LoadScene extends Phaser.Scene {
  public game: PhaserGame;

  constructor() {
    super({
      key: GameScenes.Load
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

    // Socket IO
    this.game.socket = io('http://localhost:8081');

    // const token = null; // TODO getToken();

    if (this.game.socket) {
      label.text = 'Create an interactive game session...';

      try {
        // TODO create input with form
        const { data: { channelId }, status } = await axios({
          method: 'GET',
          url: location.protocol + '//localhost:8081/api/channels/search/jihem_',
        });
        this.registry.set('isInteractive', true);
        this.registry.set('channelId', channelId);
        this.startMenuScene();
      } catch (err) {
        console.log(err);
      }
    } else {
      label.text = 'Failed...\n\nLaunch the game without interactive.';

      setTimeout(this.startMenuScene.bind(this), 1000);
    }
  }

  private startMenuScene() {
    this.scene.start(GameScenes.Menu);
  }
}
