import { AlertCenterRoot } from "./components/alert-center-root";

export const AlertCenter = Object.assign(AlertCenterRoot, {});

export type { AlertCenterRootProps as AlertCenterProps } from "./components/alert-center-root";
export type { AlertImportance, AlertItem, AlertType } from "./types/alert-item";
export { alertImportances, alertTypes } from "./types/alert-item";
