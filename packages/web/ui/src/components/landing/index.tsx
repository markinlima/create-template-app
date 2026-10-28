import { LandingContainer } from "./landing-container";
import { LandingPage } from "./landing-root";
import { LandingSection } from "./landing-section";
import { LandingTitle } from "./landing-title";

export const Landing = Object.assign(LandingPage, {
  section: LandingSection,
  container: LandingContainer,
  title: LandingTitle,
});
