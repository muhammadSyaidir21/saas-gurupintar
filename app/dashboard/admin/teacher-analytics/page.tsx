"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Search, Download } from "lucide-react"
import { getSchoolSubscription, getQuotaUsage } from "@/lib/accountQuotaManager"

// Mock data for schools
const schools = [
  { id: "school1", name: "SD Springfield" },
  { id: "school2", name: "SMA Riverdale" },
  { id: "school3", name: "SMP Sunnydale" },
  { id: "school4", name: "Sekolah Hogwarts" },
  { id: "school5", name: "Sekolah Xavier untuk Anak Berbakat" },
]

export default function TeacherAccountAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSchools = schools.filter((school) => school.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const calculateTeacherAccountStats = (schoolId: string) => {
    const subscription = getSchoolSubscription(schoolId)
    const usage = getQuotaUsage(schoolId)

    if (!subscription || !usage) {
      return { total: 0, used: 0, available: 0, percentageUsed: 0 }
    }

    const total = subscription.maxTeachers
    const used = usage.teachers
    const available = total - used
    const percentageUsed = (used / total) * 100

    return { total, used, available, percentageUsed }
  }

  const totalTeacherAccounts = filteredSchools.reduce(
    (sum, school) => sum + calculateTeacherAccountStats(school.id).total,
    0,
  )
  const totalUsedAccounts = filteredSchools.reduce(
    (sum, school) => sum + calculateTeacherAccountStats(school.id).used,
    0,
  )

  const handleExportData = () => {
    // Implement export functionality here
    console.log("Exporting data...")
  }

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
        Analitik Akun Guru
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-md border-none rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Total Akun Guru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalTeacherAccounts}</div>
            <p className="text-sm text-muted-foreground">Di semua sekolah</p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-none rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Akun Guru Terpakai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalUsedAccounts}</div>
            <p className="text-sm text-muted-foreground">
              {((totalUsedAccounts / totalTeacherAccounts) * 100).toFixed(2)}% dari total akun
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-none rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Distribusi Akun Guru per Sekolah</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari sekolah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-full"
              />
            </div>
            <Button
              onClick={handleExportData}
              className="rounded-full bg-gradient-to-r from-primary to-primary-light hover:opacity-90 transition-opacity"
            >
              <Download className="mr-2 h-4 w-4" />
              Ekspor Data
            </Button>
          </div>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Nama Sekolah</TableHead>
                  <TableHead>Total Akun</TableHead>
                  <TableHead>Akun Terpakai</TableHead>
                  <TableHead>Akun Tersedia</TableHead>
                  <TableHead>Penggunaan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => {
                  const stats = calculateTeacherAccountStats(school.id)
                  return (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>{stats.total}</TableCell>
                      <TableCell>{stats.used}</TableCell>
                      <TableCell>{stats.available}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress
                            value={stats.percentageUsed}
                            className="w-full mr-2 h-3 rounded-full bg-muted overflow-hidden"
                          />
                          <span>{stats.percentageUsed.toFixed(2)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

