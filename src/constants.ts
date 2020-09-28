import { IGameConfig, IPlayer, IEnemy } from './types';

export const GAME_SCREEN_WIDTH = 1280;
export const GAME_SCREEN_HEIGHT = 720;

export const GAME_CONFIG: IGameConfig = {
  isInteractive: false
};

export enum GameScenes {
  Load = 'Load',
  Menu = 'Menu',
  Pause = 'Pause',
  Game = 'Game'
}

export enum MixplayGroups {
  Default = 'default'
}

export enum MixplayScenes {
  Menu = 'menu',
  Game = 'game',
  Pause = 'pause'
}

export enum Characters {
  Player = 'player',
  Enemy = 'Enemy'
}

export const PLAYER_COLLECTION: IPlayer = {
  matterSprite: null,
  body: null,
  blocked: {
    left: false,
    right: false,
    bottom: false
  },
  numTouching: {
    left: 0,
    right: 0,
    bottom: 0
  },
  sensors: {
    bottom: null,
    left: null,
    right: null
  },
  time: {
    leftDown: 0,
    rightDown: 0
  },
  canDoubleJump: false,
  lastJumpedAt: 0,
  speed: {
    run: 2.5,
    jump: 2.5
  }
};

export const ENEMY_COLLECTION: IEnemy = {
  matterSprite: null,
  body: null
};
