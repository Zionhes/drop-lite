import { createFileRoute } from "@tanstack/react-router"

import { FileUploaderPage } from "@/pages/file-upload/page"
export const Route = createFileRoute("/")({
  component: FileUploaderPage,
})
