import tilemap from '../assets/tilemaps/map3.json';
import userInterface from './userInterface/MapScene3.json';
import SceneFactory from './SceneFactory';
import { ENEMY_AVAILABLE_POSITION_MAP_3, SceneKeys } from '../constants';

export default class Map3Scene extends SceneFactory {
  constructor() {
    super({
      key: SceneKeys.Map3,
      map: {
        key: 'map3',
        tilemap: tilemap,
        bestTime: 145,
        direction: 'right',
        nextMap: SceneKeys.Menu
      },
      position: {
        player: { x: 160, y: 780 },
        enemy: ENEMY_AVAILABLE_POSITION_MAP_3
      },
      user: {
        interface: userInterface
      }
    });
  }
}
