import { AppLogoLogo } from "./components/app-logo-logo";
import { AppLogoRoot } from "./components/app-logo-root";
import { AppLogoTitle } from "./components/app-logo-title";

export const AppLogo = Object.assign(AppLogoRoot, {
	title: AppLogoTitle,
	logo: AppLogoLogo,
});
