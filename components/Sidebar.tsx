"use client";

import React, { useState } from "react";
import { Home, Users, Package, Store, Moon, Sun } from "lucide-react";

export default function Sidebar() {
  const [darkSidebar, setDarkSidebar] = useState(false);
  const [active, setActive] = useState("Dashboard");

  return (
    <aside
      className={`fixed left-0 top-[84px] flex flex-col justify-between
      h-[calc(100vh-80px)] w-64 border-r transition-colors duration-300 z-40
      ${
        darkSidebar
          ? "bg-slate-900 text-white border-slate-700"
          : "bg-white text-slate-900 border-slate-200"
      }`}
    >
      <nav className="flex flex-col p-4 space-y-3">
        {[
          { name: "Dashboard", icon: Home },
          { name: "Usuarios", icon: Users },
          { name: "Productos", icon: Package },
          { name: "Agro Veterinarias", icon: Store },
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-2 p-2 rounded-md transition font-medium ${
              active === item.name
                ? "bg-violet-500 text-white"
                : darkSidebar
                ? "hover:bg-slate-800"
                : "hover:bg-slate-100"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </button>
        ))}
      </nav>

      <div
        className={`p-4 border-t flex items-center justify-between transition-colors ${
          darkSidebar ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <span className="text-sm font-medium">
          {darkSidebar ? "Modo Claro" : "Modo Oscuro"}
        </span>
        <button
          onClick={() => setDarkSidebar(!darkSidebar)}
          className="p-2 rounded-full hover:scale-110 transition-transform"
        >
          {darkSidebar ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-800" />
          )}
        </button>
      </div>
    </aside>
  );
}
