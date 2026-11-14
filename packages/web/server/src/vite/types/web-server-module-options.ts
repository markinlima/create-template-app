/** Options of {@link webServerModule}. */
export interface WebServerModuleOptions {
  /**
   * The config of the app (`export default defineWebServer({...})`), from the root of the app.
   * @defaultValue "server/web-server.config.ts"
   */
  config?: string;
}
