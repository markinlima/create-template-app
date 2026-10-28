import { CircleDashedIcon, XIcon } from "lucide-react";
import { HexColorInput, HexColorPicker } from "react-colorful";

import { Button } from "@web/ui/button";
import { Dialog } from "@web/ui/dialog";

import { useFieldContext } from "../context/app-form-context";

interface ColorPickerFieldProps {
  label: string;
  previousColor?: string | null;
  disabled?: boolean;
  className?: string;
}

export function ColorPickerField({
  label,
  className,
  previousColor,
  disabled,
}: ColorPickerFieldProps) {
  const { state, handleChange } = useFieldContext<string | null>();
  const color = state.value ?? "#ffffff";
  const hasColor = !!state.value;

  function handleResetColor() {
    if (previousColor === undefined) {
      return;
    }
    handleChange(previousColor);
  }

  return (
    <Dialog>
      <Dialog.trigger
        render={
          <Button
            className={className}
            disabled={disabled}
            size="lg"
            variant="outline"
          >
            <div
              className="size-4 rounded-full"
              style={{ backgroundColor: hasColor ? color : undefined }}
            >
              {!hasColor && (
                <CircleDashedIcon className="stroke-3 text-accent-foreground" />
              )}
            </div>
            {label}
          </Button>
        }
      />
      <Dialog.content className="w-full max-w-112.5">
        <h3 className="font-bold">Selecione a cor desejada:</h3>
        <div className="flex w-full overflow-hidden rounded-md border text-center">
          {previousColor ? (
            <button
              type="button"
              onClick={handleResetColor}
              style={{ backgroundColor: previousColor }}
              className="w-full cursor-pointer p-1"
            >
              <span className="font-bold mix-blend-difference">
                {previousColor}
              </span>
            </button>
          ) : (
            <div className="w-full cursor-pointer p-1">Sem cor definida</div>
          )}
          {hasColor ? (
            <div
              style={{ backgroundColor: color }}
              className="w-full rounded-r-md p-1"
            >
              <span className="font-bold mix-blend-difference">{color}</span>
            </div>
          ) : (
            <div className="w-full cursor-pointer p-1">Sem cor definida</div>
          )}
        </div>
        <HexColorPicker
          style={{
            width: "100%",
          }}
          color={color}
          onChange={(color) => handleChange(color)}
        />
        <div className="flex w-full items-center gap-2">
          #
          <HexColorInput
            className="w-full rounded-md border border-primary p-1"
            color={color}
            onChange={(color) => handleChange(color)}
          />
          {!!previousColor && (
            <Button
              title="Remover cor"
              onClick={() => handleChange(null)}
              variant="destructive"
              raised
            >
              <XIcon />
            </Button>
          )}
        </div>
        <Dialog.footer>
          <Dialog.close render={<Button raised>Confirmar</Button>} />
        </Dialog.footer>
      </Dialog.content>
    </Dialog>
  );
}
