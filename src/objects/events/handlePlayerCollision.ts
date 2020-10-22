import GameScene from '../../scenes/GameScene';
import changeSceneWithDelay from '../../scenes/helpers/changeSceneWithDelay';
import { Characters, GameScenes } from '../../constants';

export default function(scene: GameScene) {
  return function(event: Phaser.Physics.Matter.Events.CollisionActiveEvent) {
    const left = scene.player.collection.sensors.left;
    const right = scene.player.collection.sensors.right;
    const bottom = scene.player.collection.sensors.bottom;

    for (let i = 0; i < event.pairs.length; i++) {
      const bodyA = event.pairs[i].bodyA;
      const bodyB = event.pairs[i].bodyB;

      if (bodyB.label === Characters.Player) {
        if (bodyA.parent.label === 'dangerousTile') {
          scene.player.destroyCompoundBody();
          return;
        }

        if (bodyA.parent.label === 'exitTile') {
          scene.cameras.main.zoomTo(2);
          changeSceneWithDelay(scene, GameScenes.Menu, 1000);
        }

        if (bodyA.parent.label === 'disappearingPlatform') {
          // Matter Body instances have a reference to their associated game object. Here,
          // that's the Phaser.Physics.Matter.TileBody, which has a reference to the
          // Phaser.GameObjects.Tile.
          const tile = bodyA.gameObject.tile;

          if (tile.properties.isBeingDestroyed) {
            continue;
          }
          tile.properties.isBeingDestroyed = true;

          scene.tweens.add({
            targets: tile,
            alpha: { value: 0, duration: 500, ease: 'Power1' },
            onComplete: function(tile: any) {
              var layer = tile.tilemapLayer;
              layer.removeTileAt(tile.x, tile.y);
              tile.physics.matterBody.destroy();
            }.bind(scene, tile)
          });
        }
      }

      if (bodyB.label === Characters.Enemy && bodyA.label === Characters.Player) {
        scene.blob.forEach(function(b) {
          if (b.collection.body.id === bodyB.id) {
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
