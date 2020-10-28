import { IEnemyPosition } from '../../types';

export default function(
  enemyAvailablePositionMap: IEnemyPosition[],
  position: { x: number; y: number },
  direction: 'right' | 'top'
) {
  let enemy = null;
  const max = enemyAvailablePositionMap.length - 1;

  while (!enemy) {
    const index = Phaser.Math.RND.integerInRange(0, max);
    const selected = enemyAvailablePositionMap[index];

    if (direction === 'top') {
      if (position.y > selected.y && position.y - selected.y < 3000) {
        enemy = selected;
      }
    } else if (direction === 'right') {
      if (position.x < selected.x && selected.x - position.x < 2000) {
        enemy = selected;
      }
    }
  }
  return enemy;
}
