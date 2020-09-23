import 'phaser';

import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';
import PauseScene from './scenes/PauseScene';
import GameScene from './scenes/GameScene';

import { GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH } from './constants';

const config = {
  type: Phaser.AUTO,
  width: GAME_SCREEN_WIDTH,
  height: GAME_SCREEN_HEIGHT,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    width: GAME_SCREEN_WIDTH,
    height: GAME_SCREEN_HEIGHT
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0.4 },
      enableSleep: true
    }
  },
  scene: [LoadScene, MenuScene, GameScene, PauseScene]
};

class Game extends Phaser.Game {

  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    // TODO use Oauth2 Code Authorization
    // to create a new token or to retrieve an existing valid token with the extension
  }
}

window.addEventListener('load', async () => {
  /* Launch the Phaser.Game instance */
  new Game(config);
});
