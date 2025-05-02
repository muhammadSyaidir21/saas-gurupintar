"use client"

import { useState } from "react"
import { CalendarIcon, Edit, Plus, Trash } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// Mock data for promotions
const initialPromotions = [
  {
    id: "summer-sale",
    name: "Diskon Musim Panas",
    code: "SUMMER2023",
    description: "Diskon khusus untuk musim panas 2023",
    type: "percentage",
    value: 20,
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-08-31"),
    applicableTo: ["all"],
    usageLimit: 1000,
    usageCount: 342,
    isActive: true,
  },
  {
    id: "new-school",
    name: "Diskon Sekolah Baru",
    code: "NEWSCHOOL",
    description: "Penawaran khusus untuk sekolah baru yang bergabung dengan platform",
    type: "percentage",
    value: 30,
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    applicableTo: ["elementary", "middle", "high"],
    usageLimit: 500,
    usageCount: 127,
    isActive: true,
  },
  {
    id: "teacher-appreciation",
    name: "Apresiasi Guru",
    code: "TEACHERS2023",
    description: "Diskon khusus untuk Pekan Apresiasi Guru",
    type: "fixed",
    value: 50,
    startDate: new Date("2023-05-01"),
    endDate: new Date("2023-05-07"),
    applicableTo: ["all"],
    usageLimit: 2000,
    usageCount: 1543,
    isActive: false,
  },
  {
    id: "back-to-school",
    name: "Kembali ke Sekolah",
    code: "BACK2SCHOOL",
    description: "Diskon khusus untuk tahun ajaran baru",
    type: "percentage",
    value: 15,
    startDate: new Date("2023-08-15"),
    endDate: new Date("2023-09-30"),
    applicableTo: ["elementary", "middle", "high"],
    usageLimit: 3000,
    usageCount: 0,
    isActive: true,
  },
  {
    id: "free-trial",
    name: "Uji Coba Gratis 30 Hari",
    code: "FREETRIAL",
    description: "Coba platform kami selama 30 hari tanpa biaya",
    type: "trial",
    value: 30,
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    applicableTo: ["all"],
    usageLimit: 10000,
    usageCount: 2345,
    isActive: true,
  },
]

