import { Outlet } from "react-router";
import { Toaster } from "sonner";

export const Layout = () => {
  return (
    <>
      <div className="flex flex-col p-4 w-full h-screen lg:overflow-hidden">
        <main className="flex flex-1 justify-center items-start mx-auto pt-1 lg:pt-30 w-full max-w-6xl overflow-hidden">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </>
  );
};
