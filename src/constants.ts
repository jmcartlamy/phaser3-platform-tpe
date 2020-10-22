import { IGameConfig, IPlayer, IEnemy, IEnemyPosition } from './types';

export const GAME_SCREEN_WIDTH = 1280;
export const GAME_SCREEN_HEIGHT = 720;

export const GAME_CONFIG: IGameConfig = {
  isInteractive: false,
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight
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
  sprite: null,
  matterContainer: null,
  body: null
};

export const ENEMY_AVAILABLE_POSITION: IEnemyPosition[] = [
  { x: 1050, y: 300, direction: 'left' },
  { x: 1645, y: 180, direction: 'right' },
  { x: 800, y: 500, direction: 'left' },
  { x: 370, y: 200, direction: 'left' },
  { x: 480, y: 200, direction: 'left' },
  { x: 1115, y: 350, direction: 'left' },
  { x: 1370, y: 180, direction: 'left' },
  { x: 1650, y: 400, direction: 'left' },
  { x: 2205, y: 100, direction: 'right' },
  { x: 2178, y: 290, direction: 'left' }
];
