import { DefaultLoader, ImageSource } from "excalibur";
import Player from "/public/assets/Player/Player_Old/Player.png";  // for parcelv2 this is configured in the .parcelrc

export const Resources = {
  Player: new ImageSource(Player),
} as const;


export const loader = new DefaultLoader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}