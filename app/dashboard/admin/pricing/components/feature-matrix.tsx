"use client"

import React from "react"

import { useState } from "react"
import { Check, Edit, Plus, Trash, X } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for feature matrix
const initialFeatureMatrix = {
  elementary: [
    {
      id: "elem-feature-1",
      name: "Pembuatan Rencana Pembelajaran",
      description: "Buat dan sesuaikan rencana pembelajaran",
      basic: true,
      standard: true,
      premium: true,
      category: "Fitur Inti",
    },
    {
      id: "elem-feature-2",
      name: "Akses Perpustakaan Sumber Daya",
      description: "Akses ke sumber daya pendidikan",
      basic: "Terbatas",
      standard: true,
      premium: true,
      category: "Konten",
    },
    {
      id: "elem-feature-3",
      name: "Rencana Pembelajaran Bulanan",
      description: "Jumlah rencana pembelajaran per bulan",
      basic: "5",
      standard: "25",
      premium: "Tidak Terbatas",
      category: "Batas Penggunaan",
    },
    {
      id: "elem-feature-4",
      name: "Dukungan",
      description: "Opsi dukungan pelanggan",
      basic: "Email",
      standard: "Email Prioritas",
      premium: "Telepon & Email",
      category: "Dukungan",
    },
    {
      id: "elem-feature-5",
      name: "Analitik",
      description: "Analitik penggunaan dan kinerja",
      basic: false,
      standard: "Dasar",
      premium: "Lanjutan",
      category: "Pelaporan",
    },
    {
      id: "elem-feature-6",
      name: "Pemetaan Kurikulum",
      description: "Pemetaan kurikulum antar kelas dan mata pelajaran",
      basic: false,
      standard: false,
      premium: true,
      category: "Perencanaan",
    },
    {
      id: "elem-feature-7",
      name: "Pembuatan Sumber Daya Kustom",
      description: "Buat sumber daya pendidikan kustom",
      basic: false,
      standard: false,
      premium: true,
      category: "Konten",
    },
  ],
  middle: [
    {
      id: "mid-feature-1",
      name: "Pembuatan Rencana Pembelajaran",
      description: "Buat dan sesuaikan rencana pembelajaran",
      basic: true,
      standard: true,
      premium: true,
      category: "Fitur Inti",
    },
    {
      id: "mid-feature-2",
      name: "Akses Perpustakaan Sumber Daya",
      description: "Akses ke sumber daya pendidikan",
      basic: "Terbatas",
      standard: true,
      premium: true,
      category: "Konten",
    },
    {
      id: "mid-feature-3",
      name: "Rencana Pembelajaran Bulanan",
      description: "Jumlah rencana pembelajaran per bulan",
      basic: "10",
      standard: "35",
      premium: "Tidak Terbatas",
      category: "Batas Penggunaan",
    },
    {
      id: "mid-feature-4",
      name: "Dukungan",
      description: "Opsi dukungan pelanggan",
      basic: "Email",
      standard: "Email Prioritas",
      premium: "Telepon & Email",
      category: "Dukungan",
    },
    {
      id: "mid-feature-5",
      name: "Analitik",
      description: "Analitik penggunaan dan kinerja",
      basic: false,
      standard: "Dasar",
      premium: "Lanjutan",
      category: "Pelaporan",
    },
    {
      id: "mid-feature-6",
      name: "Pemetaan Kurikulum",
      description: "Pemetaan kurikulum antar kelas dan mata pelajaran",
      basic: false,
      standard: false,
      premium: true,
      category: "Perencanaan",
    },
    {
      id: "mid-feature-7",
      name: "Pembuatan Sumber Daya Kustom",
      description: "Buat sumber daya pendidikan kustom",
      basic: false,
      standard: false,
      premium: true,
      category: "Konten",
    },
  ],
  high: [
    {
      id: "high-feature-1",
      name: "Pembuatan Rencana Pembelajaran",
      description: "Buat dan sesuaikan rencana pembelajaran",
      basic: true,
      standard: true,
      premium: true,
      category: "Fitur Inti",
    },
    {
      id: "high-feature-2",
      name: "Akses Perpustakaan Sumber Daya",
      description: "Akses ke sumber daya pendidikan",
      basic: "Terbatas",
      standard: true,
      premium: true,
      category: "Konten",
    },
    {
      id: "high-feature-3",
      name: "Rencana Pembelajaran Bulanan",
      description: "Jumlah rencana pembelajaran per bulan",
      basic: "15",
      standard: "50",
      premium: "Tidak Terbatas",
      category: "Batas Penggunaan",
    },
    {
      id: "high-feature-4",
      name: "Dukungan",
      description: "Opsi dukungan pelanggan",
      basic: "Email",
      standard: "Email Prioritas",
      premium: "Telepon & Email",
      category: "Dukungan",
    },
    {
      id: "high-feature-5",
      name: "Analitik",
      description: "Analitik penggunaan dan kinerja",
      basic: false,
      standard: "Dasar",
      premium: "Lanjutan",
      category: "Pelaporan",
    },
    {
      id: "high-feature-6",
      name: "Pemetaan Kurikulum",
      description: "Pemetaan kurikulum antar kelas dan mata pelajaran",
      basic: false,
      standard: false,
      premium: true,
      category: "Perencanaan",
    },
    {
      id: "high-feature-7",
      name: "Pembuatan Sumber Daya Kustom",
      description: "Buat sumber daya pendidikan kustom",
      basic: false,
      standard: false,
      premium: true,
      category: "Konten",
    },
    {
      id: "high-feature-8",
      name: "Sumber Daya Persiapan Kuliah",
      description: "Sumber daya untuk persiapan kuliah",
      basic: false,
      standard: false,
      premium: true,
      category: "Konten",
    },
  ],
}

