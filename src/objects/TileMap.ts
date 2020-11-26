export default class TileMap {
  public map: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene, key: string) {
    this.map = scene.make.tilemap({ key });

    // Map with collision
    const tilesetImage = this.map.addTilesetImage('tileMaps', 'tileMaps', 64, 64, 1, 2);
    const layer = this.map.createDynamicLayer(1, tilesetImage, 0, 0);

    // Map without collision
    const tilesetImageNC = this.map.addTilesetImage('tileMapsNC', 'tileMapsNC', 64, 64, 1, 2);
    this.map.createStaticLayer(0, tilesetImageNC, 0, 0);

    // Set colliding tiles before converting the layer to Matter bodies!
    layer.setCollisionByProperty({ collides: true });

    // Convert the layer. Any colliding tiles will be given a Matter body. If a tile has collision
    // shapes from Tiled, these will be loaded. If not, a default rectangle body will be used. The
    // body will be accessible via tile.physics.matterBody.
    scene.matter.world.convertTilemapLayer(layer);

    scene.matter.world.setBounds(this.map.widthInPixels, this.map.heightInPixels);
    scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    scene.cameras.main.setScroll(95, 100);

    // Change label makes easier to check Matter collisions.
    layer.forEachTile(function(tile: any) {
      if (tile.physics.matterBody) {
        if (
          tile.properties.type === 'lava' ||
          tile.properties.type === 'spike' ||
          tile.properties.type === 'cactus'
        ) {
          tile.physics.matterBody.body.label = 'dangerousTile';
        } else if (tile.properties.type === 'exit') {
          tile.physics.matterBody.body.label = 'exitTile';
        } else if (tile.properties.fallOnContact) {
          tile.physics.matterBody.body.label = 'disappearingPlatform';
        } else if (tile.properties.bonus) {
          tile.physics.matterBody.body.label = 'bonusTile';

          if (tile.properties.type === 'green_bonus') {
            tile.physics.matterBody.body.value = 100;
          } else if (tile.properties.type === 'blue_bonus') {
            tile.physics.matterBody.body.value = 200;
          } else if (tile.properties.type === 'yellow_bonus') {
            tile.physics.matterBody.body.value = 300;
          } else if (tile.properties.type === 'red_bonus') {
            tile.physics.matterBody.body.value = 400;
          }
        }
      }
    });
  }
}
