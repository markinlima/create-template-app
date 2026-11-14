/** An option of the setup menu: an app, or an extra. */
export interface Project {
  /** The name shown in the menu. */
  name: string;
  /** The Compose profile it starts. */
  value: string;
  /** The hint shown next to the name. */
  description: string;
}
