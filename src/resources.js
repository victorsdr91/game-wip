"use strict";
import { DefaultLoader, ImageSource } from "excalibur";
import PlayerAnimations from "/public/assets/Player/Player_New/Player_Anim/*.png";  // for parcelv2 this is configured in the .parcelrc
import ItemsIcons from "/public/assets/Icons/Items/*.jpeg";
import ActorPortraits from "/public/assets/Portrait/Actor/*.png";
export const loader = new DefaultLoader();
export const PlayerResources = new Object();
export const ItemIconsResources = new Object();
export const ActorPortraitsResources = new Object();

Object.keys(PlayerAnimations).forEach((key) => {
  PlayerResources[key] = new ImageSource(PlayerAnimations[key]);
  loader.addResource(PlayerResources[key]);
});

Object.keys(ItemsIcons).forEach((key) => {
  ItemIconsResources[key] = new ImageSource(ItemsIcons[key]);
  loader.addResource(ItemIconsResources[key]);
});

Object.keys(ActorPortraits).forEach((key) => {
  ActorPortraitsResources[key] = new ImageSource(ActorPortraits[key]);
  loader.addResource(ActorPortraitsResources[key]);
});