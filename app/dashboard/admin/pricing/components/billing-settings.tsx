"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Mock data for billing settings
const initialBillingSettings = {
  general: {
    defaultCurrency: "USD",
    allowedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD"],
    invoicePrefix: "INV-",
    invoiceFooter: "Terima kasih atas bisnis Anda!",
    termsAndConditions: "Syarat dan ketentuan standar berlaku.",
    showTaxOnInvoice: true,
    allowPartialPayments: false,
  },
  renewals: {
    sendRenewalReminders: true,
    firstReminderDays: 14,
    secondReminderDays: 7,
    finalReminderDays: 1,
    autoRenewSubscriptions: true,
    renewalEmailTemplate:
      "Langganan Anda akan diperbarui pada {{renewal_date}}. Silakan perbarui informasi pembayaran Anda jika diperlukan.",
    gracePeriodDays: 7,
  },
  notifications: {
    sendPaymentReceipts: true,
    sendPaymentFailureNotices: true,
    sendSubscriptionActivationNotices: true,
    sendSubscriptionCancellationNotices: true,
    adminEmailForNotifications: "admin@example.com",
    paymentReceiptTemplate: "Terima kasih atas pembayaran sebesar {{amount}} untuk {{service}}.",
    paymentFailureTemplate:
      "Pembayaran sebesar {{amount}} untuk {{service}} gagal. Silakan perbarui informasi pembayaran Anda.",
  },
}

