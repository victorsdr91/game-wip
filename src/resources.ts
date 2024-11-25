import { DefaultLoader, ImageSource } from "excalibur";
import titleback from "/public/assets/images/titleback.webp";  // for parcelv2 this is configured in the .parcelrc
import player from "/public/assets/player.png"; // for parcelv2 this is configured in the .parcelrc
import tile11 from "/public/assets/tilesets/tile11.png";
import tile111 from "/public/assets/tilesets/tile111.png";
import buildings from "/public/assets/tilesets/buildings.tsx";
import terrains from "/public/assets/tilesets/terrains.tsx";
import starting from "/public/assets/tilemaps/starting.tmx";

import { TiledResource } from "@excaliburjs/plugin-tiled";

export const Resources = {
  TitleBackground: new ImageSource(titleback),
  Player: new ImageSource(player),
  Level1Map: new TiledResource(
    starting, 
    {
      useMapBackgroundColor: true,
      pathMap: [
        {
          path: '../tilesets/buildings.tsx',
          output: buildings
        },
        {
          path: '../tilesets/terrains.tsx',
          output: terrains
        },
        {
          path: 'tile11.png',
          output: tile11
        },
        {
          path: 'tile111.png',
          output: tile111
        }
      ]
    }
  ),
} as const;


export const loader = new DefaultLoader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}