import { DefaultLoader, ImageSource } from "excalibur"; // for parcelv2 this is configured in the .parcelrc
import * as tilesets from "/public/assets/tilemaps/tilesets/*.tsx";
import * as OutdoorDecTiles from "/public/assets/Outdoor decoration/*.png";
import * as GrassTiles from "/public/assets/tilemaps/tiles/Grass/*.png";
import * as CliffsTiles from "/public/assets/tilemaps/tiles/Cliff/*.png";
import * as WaterTiles from "/public/assets/tilemaps/tiles/Water/*.png";
import * as HousesTiles from "/public/assets/House/Buildings/Houses/*.png";
import * as TreeTiles from "/public/assets/Trees/*.png";
import scene1 from "/public/assets/tilemaps/scene1.tmx";
import human_001 from "/public/assets/sprites/human_001.png";
import monster_001 from "/public/assets/sprites/monster_001.png";

import { TiledResource } from "@excaliburjs/plugin-tiled";
const LevelPathMap = new Array();

const toPathMap = ( pathMap, resource, inputPath, format = "png"): void => {
  Object.keys(resource).forEach(( key ) => {
    pathMap.push({
      path: `${inputPath}/${key}.${format}`,
      output: resource[key],
    })
  });

  return pathMap;
};

toPathMap(LevelPathMap, tilesets, "tilesets", "tsx");
toPathMap(LevelPathMap, GrassTiles, "../tiles/Grass");
toPathMap(LevelPathMap, CliffsTiles, "../tiles/Cliff");
toPathMap(LevelPathMap, WaterTiles, "../tiles/Water");
toPathMap(LevelPathMap, HousesTiles, "../../House/Buildings/Houses");
toPathMap(LevelPathMap, OutdoorDecTiles, "../../Outdoor decoration");
toPathMap(LevelPathMap, TreeTiles, "../../Trees");
toPathMap(LevelPathMap, HousesTiles, "../House/Buildings/Houses");


export const Resources = {
  human_001: new ImageSource(human_001),
  monster_001: new ImageSource(monster_001),
  Level1Map: new TiledResource(
    scene1, 
    {
      useMapBackgroundColor: true,
      pathMap: LevelPathMap
    }
  ),
} as const;

export const worldLoader = new DefaultLoader();
for (const res of Object.values(Resources)) {
  worldLoader.addResource(res);
}