"use client"

import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Settings,
    Activity
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";

const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Agenda",
        url: "/schedule",
        icon: CalendarDays,
    },
    {
        title: "Pacientes",
        url: "/patients",
        icon: Users,
    },
    {
        title: "Configurações",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Medical CRM</SidebarGroupLabel>
                    <ModeToggle />
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
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
            </SidebarContent>

            <SidebarFooter>
                <Avatar className="h-16 w-16">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                            GS
                        </AvatarFallback>
                    </Avatar>
            </SidebarFooter>
        </Sidebar>
    )
}