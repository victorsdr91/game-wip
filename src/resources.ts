import { DefaultLoader, ImageSource } from "excalibur";
import player from "/public/assets/player.png"; // for parcelv2 this is configured in the .parcelrc

export const Resources = {
  Player: new ImageSource(player),
} as const;


export const loader = new DefaultLoader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}