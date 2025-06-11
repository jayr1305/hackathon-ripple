"use client"

import { Activity, BarChart3, Heart, Baby, Home, Users, FileText, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AppSidebarProps {
  selectedDataset: "hypertension" | "low_birth_weight"
  onDatasetChange: (dataset: "hypertension" | "low_birth_weight") => void
}

const generalItems = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Overview",
    url: "#",
    icon: BarChart3,
  },
  {
    title: "Analytics",
    url: "#",
    icon: Activity,
  },
  {
    title: "Reports",
    url: "#",
    icon: FileText,
  },
  {
    title: "Contacts",
    url: "#",
    icon: Users,
  },
]

const healthItems = [
  {
    title: "Health",
    key: "hypertension" as const,
    icon: Heart,
  },
  {
    title: "Education",
    key: "low_birth_weight" as const,
    icon: Baby,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar({ selectedDataset, onDatasetChange }: AppSidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600">WIAI</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Controller</p>
            <p className="text-xs text-muted-foreground">Wadhwani AI</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.title === "Home"}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Health Metrics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {healthItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.key === selectedDataset}
                    onClick={() => item.key && onDatasetChange(item.key)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>System Online</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
