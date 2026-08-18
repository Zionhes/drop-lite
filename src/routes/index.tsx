import { createFileRoute } from "@tanstack/react-router"

import { FileUploadPage } from "@/pages/file-upload/file-upload-page"

export const Route = createFileRoute("/")({
  component: FileUploadPage,
})
