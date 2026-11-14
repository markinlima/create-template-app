/**
 * Props of a control that the field owns: the lib sets them, so the consuming code can't pass them.
 * The field uses them to link the control with its label, its error and the form state.
 */
export type FieldControlOwnedProps =
  | "id"
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "aria-invalid"
  | "aria-describedby";
