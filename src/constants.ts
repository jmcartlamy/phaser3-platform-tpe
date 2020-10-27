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

export const ENEMY_AVAILABLE_POSITION_MAP_1: IEnemyPosition[] = [
  { x: 1373, y: 663, direction: 'left' },
  { x: 2395, y: 350, direction: 'left' },
  { x: 2458, y: 296, direction: 'left' },
  { x: 3611, y: 1057, direction: 'left' },
  { x: 3679, y: 946, direction: 'left' },
  { x: 4255, y: 1503, direction: 'left' },
  { x: 2834, y: 1244, direction: 'right' },
  { x: 2718, y: 1254, direction: 'left' },
  { x: 1953, y: 1628, direction: 'right' },
  { x: 1756, y: 1241, direction: 'left' },
  { x: 584, y: 1193, direction: 'right' },
  { x: 99, y: 1625, direction: 'right' },
  { x: 603, y: 2269, direction: 'left' },
  { x: 923, y: 2867, direction: 'left' },
  { x: 1568, y: 2469, direction: 'left' },
  { x: 1758, y: 2401, direction: 'left' },
  { x: 1022, y: 2219, direction: 'right' },
  { x: 868, y: 1888, direction: 'left' },
  { x: 1758, y: 2086, direction: 'left' },
  { x: 1249, y: 1701, direction: 'right' },
  { x: 1694, y: 1699, direction: 'right' },
  { x: 2023, y: 2787, direction: 'right' },
  { x: 3295, y: 2147, direction: 'left' },
  { x: 3225, y: 2856, direction: 'left' },
  { x: 3294, y: 2787, direction: 'left' },
  { x: 4231, y: 2724, direction: 'left' },
  { x: 4360, y: 2650, direction: 'left' },
  { x: 4481, y: 2586, direction: 'left' },
  { x: 4669, y: 2462, direction: 'left' },
  { x: 4830, y: 2341, direction: 'left' },
  { x: 4642, y: 2145, direction: 'right' },
  { x: 5596, y: 2268, direction: 'right' },
  { x: 5403, y: 1833, direction: 'right' },
  { x: 5726, y: 1320, direction: 'left' },
  { x: 6190, y: 1259, direction: 'right' },
  { x: 7003, y: 157, direction: 'left' },
  { x: 7521, y: 157, direction: 'left' },
  { x: 7584, y: 157, direction: 'right' },
  { x: 7960, y: 157, direction: 'left' },
  { x: 8015, y: 157, direction: 'right' },
  { x: 8348, y: 157, direction: 'left' },
  { x: 8729, y: 101, direction: 'left' },
  { x: 8801, y: 101, direction: 'right' },
  { x: 8472, y: 994, direction: 'left' },
  { x: 8660, y: 872, direction: 'left' },
  { x: 9566, y: 667, direction: 'left' },
  { x: 9506, y: 1324, direction: 'left' },
  { x: 9831, y: 1324, direction: 'left' },
  { x: 10393, y: 1249, direction: 'left' },
  { x: 11231, y: 1313, direction: 'left' },
  { x: 11420, y: 1895, direction: 'left' },
  { x: 11681, y: 2083, direction: 'left' },
  { x: 11933, y: 2276, direction: 'left' },
  { x: 12191, y: 2472, direction: 'left' }
];

export const ENEMY_AVAILABLE_POSITION_MAP_2: IEnemyPosition[] = [
  { x: 1562, y: 11610, direction: 'left' },
  { x: 1104, y: 11736, direction: 'right' },
  { x: 1188, y: 11296, direction: 'left' },
  { x: 1308, y: 10156, direction: 'left' },
  { x: 1246, y: 9763, direction: 'right' },
  { x: 860, y: 8600, direction: 'right' },
  { x: 487, y: 7968, direction: 'right' },
  { x: 223, y: 7521, direction: 'right' },
  { x: 1119, y: 6554, direction: 'right' },
  { x: 162, y: 6373, direction: 'right' },
  { x: 346, y: 5031, direction: 'left' },
  { x: 1687, y: 4640, direction: 'left' },
  { x: 344, y: 2907, direction: 'left' },
  { x: 414, y: 2911, direction: 'left' },
  { x: 1161, y: 2913, direction: 'right' },
  { x: 542, y: 2648, direction: 'right' },
  { x: 285, y: 1182, direction: 'left' },
];


export const ENEMY_AVAILABLE_POSITION_MAP_3: IEnemyPosition[] = [
    { x: 1756, y: 1500, direction: 'left' },
    { x: 1550, y: 1520, direction: 'right' },
    { x: 730, y: 1761, direction: 'right' },
    { x: 1051, y: 2127, direction: 'left' },
    { x: 1013, y: 3036, direction: 'left' },
    { x: 2564, y: 2784, direction: 'right' },
    { x: 1769, y: 2208, direction: 'right' },
    { x: 2012, y: 1957, direction: 'right' },
    { x: 2204, y: 1957, direction: 'right' },
    { x: 4019, y: 2589, direction: 'right' },
    { x: 4127, y: 3115, direction: 'left' },
    { x: 5155, y: 3035, direction: 'left' },
    { x: 5907, y: 2723, direction: 'left' },
    { x: 6551, y: 2776, direction: 'right' },
    { x: 7143, y: 2776, direction: 'left' },
    { x: 7743, y: 2776, direction: 'right' },
    { x: 8157, y: 3164, direction: 'left' },
    { x: 8294, y: 2838, direction: 'left' },
    { x: 8530, y: 2847, direction: 'right' },
    { x: 11486, y: 1616, direction: 'left' },
    { x: 11676, y: 1690, direction: 'left' },
    { x: 11867, y: 1761, direction: 'left' },
    { x: 12015, y: 1895, direction: 'left' },
    { x: 12394, y: 2072, direction: 'left' },
    { x: 12642, y: 2200, direction: 'left' },
    { x: 12900, y: 2395, direction: 'left' },
    { x: 13219, y: 2540, direction: 'left' },
    { x: 13334, y: 2534, direction: 'right' },
    { x: 14174, y: 2775, direction: 'left' },
    { x: 18077, y: 3490, direction: 'left' },
    { x: 18207, y: 3175, direction: 'right' },
    { x: 15770, y: 2334, direction: 'right' },
    { x: 14815, y: 1378, direction: 'left' },
    { x: 16016, y: 1760, direction: 'right' },
    { x: 16422, y: 1757, direction: 'left' },
    { x: 16929, y: 1760, direction: 'left' },
    { x: 18092, y: 422, direction: 'left' },
    { x: 21024, y: 2528, direction: 'left' },
    { x: 21401, y: 2909, direction: 'left' },
    { x: 22558, y: 1432, direction: 'left' },
    { x: 22999, y: 1762, direction: 'left' },
    { x: 24670, y: 2466, direction: 'right' },
    { x: 24228, y: 1626, direction: 'right' },
    { x: 25245, y: 1703, direction: 'left' },
];