import {
  type DragEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { cn } from "tailwind-variants";

interface DragAndDropProps {
  onDropFile: (file: File) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragStateChange?: (isDragging: boolean) => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function DragAndDropFileRoot({
  onDropFile,
  onDragStateChange,
  onDragOver: externalOnDragOver,
  onDragLeave: externalOnDragLeave,
  disabled,
  children,
  className,
}: DragAndDropProps) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (onDragStateChange) {
      onDragStateChange(isDragging);
    }
  }, [isDragging, onDragStateChange]);

  const handleFileDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (disabled) {
        setIsDragging(false);
        return;
      }

      if (event.dataTransfer.files.length === 0) {
        setIsDragging(false);
        return;
      }

      const file = event.dataTransfer.files[0];

      if (!file) {
        setIsDragging(false);
        return;
      }

      onDropFile(file);
      setIsDragging(false);
    },
    [disabled, onDropFile],
  );

  const handleDragOver = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      if (disabled) {
        return;
      }
      setIsDragging(true);
      externalOnDragOver?.(event);
    },
    [disabled, externalOnDragOver],
  );

  const handleDragLeave = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      if (disabled) {
        return;
      }
      setIsDragging(false);
      externalOnDragLeave?.(event);
    },
    [disabled, externalOnDragLeave],
  );

  const handleDragStart = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      if (disabled) {
        return;
      }
    },
    [disabled],
  );

  return (
    <div
      role="application"
      data-dragging={isDragging}
      className={cn(
        className,
        "rounded-md border-2 border-dotted transition-colors duration-200 data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/20",
      )}
      onDragStart={handleDragStart}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
    >
      {children}
    </div>
  );
}
