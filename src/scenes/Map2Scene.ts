import tilemap from '../assets/tilemaps/map2.json';
import userInterface from './userInterface/MapScene2.json';
import SceneFactory from './SceneFactory';
import { ENEMY_AVAILABLE_POSITION_MAP_2, SceneKeys } from '../constants';

export default class Map2Scene extends SceneFactory {
  constructor() {
    super({
      key: SceneKeys.Map2,
      map: {
        key: 'map2',
        tilemap: tilemap,
        bestTime: 175,
        direction: 'top',
        nextMap: SceneKeys.Map3
      },
      position: {
        player: { x: 160, y: 12360 },
        enemy: ENEMY_AVAILABLE_POSITION_MAP_2
      },
      user: {
        interface: userInterface
      }
    });
  }
}
