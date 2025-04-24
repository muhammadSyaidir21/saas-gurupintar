"use client"

import { useState } from "react"
import { Edit, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for add-on modules (same as before)
const initialAddOns = [
  {
    id: "attendance",
    name: "Pelacakan Kehadiran",
    description: "Sistem pelacakan kehadiran komprehensif dengan pelaporan dan analitik",
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    features: [
      "Pelacakan kehadiran harian",
      "Pelaporan ketidakhadiran",
      "Notifikasi orang tua",
      "Analitik kehadiran",
      "Ekspor ke CSV/PDF",
    ],
    compatibleWith: ["elementary", "middle", "high"],
    isActive: true,
  },
  {
    id: "gradebook",
    name: "Buku Nilai Lanjutan",
    description: "Buku nilai lengkap dengan skala penilaian yang dapat disesuaikan dan rapor",
    monthlyPrice: 14.99,
    annualPrice: 149.99,
    features: [
      "Skala penilaian kustom",
      "Tugas berbobot",
      "Pembuatan rapor",
      "Analitik nilai",
      "Integrasi portal orang tua",
    ],
    compatibleWith: ["middle", "high"],
    isActive: true,
  },
  {
    id: "communication",
    name: "Komunikasi Orang Tua",
    description: "Alat untuk komunikasi lancar antara guru dan orang tua",
    monthlyPrice: 7.99,
    annualPrice: 79.99,
    features: [
      "Pesan langsung",
      "Siaran pengumuman",
      "Penjadwalan acara",
      "Berbagi dokumen",
      "Layanan terjemahan",
    ],
    compatibleWith: ["elementary", "middle", "high"],
    isActive: true,
  },
  {
    id: "assessment",
    name: "Pembuat Penilaian",
    description: "Buat, kelola, dan analisis penilaian dan kuis",
    monthlyPrice: 12.99,
    annualPrice: 129.99,
    features: [
      "Bank soal",
      "Penilaian otomatis",
      "Analitik kinerja",
      "Template penilaian kustom",
      "Penyesuaian standar",
    ],
    compatibleWith: ["elementary", "middle", "high"],
    isActive: true,
  },
  {
    id: "curriculum",
    name: "Pemetaan Kurikulum",
    description: "Alat untuk merencanakan dan memetakan kurikulum lintas kelas dan mata pelajaran",
    monthlyPrice: 19.99,
    annualPrice: 199.99,
    features: [
      "Penyesuaian standar",
      "Visualisasi kurikulum",
      "Integrasi sumber daya",
      "Perencanaan lintas mata pelajaran",
      "Alat lingkup dan urutan",
    ],
    compatibleWith: ["elementary", "middle", "high"],
    isActive: true,
  },
]

export function AddOns() {
  const [addOns, setAddOns] = useState(initialAddOns)
  const [editingAddOn, setEditingAddOn] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFeature, setNewFeature] = useState("")

  // All handler functions remain the same
  const handleAddFeature = () => {
    if (newFeature.trim() && editingAddOn) {
      setEditingAddOn({
        ...editingAddOn,
        features: [...editingAddOn.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index) => {
    if (editingAddOn) {
      const updatedFeatures = [...editingAddOn.features]
      updatedFeatures.splice(index, 1)
      setEditingAddOn({
        ...editingAddOn,
        features: updatedFeatures,
      })
    }
  }

  const handleSaveAddOn = () => {
    if (editingAddOn) {
      const updatedAddOns = [...addOns]
      const addOnIndex = updatedAddOns.findIndex((a) => a.id === editingAddOn.id)

      if (addOnIndex >= 0) {
        updatedAddOns[addOnIndex] = editingAddOn
      } else {
        updatedAddOns.push(editingAddOn)
      }

      setAddOns(updatedAddOns)
      setIsDialogOpen(false)
      setEditingAddOn(null)
    }
  }

  const handleEditAddOn = (addOn) => {
    setEditingAddOn({ ...addOn })
    setIsDialogOpen(true)
  }

  const handleAddNewAddOn = () => {
    const newId = `addon-new-${Date.now()}`
    setEditingAddOn({
      id: newId,
      name: "Modul Tambahan Baru",
      description: "Deskripsi untuk modul tambahan baru",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [],
      compatibleWith: ["elementary", "middle", "high"],
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteAddOn = (addOnId) => {
    if (confirm("Are you sure you want to delete this add-on module? This action cannot be undone.")) {
      setAddOns(addOns.filter((a) => a.id !== addOnId))
    }
  }

  const toggleSchoolLevel = (level) => {
    if (editingAddOn) {
      const updatedCompatibleWith = [...editingAddOn.compatibleWith]
      const levelIndex = updatedCompatibleWith.indexOf(level)

      if (levelIndex >= 0) {
        updatedCompatibleWith.splice(levelIndex, 1)
      } else {
        updatedCompatibleWith.push(level)
      }

      setEditingAddOn({
        ...editingAddOn,
        compatibleWith: updatedCompatibleWith,
      })
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Modul Tambahan</h2>
          <p className="text-muted-foreground mt-1">Kelola modul tambahan opsional untuk paket harga Anda</p>
        </div>
        <Button onClick={handleAddNewAddOn} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Tambah Modul Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addOns.map((addOn) => (
          <Card key={addOn.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{addOn.name}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">{addOn.description}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditAddOn(addOn)} className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteAddOn(addOn.id)} className="h-8 w-8">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-4">
                <div className="flex items-baseline">
                  <div className="text-2xl font-bold">${addOn.monthlyPrice}</div>
                  <span className="text-sm font-normal text-muted-foreground ml-1">/bulan</span>
                </div>
                <div className="text-sm text-muted-foreground">${addOn.annualPrice}/tahun</div>

                <div className="pt-4 border-t mt-4">
                  <h4 className="text-sm font-medium mb-3">Fitur:</h4>
                  <ul className="space-y-2.5">
                    {addOn.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-primary mr-2 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Kompatibel dengan:</h4>
                  <div className="flex flex-wrap gap-2">
                    {addOn.compatibleWith.includes("elementary") && (
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20">
                        Sekolah Dasar
                      </Badge>
                    )}
                    {addOn.compatibleWith.includes("middle") && (
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20">
                        Sekolah Menengah Pertama
                      </Badge>
                    )}
                    {addOn.compatibleWith.includes("high") && (
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20">
                        Sekolah Menengah Atas
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t bg-muted/20">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`active-${addOn.id}`}
                  checked={addOn.isActive}
                  onCheckedChange={(checked) => {
                    const updatedAddOns = [...addOns]
                    const addOnIndex = updatedAddOns.findIndex((a) => a.id === addOn.id)
                    updatedAddOns[addOnIndex].isActive = checked
                    setAddOns(updatedAddOns)
                  }}
                />
                <Label htmlFor={`active-${addOn.id}`}>Aktif</Label>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAddOn?.id.includes("new") ? "Tambah Modul Tambahan Baru" : "Edit Modul Tambahan"}
            </DialogTitle>
            <DialogDescription>
              Konfigurasi detail untuk modul tambahan ini. Perubahan akan diterapkan di seluruh platform.
            </DialogDescription>
          </DialogHeader>

          {editingAddOn && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addon-name">Nama Modul</Label>
                  <Input
                    id="addon-name"
                    value={editingAddOn.name}
                    onChange={(e) => setEditingAddOn({ ...editingAddOn, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addon-id">ID Modul</Label>
                  <Input id="addon-id" value={editingAddOn.id} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addon-description">Deskripsi</Label>
                <Textarea
                  id="addon-description"
                  value={editingAddOn.description}
                  onChange={(e) => setEditingAddOn({ ...editingAddOn, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly-price">Harga Bulanan ($)</Label>
                  <Input
                    id="monthly-price"
                    type="number"
                    step="0.01"
                    value={editingAddOn.monthlyPrice}
                    onChange={(e) =>
                      setEditingAddOn({ ...editingAddOn, monthlyPrice: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual-price">Harga Tahunan ($)</Label>
                  <Input
                    id="annual-price"
                    type="number"
                    step="0.01"
                    value={editingAddOn.annualPrice}
                    onChange={(e) =>
                      setEditingAddOn({ ...editingAddOn, annualPrice: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 border p-4 rounded-md">
                <Label className="text-base">Fitur</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deskripsi Fitur</TableHead>
                      <TableHead className="w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editingAddOn.features.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell>{feature}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(index)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <Input
                          placeholder="Tambahkan fitur baru..."
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddFeature()
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={handleAddFeature}>
                          Tambah
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3 border p-4 rounded-md">
                <Label className="text-base">Kompatibel dengan Tingkat Sekolah</Label>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="elementary-compatible"
                      checked={editingAddOn.compatibleWith.includes("elementary")}
                      onCheckedChange={() => toggleSchoolLevel("elementary")}
                    />
                    <Label htmlFor="elementary-compatible">Sekolah Dasar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="middle-compatible"
                      checked={editingAddOn.compatibleWith.includes("middle")}
                      onCheckedChange={() => toggleSchoolLevel("middle")}
                    />
                    <Label htmlFor="middle-compatible">Sekolah Menengah Pertama</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="high-compatible"
                      checked={editingAddOn.compatibleWith.includes("high")}
                      onCheckedChange={() => toggleSchoolLevel("high")}
                    />
                    <Label htmlFor="high-compatible">Sekolah Menengah Atas</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 border-t pt-4">
                <Switch
                  id="addon-active"
                  checked={editingAddOn.isActive}
                  onCheckedChange={(checked) => setEditingAddOn({ ...editingAddOn, isActive: checked })}
                />
                <Label htmlFor="addon-active">Aktif</Label>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveAddOn}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

