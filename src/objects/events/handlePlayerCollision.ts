import SceneFactory from '../../scenes/SceneFactory';
import changeSceneWithDelay from '../../scenes/helpers/changeSceneWithDelay';
import { Characters, SceneKeys } from '../../constants';

// TODO TEMP
export default function(scene: SceneFactory, bestTime: number, nextScene: SceneKeys) {
  return function(event: Phaser.Physics.Matter.Events.CollisionActiveEvent) {
    const left = scene.player.collection.sensors.left;
    const right = scene.player.collection.sensors.right;
    const bottom = scene.player.collection.sensors.bottom;

    for (let i = 0; i < event.pairs.length; i++) {
      const bodyA = event.pairs[i].bodyA;
      const bodyB = event.pairs[i].bodyB;

      if (bodyA.label === Characters.Player || bodyB.label === Characters.Player) {
        const otherBody = bodyA.label === Characters.Player ? bodyB : bodyA;
        if (otherBody.parent.label === 'dangerousTile') {
          scene.player.destroyCompoundBody();
          return;
        }

        if (otherBody.parent.label === 'exitTile') {
          // TODO REFACTO
          const tile = otherBody.gameObject.tile;
          // Freeze timer
          scene.isLevelFinished = true;
          // Avoid multiple scoring
          if (tile.properties.isShowingScore) {
            continue;
          }
          tile.properties.isShowingScore = true;
          const { x, y } = scene.cameras.main.midPoint;
          const styles = {
            font: '48px Courier',
            fill: '#ffffff',
            backgroundColor: '#000000',
            alpha: 0.7
          };
          // Freeze player
          scene.player.collection.matterSprite.setStatic(true);

          const score = scene.game.score;
          const timeScore = Math.trunc(Math.pow(1.05, bestTime - score.time) * 2000);
          scene.game.score.total += timeScore;
          const text =
            'Score' +
            '\n\nViewer action: ' +
            score.action.toString() +
            '\nViewer balls:  ' +
            score.mouse.toString() +
            '\nExtra bonus:   ' +
            score.bonus.toString() +
            '\nTime bonus:    ' +
            timeScore.toString() +
            '\n\nTotal:         ' +
            score.total.toString() +
            '\n\nPress 1 to next';
          scene.add
            .text(x, y, text, styles)
            .setPadding(48, 48, 48, 48)
            .setOrigin(0.5, 0.5);

          scene.input.keyboard.removeListener('keyup_ONE');
          scene.input.keyboard.on('keyup_ONE', () => {
            changeSceneWithDelay(scene, nextScene, 0);
          });
        }

        if (otherBody.parent.label === 'disappearingPlatform') {
          // Matter Body instances have a reference to their associated game object. Here,
          // that's the Phaser.Physics.Matter.TileBody, which has a reference to the
          // Phaser.GameObjects.Tile.
          const tile = otherBody.gameObject.tile;

          if (tile.properties.isBeingDestroyed) {
            continue;
          }
          tile.properties.isBeingDestroyed = true;

          scene.tweens.add({
            targets: tile,
            alpha: { value: 0, duration: 500, ease: 'Power1' },
            onComplete: function(tile: any) {
              tile.tilemapLayer.removeTileAt(tile.x, tile.y);
              tile.physics.matterBody.destroy();
            }.bind(scene, tile)
          });
        }
        if (otherBody.parent.label === 'bonusTile') {
          const tile = otherBody.gameObject.tile;
          // Set score on variables
          scene.game.score.bonus += otherBody.parent.value;
          scene.game.score.total += otherBody.parent.value;
          // Set score on text
          scene.textScore.setText('Score: ' + scene.game.score.total.toString());
          // Remove tile
          tile.tilemapLayer.removeTileAt(tile.x, tile.y);
          tile.physics.matterBody.destroy();
        }
      }

      if (
        (bodyB.label === Characters.Enemy && bodyA.label === Characters.Player) ||
        (bodyA.label === Characters.Enemy && bodyB.label === Characters.Player)
      ) {
        const enemyBody = bodyA.label === Characters.Enemy ? bodyA : bodyB;
        scene.blob.forEach(function(b) {
          if (b.collection.body.id === enemyBody.id) {
            b.destroyCompoundBody();
          }
        });
        return;
      }

      if (bodyA === bottom || bodyB === bottom) {
        // Standing on any surface counts (e.g. jumping off of a non-static crate).
        scene.player.collection.numTouching.bottom += 1;
      } else if ((bodyA === left && bodyB.isStatic) || (bodyB === left && bodyA.isStatic)) {
        // Only static objects count since we don't want to be blocked by an object that we
        // can push around.
        scene.player.collection.numTouching.left += 1;
      } else if ((bodyA === right && bodyB.isStatic) || (bodyB === right && bodyA.isStatic)) {
        scene.player.collection.numTouching.right += 1;
      }
    }
  };
}
