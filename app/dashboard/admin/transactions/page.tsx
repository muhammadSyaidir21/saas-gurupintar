"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data - in a real application, this would come from an API
const initialTransactions = [
  { id: 1, teacherId: "T001", teacherName: "Alice Johnson", amount: 50, date: "2023-07-01", status: "Selesai" },
  { id: 2, teacherId: "T002", teacherName: "Bob Smith", amount: 50, date: "2023-07-02", status: "Tertunda" },
  { id: 3, teacherId: "T003", teacherName: "Carol Williams", amount: 50, date: "2023-07-03", status: "Gagal" },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions, setTransactions] = useState(initialTransactions)

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExportData = () => {
    // Implement export functionality here
    console.log("Mengekspor data transaksi...")
  }

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-3xl font-bold mb-8">Monitor Transaksi</h1>
      <Card className="shadow-sm border-none h-full">
        <CardHeader>
          <CardTitle>Transaksi Pembayaran Guru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Search className="text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Button onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Ekspor Data
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Guru</TableHead>
                <TableHead>Nama Guru</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.teacherId}</TableCell>
                  <TableCell>{transaction.teacherName}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "Selesai"
                          ? "default"
                          : transaction.status === "Tertunda"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

