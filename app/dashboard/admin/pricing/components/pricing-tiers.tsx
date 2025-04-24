"use client"

import { useState } from "react"
import { Copy, Edit, Plus, Trash } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for pricing tiers (same as before)
const initialTiers = {
  elementary: [
    {
      id: "elem-basic",
      name: "Basic",
      description: "Alat perencanaan pelajaran esensial untuk pendidik sekolah dasar",
      monthlyPrice: 29.99,
      annualPrice: 299.99,
      features: [
        "Template rencana pelajaran dasar",
        "Akses perpustakaan sumber daya terbatas",
        "5 rencana pelajaran per bulan",
        "Dukungan email",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      id: "elem-standard",
      name: "Standard",
      description: "Alat komprehensif untuk manajemen kelas sekolah dasar",
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      features: [
        "Template rencana pelajaran lanjutan",
        "Akses perpustakaan sumber daya penuh",
        "25 rencana pelajaran per bulan",
        "Dukungan email prioritas",
        "Analitik dasar",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      id: "elem-premium",
      name: "Premium",
      description: "Solusi lengkap untuk keunggulan pendidikan sekolah dasar",
      monthlyPrice: 79.99,
      annualPrice: 799.99,
      features: [
        "Semua fitur Standard",
        "Rencana pelajaran tidak terbatas",
        "Analitik lanjutan",
        "Alat pemetaan kurikulum",
        "Dukungan telepon",
        "Pembuatan sumber daya kustom",
      ],
      isPopular: false,
      isActive: true,
    },
  ],
  middle: [
    {
      id: "mid-basic",
      name: "Basic",
      description: "Alat esensial untuk pendidik sekolah menengah pertama",
      monthlyPrice: 39.99,
      annualPrice: 399.99,
      features: [
        "Template rencana pelajaran dasar",
        "Akses perpustakaan sumber daya terbatas",
        "10 rencana pelajaran per bulan",
        "Dukungan email",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      id: "mid-standard",
      name: "Standard",
      description: "Alat komprehensif untuk manajemen kelas sekolah menengah pertama",
      monthlyPrice: 59.99,
      annualPrice: 599.99,
      features: [
        "Template rencana pelajaran lanjutan",
        "Akses perpustakaan sumber daya penuh",
        "35 rencana pelajaran per bulan",
        "Dukungan email prioritas",
        "Analitik dasar",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      id: "mid-premium",
      name: "Premium",
      description: "Solusi lengkap untuk keunggulan pendidikan sekolah menengah pertama",
      monthlyPrice: 89.99,
      annualPrice: 899.99,
      features: [
        "Semua fitur Standard",
        "Rencana pelajaran tidak terbatas",
        "Analitik lanjutan",
        "Alat pemetaan kurikulum",
        "Dukungan telepon",
        "Pembuatan sumber daya kustom",
      ],
      isPopular: false,
      isActive: true,
    },
  ],
  high: [
    {
      id: "high-basic",
      name: "Basic",
      description: "Alat esensial untuk pendidik sekolah menengah atas",
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      features: [
        "Template rencana pelajaran dasar",
        "Akses perpustakaan sumber daya terbatas",
        "15 rencana pelajaran per bulan",
        "Dukungan email",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      id: "high-standard",
      name: "Standard",
      description: "Alat komprehensif untuk manajemen kelas sekolah menengah atas",
      monthlyPrice: 79.99,
      annualPrice: 799.99,
      features: [
        "Template rencana pelajaran lanjutan",
        "Akses perpustakaan sumber daya penuh",
        "50 rencana pelajaran per bulan",
        "Dukungan email prioritas",
        "Analitik dasar",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      id: "high-premium",
      name: "Premium",
      description: "Solusi lengkap untuk keunggulan pendidikan sekolah menengah atas",
      monthlyPrice: 119.99,
      annualPrice: 1199.99,
      features: [
        "Semua fitur Standard",
        "Rencana pelajaran tidak terbatas",
        "Analitik lanjutan",
        "Alat pemetaan kurikulum",
        "Dukungan telepon",
        "Pembuatan sumber daya kustom",
        "Sumber daya persiapan kuliah",
      ],
      isPopular: false,
      isActive: true,
    },
  ],
}

export function PricingTiers() {
  const [tiers, setTiers] = useState(initialTiers)
  const [activeSchoolLevel, setActiveSchoolLevel] = useState("elementary")
  const [editingTier, setEditingTier] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFeature, setNewFeature] = useState("")

  // All the handler functions remain the same
  const handleAddFeature = () => {
    if (newFeature.trim() && editingTier) {
      setEditingTier({
        ...editingTier,
        features: [...editingTier.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index) => {
    if (editingTier) {
      const updatedFeatures = [...editingTier.features]
      updatedFeatures.splice(index, 1)
      setEditingTier({
        ...editingTier,
        features: updatedFeatures,
      })
    }
  }

  const handleSaveTier = () => {
    if (editingTier) {
      const updatedTiers = { ...tiers }
      const tierIndex = updatedTiers[activeSchoolLevel].findIndex((t) => t.id === editingTier.id)

      if (tierIndex >= 0) {
        updatedTiers[activeSchoolLevel][tierIndex] = editingTier
      } else {
        updatedTiers[activeSchoolLevel].push(editingTier)
      }

      setTiers(updatedTiers)
      setIsDialogOpen(false)
      setEditingTier(null)
    }
  }

  const handleEditTier = (tier) => {
    setEditingTier({ ...tier })
    setIsDialogOpen(true)
  }

  const handleAddNewTier = () => {
    const newId = `${activeSchoolLevel}-new-${Date.now()}`
    setEditingTier({
      id: newId,
      name: "Paket Baru",
      description: "Deskripsi untuk paket baru",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [],
      isPopular: false,
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const handleDuplicateTier = (tier) => {
    const newTier = {
      ...tier,
      id: `${tier.id}-copy-${Date.now()}`,
      name: `${tier.name} (Salinan)`,
      isPopular: false,
    }

    const updatedTiers = { ...tiers }
    updatedTiers[activeSchoolLevel].push(newTier)
    setTiers(updatedTiers)
  }

  const handleDeleteTier = (tierId) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket harga ini? Tindakan ini tidak dapat dibatalkan.")) {
      const updatedTiers = { ...tiers }
      updatedTiers[activeSchoolLevel] = updatedTiers[activeSchoolLevel].filter((t) => t.id !== tierId)
      setTiers(updatedTiers)
    }
  }

  const handleSetPopular = (tierId) => {
    const updatedTiers = { ...tiers }
    updatedTiers[activeSchoolLevel] = updatedTiers[activeSchoolLevel].map((t) => ({
      ...t,
      isPopular: t.id === tierId,
    }))
    setTiers(updatedTiers)
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Paket Harga</h2>
          <p className="text-muted-foreground mt-1">Kelola paket harga untuk berbagai jenjang sekolah</p>
        </div>
        <Button onClick={handleAddNewTier} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Tambah Paket Baru
        </Button>
      </div>

      <div className="bg-muted/30 p-1 rounded-lg mb-6">
        <Tabs value={activeSchoolLevel} onValueChange={setActiveSchoolLevel}>
          <TabsList className="grid grid-cols-3 gap-1 w-full">
            <TabsTrigger value="elementary" className="py-2.5">
              Sekolah Dasar
            </TabsTrigger>
            <TabsTrigger value="middle" className="py-2.5">
              Sekolah Menengah Pertama
            </TabsTrigger>
            <TabsTrigger value="high" className="py-2.5">
              Sekolah Menengah Atas
            </TabsTrigger>
          </TabsList>

          {["elementary", "middle", "high"].map((level) => (
            <TabsContent key={level} value={level} className="mt-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tiers[level].map((tier) => (
                  <Card
                    key={tier.id}
                    className={`overflow-hidden transition-all hover:shadow-md ${tier.isPopular ? "border-primary shadow-sm" : "border"}`}
                  >
                    {tier.isPopular && (
                      <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium">
                        Paling Populer
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{tier.name}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">{tier.description}</CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditTier(tier)} className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicateTier(tier)}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTier(tier.id)}
                            className="h-8 w-8"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-6">
                      <div className="space-y-4">
                        <div className="flex items-baseline">
                          <div className="text-3xl font-bold">${tier.monthlyPrice}</div>
                          <span className="text-sm font-normal text-muted-foreground ml-1">/bulan</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${tier.annualPrice}/tahun
                          <Badge variant="outline" className="ml-2 font-normal">
                            Hemat {Math.round(100 - (tier.annualPrice / (tier.monthlyPrice * 12)) * 100)}%
                          </Badge>
                        </div>

                        <div className="pt-4 border-t mt-4">
                          <h4 className="text-sm font-medium mb-3">Fitur:</h4>
                          <ul className="space-y-2.5">
                            {tier.features.map((feature, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="text-primary mr-2 mt-0.5">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t bg-muted/20">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`active-${tier.id}`}
                          checked={tier.isActive}
                          onCheckedChange={(checked) => {
                            const updatedTiers = { ...tiers }
                            const tierIndex = updatedTiers[level].findIndex((t) => t.id === tier.id)
                            updatedTiers[level][tierIndex].isActive = checked
                            setTiers(updatedTiers)
                          }}
                        />
                        <Label htmlFor={`active-${tier.id}`}>Aktif</Label>
                      </div>
                      {!tier.isPopular && (
                        <Button variant="outline" size="sm" onClick={() => handleSetPopular(tier.id)}>
                          Jadikan Populer
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTier?.id.includes("new") ? "Tambah Paket Harga Baru" : "Edit Paket Harga"}</DialogTitle>
            <DialogDescription>
              Konfigurasikan detail untuk paket harga ini. Perubahan akan diterapkan di seluruh platform.
            </DialogDescription>
          </DialogHeader>

          {editingTier && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tier-name">Nama Paket</Label>
                  <Input
                    id="tier-name"
                    value={editingTier.name}
                    onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier-id">ID Paket</Label>
                  <Input id="tier-id" value={editingTier.id} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier-description">Deskripsi</Label>
                <Textarea
                  id="tier-description"
                  value={editingTier.description}
                  onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly-price">Harga Bulanan ($)</Label>
                  <Input
                    id="monthly-price"
                    type="number"
                    step="0.01"
                    value={editingTier.monthlyPrice}
                    onChange={(e) =>
                      setEditingTier({ ...editingTier, monthlyPrice: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual-price">Harga Tahunan ($)</Label>
                  <Input
                    id="annual-price"
                    type="number"
                    step="0.01"
                    value={editingTier.annualPrice}
                    onChange={(e) => setEditingTier({ ...editingTier, annualPrice: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-3 border p-4 rounded-md">
                <Label className="text-base">Fitur</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deskripsi Fitur</TableHead>
                      <TableHead className="w-[100px]">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editingTier.features.map((feature, index) => (
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
                          placeholder="Tambah fitur baru..."
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

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tier-active"
                    checked={editingTier.isActive}
                    onCheckedChange={(checked) => setEditingTier({ ...editingTier, isActive: checked })}
                  />
                  <Label htmlFor="tier-active">Aktif</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="tier-popular"
                    checked={editingTier.isPopular}
                    onCheckedChange={(checked) => setEditingTier({ ...editingTier, isPopular: checked })}
                  />
                  <Label htmlFor="tier-popular">Tandai sebagai Populer</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveTier}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

