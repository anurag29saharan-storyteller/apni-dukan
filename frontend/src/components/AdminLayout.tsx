import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-ink-50">
      <AdminNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}