import { SceneKeys } from './constants';

export interface PhaserGame extends Phaser.Game {
  socket: SocketIOClient.Socket;
  score: Score;
  // TODO interactive
}

export interface SceneFactoryParams {
  key: string;
  map: {
    key: string;
    tilemap: object;
    bestTime: number;
    direction: 'right' | 'top';
    nextMap: SceneKeys;
  };
  position: {
    player: IPlayerPosition;
    enemy: IEnemyPosition[];
  };
  user: {
    interface: object;
  };
}

export interface Score {
  action: number;
  mouse: number;
  time: number;
  bonus: number;
  total: number;
}

type KeysDirection = 'left' | 'right' | 'bottom';

export interface IGameConfig {
  isInteractive: boolean;
  innerWidth: number;
  innerHeight: number;
}

export interface IPlayer {
  matterSprite: Phaser.Physics.Matter.Sprite | null;
  body: any;
  blocked: Record<KeysDirection, boolean>;
  numTouching: Record<KeysDirection, number>;
  sensors: Record<KeysDirection, any>; // TODO
  time: {
    leftDown: number;
    rightDown: number;
  };
  canDoubleJump: boolean;
  lastJumpedAt: number;
  speed: {
    run: number;
    jump: number;
  };
}

export interface IPlayerPosition {
  x: number;
  y: number;
}

export interface IEnemy {
  sprite: Phaser.GameObjects.Sprite | null;
  matterContainer: Phaser.GameObjects.Container | null;
  body: any;
}

export interface IEnemyPosition {
  x: number;
  y: number;
  direction: 'left' | 'right';
}

export interface PayloadMouseEvent {
  id: string;
  type: string;
  clientX: number;
  clientY: number;
  clientHeight: number;
  clientWidth: number;
}

export interface PayloadAction {
  id: string;
  username: string | null;
}
