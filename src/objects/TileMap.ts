export default class TileMap {
  public map: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene, key: string) {
    this.map = scene.make.tilemap({ key });
    const tileset = this.map.addTilesetImage('tileMaps');

    const layer = this.map.createDynamicLayer(0, tileset, 0, 0);

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
      if (tile.properties.type === 'lava' || tile.properties.type === 'spike') {
        tile.physics.matterBody.body.label = 'dangerousTile';
      } else if (tile.properties.type === 'exit') {
        tile.physics.matterBody.body.label = 'exitTile';
      } else if (tile.properties.fallOnContact) {
        tile.physics.matterBody.body.label = 'disappearingPlatform';
      }
    });
  }
}
