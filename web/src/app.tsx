import { RouterProvider } from "react-router";
import { TanstackProvider } from "./app/providers/tanstack-provider";
import { router } from "./app/router";

export function App() {
  return (
    <TanstackProvider>
      <RouterProvider router={router} />
    </TanstackProvider>
  );
}
