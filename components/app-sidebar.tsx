import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Settings,
} from "lucide-react"
import { auth } from "@/auth"

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
import { SignOutButton } from "./ui/sign-out-button";

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

export async function AppSidebar() {
    const session = await auth()
    const name = session?.user?.name || ""
    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "??"
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

            <SidebarFooter className="flex items-center justify-between">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={session?.user?.image ?? ""} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <SignOutButton />
            </SidebarFooter>
        </Sidebar>
    )
}