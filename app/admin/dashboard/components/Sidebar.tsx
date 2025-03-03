"use client";

import { IconType } from "react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { RxDashboard } from "react-icons/rx";
import { BsCalendarEvent } from "react-icons/bs";
import { FiUsers, FiSettings } from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BiLogOut } from "react-icons/bi";
import Logo from "./Logo";
import { createPortal } from 'react-dom';

interface NavItem {
  icon: IconType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    icon: RxDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: BsCalendarEvent,
    label: "Events",
    href: "/admin/events",
  },
  {
    icon: FiUsers,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: HiOutlineDocumentReport,
    label: "Reports",
    href: "/admin/reports",
  },
  {
    icon: FiSettings,
    label: "Settings",
    href: "/admin/settings",
  },
];

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
}

const TooltipContent = ({children}: {children: React.ReactNode}) => {
  if (typeof window === 'undefined') return null;
  
  return createPortal(
    <div className="absolute top-0 left-0 z-[9999]">
      {children}
    </div>,
    document.body
  );
};

export default function Sidebar({ isExpanded, isDarkMode }: SidebarProps) {
  return (
    <Tooltip.Provider delayDuration={0}>
      <aside
        className={`flex h-screen flex-col backdrop-blur-md backdrop-saturate-150 text-white transition-all duration-300 ease-in-out border-r ${
          isDarkMode 
            ? "bg-gray-800/95 border-white/10" 
            : "bg-blue-600/95 border-white/20"
        } ${
          isExpanded 
            ? "w-64 shadow-2xl" 
            : "w-20"
        }`}
        aria-expanded={isExpanded}
        role="navigation"
      >
        <div className="flex h-16 items-center justify-center px-4">
          <div className="flex items-center gap-3">
            <div className={`group relative isolate cursor-pointer rounded-lg p-1 transition-all duration-300 hover:bg-white/10 ${
              isExpanded ? "h-9 w-9" : "h-11 w-11"
            }`}>
              <Logo />
            </div>
            <span
              className={`font-semibold whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 w-0"
              }`}
            >
              HMTIPemuda
            </span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip.Root key={item.href}>
                <Tooltip.Trigger asChild>
                  <a
                    href={item.href}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 overflow-hidden ${
                      item.href === "/admin/dashboard" 
                        ? "bg-white/10 text-white font-medium before:absolute before:-left-4 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-white before:content-['']" 
                        : "text-white/80 hover:bg-white/10 hover:text-white after:absolute after:inset-0 after:w-0 after:bg-white/10 after:transition-all hover:after:w-full"
                    }`}
                    aria-label={item.label}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <Icon 
                      className={`relative z-10 transition-all duration-300 ${
                        isExpanded ? "h-5 w-5" : "h-8 w-8"
                      } group-hover:scale-110`} 
                      aria-hidden="true" 
                    />
                    <span
                      className={`relative z-10 whitespace-nowrap transition-all duration-300 ${
                        isExpanded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 w-0"
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                </Tooltip.Trigger>
                {!isExpanded && (
                  <TooltipContent>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={12}
                        className="animate-slideRight select-none rounded-md bg-gray-800/90 px-3 py-1.5 text-sm text-white shadow-lg backdrop-blur-sm dark:bg-gray-700/90"
                      >
                        {item.label}
                        <Tooltip.Arrow className="fill-gray-800/90 dark:fill-gray-700/90" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </TooltipContent>
                )}
              </Tooltip.Root>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button 
                className="group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white overflow-hidden after:absolute after:inset-0 after:w-0 after:bg-white/10 after:transition-all hover:after:w-full"
                aria-label="Logout"
                role="button"
                tabIndex={0}
              >
                <BiLogOut 
                  className={`relative z-10 transition-all duration-300 ${
                    isExpanded ? "h-5 w-5" : "h-8 w-8"
                  } group-hover:scale-110`} 
                  aria-hidden="true" 
                />
                <span
                  className={`relative z-10 whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 w-0"
                  }`}
                >
                  Logout
                </span>
              </button>
            </Tooltip.Trigger>
            {!isExpanded && (
              <TooltipContent>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={12}
                    className="animate-slideRight select-none rounded-md bg-gray-800/90 px-3 py-1.5 text-sm text-white shadow-lg backdrop-blur-sm dark:bg-gray-700/90"
                  >
                    Logout
                    <Tooltip.Arrow className="fill-gray-800/90 dark:fill-gray-700/90" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </TooltipContent>
            )}
          </Tooltip.Root>
        </div>
      </aside>
    </Tooltip.Provider>
  );
}
