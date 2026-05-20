import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { DatabaseDebug } from "./DatabaseDebug";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-200 to-blue-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <DatabaseDebug />
    </div>
  );
}