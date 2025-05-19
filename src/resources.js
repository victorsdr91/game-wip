"use srtict";
import { DefaultLoader, ImageSource } from "excalibur";
import PlayerAnimations from "/public/assets/Player/Player_New/Player_Anim/*.png";  // for parcelv2 this is configured in the .parcelrc

export const loader = new DefaultLoader();
export const PlayerResources = new Object();

Object.keys(PlayerAnimations).forEach((key) => {
  PlayerResources[key] = new ImageSource(PlayerAnimations[key]);
  loader.addResource(PlayerResources[key]);
});