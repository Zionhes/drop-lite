import { createFileRoute } from "@tanstack/react-router"
import FileUploader from "@/components/FileUploader"
export const Route = createFileRoute("/")({
  component: () => (
    <div>
      <FileUploader />
    </div>
  ),
})
