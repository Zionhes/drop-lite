import React, { useState, useRef } from "react"
import { useForm } from "@tanstack/react-form"
import { UploadCloud, X, Trash2, FileText, FileCheck } from "lucide-react"
import {
  Attachment,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentAction,
} from "@/components/ui/attachment"
import {
  MAX_FILE_COUNT,
  FILE_INPUT_ACCEPT,
  selectedFilesSchema,
  fileUploadSchema,
  type FileUploadValues,
} from "@/pages/file-upload/file-upload-schema"

export interface LocalFile {
  id: string
  file: File
  preview: string
}

export default function FileUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    defaultValues: {
      files: [] as LocalFile[],
    },
    onSubmit: async ({ value }) => {
      const rawFiles = value.files.map((f) => f.file)
      const validation = fileUploadSchema.safeParse({ files: rawFiles })

      if (validation.success) {
        const payload: FileUploadValues = validation.data
        console.log("Archivos listos para enviar:", payload.files)
      }
    },
  })

  const cleanupPreview = (previewUrl: string) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }

  const processAndAppendFiles = (
    incomingFiles: FileList | File[],
    currentFiles: LocalFile[],
    pushFn: (item: LocalFile) => void
  ) => {
    const availableSlots = MAX_FILE_COUNT - currentFiles.length
    if (availableSlots <= 0) return

    const filesToProcess = Array.from(incomingFiles).slice(0, availableSlots)

    filesToProcess.forEach((file) => {
      const alreadyExists = currentFiles.some((f) => f.id === file.name)
      if (alreadyExists) return

      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : ""

      pushFn({
        id: file.name,
        file,
        preview,
      })
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
      <form.Field
        name="files"
        mode="array"
        validators={{
          onChange: ({ value }) => {
            const rawFiles = value.map((f: LocalFile) => f.file)
            const result = selectedFilesSchema.safeParse(rawFiles)

            if (!result.success) {
              return result.error.issues[0]?.message || "Error en los archivos"
            }
            return undefined
          },
        }}
      >
        {(filesField) => {
          const files: LocalFile[] = filesField.state.value || []

          const handleDragOver = (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(true)
          }

          const handleDragLeave = (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
          }

          const handleDrop = (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            if (e.dataTransfer.files?.length) {
              processAndAppendFiles(
                e.dataTransfer.files,
                files,
                (item: LocalFile) => filesField.pushValue(item)
              )
            }
          }

          const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.length) {
              processAndAppendFiles(e.target.files, files, (item: LocalFile) =>
                filesField.pushValue(item)
              )
              e.target.value = ""
            }
          }

          return (
            <div className="space-y-4">
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={FILE_INPUT_ACCEPT}
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="space-y-2">
                  <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra y suelta tus archivos aquí, o{" "}
                    <span className="text-primary underline">
                      Buscar Archivos
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Máximo {MAX_FILE_COUNT} {FILE_INPUT_ACCEPT}
                    {""}
                    de hasta 10 MB.
                  </p>
                </div>
              </div>

              {/* Render de errores del campo */}
              {filesField.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {filesField.state.meta.errors.join(", ")}
                </p>
              )}

              {/* Header Contador y Limpieza */}
              {files.length > 0 && (
                <div className="flex items-center justify-around pt-2">
                  <span className="text-sm font-medium">
                    Archivos cargados:{" "}
                    <strong className="text-primary">
                      {files.length} / {MAX_FILE_COUNT}
                    </strong>
                  </span>
                  <AttachmentAction
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      files.forEach((f: LocalFile) => cleanupPreview(f.preview))
                      filesField.setValue([])
                    }}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Eliminar todos
                  </AttachmentAction>
                  {files.length === MAX_FILE_COUNT && (
                    <AttachmentAction type="button">
                      <FileCheck className="mr-2 size-4" />
                      Subir
                    </AttachmentAction>
                  )}
                </div>
              )}

              {/* Lista de Attachments */}
              <div className="grid grid-cols-1 gap-2">
                {files.map((item: LocalFile, index: number) => (
                  <Attachment key={item.id}>
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt={item.file.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    )}
                    <AttachmentContent>
                      <AttachmentTitle>{item.file.name}</AttachmentTitle>
                      <AttachmentDescription>
                        {(item.file.size / 1024).toFixed(1)} KB
                      </AttachmentDescription>
                    </AttachmentContent>
                    <AttachmentAction
                      type="button"
                      onClick={() => {
                        cleanupPreview(item.preview)
                        filesField.removeValue(index)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </AttachmentAction>
                  </Attachment>
                ))}
              </div>
            </div>
          )
        }}
      </form.Field>
    </div>
  )
}
