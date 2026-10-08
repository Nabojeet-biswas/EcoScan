import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./common/Navbar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { NavbarProvider } from "@/context/NavbarContext";
import { clsx } from "clsx";

function Backdrop({ isOpen, close }: { isOpen: boolean; close: () => void }) {
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-40 bg-black/50",
        prefersReducedMotion ? "" : "transition-opacity duration-250 ease-out"
      )}
      onClick={close}
      aria-hidden="true"
    />
  );
}

function LayoutInner() {
  const { isOpen, close } = useSidebar();

  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const transitionClass = prefersReducedMotion
    ? ""
    : "transition-transform duration-250 ease-out";

  return (
    <NavbarProvider>
      <div className="min-h-screen">
        <Sidebar
          className={clsx(
            "fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col border-r border-line-strong bg-bg-surface",
            isOpen ? "translate-x-0" : "-translate-x-full",
            transitionClass
          )}
          aria-label="Main navigation"
          role="navigation"
          aria-hidden={!isOpen}
        />

        <Backdrop isOpen={isOpen} close={close} />

        <main id="main-content">
          <Navbar />
          <Outlet />
        </main>
      </div>
    </NavbarProvider>
  );
}

export function Layout() {
  return (
    <SidebarProvider>
      <LayoutInner />
    </SidebarProvider>
  );
}