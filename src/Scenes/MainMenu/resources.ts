import { DefaultLoader, ImageSource } from "excalibur";
import Button from "/public/assets/images/mainmenu/Button.png";
import ButtonHover from "/public/assets/images/mainmenu/ButtonHover.png";

export const MainMenuResources = {
  Button: new ImageSource(Button),
  ButtonHover: new ImageSource(ButtonHover),
} as const;


export const mainMenuLoader = new DefaultLoader();
for (const res of Object.values(MainMenuResources)) {
  mainMenuLoader.addResource(res);
}