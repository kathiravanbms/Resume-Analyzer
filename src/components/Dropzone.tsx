import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "./ui";
import { ACCEPT_STRING, isSupportedFile } from "../lib/parsing/extract";

export function Dropzone({
  onFile,
  disabled,
}: {
  onFile: (file: File) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    setError(null);
    const file = files?.[0];
    if (!file) return;
    if (!isSupportedFile(file)) {
      setError("Unsupported type. Use PDF, DOCX, TXT, or MD.");
      return;
    }
    onFile(file);
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 px-6 py-14 text-center transition-colors duration-150",
          dragging
            ? "drag-pulse border-2 border-dashed bg-mark/25"
            : "border-2 border-dashed border-rule-strong hover:border-link hover:bg-link/5",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <Upload className={cn("size-5", dragging ? "text-ink" : "text-ink-soft")} />
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink">
          Drop resume / click to browse
        </p>
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">
          PDF · DOCX · TXT · MD
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_STRING}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error ? (
        <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-fail">
          {error}
        </p>
      ) : null}
    </div>
  );
}
