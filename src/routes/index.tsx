import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: () => <div>¡Página de inicio!</div>,
})
