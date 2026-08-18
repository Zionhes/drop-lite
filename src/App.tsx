import { createRouter, RouterProvider } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { routeTree } from "./routeTree.gen" // Tu árbol de rutas generado

// 1. Creas la instancia
const router = createRouter({ routeTree })

// 2. Opcional: Registrar el router para el autocompletado de TypeScript
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// 3. Renderizas tu App
export const App = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
    </QueryClientProvider>
  )
}
