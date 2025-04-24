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

// Mock data for subscription periods
const initialPeriods = [
  {
    id: "monthly",
    name: "Bulanan",
    description: "Ditagih setiap bulan",
    durationMonths: 1,
    discountPercentage: 0,
    isDefault: true,
    isActive: true,
  },
  {
    id: "quarterly",
    name: "Triwulan",
    description: "Ditagih setiap 3 bulan",
    durationMonths: 3,
    discountPercentage: 5,
    isDefault: false,
    isActive: true,
  },
  {
    id: "semi-annual",
    name: "Semester",
    description: "Ditagih setiap 6 bulan",
    durationMonths: 6,
    discountPercentage: 10,
    isDefault: false,
    isActive: true,
  },
  {
    id: "annual",
    name: "Tahunan",
    description: "Ditagih sekali setahun",
    durationMonths: 12,
    discountPercentage: 16,
    isDefault: false,
    isActive: true,
  },
  {
    id: "biennial",
    name: "Dua Tahunan",
    description: "Ditagih setiap 2 tahun",
    durationMonths: 24,
    discountPercentage: 25,
    isDefault: false,
    isActive: true,
  },
]

export function SubscriptionPeriods() {
  const [periods, setPeriods] = useState(initialPeriods)
  const [editingPeriod, setEditingPeriod] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSavePeriod = () => {
    if (editingPeriod) {
      const updatedPeriods = [...periods]
      const periodIndex = updatedPeriods.findIndex((p) => p.id === editingPeriod.id)

      if (periodIndex >= 0) {
        updatedPeriods[periodIndex] = editingPeriod
      } else {
        updatedPeriods.push(editingPeriod)
      }

      // If this period is set as default, update all others
      if (editingPeriod.isDefault) {
        updatedPeriods.forEach((period, index) => {
          if (period.id !== editingPeriod.id) {
            updatedPeriods[index].isDefault = false
          }
        })
      }

      setPeriods(updatedPeriods)
      setIsDialogOpen(false)
      setEditingPeriod(null)
    }
  }

  const handleEditPeriod = (period) => {
    setEditingPeriod({ ...period })
    setIsDialogOpen(true)
  }

  const handleAddNewPeriod = () => {
    const newId = `period-new-${Date.now()}`
    setEditingPeriod({
      id: newId,
      name: "New Period",
      description: "Description for the new subscription period",
      durationMonths: 1,
      discountPercentage: 0,
      isDefault: false,
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const handleDeletePeriod = (periodId) => {
    if (confirm("Are you sure you want to delete this subscription period? This action cannot be undone.")) {
      setPeriods(periods.filter((p) => p.id !== periodId))
    }
  }

  const handleSetDefault = (periodId) => {
    const updatedPeriods = periods.map((period) => ({
      ...period,
      isDefault: period.id === periodId,
    }))
    setPeriods(updatedPeriods)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Periode Langganan</h2>
        <Button onClick={handleAddNewPeriod}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Periode Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {periods.map((period) => (
          <Card key={period.id} className={period.isDefault ? "border-primary" : ""}>
            {period.isDefault && (
              <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                Periode Default
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{period.name}</CardTitle>
                  <CardDescription className="mt-2">{period.description}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditPeriod(period)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePeriod(period.id)}
                    disabled={period.isDefault}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Durasi:</span>
                  <span className="font-medium">
                    {period.durationMonths} {period.durationMonths === 1 ? "bulan" : "bulan"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Diskon:</span>
                  <span className="font-medium">{period.discountPercentage}%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`active-${period.id}`}
                  checked={period.isActive}
                  onCheckedChange={(checked) => {
                    const updatedPeriods = [...periods]
                    const periodIndex = updatedPeriods.findIndex((p) => p.id === period.id)
                    updatedPeriods[periodIndex].isActive = checked
                    setPeriods(updatedPeriods)
                  }}
                  disabled={period.isDefault}
                />
                <Label htmlFor={`active-${period.id}`}>Aktif</Label>
              </div>
              {!period.isDefault && (
                <Button variant="outline" size="sm" onClick={() => handleSetDefault(period.id)}>
                  Jadikan Default
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPeriod?.id.includes("new") ? "Tambah Periode Langganan Baru" : "Edit Periode Langganan"}
            </DialogTitle>
            <DialogDescription>
              Konfigurasi detail untuk periode langganan ini. Perubahan akan diterapkan di seluruh platform.
            </DialogDescription>
          </DialogHeader>

          {editingPeriod && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="period-name">Nama Periode</Label>
                <Input
                  id="period-name"
                  value={editingPeriod.name}
                  onChange={(e) => setEditingPeriod({ ...editingPeriod, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period-description">Deskripsi</Label>
                <Textarea
                  id="period-description"
                  value={editingPeriod.description}
                  onChange={(e) => setEditingPeriod({ ...editingPeriod, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration-months">Durasi (bulan)</Label>
                  <Input
                    id="duration-months"
                    type="number"
                    min="1"
                    value={editingPeriod.durationMonths}
                    onChange={(e) =>
                      setEditingPeriod({ ...editingPeriod, durationMonths: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount-percentage">Persentase Diskon (%)</Label>
                  <Input
                    id="discount-percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={editingPeriod.discountPercentage}
                    onChange={(e) =>
                      setEditingPeriod({ ...editingPeriod, discountPercentage: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="period-default"
                  checked={editingPeriod.isDefault}
                  onCheckedChange={(checked) => setEditingPeriod({ ...editingPeriod, isDefault: checked })}
                />
                <Label htmlFor="period-default">Jadikan Periode Default</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="period-active"
                  checked={editingPeriod.isActive}
                  onCheckedChange={(checked) => setEditingPeriod({ ...editingPeriod, isActive: checked })}
                  disabled={editingPeriod.isDefault}
                />
                <Label htmlFor="period-active">Aktif</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSavePeriod}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

