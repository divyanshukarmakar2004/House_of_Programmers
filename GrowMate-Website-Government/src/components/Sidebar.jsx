import React from "react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Bug,
  Bell,
  Gift,
  FileText,
  Settings,
  X,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Farmers Directory",
    href: "/farmers",
    icon: Users,
  },
  {
    title: "Yield & Crop Analysis",
    href: "/yield-analysis",
    icon: BarChart3,
  },
  {
    title: "Pest & Disease Tracking",
    href: "/pest-tracking",
    icon: Bug,
  },
  {
    title: "Market Prices",
    href: "/market-prices",
    icon: IndianRupee,
  },
  {
    title: "Alerts & Notifications",
    href: "/alerts",
    icon: Bell,
  },
  {
    title: "Schemes & Subsidies",
    href: "/schemes",
    icon: Gift,
  },
  {
    title: "Reports & Insights",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in-0 duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-68 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0" // Always visible on large screens
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-2 flex-shrink-0 max-w-[100%]">
              <img src="/logo3.png" alt="Logo" className="w-15 h-15 flex-shrink-0" />
              <div className="overflow-hidden">
                  <h1 className="text-3xl font-heading font-bold text-[#2E7D32] drop-shadow-lg truncate">
                    Agri<span className="text-[#DAA520]">Smart</span>
                  </h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-[#66BB6A]/20 hover:text-[#2E7D32] ml-2 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group animate-in fade-in-0 slide-in-from-left-2",
                    isActive
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "text-sidebar-foreground hover:bg-[#66BB6A]/20 hover:text-[#2E7D32]"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.title}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-white" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-[#4E4E4E] text-center">
              <p>© 2025 Govt of India</p>
              <p>Electronics & IT Dept</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