export function BillingSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [billingSettings, setBillingSettings] = useState(initialBillingSettings)
  
  const handleGeneralSettingChange = (key: string, value: any) => {
    setBillingSettings({
      ...billingSettings,
      general: {
        ...billingSettings.general,
        [key]: value
      }
    })
  }
  
  const handleRenewalSettingChange = (key: string, value: any) => {
    setBillingSettings({
      ...billingSettings,
      renewals: {
        ...billingSettings.renewals,
        [key]: value
      }
    })
  }
  
  const handleNotificationSettingChange = (key: string, value: any) => {
    setBillingSettings({
      ...billingSettings,
      notifications: {
        ...billingSettings.notifications,
        [key]: value
      }
    })
  }
  
  const toggleCurrency = (currency: string) => {
    const currentCurrencies = [...billingSettings.general.allowedCurrencies]
    const currencyIndex = currentCurrencies.indexOf(currency)
    
    if (currencyIndex >= 0) {
      currentCurrencies.splice(currencyIndex, 1)
    } else {
      currentCurrencies.push(currency)
    }
    
    handleGeneralSettingChange('allowedCurrencies', currentCurrencies)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pengaturan Penagihan</h2>
      </div>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="renewals">Pembaruan</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Penagihan Umum</CardTitle>
              <CardDescription>Konfigurasi preferensi penagihan umum Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Mata Uang Default</Label>
                <Input 
                  id="defaultCurrency" 
                  value={billingSettings.general.defaultCurrency}
                  onChange={(e) => handleGeneralSettingChange('defaultCurrency', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Mata Uang yang Diizinkan</Label>
                <div className="flex flex-wrap gap-2">
                  {["USD", "EUR", "GBP", "CAD", "AUD"].map((currency) => (
                    <Button 
                      key={currency}
                      variant={billingSettings.general.allowedCurrencies.includes(currency) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCurrency(currency)}
                    >
                      {currency}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Awalan Faktur</Label>
                <Input 
                  id="invoicePrefix" 
                  value={billingSettings.general.invoicePrefix}
                  onChange={(e) => handleGeneralSettingChange('invoicePrefix', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoiceFooter">Catatan Kaki Faktur</Label>
                <Textarea 
                  id="invoiceFooter" 
                  value={billingSettings.general.invoiceFooter}
                  onChange={(e) => handleGeneralSettingChange('invoiceFooter', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Syarat dan Ketentuan</Label>
                <Textarea 
                  id="termsAndConditions" 
                  value={billingSettings.general.termsAndConditions}
                  onChange={(e) => handleGeneralSettingChange('termsAndConditions', e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showTaxOnInvoice">Tampilkan Pajak pada Faktur</Label>
                <Switch 
                  id="showTaxOnInvoice" 
                  checked={billingSettings.general.showTaxOnInvoice}
                  onCheckedChange={(checked) => handleGeneralSettingChange('showTaxOnInvoice', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="allowPartialPayments">Izinkan Pembayaran Sebagian</Label>
                <Switch 
                  id="allowPartialPayments" 
                  checked={billingSettings.general.allowPartialPayments}
                  onCheckedChange={(checked) => handleGeneralSettingChange('allowPartialPayments', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="renewals">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pembaruan</CardTitle>
              <CardDescription>Konfigurasi cara langganan diperbarui dan dikelola</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sendRenewalReminders">Kirim Pengingat Pembaruan</Label>
                <Switch 
                  id="sendRenewalReminders" 
                  checked={billingSettings.renewals.sendRenewalReminders}
                  onCheckedChange={(checked) => handleRenewalSettingChange('sendRenewalReminders', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstReminderDays">Pengingat Pertama (hari sebelumnya)</Label>
                <Input 
                  id="firstReminderDays" 
                  type="number"
                  value={billingSettings.renewals.firstReminderDays}
                  onChange={(e) => handleRenewalSettingChange('firstReminderDays', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondReminderDays">Pengingat Kedua (hari sebelumnya)</Label>
                <Input 
                  id="secondReminderDays" 
                  type="number"
                  value={billingSettings.renewals.secondReminderDays}
                  onChange={(e) => handleRenewalSettingChange('secondReminderDays', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="finalReminderDays">Pengingat Terakhir (hari sebelumnya)</Label>
                <Input 
                  id="finalReminderDays" 
                  type="number"
                  value={billingSettings.renewals.finalReminderDays}
                  onChange={(e) => handleRenewalSettingChange('finalReminderDays', parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoRenewSubscriptions">Pembaruan Otomatis Langganan</Label>
                <Switch 
                  id="autoRenewSubscriptions" 
                  checked={billingSettings.renewals.autoRenewSubscriptions}
                  onCheckedChange={(checked) => handleRenewalSettingChange('autoRenewSubscriptions', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="renewalEmailTemplate">Template Email Pembaruan</Label>
                <Textarea 
                  id="renewalEmailTemplate" 
                  value={billingSettings.renewals.renewalEmailTemplate}
                  onChange={(e) => handleRenewalSettingChange('renewalEmailTemplate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gracePeriodDays">Masa Tenggang (hari)</Label>
                <Input 
                  id="gracePeriodDays" 
                  type="number"
                  value={billingSettings.renewals.gracePeriodDays}
                  onChange={(e) => handleRenewalSettingChange('gracePeriodDays', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
              <CardDescription>Konfigurasi notifikasi email untuk peristiwa penagihan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sendPaymentReceipts">Kirim Tanda Terima Pembayaran</Label>
                <Switch 
                  id="sendPaymentReceipts" 
                  checked={billingSettings.notifications.sendPaymentReceipts}
                  onCheckedChange={(checked) => handleNotificationSettingChange('sendPaymentReceipts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sendPaymentFailureNotices">Kirim Pemberitahuan Kegagalan Pembayaran</Label>
                <Switch 
                  id="sendPaymentFailureNotices" 
                  checked={billingSettings.notifications.sendPaymentFailureNotices}
                  onCheckedChange={(checked) => handleNotificationSettingChange('sendPaymentFailureNotices', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sendSubscriptionActivationNotices">Kirim Pemberitahuan Aktivasi Langganan</Label>
                <Switch 
                  id="sendSubscriptionActivationNotices" 
                  checked={billingSettings.notifications.sendSubscriptionActivationNotices}
                  onCheckedChange={(checked) => handleNotificationSettingChange('sendSubscriptionActivationNotices', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sendSubscriptionCancellationNotices">Kirim Pemberitahuan Pembatalan Langganan</Label>
                <Switch 
                  id="sendSubscriptionCancellationNotices" 
                  checked={billingSettings.notifications.sendSubscriptionCancellationNotices}
                  onCheckedChange={(checked) => handleNotificationSettingChange('sendSubscriptionCancellationNotices', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmailForNotifications">Email Admin untuk Notifikasi</Label>
                <Input 
                  id="adminEmailForNotifications" 
                  type="email"
                  value={billingSettings.notifications.adminEmailForNotifications}
                  onChange={(e) => handleNotificationSettingChange('adminEmailForNotifications', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentReceiptTemplate">Template Tanda Terima Pembayaran</Label>
                <Textarea 
                  id="paymentReceiptTemplate" 
                  value={billingSettings.notifications.paymentReceiptTemplate}
                  onChange={(e) => handleNotificationSettingChange('paymentReceiptTemplate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentFailureTemplate">Template Kegagalan Pembayaran</Label>
                <Textarea 
                  id="paymentFailureTemplate" 
                  value={billingSettings.notifications.paymentFailureTemplate}
                  onChange={(e) => handleNotificationSettingChange('paymentFailureTemplate', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}