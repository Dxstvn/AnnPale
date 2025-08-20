"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Download,
  Send,
  Plus,
  Trash2,
  Copy,
  Eye,
  ChevronLeft,
  Calendar,
  DollarSign,
  Mail,
  Printer,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Hash
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { format } from "date-fns"

// Currency formatter
const formatCurrency = (amount: number, locale: string = 'en') => {
  const currency = locale === 'ht' ? 'HTG' : locale === 'fr' ? 'EUR' : 'USD'
  const formatter = new Intl.NumberFormat(locale === 'ht' ? 'ht-HT' : locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: currency,
  })
  return formatter.format(amount)
}

// Translations
const invoiceTranslations: Record<string, Record<string, string>> = {
  invoice_center: {
    en: "Invoice Generation Center",
    fr: "Centre de génération de factures",
    ht: "Sant jenere fakti"
  },
  create_manage_invoices: {
    en: "Create and manage professional invoices",
    fr: "Créer et gérer des factures professionnelles",
    ht: "Kreye ak jere fakti pwofesyonèl"
  },
  total_invoiced: {
    en: "Total Invoiced",
    fr: "Total facturé",
    ht: "Total fakti"
  },
  pending_payment: {
    en: "Pending Payment",
    fr: "Paiement en attente",
    ht: "Peman k ap tann"
  },
  paid_invoices: {
    en: "Paid Invoices",
    fr: "Factures payées",
    ht: "Fakti peye"
  },
  overdue_amount: {
    en: "Overdue Amount",
    fr: "Montant en retard",
    ht: "Kantite an reta"
  },
  create_invoice: {
    en: "Create Invoice",
    fr: "Créer une facture",
    ht: "Kreye fakti"
  },
  invoice_number: {
    en: "Invoice Number",
    fr: "Numéro de facture",
    ht: "Nimewo fakti"
  },
  bill_to: {
    en: "Bill To",
    fr: "Facturer à",
    ht: "Faktire"
  },
  description: {
    en: "Description",
    fr: "Description",
    ht: "Deskripsyon"
  },
  quantity: {
    en: "Quantity",
    fr: "Quantité",
    ht: "Kantite"
  },
  rate: {
    en: "Rate",
    fr: "Tarif",
    ht: "Pri"
  },
  amount: {
    en: "Amount",
    fr: "Montant",
    ht: "Kantite"
  },
  subtotal: {
    en: "Subtotal",
    fr: "Sous-total",
    ht: "Sou-total"
  },
  tax: {
    en: "Tax",
    fr: "Taxe",
    ht: "Taks"
  },
  total: {
    en: "Total",
    fr: "Total",
    ht: "Total"
  },
  due_date: {
    en: "Due Date",
    fr: "Date d'échéance",
    ht: "Dat pou peye"
  },
  payment_terms: {
    en: "Payment Terms",
    fr: "Conditions de paiement",
    ht: "Kondisyon peman"
  },
  add_item: {
    en: "Add Item",
    fr: "Ajouter un article",
    ht: "Ajoute atik"
  },
  notes: {
    en: "Notes",
    fr: "Notes",
    ht: "Nòt"
  },
  preview: {
    en: "Preview",
    fr: "Aperçu",
    ht: "Apèsi"
  },
  send_invoice: {
    en: "Send Invoice",
    fr: "Envoyer la facture",
    ht: "Voye fakti"
  }
}

// Mock data
const invoiceStats = {
  totalInvoiced: 12500.00,
  pendingPayment: 3200.00,
  paidInvoices: 9300.00,
  overdueAmount: 850.00
}

const existingInvoices = [
  {
    id: "INV-2024-001",
    date: "2024-12-01",
    dueDate: "2024-12-15",
    client: "Sarah Mitchell",
    amount: 850.00,
    status: "paid" as const,
    items: 2
  },
  {
    id: "INV-2024-002",
    date: "2024-12-05",
    dueDate: "2024-12-19",
    client: "Michael Rodriguez",
    amount: 1200.00,
    status: "pending" as const,
    items: 3
  },
  {
    id: "INV-2024-003",
    date: "2024-12-08",
    dueDate: "2024-12-22",
    client: "Lisa Kim",
    amount: 650.00,
    status: "pending" as const,
    items: 1
  },
  {
    id: "INV-2024-004",
    date: "2024-11-15",
    dueDate: "2024-11-29",
    client: "John Davis",
    amount: 850.00,
    status: "overdue" as const,
    items: 2
  },
  {
    id: "INV-2024-005",
    date: "2024-11-20",
    dueDate: "2024-12-04",
    client: "Emma Thompson",
    amount: 1350.00,
    status: "paid" as const,
    items: 4
  }
]

