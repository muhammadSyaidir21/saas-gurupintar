"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useOperatorsStore } from "@/lib/store/useOperatorsStore"
import type { Operator } from "@/lib/api/mockData/operators"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { StatusBadge } from "@/components/dashboard/operators/status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { PackageBadge } from "@/components/dashboard/operators/package-badge"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Edit2,
  ExternalLink,
  Info,
  Key,
  Lock,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Shield,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow, format } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "@/hooks/use-toast"

export default function OperatorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const operatorId = params.id as string
  const { fetchOperator, selectedOperator, isLoading, error, updateOperator } = useOperatorsStore()
  const [usageData, setUsageData] = useState<any[]>([])
  const [activityData, setActivityData] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedOperator, setEditedOperator] = useState<Partial<Operator>>({})
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    if (operatorId) {
      fetchOperator(operatorId)
    }
  }, [operatorId, fetchOperator])

  useEffect(() => {
    if (selectedOperator) {
      generateUsageData(selectedOperator)
      generateActivityData(selectedOperator)
      setEditedOperator(selectedOperator)
    }
  }, [selectedOperator])

  const generateUsageData = (operator: Operator) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()

    // Safely access quotaUsage.used with a fallback to 0
    const quotaUsed = operator.quotaUsage?.used || 0

    const data = months.slice(0, currentMonth + 1).map((month, index) => {
      const baseValue = quotaUsed / (currentMonth + 1)
      const randomFactor = 0.7 + Math.random() * 0.6 // Random factor between 0.7 and 1.3

      return {
        month,
        usage: Math.round((baseValue * randomFactor * (index + 1)) / (currentMonth + 1)),
      }
    })

    setUsageData(data)
  }

  const generateActivityData = (operator: Operator) => {
    // Generate 14 days of activity data
    const data = Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (13 - i))

      return {
        date: format(date, "MMM dd"),
        logins: Math.floor(Math.random() * 10),
        actions: Math.floor(Math.random() * 20),
      }
    })

    setActivityData(data)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return "Invalid date"
    }
  }

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return "Unknown"
    }
  }

  // Safe number formatting with fallback
  const formatNumber = (value: number | undefined) => {
    return value !== undefined ? value.toLocaleString() : "0"
  }

  const handleSaveChanges = () => {
    if (selectedOperator && editedOperator) {
      const updatedOperator = {
        ...selectedOperator,
        ...editedOperator,
      }

      updateOperator(updatedOperator)
      setIsEditing(false)
      toast({
        title: "Perubahan tersimpan",
        description: "Informasi operator telah berhasil diperbarui.",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditedOperator(selectedOperator || {})
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedOperator((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setEditedOperator((prev) => ({
      ...prev,
      [parent]: {
        ...((prev[parent as keyof typeof prev] as any) || {}),
        [field]: value,
      },
    }))
  }

  const handleResetPassword = () => {
    // In a real app, this would call an API to reset the password
    toast({
      title: "Password reset",
      description: "A password reset link has been sent to the operator's email.",
    })
    setShowResetPasswordDialog(false)
  }

  const handleSuspendAccount = () => {
    if (selectedOperator) {
      const updatedOperator = {
        ...selectedOperator,
        status: selectedOperator.status === "Suspended" ? "Active" : "Suspended",
      }

      updateOperator(updatedOperator)
      setShowSuspendDialog(false)
      toast({
        title: selectedOperator.status === "Suspended" ? "Account activated" : "Account suspended",
        description:
          selectedOperator.status === "Suspended"
            ? "The operator account has been activated."
            : "The operator account has been suspended.",
      })
    }
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    router.push("/dashboard/admin/operators")
    toast({
      title: "Account deleted",
      description: "The operator account has been permanently deleted.",
      variant: "destructive",
    })
    setShowDeleteDialog(false)
  }

  const handleToggle2FA = () => {
    if (selectedOperator) {
      const updatedOperator = {
        ...selectedOperator,
        settings: {
          ...(selectedOperator.settings || {}),
          twoFactorEnabled: !(selectedOperator.settings?.twoFactorEnabled || false),
        },
      }

      updateOperator(updatedOperator)
      toast({
        title: updatedOperator.settings?.twoFactorEnabled ? "2FA Enabled" : "2FA Disabled",
        description: updatedOperator.settings?.twoFactorEnabled
          ? "Two-factor authentication has been enabled for this account."
          : "Two-factor authentication has been disabled for this account.",
      })
    }
  }

  if (isLoading) {
    return <OperatorDetailSkeleton />
  }

  if (error || !selectedOperator) {
    return (
      <div className="container py-6">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/admin">Dasbor</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/admin/operators">Operator</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Gagal memuat detail operator. Operator mungkin tidak ada.
          </AlertDescription>
        </Alert>

        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push("/dashboard/admin/operators")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Operator
          </Button>
        </div>
      </div>
    )
  }

  const operator = selectedOperator

  // Safely calculate quota percentage with fallbacks
  const quotaUsed = operator.quotaUsage?.used || 0
  const quotaTotal = operator.quotaUsage?.total || 1 // Prevent division by zero
  const quotaPercentage = Math.round((quotaUsed / quotaTotal) * 100)
  const quotaRemaining = operator.quotaUsage?.remaining || 0

  // Calculate color based on quota percentage
  const getQuotaColor = () => {
    if (quotaPercentage < 60) return "var(--chart-1)"
    if (quotaPercentage < 80) return "var(--chart-2)"
    return "var(--chart-3)"
  }

  // Pie chart data for quota
  const quotaPieData = [
    { name: "Used", value: quotaUsed },
    { name: "Remaining", value: quotaRemaining },
  ]

  const QUOTA_COLORS = [getQuotaColor(), "var(--muted)"]

  return (
    <div className="container py-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/admin">Dasbor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/admin/operators">Operator</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{operator.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sticky top-0 z-10 bg-background pb-4 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={operator.avatar} alt={operator.name} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{operator.name}</h1>
              <StatusBadge status={operator.status} />
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <span>{operator.email}</span>
              <span>•</span>
              <span>ID: {operatorId}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profil
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setShowResetPasswordDialog(true)}>
                    <Key className="mr-2 h-4 w-4" />
                    Reset Kata Sandi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(`mailto:${operator.email}`)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Kirim Email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowSuspendDialog(true)} className="text-amber-600">
                    <Lock className="mr-2 h-4 w-4" />
                    {operator.status === "Suspended" ? "Aktifkan Akun" : "Tangguhkan Akun"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Akun
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="default" size="sm" onClick={handleSaveChanges}>
                <Check className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Informasi Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" name="name" value={editedOperator.name || ""} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editedOperator.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telepon</Label>
                    <Input id="phone" name="phone" value={editedOperator.phone || ""} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="role">Peran</Label>
                    <Select
                      value={editedOperator.role || ""}
                      onValueChange={(value) => setEditedOperator({ ...editedOperator, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih peran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operator">Operator</SelectItem>
                        <SelectItem value="Senior Operator">Operator Senior</SelectItem>
                        <SelectItem value="Regional Operator">Operator Regional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="region">Wilayah</Label>
                    <Input id="region" name="region" value={editedOperator.region || ""} onChange={handleInputChange} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{operator.email || "Not provided"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Telepon</div>
                      <div className="font-medium">{operator.phone || "Not provided"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Peran</div>
                      <div className="font-medium">{operator.role || "Standard Operator"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Wilayah</div>
                      <div className="font-medium">{operator.region || "Not specified"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Tanggal Bergabung</div>
                      <div className="font-medium">{operator.joinDate ? formatDate(operator.joinDate) : "Unknown"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Terakhir Aktif</div>
                      <div className="font-medium">
                        {operator.lastActive ? getTimeAgo(operator.lastActive) : "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold">{formatNumber(operator.schools)}</div>
                  <div className="text-sm text-muted-foreground">Sekolah</div>
                </div>
                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold">{formatNumber(operator.activeUsers)}</div>
                  <div className="text-sm text-muted-foreground">Pengguna Aktif</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">Penggunaan Kuota</div>
                  <div className="text-sm font-medium">{quotaPercentage}%</div>
                </div>
                <Progress value={quotaPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <div>{formatNumber(quotaUsed)} digunakan</div>
                  <div>{formatNumber(quotaRemaining)} tersisa</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Status Paket</div>
                {operator.packages && operator.packages.length > 0 ? (
                  <div className="space-y-2">
                    {operator.packages.slice(0, 2).map((pkg) => (
                      <div key={pkg.id} className="flex justify-between items-center p-2 bg-muted/40 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          <div className="text-sm font-medium">{pkg.name}</div>
                        </div>
                        <PackageBadge tier={pkg.tier} />
                      </div>
                    ))}
                    {operator.packages.length > 2 && (
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View all {operator.packages.length} packages
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Tidak ada paket tersedia</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Alamat</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="street">Jalan</Label>
                    <Input
                      id="street"
                      value={editedOperator.address?.street || ""}
                      onChange={(e) => handleNestedInputChange("address", "street", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Kota</Label>
                      <Input
                        id="city"
                        value={editedOperator.address?.city || ""}
                        onChange={(e) => handleNestedInputChange("address", "city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Provinsi</Label>
                      <Input
                        id="state"
                        value={editedOperator.address?.state || ""}
                        onChange={(e) => handleNestedInputChange("address", "state", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">Kode Pos</Label>
                      <Input
                        id="zipCode"
                        value={editedOperator.address?.zipCode || ""}
                        onChange={(e) => handleNestedInputChange("address", "zipCode", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Negara</Label>
                      <Input
                        id="country"
                        value={editedOperator.address?.country || ""}
                        onChange={(e) => handleNestedInputChange("address", "country", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : operator.address ? (
                <div className="space-y-1">
                  <div className="font-medium">{operator.address.street || "No street address"}</div>
                  <div>
                    {operator.address.city || "No city"},{operator.address.state || "No state"}
                    {operator.address.zipCode || ""}
                  </div>
                  <div>{operator.address.country || "No country"}</div>
                </div>
              ) : (
                <div className="text-muted-foreground">Tidak ada informasi alamat tersedia</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-muted/40 p-1">
              <TabsTrigger value="overview" className="flex-1">
                Ringkasan
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex-1">
                Paket
              </TabsTrigger>
              <TabsTrigger value="quota" className="flex-1">
                Kuota & Penggunaan
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1">
                Keamanan
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">
                Aktivitas
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Informasi Perusahaan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="companyName">Nama Perusahaan</Label>
                          <Input
                            id="companyName"
                            value={editedOperator.company?.name || ""}
                            onChange={(e) => handleNestedInputChange("company", "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="position">Jabatan</Label>
                          <Input
                            id="position"
                            value={editedOperator.company?.position || ""}
                            onChange={(e) => handleNestedInputChange("company", "position", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="department">Departemen</Label>
                          <Input
                            id="department"
                            value={editedOperator.company?.department || ""}
                            onChange={(e) => handleNestedInputChange("company", "department", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountType">Tipe Akun</Label>
                          <Select
                            value={editedOperator.accountType || "Standard"}
                            onValueChange={(value) => setEditedOperator({ ...editedOperator, accountType: value })}
                          >
                            <SelectTrigger id="accountType">
                              <SelectValue placeholder="Pilih tipe akun" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Standard">Standar</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="Enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : operator.company ? (
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Perusahaan</div>
                          <div className="font-medium">{operator.company.name || "Not specified"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Jabatan</div>
                          <div className="font-medium">{operator.company.position || "Not specified"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Departemen</div>
                          <div className="font-medium">{operator.company.department || "Not specified"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Tipe Akun</div>
                          <div className="font-medium">{operator.accountType || "Standard"}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Tidak ada informasi perusahaan tersedia</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Statistik Cepat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/40 rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Login Terakhir</div>
                          <div className="font-medium">
                            {operator.lastActive ? getTimeAgo(operator.lastActive) : "Never"}
                          </div>
                        </div>
                        <div className="bg-muted/40 rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">Usia Akun</div>
                          <div className="font-medium">
                            {operator.joinDate ? getTimeAgo(operator.joinDate) : "Unknown"}
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/40 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm text-muted-foreground">Penggunaan Kuota</div>
                          <div className="text-sm font-medium">{quotaPercentage}%</div>
                        </div>
                        <Progress value={quotaPercentage} className="h-2" />
                      </div>

                      <div className="bg-muted/40 rounded-lg p-3">
                        <div className="text-sm text-muted-foreground mb-1">Status Akun</div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={operator.status} />
                          <span className="text-sm">
                            {operator.status === "Active"
                              ? "Akun aktif dan beroperasi"
                              : operator.status === "Inactive"
                                ? "Akun saat ini tidak aktif"
                                : operator.status === "Pending"
                                  ? "Akun menunggu aktivasi"
                                  : "Akun telah ditangguhkan"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Catatan</CardTitle>
                  <CardDescription>Catatan internal tentang operator ini</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      placeholder="Tambahkan catatan tentang operator ini..."
                      className="min-h-[100px]"
                      value={editedOperator.notes || ""}
                      onChange={(e) => setEditedOperator({ ...editedOperator, notes: e.target.value })}
                    />
                  ) : (
                    <div className="bg-muted/40 rounded-lg p-3 min-h-[100px]">
                      {operator.notes ? (
                        <p>{operator.notes}</p>
                      ) : (
                        <p className="text-muted-foreground">Tidak ada catatan tersedia untuk operator ini.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-4">
                      {activityData.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          <div className="bg-primary/10 rounded-full p-1.5">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {index === 0
                                ? "Login ke sistem"
                                : index === 1
                                  ? "Memperbarui pengaturan sekolah"
                                  : index === 2
                                    ? "Menambahkan akun guru baru"
                                    : index === 3
                                      ? "Membuat laporan bulanan"
                                      : "Melihat analitik dasbor"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {activity.date} • {Math.floor(Math.random() * 12) + 1}:
                              {Math.floor(Math.random() * 60)
                                .toString()
                                .padStart(2, "0")}{" "}
                              {Math.random() > 0.5 ? "AM" : "PM"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Semua Aktivitas
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paket Berlangganan</CardTitle>
                  <CardDescription>Kelola langganan paket operator</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {operator.packages && operator.packages.length > 0 ? (
                    operator.packages.map((pkg) => (
                      <div key={pkg.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/40 p-4 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                pkg.tier === "Premium"
                                  ? "bg-amber-100 text-amber-700"
                                  : pkg.tier === "Enterprise"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              <Star className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-lg">{pkg.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Dibeli: {pkg.purchaseDate ? formatDate(pkg.purchaseDate) : "Tidak diketahui"} • Berakhir:{" "}
                                {pkg.expiryDate ? formatDate(pkg.expiryDate) : "Tidak diketahui"}
                              </div>
                            </div>
                          </div>
                          <PackageBadge tier={pkg.tier} />
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-muted/40 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Biaya</div>
                              <div className="text-xl font-bold">${pkg.cost || 0}</div>
                            </div>
                            <div className="bg-muted/40 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Status</div>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    new Date(pkg.expiryDate) > new Date() ? "bg-green-500" : "bg-red-500"
                                  }`}
                                ></div>
                                <span>{new Date(pkg.expiryDate) > new Date() ? "Aktif" : "Kadaluarsa"}</span>
                              </div>
                            </div>
                            <div className="bg-muted/40 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Pembaruan</div>
                              <div className="font-medium">
                                {new Date(pkg.expiryDate) > new Date()
                                  ? `Dalam ${Math.ceil((new Date(pkg.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} hari`
                                  : "Kadaluarsa"}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Fitur:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {pkg.features && pkg.features.length > 0 ? (
                                pkg.features.map((feature, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span className="text-sm">{feature}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm text-muted-foreground">Tidak ada fitur yang tercantum</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="border-t p-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Kelola
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Tidak Ada Paket</h3>
                      <p className="text-muted-foreground mb-4">Operator ini belum memiliki paket.</p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Paket
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paket Tersedia</CardTitle>
                  <CardDescription>Paket tambahan yang dapat ditugaskan ke operator ini</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Basic", "Standard", "Premium"].map((tier) => (
                      <Card key={tier} className="border-2 hover:border-primary/50 transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle>{tier} Package</CardTitle>
                          <CardDescription>
                            {tier === "Basic"
                              ? "Fitur dasar"
                              : tier === "Standard"
                                ? "Fitur lanjutan"
                                : "Solusi lengkap"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-2xl font-bold">
                            ${tier === "Basic" ? "99" : tier === "Standard" ? "199" : "299"}
                            <span className="text-sm font-normal text-muted-foreground">/bulan</span>
                          </div>
                          <div className="space-y-2">
                            {[
                              "Fitur inti",
                              tier !== "Basic" && "Analitik lanjutan",
                              tier === "Premium" && "Dukungan prioritas",
                              "Manajemen pengguna",
                              tier !== "Basic" && "Merek kustom",
                              tier === "Premium" && "Akses API",
                            ]
                              .filter(Boolean)
                              .map((feature, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" variant={tier === "Premium" ? "default" : "outline"}>
                            Tetapkan Paket
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quota Tab */}
            <TabsContent value="quota" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ringkasan Kuota</CardTitle>
                    <CardDescription>Penggunaan dan alokasi kuota saat ini</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <div className="w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={quotaPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {quotaPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={QUOTA_COLORS[index % QUOTA_COLORS.length]} />
                              ))}
                            </Pie>
                            <text
                              x="50%"
                              y="50%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-lg font-bold"
                            >
                              {quotaPercentage}%
                            </text>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/40 rounded-lg p-3">
                        <div className="text-sm text-muted-foreground">Total Kuota</div>
                        <div className="text-xl font-bold">{formatNumber(quotaTotal)}</div>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <div className="text-sm text-muted-foreground">Kuota Digunakan</div>
                        <div className="text-xl font-bold">{formatNumber(quotaUsed)}</div>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <div className="text-sm text-muted-foreground">Tersisa</div>
                        <div className="text-xl font-bold">{formatNumber(quotaRemaining)}</div>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <div className="text-sm text-muted-foreground">Terakhir Diperbarui</div>
                        <div className="font-medium">
                          {operator.quotaUsage?.lastUpdated
                            ? new Date(operator.quotaUsage.lastUpdated).toLocaleString()
                            : "Never"}
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-2">
                        <Label htmlFor="quotaTotal">Sesuaikan Total Kuota</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="quotaTotal"
                            type="number"
                            value={editedOperator.quotaUsage?.total || quotaTotal}
                            onChange={(e) =>
                              handleNestedInputChange("quotaUsage", "total", Number.parseInt(e.target.value))
                            }
                          />
                          <Button variant="outline">Terapkan</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tren Penggunaan</CardTitle>
                    <CardDescription>Pola konsumsi kuota bulanan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          usage: {
                            label: "Penggunaan Kuota",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={usageData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="usage" fill="var(--color-usage)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Alokasi Kuota</CardTitle>
                  <CardDescription>Kelola distribusi kuota antar sekolah</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }, (_, i) => ({
                      name: `School ${i + 1}`,
                      allocation: Math.floor(Math.random() * 30) + 10,
                      used: Math.floor(Math.random() * 20) + 5,
                    })).map((school, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{school.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {school.used} / {school.allocation} ({Math.round((school.used / school.allocation) * 100)}%)
                          </div>
                        </div>
                        <Progress value={(school.used / school.allocation) * 100} className="h-2" />
                      </div>
                    ))}

                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Alokasi Sekolah
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Keamanan Akun</CardTitle>
                  <CardDescription>Kelola pengaturan keamanan dan kontrol akses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Autentikasi Dua Faktor</div>
                        <div className="text-sm text-muted-foreground">
                          Tambahkan lapisan keamanan ekstra ke akun
                        </div>
                      </div>
                    </div>
                    <Switch checked={operator.settings?.twoFactorEnabled || false} onCheckedChange={handleToggle2FA} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Manajemen Password</div>
                        <div className="text-sm text-muted-foreground">
                          Terakhir diubah:{" "}
                          {operator.lastPasswordChange ? getTimeAgo(operator.lastPasswordChange) : "Tidak diketahui"}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowResetPasswordDialog(true)}>
                      Reset Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Status Akun</div>
                        <div className="text-sm text-muted-foreground">
                          Current status: <StatusBadge status={operator.status} />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={operator.status === "Suspended" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowSuspendDialog(true)}
                    >
                      {operator.status === "Suspended" ? "Aktifkan Akun" : "Tangguhkan Akun"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-destructive/10 p-2 rounded-full">
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <div className="font-medium">Hapus Akun</div>
                        <div className="text-sm text-muted-foreground">Hapus permanen akun operator ini</div>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                      Hapus Akun
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Izin</CardTitle>
                  <CardDescription>Kelola apa yang dapat diakses operator ini</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Kelola Sekolah", description: "Buat, edit dan hapus sekolah" },
                      { name: "Kelola Guru", description: "Tambah dan hapus akun guru" },
                      { name: "Lihat Laporan", description: "Akses analitik dan pelaporan" },
                      { name: "Kelola Tagihan", description: "Akses informasi tagihan dan pembayaran" },
                      { name: "Akses API", description: "Gunakan endpoint API dan buat token" },
                    ].map((permission, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-muted-foreground">{permission.description}</div>
                        </div>
                        <Switch checked={index < 3} disabled={!isEditing} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Login</CardTitle>
                  <CardDescription>Aktivitas akses akun terbaru</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-4">
                      {Array.from({ length: 5 }, (_, i) => {
                        const date = new Date()
                        date.setDate(date.getDate() - i)
                        return {
                          date: format(date, "MMM dd, yyyy"),
                          time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60)
                            .toString()
                            .padStart(2, "0")} ${Math.random() > 0.5 ? "AM" : "PM"}`,
                          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                          device: Math.random() > 0.5 ? "Desktop - Chrome" : "Mobile - Safari",
                          location: Math.random() > 0.5 ? "Jakarta, Indonesia" : "Bandung, Indonesia",
                        }
                      }).map((login, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          <div className={`bg-primary/10 rounded-full p-1.5 ${index === 0 ? "bg-green-100" : ""}`}>
                            <Clock className={`h-4 w-4 ${index === 0 ? "text-green-600" : "text-primary"}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">{index === 0 ? "Current session" : "Login"}</div>
                              <div className="text-sm text-muted-foreground">
                                {login.date} • {login.time}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {login.device} • {login.ip} • {login.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Aktivitas</CardTitle>
                  <CardDescription>Aktivitas dan tindakan akun terbaru</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] mb-6">
                    <ChartContainer
                      config={{
                        logins: {
                          label: "Logins",
                          color: "hsl(var(--chart-1))",
                        },
                        actions: {
                          label: "Actions",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="logins"
                            stroke="var(--color-logins)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="actions"
                            stroke="var(--color-actions)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/40 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">
                        {activityData.reduce((sum, item) => sum + item.logins, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Login</div>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">
                        {activityData.reduce((sum, item) => sum + item.actions, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Actions</div>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">
                        {Math.round(activityData.reduce((sum, item) => sum + item.actions, 0) / activityData.length)}
                      </div>
                      <div className="text-sm text-muted-foreground">Rata-rata Tindakan Harian</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Log Aktivitas</CardTitle>
                  <CardDescription>Riwayat detail tindakan operator</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {Array.from({ length: 10 }, (_, i) => {
                        const date = new Date()
                        date.setDate(date.getDate() - Math.floor(i / 2))
                        date.setHours(date.getHours() - (i % 2) * 3)

                        const actions = [
                          { type: "login", icon: <User className="h-4 w-4" />, color: "bg-blue-100 text-blue-600" },
                          { type: "update", icon: <Edit2 className="h-4 w-4" />, color: "bg-amber-100 text-amber-600" },
                          { type: "create", icon: <Plus className="h-4 w-4" />, color: "bg-green-100 text-green-600" },
                          { type: "delete", icon: <Trash2 className="h-4 w-4" />, color: "bg-red-100 text-red-600" },
                          { type: "view", icon: <Eye className="h-4 w-4" />, color: "bg-purple-100 text-purple-600" },
                        ]

                        const action = actions[Math.floor(Math.random() * actions.length)]

                        const activities = [
                          { type: "login", description: "Logged into the system" },
                          { type: "update", description: "Updated school settings for School Name" },
                          { type: "create", description: "Created new teacher account" },
                          { type: "delete", description: "Removed inactive student account" },
                          { type: "view", description: "Viewed monthly analytics report" },
                          { type: "update", description: "Changed password" },
                          { type: "create", description: "Added new class to School Name" },
                          { type: "view", description: "Accessed billing information" },
                          { type: "update", description: "Updated profile information" },
                          { type: "create", description: "Generated custom report" },
                        ]

                        const activity = activities[Math.floor(Math.random() * activities.length)]

                        return {
                          date: format(date, "MMM dd, yyyy"),
                          time: format(date, "h:mm a"),
                          action: action.type,
                          icon: action.icon,
                          color: action.color,
                          description: activity.description,
                          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                        }
                      }).map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                          <div className={`rounded-full p-1.5 ${activity.color}`}>{activity.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">{activity.description}</div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <Info className="h-4 w-4" />
                                      <span className="sr-only">Details</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>IP: {activity.ip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {activity.date} at {activity.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Ekspor Log Aktivitas
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Kata Sandi</DialogTitle>
            <DialogDescription>
              Ini akan mengirim tautan reset kata sandi ke alamat email operator.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-full">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">{operator.email}</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru (Opsional)</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Kosongkan untuk mengirim tautan reset"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Jika Anda memberikan password, itu akan diatur langsung alih-alih mengirim tautan reset.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Account Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{operator.status === "Suspended" ? "Aktifkan Akun" : "Tangguhkan Akun"}</DialogTitle>
            <DialogDescription>
              {operator.status === "Suspended"
                ? "Ini akan mengaktifkan kembali akun operator, memungkinkan mereka untuk login dan menggunakan sistem."
                : "Ini akan menangguhkan sementara akun operator. Mereka tidak akan dapat login sampai akun diaktifkan kembali."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert variant={operator.status === "Suspended" ? "default" : "warning"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{operator.status === "Suspended" ? "Pemberitahuan Aktivasi" : "Peringatan Penangguhan"}</AlertTitle>
              <AlertDescription>
                {operator.status === "Suspended"
                  ? "Operator akan diberitahu melalui email ketika akun mereka diaktifkan."
                  : "Operator akan segera keluar dari semua sesi aktif."}
              </AlertDescription>
            </Alert>

            {operator.status !== "Suspended" && (
              <div className="space-y-2">
                <Label htmlFor="suspendReason">Alasan (Opsional)</Label>
                <Textarea id="suspendReason" placeholder="Berikan alasan untuk penangguhan..." />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
              Batal
            </Button>
            <Button
              variant={operator.status === "Suspended" ? "default" : "destructive"}
              onClick={handleSuspendAccount}
            >
              {operator.status === "Suspended" ? "Aktifkan Akun" : "Tangguhkan Akun"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Akun</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permanen akun operator dan menghapus semua data terkait.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Peringatan</AlertTitle>
              <AlertDescription>
                Semua data terkait dengan akun ini akan dihapus permanen, termasuk:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Informasi pribadi</li>
                  <li>Asosiasi sekolah</li>
                  <li>Riwayat aktivitas</li>
                  <li>Langganan paket</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="confirmDelete">Ketik "HAPUS" untuk konfirmasi</Label>
              <Input id="confirmDelete" placeholder="HAPUS" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Hapus Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OperatorDetailSkeleton() {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <div>
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-10 w-full" />

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Missing components
function Package({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
      </svg>
    </div>
  )
}

function Plus({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M5 12h14M12 5v14" />
      </svg>
    </div>
  )
}

function Eye({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </div>
  )
}

function Download({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    </div>
  )
}

