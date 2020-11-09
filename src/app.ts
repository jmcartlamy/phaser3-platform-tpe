import 'phaser';

import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';
import PauseScene from './scenes/PauseScene';
import Map1Scene from './scenes/Map1Scene';
import Map2Scene from './scenes/Map2Scene';
import Map3Scene from './scenes/Map3Scene';

import { GAME_SCREEN_HEIGHT, GAME_SCREEN_WIDTH } from './constants';

const config = {
  type: Phaser.WEBGL,
  width: GAME_SCREEN_WIDTH,
  height: GAME_SCREEN_HEIGHT,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
      enableSleeping: true,
      getDelta: function(time: number, delta: number) {
        return delta;
      }
    }
  },
  scene: [LoadScene, MenuScene, Map1Scene, Map2Scene, Map3Scene, PauseScene]
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
