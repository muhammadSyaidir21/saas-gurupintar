"use client"

import { useState } from "react"
import { BarChart, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for revenue chart
const revenueData = [
  { month: "Jan", revenue: 12500 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Apr", revenue: 22000 },
  { month: "Mei", revenue: 25000 },
  { month: "Jun", revenue: 28000 },
  { month: "Jul", revenue: 32000 },
  { month: "Agu", revenue: 35000 },
  { month: "Sep", revenue: 38000 },
  { month: "Okt", revenue: 42000 },
  { month: "Nov", revenue: 45000 },
  { month: "Des", revenue: 48000 },
]

// Mock data for package popularity
const packagePopularityData = [
  { name: "Dasar (SD)", count: 450 },
  { name: "Standar (SD)", count: 850 },
  { name: "Premium (SD)", count: 350 },
  { name: "Dasar (SMP)", count: 300 },
  { name: "Standar (SMP)", count: 750 },
  { name: "Premium (SMP)", count: 250 },
  { name: "Dasar (SMA)", count: 200 },
  { name: "Standar (SMA)", count: 650 },
  { name: "Premium (SMA)", count: 150 },
]

// Mock data for add-on popularity
const addonPopularityData = [
  { name: "Pelacakan Kehadiran", count: 1200 },
  { name: "Buku Nilai Lanjutan", count: 950 },
  { name: "Komunikasi Orang Tua", count: 1500 },
  { name: "Pembuat Penilaian", count: 850 },
  { name: "Pemetaan Kurikulum", count: 650 },
]

// Mock data for subscription periods
const subscriptionPeriodData = [
  { name: "Bulanan", count: 1200 },
  { name: "Triwulan", count: 450 },
  { name: "Semester", count: 350 },
  { name: "Tahunan", count: 850 },
  { name: "Dua Tahun", count: 150 },
]

export function PricingAnalytics() {
  const [timeRange, setTimeRange] = useState("year")
  const [chartType, setChartType] = useState("revenue")

  const getMaxValue = (data, key) => {
    return Math.max(...data.map((item) => item[key])) * 1.1
  }

  const renderBarChart = (data, nameKey, valueKey, maxValue) => {
    return (
      <div className="w-full h-80 mt-4">
        <div className="flex justify-between items-end h-64 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="bg-primary w-12 rounded-t-sm"
                style={{
                  height: `${(item[valueKey] / maxValue) * 100}%`,
                  minHeight: "4px",
                }}
              ></div>
              <div className="text-xs mt-2 text-center w-16 truncate" title={item[nameKey]}>
                {item[nameKey]}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderLineChart = (data, xKey, yKey, maxValue) => {
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = 100 - (item[yKey] / maxValue) * 100
        return `${x},${y}`
      })
      .join(" ")

    return (
      <div className="w-full h-80 mt-4">
        <svg className="w-full h-64" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - (item[yKey] / maxValue) * 100
            return <circle key={index} cx={x} cy={y} r="1.5" fill="hsl(var(--primary))" />
          })}
        </svg>
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <div key={index} className="text-xs text-center">
              {index % 2 === 0 ? item[xKey] : ""}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Analisis Harga</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih rentang waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">30 Hari Terakhir</SelectItem>
              <SelectItem value="quarter">Triwulan Terakhir</SelectItem>
              <SelectItem value="year">Tahun Terakhir</SelectItem>
              <SelectItem value="all">Semua Waktu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={chartType} onValueChange={setChartType}>
        <TabsList className="mb-4">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Pendapatan</span>
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Popularitas Paket</span>
          </TabsTrigger>
          <TabsTrigger value="addons" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Popularitas Add-on</span>
          </TabsTrigger>
          <TabsTrigger value="periods" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Periode Langganan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Pendapatan dari Waktu ke Waktu</CardTitle>
              <CardDescription>Lacak tren pendapatan selama periode yang dipilih</CardDescription>
            </CardHeader>
            <CardContent>
              {renderLineChart(revenueData, "month", "revenue", getMaxValue(revenueData, "revenue"))}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Pendapatan</div>
                  <div className="text-2xl font-bold">$361,500</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Rata-rata Bulanan</div>
                  <div className="text-2xl font-bold">$30,125</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Tingkat Pertumbuhan</div>
                  <div className="text-2xl font-bold text-green-600">+12.4%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Proyeksi Tahunan</div>
                  <div className="text-2xl font-bold">$420,000</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle>Popularitas Paket</CardTitle>
              <CardDescription>Bandingkan popularitas paket harga yang berbeda</CardDescription>
            </CardHeader>
            <CardContent>
              {renderBarChart(packagePopularityData, "name", "count", getMaxValue(packagePopularityData, "count"))}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Paling Populer</div>
                  <div className="text-xl font-bold">Standar (SD)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Langganan</div>
                  <div className="text-2xl font-bold">3,950</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Persentase Tingkat Standar</div>
                  <div className="text-2xl font-bold">56.9%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Persentase SD</div>
                  <div className="text-2xl font-bold">41.8%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addons">
          <Card>
            <CardHeader>
              <CardTitle>Popularitas Modul Add-on</CardTitle>
              <CardDescription>Bandingkan popularitas modul add-on yang berbeda</CardDescription>
            </CardHeader>
            <CardContent>
              {renderBarChart(addonPopularityData, "name", "count", getMaxValue(addonPopularityData, "count"))}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Paling Populer</div>
                  <div className="text-xl font-bold">Komunikasi Orang Tua</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Add-on</div>
                  <div className="text-2xl font-bold">5,150</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Tingkat Keterikatan</div>
                  <div className="text-2xl font-bold">78.3%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Pendapatan Add-on</div>
                  <div className="text-2xl font-bold">$127,500</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="periods">
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Periode Langganan</CardTitle>
              <CardDescription>Bandingkan popularitas periode langganan yang berbeda</CardDescription>
            </CardHeader>
            <CardContent>
              {renderBarChart(subscriptionPeriodData, "name", "count", getMaxValue(subscriptionPeriodData, "count"))}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Paling Populer</div>
                  <div className="text-xl font-bold">Bulanan</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Persentase Tahunan+</div>
                  <div className="text-2xl font-bold">33.3%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Rata-rata Langganan</div>
                  <div className="text-2xl font-bold">7.2 bulan</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Tingkat Perpanjangan</div>
                  <div className="text-2xl font-bold">76.5%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

