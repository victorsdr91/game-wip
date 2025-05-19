import { DefaultLoader, ImageSource } from "excalibur";
import Button from "/public/assets/images/mainmenu/Button.png";
import ButtonHover from "/public/assets/images/mainmenu/ButtonHover.png";
import titleback from "/public/assets/images/titleback.webp";

export const MainMenuResources = {
  TitleBackground: new ImageSource(titleback),
  Button: new ImageSource(Button),
  ButtonHover: new ImageSource(ButtonHover),
} as const;


export const mainMenuLoader = new DefaultLoader();
for (const res of Object.values(MainMenuResources)) {
  mainMenuLoader.addResource(res);
}