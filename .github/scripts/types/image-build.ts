/** One `docker build` of a test stack. */
export interface ImageBuild {
  service: string;
  image: string;
  args: string[];
}