// Feature categories
const featureCategories = [
  "Fitur Inti",
  "Konten",
  "Batas Penggunaan",
  "Dukungan",
  "Pelaporan",
  "Perencanaan",
  "Integrasi",
  "Lainnya",
]

export function FeatureMatrix() {
  const [featureMatrix, setFeatureMatrix] = useState(initialFeatureMatrix)
  const [activeSchoolLevel, setActiveSchoolLevel] = useState("elementary")
  const [editingFeature, setEditingFeature] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveFeature = () => {
    if (editingFeature) {
      const updatedMatrix = { ...featureMatrix }
      const featureIndex = updatedMatrix[activeSchoolLevel].findIndex((f) => f.id === editingFeature.id)

      if (featureIndex >= 0) {
        updatedMatrix[activeSchoolLevel][featureIndex] = editingFeature
      } else {
        updatedMatrix[activeSchoolLevel].push(editingFeature)
      }

      setFeatureMatrix(updatedMatrix)
      setIsDialogOpen(false)
      setEditingFeature(null)
    }
  }

  const handleEditFeature = (feature) => {
    setEditingFeature({ ...feature })
    setIsDialogOpen(true)
  }

  const handleAddNewFeature = () => {
    const newId = `${activeSchoolLevel}-feature-new-${Date.now()}`
    setEditingFeature({
      id: newId,
      name: "New Feature",
      description: "Description for the new feature",
      basic: false,
      standard: false,
      premium: false,
      category: "Core Features",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteFeature = (featureId) => {
    if (confirm("Are you sure you want to delete this feature? This action cannot be undone.")) {
      const updatedMatrix = { ...featureMatrix }
      updatedMatrix[activeSchoolLevel] = updatedMatrix[activeSchoolLevel].filter((f) => f.id !== featureId)
      setFeatureMatrix(updatedMatrix)
    }
  }

  const handleCopyToAllLevels = (feature) => {
    if (
      confirm(
        "Are you sure you want to copy this feature to all school levels? This will overwrite any existing features with the same name.",
      )
    ) {
      const updatedMatrix = { ...featureMatrix }[("elementary", "middle", "high")].forEach((level) => {
        if (level !== activeSchoolLevel) {
          const existingFeatureIndex = updatedMatrix[level].findIndex((f) => f.name === feature.name)

          if (existingFeatureIndex >= 0) {
            updatedMatrix[level][existingFeatureIndex] = {
              ...feature,
              id: `${level}-feature-${Date.now()}`,
            }
          } else {
            updatedMatrix[level].push({
              ...feature,
              id: `${level}-feature-${Date.now()}`,
            })
          }
        }
      })

      setFeatureMatrix(updatedMatrix)
    }
  }

  const renderFeatureValue = (value) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-green-600 mx-auto" />
    } else if (value === false) {
      return <X className="h-5 w-5 text-red-600 mx-auto" />
    } else {
      return <span className="text-center block">{value}</span>
    }
  }

  // Group features by category
  const getFeaturesByCategory = () => {
    const features = featureMatrix[activeSchoolLevel]
    const groupedFeatures = {}

    features.forEach((feature) => {
      if (!groupedFeatures[feature.category]) {
        groupedFeatures[feature.category] = []
      }
      groupedFeatures[feature.category].push(feature)
    })

    return groupedFeatures
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Matriks Perbandingan Fitur</h2>
        <Button onClick={handleAddNewFeature}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Fitur Baru
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
                <CardTitle>Perbandingan Fitur</CardTitle>
                <CardDescription>
                  Bandingkan fitur di berbagai tingkatan harga untuk {level === "elementary" ? "Sekolah Dasar" : level === "middle" ? "Sekolah Menengah Pertama" : "Sekolah Menengah Atas"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Fitur</TableHead>
                      <TableHead className="text-center">Dasar</TableHead>
                      <TableHead className="text-center">Standar</TableHead>
                      <TableHead className="text-center">Premium</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(getFeaturesByCategory()).map(([category, features]) => (
                      <React.Fragment key={category}>
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/50 font-medium">
                            {category}
                          </TableCell>
                        </TableRow>
                        {features.map((feature) => (
                          <TableRow key={feature.id}>
                            <TableCell>
                              <div className="font-medium">{feature.name}</div>
                              <div className="text-sm text-muted-foreground">{feature.description}</div>
                            </TableCell>
                            <TableCell className="text-center">{renderFeatureValue(feature.basic)}</TableCell>
                            <TableCell className="text-center">{renderFeatureValue(feature.standard)}</TableCell>
                            <TableCell className="text-center">{renderFeatureValue(feature.premium)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditFeature(feature)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleCopyToAllLevels(feature)}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteFeature(feature.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
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
            <DialogTitle>{editingFeature?.id.includes("new") ? "Tambah Fitur Baru" : "Edit Fitur"}</DialogTitle>
            <DialogDescription>Konfigurasi detail fitur dan ketersediaan di berbagai tingkatan harga.</DialogDescription>
          </DialogHeader>

          {editingFeature && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="feature-name">Nama Fitur</Label>
                <Input
                  id="feature-name"
                  value={editingFeature.name}
                  onChange={(e) => setEditingFeature({ ...editingFeature, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feature-description">Deskripsi</Label>
                <Textarea
                  id="feature-description"
                  value={editingFeature.description}
                  onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feature-category">Kategori</Label>
                <Select
                  value={editingFeature.category}
                  onValueChange={(value) => setEditingFeature({ ...editingFeature, category: value })}
                >
                  <SelectTrigger id="feature-category">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Ketersediaan di Tingkatan Harga</Label>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 border rounded-md p-4">
                    <div className="font-medium">Dasar</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="basic-included"
                          checked={editingFeature.basic !== false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEditingFeature({ ...editingFeature, basic: true })
                            } else {
                              setEditingFeature({ ...editingFeature, basic: false })
                            }
                          }}
                        />
                        <Label htmlFor="basic-included">Termasuk</Label>
                      </div>

                      {editingFeature.basic !== false && (
                        <div className="pt-2">
                          <Label htmlFor="basic-value">Nilai (opsional)</Label>
                          <Input
                            id="basic-value"
                            value={editingFeature.basic === true ? "" : editingFeature.basic}
                            onChange={(e) => {
                              const value = e.target.value
                              setEditingFeature({
                                ...editingFeature,
                                basic: value === "" ? true : value,
                              })
                            }}
                            placeholder="contoh: Terbatas, 5, dll."
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 border rounded-md p-4">
                    <div className="font-medium">Standar</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="standard-included"
                          checked={editingFeature.standard !== false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEditingFeature({ ...editingFeature, standard: true })
                            } else {
                              setEditingFeature({ ...editingFeature, standard: false })
                            }
                          }}
                        />
                        <Label htmlFor="standard-included">Termasuk</Label>
                      </div>

                      {editingFeature.standard !== false && (
                        <div className="pt-2">
                          <Label htmlFor="standard-value">Nilai (opsional)</Label>
                          <Input
                            id="standard-value"
                            value={editingFeature.standard === true ? "" : editingFeature.standard}
                            onChange={(e) => {
                              const value = e.target.value
                              setEditingFeature({
                                ...editingFeature,
                                standard: value === "" ? true : value,
                              })
                            }}
                            placeholder="contoh: Dasar, 25, dll."
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 border rounded-md p-4">
                    <div className="font-medium">Premium</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="premium-included"
                          checked={editingFeature.premium !== false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEditingFeature({ ...editingFeature, premium: true })
                            } else {
                              setEditingFeature({ ...editingFeature, premium: false })
                            }
                          }}
                        />
                        <Label htmlFor="premium-included">Termasuk</Label>
                      </div>

                      {editingFeature.premium !== false && (
                        <div className="pt-2">
                          <Label htmlFor="premium-value">Nilai (opsional)</Label>
                          <Input
                            id="premium-value"
                            value={editingFeature.premium === true ? "" : editingFeature.premium}
                            onChange={(e) => {
                              const value = e.target.value
                              setEditingFeature({
                                ...editingFeature,
                                premium: value === "" ? true : value,
                              })
                            }}
                            placeholder="contoh: Lanjutan, Tidak Terbatas, dll."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveFeature}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

