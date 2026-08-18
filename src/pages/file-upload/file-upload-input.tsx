import { useRef, useState } from "react"
import { FileIcon, FilesIcon, Trash2Icon, UploadCloudIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  FILE_INPUT_ACCEPT,
  MAX_FILE_COUNT,
} from "@/pages/file-upload/file-upload-schema"

type FileUploadInputProps = {
  id: string
  value: File[]
  onChange: (files: File[]) => void
  onBlur: () => void
  invalid: boolean
}

function getFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function mergeFiles(currentFiles: File[], newFiles: File[]) {
  const uniqueFiles = new Map(
    currentFiles.map((file) => [getFileKey(file), file])
  )

  newFiles.forEach((file) => uniqueFiles.set(getFileKey(file), file))

  return Array.from(uniqueFiles.values())
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function FileUploadInput({
  id,
  value,
  onChange,
  onBlur,
  invalid,
}: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return

    onChange(mergeFiles(value, Array.from(fileList)))
    onBlur()

    if (inputRef.current) inputRef.current.value = ""
  }

  const removeFile = (fileToRemove: File) => {
    onChange(
      value.filter((file) => getFileKey(file) !== getFileKey(fileToRemove))
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <input
        ref={inputRef}
        id={id}
        type="file"
        multiple
        accept={FILE_INPUT_ACCEPT}
        aria-invalid={invalid}
        className="sr-only"
        onBlur={onBlur}
        onChange={(event) => addFiles(event.target.files)}
      />

      <div
        data-dragging={isDragging}
        data-invalid={invalid}
        className={cn(
          "flex min-h-52 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/30 p-6 text-center transition-colors",
          "hover:bg-muted/50 data-[dragging=true]:border-ring data-[dragging=true]:bg-muted/50 data-[invalid=true]:border-destructive/50"
        )}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault()
          if (
            !(event.relatedTarget instanceof Node) ||
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            setIsDragging(false)
          }
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          addFiles(event.dataTransfer.files)
        }}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-background ring-1 ring-foreground/10">
          <UploadCloudIcon className="size-6 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">Arrastra tus archivos aquí</p>
          <p className="text-sm text-muted-foreground">
            PDF, PNG, JPG, WEBP o TXT de hasta 10 MB
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <FilesIcon data-icon="inline-start" />
          Seleccionar archivos
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Archivos seleccionados</span>
            <span className="text-muted-foreground">
              {value.length} de {MAX_FILE_COUNT}
            </span>
          </div>
          <AttachmentGroup
            aria-label="Archivos seleccionados"
            className="flex-col gap-2 overflow-visible py-0"
          >
            {value.map((file) => (
              <Attachment
                key={getFileKey(file)}
                state="done"
                className="w-full"
              >
                <AttachmentMedia variant="icon">
                  <FileIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {file.type || "Archivo"} · {formatFileSize(file.size)}
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    type="button"
                    aria-label={`Quitar ${file.name}`}
                    onClick={() => removeFile(file)}
                  >
                    <Trash2Icon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </AttachmentGroup>
        </div>
      )}
    </div>
  )
}
