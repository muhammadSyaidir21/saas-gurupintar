"use client"

import { useState } from "react"
import { Edit, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for usage limits
const initialUsageLimits = {
  elementary: [
    {
      id: "elem-limit-1",
      name: "Rencana Pembelajaran",
      description: "Jumlah maksimum rencana pembelajaran yang dapat dibuat per bulan",
      basic: 5,
      standard: 25,
      premium: "Tidak Terbatas",
      unit: "rencana/bulan",
      isActive: true,
    },
    {
      id: "elem-limit-2",
      name: "Unduhan Sumber Daya",
      description: "Jumlah maksimum sumber daya yang dapat diunduh per bulan",
      basic: 20,
      standard: 100,
      premium: 500,
      unit: "unduhan/bulan",
      isActive: true,
    },
    {
      id: "elem-limit-3",
      name: "Ruang Penyimpanan",
      description: "Ruang penyimpanan maksimum untuk file dan sumber daya yang diunggah",
      basic: 1,
      standard: 5,
      premium: 20,
      unit: "GB",
      isActive: true,
    },
    {
      id: "elem-limit-4",
      name: "Template Kustom",
      description: "Jumlah maksimum template kustom yang dapat dibuat",
      basic: 2,
      standard: 10,
      premium: 50,
      unit: "template",
      isActive: true,
    },
    {
      id: "elem-limit-5",
      name: "Permintaan API",
      description: "Jumlah maksimum permintaan API per hari",
      basic: 100,
      standard: 1000,
      premium: 10000,
      unit: "permintaan/hari",
      isActive: true,
    },
  ],
  middle: [
    {
      id: "mid-limit-1",
      name: "Rencana Pembelajaran",
      description: "Jumlah maksimum rencana pembelajaran yang dapat dibuat per bulan",
      basic: 10,
      standard: 35,
      premium: "Tidak Terbatas",
      unit: "rencana/bulan",
      isActive: true,
    },
    {
      id: "mid-limit-2",
      name: "Unduhan Sumber Daya",
      description: "Jumlah maksimum sumber daya yang dapat diunduh per bulan",
      basic: 30,
      standard: 150,
      premium: 750,
      unit: "unduhan/bulan",
      isActive: true,
    },
    {
      id: "mid-limit-3",
      name: "Ruang Penyimpanan",
      description: "Ruang penyimpanan maksimum untuk file dan sumber daya yang diunggah",
      basic: 2,
      standard: 10,
      premium: 30,
      unit: "GB",
      isActive: true,
    },
    {
      id: "mid-limit-4",
      name: "Template Kustom",
      description: "Jumlah maksimum template kustom yang dapat dibuat",
      basic: 3,
      standard: 15,
      premium: 75,
      unit: "template",
      isActive: true,
    },
    {
      id: "mid-limit-5",
      name: "Permintaan API",
      description: "Jumlah maksimum permintaan API per hari",
      basic: 200,
      standard: 2000,
      premium: 20000,
      unit: "permintaan/hari",
      isActive: true,
    },
  ],
  high: [
    {
      id: "high-limit-1",
      name: "Rencana Pembelajaran",
      description: "Jumlah maksimum rencana pembelajaran yang dapat dibuat per bulan",
      basic: 15,
      standard: 50,
      premium: "Tidak Terbatas",
      unit: "rencana/bulan",
      isActive: true,
    },
    {
      id: "high-limit-2",
      name: "Unduhan Sumber Daya",
      description: "Jumlah maksimum sumber daya yang dapat diunduh per bulan",
      basic: 50,
      standard: 250,
      premium: 1000,
      unit: "unduhan/bulan",
      isActive: true,
    },
    {
      id: "high-limit-3",
      name: "Ruang Penyimpanan",
      description: "Ruang penyimpanan maksimum untuk file dan sumber daya yang diunggah",
      basic: 3,
      standard: 15,
      premium: 50,
      unit: "GB",
      isActive: true,
    },
    {
      id: "high-limit-4",
      name: "Template Kustom",
      description: "Jumlah maksimum template kustom yang dapat dibuat",
      basic: 5,
      standard: 25,
      premium: 100,
      unit: "template",
      isActive: true,
    },
    {
      id: "high-limit-5",
      name: "Permintaan API",
      description: "Jumlah maksimum permintaan API per hari",
      basic: 300,
      standard: 3000,
      premium: 30000,
      unit: "permintaan/hari",
      isActive: true,
    },
  ],
}

export function UsageLimits() {
  const [usageLimits, setUsageLimits] = useState(initialUsageLimits)
  const [activeSchoolLevel, setActiveSchoolLevel] = useState("elementary")
  const [editingLimit, setEditingLimit] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveLimit = () => {
    if (editingLimit) {
      const updatedLimits = { ...usageLimits }
      const limitIndex = updatedLimits[activeSchoolLevel].findIndex((l) => l.id === editingLimit.id)

      if (limitIndex >= 0) {
        updatedLimits[activeSchoolLevel][limitIndex] = editingLimit
      } else {
        updatedLimits[activeSchoolLevel].push(editingLimit)
      }

      setUsageLimits(updatedLimits)
      setIsDialogOpen(false)
      setEditingLimit(null)
    }
  }

  const handleEditLimit = (limit) => {
    setEditingLimit({ ...limit })
    setIsDialogOpen(true)
  }

  const handleAddNewLimit = () => {
    const newId = `${activeSchoolLevel}-limit-new-${Date.now()}`
    setEditingLimit({
      id: newId,
      name: "New Usage Limit",
      description: "Description for the new usage limit",
      basic: 0,
      standard: 0,
      premium: 0,
      unit: "",
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteLimit = (limitId) => {
    if (confirm("Are you sure you want to delete this usage limit? This action cannot be undone.")) {
      const updatedLimits = { ...usageLimits }
      updatedLimits[activeSchoolLevel] = updatedLimits[activeSchoolLevel].filter((l) => l.id !== limitId)
      setUsageLimits(updatedLimits)
    }
  }

  const handleCopyToAllLevels = (limit) => {
    if (
      confirm(
        "Are you sure you want to copy this usage limit to all school levels? This will overwrite any existing limits with the same name.",
      )
    ) {
      const updatedLimits = { ...usageLimits }[("elementary", "middle", "high")].forEach((level) => {
        if (level !== activeSchoolLevel) {
          const existingLimitIndex = updatedLimits[level].findIndex((l) => l.name === limit.name)

          if (existingLimitIndex >= 0) {
            updatedLimits[level][existingLimitIndex] = {
              ...limit,
              id: `${level}-limit-${Date.now()}`,
            }
          } else {
            updatedLimits[level].push({
              ...limit,
              id: `${level}-limit-${Date.now()}`,
            })
          }
        }
      })

      setUsageLimits(updatedLimits)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Batas Penggunaan</h2>
        <Button onClick={handleAddNewLimit}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Batas Baru
        </Button>
      </div>

      <Tabs value={activeSchoolLevel} onValueChange={setActiveSchoolLevel}>
        <TabsList className="mb-4">
          <TabsTrigger value="elementary">Sekolah Dasar</TabsTrigger>
          <TabsTrigger value="middle">Sekolah Menengah Pertama</TabsTrigger>
          <TabsTrigger value="high">Sekolah Menengah Atas</TabsTrigger>
        </TabsList>

        {["elementary", "middle", "high"].map((level) => (
          <TabsContent key={level} value={level}>
            <Card>
              <CardHeader>
                <CardTitle>Batas Penggunaan</CardTitle>
                <CardDescription>
                  Konfigurasi batas penggunaan untuk berbagai tingkatan harga untuk{" "}
                  {level === "elementary" ? "Sekolah Dasar" : level === "middle" ? "Sekolah Menengah Pertama" : "Sekolah Menengah Atas"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Batas</TableHead>
                      <TableHead className="text-center">Dasar</TableHead>
                      <TableHead className="text-center">Standar</TableHead>
                      <TableHead className="text-center">Premium</TableHead>
                      <TableHead className="text-center">Satuan</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageLimits[level].map((limit) => (
                      <TableRow key={limit.id}>
                        <TableCell>
                          <div className="font-medium">{limit.name}</div>
                          <div className="text-sm text-muted-foreground">{limit.description}</div>
                        </TableCell>
                        <TableCell className="text-center">{limit.basic}</TableCell>
                        <TableCell className="text-center">{limit.standard}</TableCell>
                        <TableCell className="text-center">{limit.premium}</TableCell>
                        <TableCell className="text-center">{limit.unit}</TableCell>
                        <TableCell className="text-center">
                          <Switch
                            id={`active-${limit.id}`}
                            checked={limit.isActive}
                            onCheckedChange={(checked) => {
                              const updatedLimits = { ...usageLimits }
                              const limitIndex = updatedLimits[level].findIndex((l) => l.id === limit.id)
                              updatedLimits[level][limitIndex].isActive = checked
                              setUsageLimits(updatedLimits)
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditLimit(limit)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleCopyToAllLevels(limit)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLimit(limit.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLimit?.id.includes("new") ? "Tambah Batas Penggunaan Baru" : "Edit Batas Penggunaan"}</DialogTitle>
            <DialogDescription>Konfigurasi detail batas penggunaan untuk berbagai tingkatan harga.</DialogDescription>
          </DialogHeader>

          {editingLimit && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="limit-name">Nama Batas</Label>
                <Input
                  id="limit-name"
                  value={editingLimit.name}
                  onChange={(e) => setEditingLimit({ ...editingLimit, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit-description">Deskripsi</Label>
                <Textarea
                  id="limit-description"
                  value={editingLimit.description}
                  onChange={(e) => setEditingLimit({ ...editingLimit, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="limit-unit">Satuan</Label>
                  <Input
                    id="limit-unit"
                    value={editingLimit.unit}
                    onChange={(e) => setEditingLimit({ ...editingLimit, unit: e.target.value })}
                    placeholder="contoh: GB, permintaan/hari, dll."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit-active">Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="limit-active"
                      checked={editingLimit.isActive}
                      onCheckedChange={(checked) => setEditingLimit({ ...editingLimit, isActive: checked })}
                    />
                    <Label htmlFor="limit-active">Aktif</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Batas untuk Tingkatan Harga</Label>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basic-limit">Dasar</Label>
                    <Input
                      id="basic-limit"
                      value={editingLimit.basic}
                      onChange={(e) => setEditingLimit({ ...editingLimit, basic: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="standard-limit">Standar</Label>
                    <Input
                      id="standard-limit"
                      value={editingLimit.standard}
                      onChange={(e) => setEditingLimit({ ...editingLimit, standard: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premium-limit">Premium</Label>
                    <Input
                      id="premium-limit"
                      value={editingLimit.premium}
                      onChange={(e) => setEditingLimit({ ...editingLimit, premium: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveLimit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

