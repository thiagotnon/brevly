import { Navigate, createBrowserRouter } from "react-router";
import { Layout } from "../components/layout";
import { ErrorElement, Home, NotFound, Redirect } from "./views";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        path: "/",
        element: <Home />,
      },
      {
        path: "/url/not-found",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <Navigate to="/url/not-found" replace />,
      },
      {
        path: "/:shortened",
        element: <Redirect />,
      },
    ],
  },
]);
