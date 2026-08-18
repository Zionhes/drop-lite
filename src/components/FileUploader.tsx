import React from "react"
import { useForm } from "@tanstack/react-form"
import { UploadCloud, X, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Attachment,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentAction,
} from "@/components/ui/attachment"
import { localFileSchema, fileFormSchema } from "@/lib/utils"
import type { LocalFile, FileFormValues } from "@/lib/utils"

export default function FileUploader() {
  const defaultValues: FileFormValues = {
    isDragging: false,
    files: [],
  }

  const form = useForm({
    defaultValues,
    validators: {
      // Directo sin adaptadores (Standard Schema de Zod v4)
      onChange: fileFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Archivos cargados:", value.files)
    },
  })

  const processAndAppendFiles = (
    incomingFiles: FileList | File[],
    pushFn: (item: LocalFile) => void
  ) => {
    Array.from(incomingFiles).forEach((file) => {
      const newFileObj = {
        id: crypto.randomUUID(),
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "",
      }

      const result = localFileSchema.safeParse(newFileObj)
      if (result.success) {
        pushFn(result.data)
      }
    })
  }

  const cleanupPreview = (previewUrl: string) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
      <form.Field name="isDragging">
        {(isDraggingField) => (
          <form.Field name="files" mode="array">
            {(filesField) => {
              const files: LocalFile[] = filesField.state.value || []

              const handleDragOver = (e: React.DragEvent) => {
                e.preventDefault()
                isDraggingField.handleChange(true)
              }

              const handleDragLeave = (e: React.DragEvent) => {
                e.preventDefault()
                isDraggingField.handleChange(false)
              }

              const handleDrop = (e: React.DragEvent) => {
                e.preventDefault()
                isDraggingField.handleChange(false)
                if (e.dataTransfer.files?.length) {
                  processAndAppendFiles(
                    e.dataTransfer.files,
                    (item: LocalFile) => filesField.pushValue(item)
                  )
                }
              }

              const handleFileInput = (
                e: React.ChangeEvent<HTMLInputElement>
              ) => {
                if (e.target.files?.length) {
                  processAndAppendFiles(e.target.files, (item: LocalFile) =>
                    filesField.pushValue(item)
                  )
                }
              }

              return (
                <div className="space-y-4">
                  {/* Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                      isDraggingField.state.value
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload-input"
                    />
                    <label
                      htmlFor="file-upload-input"
                      className="block cursor-pointer space-y-2"
                    >
                      <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Arrastra y suelta tus archivos aquí, o{" "}
                        <span className="text-primary underline">examina</span>
                      </p>
                    </label>
                  </div>

                  {/* Contador y Limpieza */}
                  {files.length > 0 && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-medium">
                        Archivos cargados:{" "}
                        <strong className="text-primary">{files.length}</strong>
                      </span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          files.forEach((f: LocalFile) =>
                            cleanupPreview(f.preview)
                          )
                          filesField.setValue([])
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar todos
                      </Button>
                    </div>
                  )}

                  {/* Componente Attachment */}
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
                        <AttachmentAction>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              cleanupPreview(item.preview)
                              filesField.removeValue(index)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </AttachmentAction>
                      </Attachment>
                    ))}
                  </div>
                </div>
              )
            }}
          </form.Field>
        )}
      </form.Field>
    </div>
  )
}
