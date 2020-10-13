export interface PhaserGame extends Phaser.Game {
  socket: SocketIOClient.Socket;
  // TODO interactive
}

type KeysDirection = 'left' | 'right' | 'bottom';

export interface IGameConfig {
  isInteractive: boolean;
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

export interface IEnemy {
  matterSprite: Phaser.Physics.Matter.Sprite | null;
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
}