const invoiceTemplates = [
  { id: "standard", name: "Standard Invoice", description: "Basic invoice template" },
  { id: "detailed", name: "Detailed Invoice", description: "Invoice with line items" },
  { id: "simple", name: "Simple Receipt", description: "Simplified receipt format" }
]

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export default function InvoicesPage() {
  const { language } = useLanguage()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("standard")
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, amount: 0 }
  ])
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "INV-2024-006",
    billTo: "",
    email: "",
    dueDate: "",
    paymentTerms: "net30",
    notes: "",
    taxRate: 0
  })
  
  const t = (key: string) => {
    return invoiceTranslations[key]?.[language] || invoiceTranslations[key]?.en || key
  }
  
  const getStatusBadge = (status: string) => {
    const config = {
      paid: { label: "Paid", className: "bg-green-500 text-white", icon: CheckCircle },
      pending: { label: "Pending", className: "bg-orange-500 text-white", icon: Clock },
      overdue: { label: "Overdue", className: "bg-red-500 text-white", icon: AlertCircle },
      draft: { label: "Draft", className: "bg-gray-500 text-white", icon: Edit }
    }
    const statusConfig = config[status as keyof typeof config]
    if (!statusConfig) return null
    
    const Icon = statusConfig.icon
    return (
      <Badge className={statusConfig.className}>
        <Icon className="h-3 w-3 mr-1" />
        {statusConfig.label}
      </Badge>
    )
  }
  
  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    }
    setInvoiceItems([...invoiceItems, newItem])
  }
  
  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id))
  }
  
  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate
        }
        return updated
      }
      return item
    }))
  }
  
  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.amount, 0)
  }
  
  const calculateTax = () => {
    return calculateSubtotal() * (invoiceData.taxRate / 100)
  }
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }
  
  const handlePreviewInvoice = () => {
    console.log("Preview invoice:", {
      ...invoiceData,
      items: invoiceItems,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal()
    })
  }
  
  const handleSendInvoice = () => {
    console.log("Sending invoice...")
    setIsCreateDialogOpen(false)
  }
  
  const handleDownloadInvoice = (invoiceId: string) => {
    console.log("Downloading invoice:", invoiceId)
  }
  
  const handleDuplicateInvoice = (invoiceId: string) => {
    console.log("Duplicating invoice:", invoiceId)
  }
  
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/creator/finances">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Financial Center
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('invoice_center')}</h1>
            <p className="text-gray-600 mt-1">{t('create_manage_invoices')}</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                {t('create_invoice')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('create_invoice')}</DialogTitle>
                <DialogDescription>
                  Generate a professional invoice for your services
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Invoice Header */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">{t('invoice_number')}</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="invoice-number"
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">{t('due_date')}</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="due-date"
                        type="date"
                        value={invoiceData.dueDate}
                        onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Bill To */}
                <div className="space-y-4">
                  <h3 className="font-medium">{t('bill_to')}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Client Name</Label>
                      <Input
                        id="client-name"
                        placeholder="Enter client name"
                        value={invoiceData.billTo}
                        onChange={(e) => setInvoiceData({...invoiceData, billTo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="client-email"
                          type="email"
                          placeholder="client@email.com"
                          value={invoiceData.email}
                          onChange={(e) => setInvoiceData({...invoiceData, email: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Invoice Items */}
                <div className="space-y-4">
                  <h3 className="font-medium">Invoice Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">{t('description')}</TableHead>
                        <TableHead>{t('quantity')}</TableHead>
                        <TableHead>{t('rate')}</TableHead>
                        <TableHead>{t('amount')}</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoiceItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              placeholder="Item description"
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => updateInvoiceItem(item.id, 'rate', Number(e.target.value))}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {formatCurrency(item.amount, language)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInvoiceItem(item.id)}
                              disabled={invoiceItems.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button
                    variant="outline"
                    onClick={addInvoiceItem}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('add_item')}
                  </Button>
                </div>
                
                {/* Totals */}
                <div className="space-y-2">
                  <Separator />
                  <div className="space-y-2 text-right">
                    <div className="flex justify-end gap-4">
                      <span className="text-gray-600">{t('subtotal')}:</span>
                      <span className="font-medium w-32">
                        {formatCurrency(calculateSubtotal(), language)}
                      </span>
                    </div>
                    <div className="flex justify-end gap-4 items-center">
                      <span className="text-gray-600">{t('tax')}:</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={invoiceData.taxRate}
                          onChange={(e) => setInvoiceData({...invoiceData, taxRate: Number(e.target.value)})}
                          className="w-20"
                        />
                        <span>%</span>
                        <span className="font-medium w-32 text-right">
                          {formatCurrency(calculateTax(), language)}
                        </span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end gap-4 text-lg">
                      <span className="font-medium">{t('total')}:</span>
                      <span className="font-bold w-32">
                        {formatCurrency(calculateTotal(), language)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Additional Options */}
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-terms">{t('payment_terms')}</Label>
                      <Select 
                        value={invoiceData.paymentTerms} 
                        onValueChange={(value) => setInvoiceData({...invoiceData, paymentTerms: value})}
                      >
                        <SelectTrigger id="payment-terms">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Due on Receipt</SelectItem>
                          <SelectItem value="net15">Net 15 Days</SelectItem>
                          <SelectItem value="net30">Net 30 Days</SelectItem>
                          <SelectItem value="net60">Net 60 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template">Invoice Template</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger id="template">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {invoiceTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-gray-500">{template.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">{t('notes')}</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes or payment instructions"
                      value={invoiceData.notes}
                      onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={handlePreviewInvoice}>
                  <Eye className="h-4 w-4 mr-2" />
                  {t('preview')}
                </Button>
                <Button onClick={handleSendInvoice}>
                  <Send className="h-4 w-4 mr-2" />
                  {t('send_invoice')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('total_invoiced')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(invoiceStats.totalInvoiced, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('pending_payment')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(invoiceStats.pendingPayment, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">3 invoices</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('paid_invoices')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(invoiceStats.paidInvoices, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('overdue_amount')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(invoiceStats.overdueAmount, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">1 invoice</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>
      
      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>Manage and track all your invoices</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Invoices</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                  <TableCell>{format(new Date(invoice.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.client}</p>
                      <p className="text-xs text-gray-500">{invoice.items} items</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(invoice.amount, language)}
                  </TableCell>
                  <TableCell>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log("View", invoice.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicateInvoice(invoice.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {invoice.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("Send reminder", invoice.id)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Invoice Tips */}
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tip:</strong> Send invoices promptly after completing work to ensure faster payment. 
          Set up automatic reminders for overdue invoices to improve collection rates.
        </AlertDescription>
      </Alert>
    </div>
  )
}