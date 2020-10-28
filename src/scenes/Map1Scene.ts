import tilemap from '../assets/tilemaps/map1.json';
import userInterface from './userInterface/MapScene1.json';
import SceneFactory from './SceneFactory';
import { ENEMY_AVAILABLE_POSITION_MAP_1, SceneKeys } from '../constants';

export default class Map1Scene extends SceneFactory {
  constructor() {
    super({
      key: SceneKeys.Map1,
      map: {
        key: 'map1',
        tilemap: tilemap,
        bestTime: 50,
        direction: 'right',
        nextMap: SceneKeys.Map2
      },
      position: {
        player: { x: 160, y: 700 },
        enemy: ENEMY_AVAILABLE_POSITION_MAP_1
      },
      user: {
        interface: userInterface
      }
    });
  }
}
