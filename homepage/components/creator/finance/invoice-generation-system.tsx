"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText,
  Download,
  Send,
  Eye,
  Edit,
  Printer,
  Mail,
  Link,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Building,
  MapPin,
  Phone,
  Globe,
  CreditCard,
  Receipt,
  Package,
  Sparkles,
  Settings,
  Upload,
  Palette,
  Languages,
  FileDown,
  Share2,
  History,
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  Plus,
  Copy,
  Trash2,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Image,
  Type,
  Hash,
  Shield,
  Zap,
  Archive,
  Star
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Invoice {
  id: string
  number: string
  date: Date
  dueDate: Date
  customer: {
    name: string
    company?: string
    email: string
    address: string
    phone?: string
  }
  items: {
    description: string
    quantity: number
    rate: number
    amount: number
  }[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "viewed" | "paid" | "overdue"
  paymentMethod?: string
  paymentDate?: Date
  notes?: string
  terms?: string
}

interface InvoiceTemplate {
  id: string
  name: string
  preview: string
  customizable: string[]
  popular?: boolean
}

export function InvoiceGenerationSystem() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const [showPreview, setShowPreview] = useState(false)
  const [customization, setCustomization] = useState({
    logo: null as File | null,
    primaryColor: "#9333ea",
    secondaryColor: "#ec4899",
    includeTerms: true,
    includeThankYou: true,
    language: "en"
  })
  const [bulkAction, setBulkAction] = useState("")
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])

  // Mock invoices data
  const invoices: Invoice[] = [
    {
      id: "1",
      number: "INV-2024-001",
      date: new Date("2024-12-27"),
      dueDate: new Date("2025-01-10"),
      customer: {
        name: "Marie Joseph",
        company: "MJ Productions",
        email: "marie@mjproductions.com",
        address: "123 Business St, Miami, FL 33101",
        phone: "+1 (305) 555-0123"
      },
      items: [
        { description: "Birthday Video Message - Premium", quantity: 1, rate: 150, amount: 150 },
        { description: "Rush Delivery (24hr)", quantity: 1, rate: 25, amount: 25 }
      ],
      subtotal: 175,
      tax: 12.25,
      total: 187.25,
      status: "paid",
      paymentMethod: "Credit Card",
      paymentDate: new Date("2024-12-28"),
      notes: "Thank you for your business!",
      terms: "Payment due within 14 days"
    },
    {
      id: "2",
      number: "INV-2024-002",
      date: new Date("2024-12-26"),
      dueDate: new Date("2025-01-09"),
      customer: {
        name: "Jean Baptiste",
        email: "jean@example.com",
        address: "456 Commerce Ave, New York, NY 10001"
      },
      items: [
        { description: "Business Shoutout Video", quantity: 1, rate: 200, amount: 200 }
      ],
      subtotal: 200,
      tax: 14,
      total: 214,
      status: "sent"
    },
    {
      id: "3",
      number: "INV-2024-003",
      date: new Date("2024-12-25"),
      dueDate: new Date("2025-01-08"),
      customer: {
        name: "Sophia Laurent",
        company: "Laurent Events",
        email: "sophia@laurentevents.com",
        address: "789 Event Plaza, Los Angeles, CA 90001"
      },
      items: [
        { description: "Wedding Congratulations Video", quantity: 1, rate: 300, amount: 300 },
        { description: "Extended Message (5 min)", quantity: 1, rate: 50, amount: 50 }
      ],
      subtotal: 350,
      tax: 24.50,
      total: 374.50,
      status: "viewed"
    }
  ]

  // Invoice templates
  const templates: InvoiceTemplate[] = [
    {
      id: "professional",
      name: "Professional",
      preview: "Clean and modern design",
      customizable: ["logo", "colors", "terms"],
      popular: true
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Simple and elegant",
      customizable: ["logo", "colors"]
    },
    {
      id: "creative",
      name: "Creative",
      preview: "Bold and colorful",
      customizable: ["logo", "colors", "fonts", "layout"]
    },
    {
      id: "corporate",
      name: "Corporate",
      preview: "Traditional business style",
      customizable: ["logo", "header", "footer"]
    }
  ]

  // Available languages
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "ht", name: "Kreyòl Ayisyen" },
    { code: "es", name: "Español" }
  ]

  // Calculate invoice statistics
  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === "paid").length,
    pending: invoices.filter(i => i.status === "sent" || i.status === "viewed").length,
    overdue: invoices.filter(i => i.status === "overdue").length,
    totalAmount: invoices.reduce((sum, i) => sum + i.total, 0),
    paidAmount: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.total, 0)
  }

  const handleGenerateInvoice = () => {
    console.log("Generating invoice...")
  }

  const handleSendInvoice = (invoice: Invoice) => {
    console.log("Sending invoice:", invoice.number)
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log("Downloading invoice:", invoice.number)
  }

  const handleBulkAction = () => {
    console.log("Bulk action:", bulkAction, "on invoices:", selectedInvoices)
  }

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700"
      case "sent": return "bg-blue-100 text-blue-700"
      case "viewed": return "bg-yellow-100 text-yellow-700"
      case "overdue": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid": return <CheckCircle2 className="w-4 h-4" />
      case "sent": return <Send className="w-4 h-4" />
      case "viewed": return <Eye className="w-4 h-4" />
      case "overdue": return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Invoice Generation System</h2>
          <p className="text-gray-500">Create professional invoices for your business customers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
          <Button onClick={handleGenerateInvoice}>
            <Plus className="w-4 h-4 mr-1" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <FileText className="w-8 h-8 text-gray-400" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.paid}</p>
                <p className="text-xs text-gray-500">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-8 h-8 text-blue-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-xs text-gray-500">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="w-8 h-8 text-purple-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">${stats.paidAmount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Paid Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List & Management */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Invoices</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-1" />
                    Search
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Bulk Actions */}
              {selectedInvoices.length > 0 && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedInvoices.length} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Bulk action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send">Send All</SelectItem>
                        <SelectItem value="download">Download All</SelectItem>
                        <SelectItem value="archive">Archive</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleBulkAction}>
                      Apply
                    </Button>
                  </div>
                </div>
              )}

              {/* Invoice List */}
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            if (e.target.checked) {
                              setSelectedInvoices([...selectedInvoices, invoice.id])
                            } else {
                              setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id))
                            }
                          }}
                          className="mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{invoice.number}</h4>
                            <Badge className={getStatusColor(invoice.status)}>
                              {getStatusIcon(invoice.status)}
                              <span className="ml-1">{invoice.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{invoice.customer.name}</p>
                          {invoice.customer.company && (
                            <p className="text-xs text-gray-500">{invoice.customer.company}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {invoice.date.toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Due {invoice.dueDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${invoice.total.toFixed(2)}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSendInvoice(invoice)
                            }}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadInvoice(invoice)
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowPreview(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          {selectedInvoice && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Invoice Details</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-semibold mb-2">Customer Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium">{selectedInvoice.customer.name}</p>
                      </div>
                      {selectedInvoice.customer.company && (
                        <div>
                          <p className="text-gray-500">Company</p>
                          <p className="font-medium">{selectedInvoice.customer.company}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{selectedInvoice.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium">{selectedInvoice.customer.address}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Items */}
                  <div>
                    <h4 className="font-semibold mb-2">Service Details</h4>
                    <div className="space-y-2">
                      {selectedInvoice.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.description}</span>
                          <span className="font-medium">${item.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${selectedInvoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-lg">${selectedInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  {selectedInvoice.paymentMethod && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Payment Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Method</p>
                            <p className="font-medium">{selectedInvoice.paymentMethod}</p>
                          </div>
                          {selectedInvoice.paymentDate && (
                            <div>
                              <p className="text-gray-500">Date</p>
                              <p className="font-medium">
                                {selectedInvoice.paymentDate.toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Customization Panel */}
        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "border-purple-500 bg-purple-50"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {template.name}
                          {template.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </h4>
                        <p className="text-xs text-gray-500">{template.preview}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Logo Upload */}
                <div>
                  <Label>Company Logo</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Logo
                    </Button>
                    {customization.logo && (
                      <span className="text-sm text-gray-500">logo.png</span>
                    )}
                  </div>
                </div>

                {/* Color Scheme */}
                <div>
                  <Label>Color Scheme</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border cursor-pointer"
                        style={{ backgroundColor: customization.primaryColor }}
                      />
                      <span className="text-sm">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border cursor-pointer"
                        style={{ backgroundColor: customization.secondaryColor }}
                      />
                      <span className="text-sm">Secondary</span>
                    </div>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <Label>Language</Label>
                  <Select 
                    value={customization.language} 
                    onValueChange={(value) => setCustomization({...customization, language: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="terms" className="cursor-pointer">Include Terms</Label>
                    <Switch
                      id="terms"
                      checked={customization.includeTerms}
                      onCheckedChange={(checked) => 
                        setCustomization({...customization, includeTerms: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="thanks" className="cursor-pointer">Include Thank You</Label>
                    <Switch
                      id="thanks"
                      checked={customization.includeThankYou}
                      onCheckedChange={(checked) => 
                        setCustomization({...customization, includeThankYou: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Automatic Invoice
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Create Recurring Invoice
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Bulk Create Invoices
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Receipt className="w-4 h-4 mr-2" />
                  Generate Credit Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Invoice Preview */}
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: customization.primaryColor }}>
                      INVOICE
                    </h1>
                    <p className="text-gray-500 mt-1">{selectedInvoice.number}</p>
                  </div>
                  <div className="text-right">
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                      <Image className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Invoice Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: customization.secondaryColor }}>
                      From
                    </h3>
                    <p className="font-medium">Your Name</p>
                    <p className="text-gray-600">Creator/Business Name</p>
                    <p className="text-gray-600">123 Creator St</p>
                    <p className="text-gray-600">City, State 12345</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: customization.secondaryColor }}>
                      Bill To
                    </h3>
                    <p className="font-medium">{selectedInvoice.customer.name}</p>
                    {selectedInvoice.customer.company && (
                      <p className="text-gray-600">{selectedInvoice.customer.company}</p>
                    )}
                    <p className="text-gray-600">{selectedInvoice.customer.address}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-gray-500">Invoice Date</p>
                    <p className="font-medium">{selectedInvoice.date.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Due Date</p>
                    <p className="font-medium">{selectedInvoice.dueDate.toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Line Items */}
                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Rate</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">${item.rate.toFixed(2)}</td>
                        <td className="text-right py-2">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right py-2">Subtotal</td>
                      <td className="text-right py-2">${selectedInvoice.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-right py-2">Tax</td>
                      <td className="text-right py-2">${selectedInvoice.tax.toFixed(2)}</td>
                    </tr>
                    <tr className="font-bold text-lg">
                      <td colSpan={3} className="text-right py-2">Total</td>
                      <td className="text-right py-2" style={{ color: customization.primaryColor }}>
                        ${selectedInvoice.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Footer */}
                {customization.includeTerms && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                    <p className="text-sm text-gray-600">{selectedInvoice.terms}</p>
                  </div>
                )}
                {customization.includeThankYou && (
                  <div className="text-center pt-4 border-t">
                    <p className="text-gray-600">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t p-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Download PDF
                </Button>
                <Button>
                  <Send className="w-4 h-4 mr-1" />
                  Send Invoice
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}