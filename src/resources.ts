import { ImageSource, Loader } from "excalibur";
import sword from "./images/sword.png"; // for parcelv2 this is configured in the .parcelrc
import player from "/public/assets/player.png"; // for parcelv2 this is configured in the .parcelrc

export const Resources = {
  Sword: new ImageSource(sword),
  Player: new ImageSource(player)
} as const;

export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}