import { LandingContainer } from "./components/landing-container";
import { LandingPage } from "./components/landing-root";
import { LandingSection } from "./components/landing-section";
import { LandingTitle } from "./components/landing-title";

/** The parts of a landing page: its page, sections, container and title. */
export const Landing = Object.assign(LandingPage, {
  section: LandingSection,
  container: LandingContainer,
  title: LandingTitle,
});
