"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  GalleryVerticalEnd,
  LayoutDashboard,
  LogOut,
  PieChart,
  School,
  Search,
  Settings2,
  Sparkles,
  Users,
  Bell,
  HelpCircle,
  ChevronRight,
  BarChart,
  TrendingUp,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Flattened navigation items for each role (removed subItems)
const roleData = {
  admin: {
    navItems: [
      { title: "Beranda", url: "/dashboard/admin", icon: LayoutDashboard },
      { title: "Pengguna", url: "/dashboard/admin/users", icon: Users },
      { title: "Operator", url: "/dashboard/admin/operators", icon: Users },
      { title: "Guru", url: "/dashboard/admin/teachers", icon: Users },
      { title: "Sekolah", url: "/dashboard/admin/schools", icon: School },
      { title: "Harga", url: "/dashboard/admin/pricing", icon: DollarSign },
      { title: "Transaksi", url: "/dashboard/admin/transactions", icon: CreditCard },
      { title: "Laporan", url: "/dashboard/admin/reports", icon: FileText },
      { title: "Analitik", url: "/dashboard/admin/teacher-analytics", icon: PieChart },
      { title: "Pengaturan", url: "/dashboard/admin/settings", icon: Settings2 },
    ],
    projects: [
      { name: "Analitik Pengguna", url: "#", icon: PieChart },
      { name: "Performa Sekolah", url: "#", icon: GalleryVerticalEnd },
    ],
  },
  operator: {
    navItems: [
      { title: "Beranda", url: "/dashboard/operator", icon: LayoutDashboard },
      { title: "Guru", url: "/dashboard/operator/teachers", icon: Users },
      { title: "Laporan", url: "/dashboard/operator/reports", icon: FileText },
      { title: "Pengaturan", url: "/dashboard/operator/settings", icon: Settings2 },
    ],
    projects: [
      { title: "Evaluasi Guru", url: "#", icon: FileText },
      { title: "Kalender Sekolah", url: "#", icon: Calendar },
    ],
  },
  teacher: {
    navItems: [
      { title: "Beranda", url: "/dashboard/teacher/dashboard", icon: LayoutDashboard },
      { title: "Buat RPP", url: "/dashboard/teacher/generate/rpp", icon: FileText },
      { title: "Buat Silabus", url: "/dashboard/teacher/syllabus", icon: FileText },
      { title: "Riwayat", url: "/dashboard/teacher/history", icon: FileText },
      { title: "Pelajaran", url: "/dashboard/teacher/lessons", icon: BookOpen },
      { title: "Jadwal", url: "/dashboard/teacher/schedule", icon: Calendar },
      { title: "Laporan", url: "/dashboard/teacher/reports", icon: FileText },
      { title: "Pengaturan", url: "/dashboard/teacher/settings", icon: Settings2 },
    ],
    projects: [
      { title: "Rencana Pelajaran", url: "#", icon: BookOpen },
      { title: "Perkembangan Siswa", url: "#", icon: GalleryVerticalEnd },
    ],
  },
  headmaster: {
    navItems: [
      { title: "Beranda", url: "/dashboard/headmaster", icon: LayoutDashboard },
      { title: "Guru", url: "/dashboard/headmaster/teachers", icon: Users },
      { title: "Operator", url: "/dashboard/headmaster/operators", icon: Users },
      { title: "Informasi Sekolah", url: "/dashboard/headmaster/school-info", icon: School },
      { title: "Laporan", url: "/dashboard/headmaster/reports", icon: FileText },
      { title: "Analitik", url: "/dashboard/headmaster/analytics", icon: BarChart },
      { title: "Pengaturan", url: "/dashboard/headmaster/settings", icon: Settings2 },
    ],
    projects: [
      { title: "Performa Guru", url: "#", icon: TrendingUp },
      { title: "Kalender Sekolah", url: "#", icon: Calendar },
    ],
  },
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: "admin" | "operator" | "teacher" | "headmaster"
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const data = roleData[role]
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const { user, logout } = useAuth()

  // Filter navigation items based on search term
  const filteredNavItems = data.navItems.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

  // Detect scroll position for shadow effect
  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (e.target) {
        const target = e.target as HTMLElement
        setIsScrolled(target.scrollTop > 10)
      }
    }

    // Use a ref instead of querySelector to avoid null issues
    const scrollArea = document.querySelector(".sidebar-scroll-area")
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll)
      return () => {
        if (scrollArea) {
          scrollArea.removeEventListener("scroll", handleScroll)
        }
      }
    }

    return undefined
  }, [])

  // Handle logout with confirmation
  const handleLogout = () => {
    setLogoutDialogOpen(true)
  }

  const confirmLogout = () => {
    // Show loading state or feedback if needed
    logout()
    setLogoutDialogOpen(false)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Sidebar
        collapsible="icon"
        className="border-r border-border/10 transition-all duration-300 m-0 p-0 bg-white dark:bg-gray-900/95 backdrop-blur-sm"
        {...props}
      >
        <SidebarHeader
          className={cn(
            "px-6 py-5 transition-all duration-300 sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
            isScrolled && "shadow-sm",
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-primary to-primary-light p-2.5 rounded-xl shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Guru Pintar
            </h2>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-border/20 rounded-xl h-10 focus-visible:ring-primary/20 bg-muted/30 transition-all focus-visible:bg-white dark:focus-visible:bg-gray-800"
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 py-2">
          <ScrollArea className="h-[calc(100vh-15rem)] sidebar-scroll-area">
            <div className="space-y-6">
              <div>
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Navigasi
                  </h3>
                </div>
                <SidebarMenu>
                  {filteredNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.url}
                            className={cn(
                              "group flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all text-sm",
                              pathname === item.url
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-foreground hover:bg-muted/50",
                              hoveredItem === item.title && pathname !== item.url && "bg-muted/30 translate-x-1",
                            )}
                            onMouseEnter={() => setHoveredItem(item.title)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <div
                              className={cn(
                                "flex items-center justify-center h-8 w-8 rounded-lg transition-all",
                                pathname === item.url ? "bg-primary/20" : "bg-muted/30 group-hover:bg-primary/10",
                              )}
                            >
                              <item.icon
                                className={cn(
                                  "h-4.5 w-4.5 transition-all",
                                  pathname === item.url
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-primary",
                                )}
                              />
                            </div>
                            <span className="transition-all duration-300 flex-1">{item.title}</span>
                            {pathname === item.url && <ChevronRight className="h-4 w-4 text-primary opacity-70" />}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>

              {data.projects.length > 0 && (
                <div>
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Proyek Terbaru
                    </h3>
                  </div>
                  <SidebarMenu>
                    {data.projects.map((project) => (
                      <SidebarMenuItem key={project?.name}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={project.url}
                              className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm hover:bg-muted/50 transition-all hover:translate-x-1"
                            >
                              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted/30 group-hover:bg-primary/10 transition-all">
                                <project.icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-all" />
                              </div>
                              <span className="transition-all duration-300 flex-1">
                                {project.title || project.name}
                              </span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {project.title || project.name}
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              )}
            </div>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/10 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-xl hover:bg-muted/30 transition-all duration-300 cursor-pointer">
            <Avatar className="h-10 w-10 border-2 border-primary/20 transition-all duration-300 hover:border-primary">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 rounded-xl border-border/20 hover:bg-destructive/10 hover:text-destructive text-sm mb-4 transition-all duration-300"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </Button>

          <div className="flex justify-between mt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 transition-all duration-300"
                >
                  <Bell className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors duration-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifikasi</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 transition-all duration-300"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors duration-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bantuan</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 transition-all duration-300"
                >
                  <Settings2 className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors duration-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pengaturan</TooltipContent>
            </Tooltip>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar? Anda perlu masuk kembali untuk mengakses akun Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-lg">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-destructive hover:bg-destructive/90 rounded-lg">
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}

