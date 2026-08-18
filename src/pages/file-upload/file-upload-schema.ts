import { z } from "zod"

export const MAX_FILE_COUNT = 5
export const FILE_INPUT_ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.txt"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
]

const fileSchema = z
  .file()
  .max(MAX_FILE_SIZE, "Cada archivo debe pesar 10 MB o menos.")
  .mime(
    ACCEPTED_FILE_TYPES,
    "Solo se permiten archivos PDF, PNG, JPG, WEBP o TXT."
  )

export const selectedFilesSchema = z
  .array(fileSchema)
  .min(1, "Selecciona al menos un archivo.")
  .max(MAX_FILE_COUNT, `Puedes seleccionar hasta ${MAX_FILE_COUNT} archivos.`)

export const fileUploadSchema = z.object({
  files: selectedFilesSchema,
})

export type FileUploadValues = z.infer<typeof fileUploadSchema>
