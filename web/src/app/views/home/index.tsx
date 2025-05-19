import { NavLink } from "react-router";
import { LinkForm } from "./components/link-form";
import { LinkList } from "./components/link-list";

export function Home() {
  return (
    <div className="flex flex-col flex-1 gap-8 w-full overflow-hidden">
      <div className="flex flex-col items-center-safe lg:items-start gap-8 w-full h-full overflow-hidden">
        <NavLink to="/">
          <img src="/logo.svg" alt="Logo" className="w-32" />
        </NavLink>
        <div className="flex-1 gap-4 grid grid-cols-1 lg:grid-cols-5 w-full overflow-hidden">
          <div className="lg:col-span-2">
            <LinkForm />
          </div>
          <div className="flex flex-col lg:col-span-3 overflow-hidden">
            <LinkList />
          </div>
        </div>
      </div>
    </div>
  );
}
