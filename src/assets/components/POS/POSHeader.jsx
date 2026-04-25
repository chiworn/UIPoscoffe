import React from 'react'
import { Link, useLocation } from "react-router-dom";
import {
  Coffee,
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  User
} from "lucide-react";


const navItems = [
  { path: "/POS", label: "POS", icon: Coffee },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/products", label: "Products", icon: Package },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings }
];

export default function POSHeader() {
     const location = useLocation();
  return (
    <>
       <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 bg-amber-900 items-center justify-center rounded-xl bg-primary">
            <Coffee className="h-5 w-5   text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg   font-bold">CaféPOS</h1>
            <p className="text-xs text-muted-foreground">
              Coffee Shop System
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className=
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">Cashier</p>
            <p className=" text-blue-600">Active</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <User className="h-5 w-5" />
          </button>
        </div>

      </div>
    </header>
    </>
  )
}