export function Promotions() {
  const [promotions, setPromotions] = useState(initialPromotions)
  const [editingPromotion, setEditingPromotion] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSavePromotion = () => {
    if (editingPromotion) {
      const updatedPromotions = [...promotions]
      const promotionIndex = updatedPromotions.findIndex((p) => p.id === editingPromotion.id)

      if (promotionIndex >= 0) {
        updatedPromotions[promotionIndex] = editingPromotion
      } else {
        updatedPromotions.push(editingPromotion)
      }

      setPromotions(updatedPromotions)
      setIsDialogOpen(false)
      setEditingPromotion(null)
    }
  }

  const handleEditPromotion = (promotion) => {
    setEditingPromotion({ ...promotion })
    setIsDialogOpen(true)
  }

  const handleAddNewPromotion = () => {
    const newId = `promo-new-${Date.now()}`
    setEditingPromotion({
      id: newId,
      name: "New Promotion",
      code: "",
      description: "Description for the new promotion",
      type: "percentage",
      value: 10,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      applicableTo: ["all"],
      usageLimit: 1000,
      usageCount: 0,
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const handleDeletePromotion = (promotionId) => {
    if (confirm("Are you sure you want to delete this promotion? This action cannot be undone.")) {
      setPromotions(promotions.filter((p) => p.id !== promotionId))
    }
  }

  const toggleSchoolLevel = (level) => {
    if (editingPromotion) {
      let updatedApplicableTo = [...editingPromotion.applicableTo]

      if (level === "all") {
        // If "all" is selected, remove all other options
        updatedApplicableTo = ["all"]
      } else {
        // If a specific level is selected, remove "all" if it exists
        updatedApplicableTo = updatedApplicableTo.filter((l) => l !== "all")

        const levelIndex = updatedApplicableTo.indexOf(level)

        if (levelIndex >= 0) {
          updatedApplicableTo.splice(levelIndex, 1)
        } else {
          updatedApplicableTo.push(level)
        }
      }

      setEditingPromotion({
        ...editingPromotion,
        applicableTo: updatedApplicableTo,
      })
    }
  }

  const getPromotionStatusBadge = (promotion) => {
    const now = new Date()

    if (!promotion.isActive) {
      return <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">Tidak Aktif</span>
    }

    if (now < promotion.startDate) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Terjadwal</span>
    }

    if (now > promotion.endDate) {
      return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Kadaluarsa</span>
    }

    return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Aktif</span>
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Promosi & Diskon</h2>
        <Button onClick={handleAddNewPromotion}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Promosi Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>{promotion.name}</CardTitle>
                    {getPromotionStatusBadge(promotion)}
                  </div>
                  <CardDescription className="mt-2">{promotion.description}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditPromotion(promotion)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePromotion(promotion.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Kode:</span>
                  <span className="font-medium">{promotion.code}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Diskon:</span>
                  <span className="font-medium">
                    {promotion.type === "percentage" && `${promotion.value}%`}
                    {promotion.type === "fixed" && `Rp${promotion.value}`}
                    {promotion.type === "trial" && `${promotion.value} hari gratis`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Periode Berlaku:</span>
                  <span className="font-medium">
                    {format(promotion.startDate, "MMM d, yyyy")} - {format(promotion.endDate, "MMM d, yyyy")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Penggunaan:</span>
                  <span className="font-medium">
                    {promotion.usageCount} / {promotion.usageLimit}
                  </span>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Berlaku untuk:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {promotion.applicableTo.includes("all") ? (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        Semua Tingkat Sekolah
                      </span>
                    ) : (
                      <>
                        {promotion.applicableTo.includes("elementary") && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">SD</span>
                        )}
                        {promotion.applicableTo.includes("middle") && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">SMP</span>
                        )}
                        {promotion.applicableTo.includes("high") && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">SMA</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`active-${promotion.id}`}
                  checked={promotion.isActive}
                  onCheckedChange={(checked) => {
                    const updatedPromotions = [...promotions]
                    const promotionIndex = updatedPromotions.findIndex((p) => p.id === promotion.id)
                    updatedPromotions[promotionIndex].isActive = checked
                    setPromotions(updatedPromotions)
                  }}
                />
                <Label htmlFor={`active-${promotion.id}`}>Aktif</Label>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPromotion?.id.includes("new") ? "Tambah Promosi Baru" : "Edit Promosi"}</DialogTitle>
            <DialogDescription>
              Konfigurasi detail untuk promosi ini. Perubahan akan diterapkan di seluruh platform.
            </DialogDescription>
          </DialogHeader>

          {editingPromotion && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="promotion-name">Nama Promosi</Label>
                  <Input
                    id="promotion-name"
                    value={editingPromotion.name}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promotion-code">Kode Promosi</Label>
                  <Input
                    id="promotion-code"
                    value={editingPromotion.code}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promotion-description">Deskripsi</Label>
                <Textarea
                  id="promotion-description"
                  value={editingPromotion.description}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="promotion-type">Jenis Diskon</Label>
                  <Select
                    value={editingPromotion.type}
                    onValueChange={(value) => setEditingPromotion({ ...editingPromotion, type: value })}
                  >
                    <SelectTrigger id="promotion-type">
                      <SelectValue placeholder="Pilih jenis diskon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Diskon Persentase</SelectItem>
                      <SelectItem value="fixed">Diskon Jumlah Tetap</SelectItem>
                      <SelectItem value="trial">Periode Uji Coba Gratis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promotion-value">
                    {editingPromotion.type === "percentage" && "Persentase Diskon (%)"}
                    {editingPromotion.type === "fixed" && "Jumlah Diskon (Rp)"}
                    {editingPromotion.type === "trial" && "Periode Uji Coba (hari)"}
                  </Label>
                  <Input
                    id="promotion-value"
                    type="number"
                    min="0"
                    value={editingPromotion.value}
                    onChange={(e) =>
                      setEditingPromotion({ ...editingPromotion, value: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Tanggal Mulai</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingPromotion.startDate ? format(editingPromotion.startDate, "PPP") : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingPromotion.startDate}
                        onSelect={(date) => setEditingPromotion({ ...editingPromotion, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Tanggal Berakhir</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingPromotion.endDate ? format(editingPromotion.endDate, "PPP") : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingPromotion.endDate}
                        onSelect={(date) => setEditingPromotion({ ...editingPromotion, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usage-limit">Batas Penggunaan</Label>
                <Input
                  id="usage-limit"
                  type="number"
                  min="1"
                  value={editingPromotion.usageLimit}
                  onChange={(e) =>
                    setEditingPromotion({ ...editingPromotion, usageLimit: Number.parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Berlaku untuk Tingkat Sekolah</Label>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="all-levels"
                      checked={editingPromotion.applicableTo.includes("all")}
                      onCheckedChange={() => toggleSchoolLevel("all")}
                    />
                    <Label htmlFor="all-levels">Semua Tingkat Sekolah</Label>
                  </div>

                  {!editingPromotion.applicableTo.includes("all") && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="elementary-applicable"
                          checked={editingPromotion.applicableTo.includes("elementary")}
                          onCheckedChange={() => toggleSchoolLevel("elementary")}
                        />
                        <Label htmlFor="elementary-applicable">Sekolah Dasar</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="middle-applicable"
                          checked={editingPromotion.applicableTo.includes("middle")}
                          onCheckedChange={() => toggleSchoolLevel("middle")}
                        />
                        <Label htmlFor="middle-applicable">Sekolah Menengah Pertama</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="high-applicable"
                          checked={editingPromotion.applicableTo.includes("high")}
                          onCheckedChange={() => toggleSchoolLevel("high")}
                        />
                        <Label htmlFor="high-applicable">Sekolah Menengah Atas</Label>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="promotion-active"
                  checked={editingPromotion.isActive}
                  onCheckedChange={(checked) => setEditingPromotion({ ...editingPromotion, isActive: checked })}
                />
                <Label htmlFor="promotion-active">Aktif</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSavePromotion}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

