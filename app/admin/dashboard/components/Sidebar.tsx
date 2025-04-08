"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { RxDashboard } from "react-icons/rx";
import { BsCalendarEvent } from "react-icons/bs";
import { FiUsers, FiSettings, FiFolder } from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoLogoWhatsapp, IoEarthOutline } from "react-icons/io5";
import Logo from "./Logo";

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
    icon: FiFolder,
    label: "Files",
    href: "/admin/files",
  },
  {
    icon: BsCalendarEvent,
    label: "Events",
    href: "/admin/dashboard/events",
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
    icon: IoLogoWhatsapp,
    label: "WhatsApp",
    href: "/admin/dashboard/whatsapp", // Changed to use the tab system
  },
  {
    icon: IoEarthOutline,
    label: "Site Config",
    href: "/admin/dashboard/site-config",
  },
];

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ isExpanded, isDarkMode, activeTab, onTabChange }: SidebarProps) {

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = activeTab === item.label.toLowerCase();
    const Icon = item.icon;

    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Link
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              onTabChange(item.label.toLowerCase());
            }}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
              isActive
                ? "bg-white/15 text-white font-medium before:absolute before:-left-4 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-white before:content-['']"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="relative flex items-center">
              <Icon
                className={`transition-all duration-300 ${
                  isExpanded ? "h-[22px] w-[22px]" : "h-7 w-7"
                } ${isActive ? "text-white" : "text-white/80"} group-hover:scale-110`}
                aria-hidden="true"
              />
            </span>
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100" : "w-0 translate-x-10 opacity-0"
              }`}
            >
              {item.label}
            </span>
          </Link>
        </Tooltip.Trigger>
        {!isExpanded && (
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={12}
              className="animate-slideRight select-none rounded-lg bg-gray-800/95 px-3 py-2 text-sm text-white shadow-xl backdrop-blur-sm"
            >
              {item.label}
              <Tooltip.Arrow className="fill-gray-800/95" />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    );
  };

  return (
    <Tooltip.Provider delayDuration={0}>
      <aside
        className={`flex h-screen flex-col backdrop-blur-md backdrop-saturate-150 text-white transition-all duration-300 ease-in-out border-r ${
          isDarkMode
            ? "bg-gray-900/95 border-white/10"
            : "bg-blue-700/95 border-white/20"
        } ${isExpanded ? "w-64" : "w-20"}`}
        role="navigation"
        aria-label="Main Sidebar"
      >
        <div className="h-16 flex items-center justify-start px-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`group relative isolate cursor-pointer rounded-lg p-1 transition-all duration-300 hover:bg-white/10 ${
              isExpanded ? "h-9 w-9" : "h-11 w-11"
            }`}>
              <Logo />
            </div>
            <span
              className={`font-semibold whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100" : "w-0 translate-x-10 opacity-0"
              }`}
            >
              HMTIPemuda
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                onClick={() => {}} // Add your settings click handler here
                aria-label="Settings"
              >
                <span className="relative flex items-center">
                  <FiSettings
                    className={`transition-all duration-300 ${
                      isExpanded ? "h-[22px] w-[22px]" : "h-7 w-7"
                    } group-hover:scale-110`}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={`whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? "opacity-100" : "w-0 translate-x-10 opacity-0"
                  }`}
                >
                  Settings
                </span>
              </button>
            </Tooltip.Trigger>
            {!isExpanded && (
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  sideOffset={12}
                  className="animate-slideRight select-none rounded-lg bg-gray-800/95 px-3 py-2 text-sm text-white shadow-xl backdrop-blur-sm"
                >
                  Settings
                  <Tooltip.Arrow className="fill-gray-800/95" />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </div>
      </aside>
    </Tooltip.Provider>
  );
}
