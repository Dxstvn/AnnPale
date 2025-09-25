"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  Upload,
  Eye,
  Send,
  HelpCircle,
  Shield,
  Calculator,
  FileCheck,
  Printer,
  Mail
} from "lucide-react"
import Link from "next/link"
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
const taxTranslations: Record<string, Record<string, string>> = {
  tax_center: {
    en: "Tax Documentation Center",
    fr: "Centre de documentation fiscale",
    ht: "Sant dokiman taks"
  },
  manage_tax_documents: {
    en: "Manage your tax documents and compliance",
    fr: "Gérez vos documents fiscaux et votre conformité",
    ht: "Jere dokiman taks ou ak konfòmite"
  },
  tax_year: {
    en: "Tax Year",
    fr: "Année fiscale",
    ht: "Ane taks"
  },
  ytd_earnings: {
    en: "YTD Earnings",
    fr: "Revenus YTD",
    ht: "Kòb ou fè ane sa"
  },
  estimated_tax: {
    en: "Estimated Tax",
    fr: "Impôt estimé",
    ht: "Taks estime"
  },
  documents_ready: {
    en: "Documents Ready",
    fr: "Documents prêts",
    ht: "Dokiman pare"
  },
  overview: {
    en: "Overview",
    fr: "Aperçu",
    ht: "Apèsi"
  },
  documents: {
    en: "Documents",
    fr: "Documents",
    ht: "Dokiman"
  },
  tax_settings: {
    en: "Tax Settings",
    fr: "Paramètres fiscaux",
    ht: "Paramèt taks"
  },
  download_all: {
    en: "Download All",
    fr: "Tout télécharger",
    ht: "Telechaje tout"
  },
  tax_summary: {
    en: "Tax Summary",
    fr: "Résumé fiscal",
    ht: "Rezime taks"
  },
  quarterly_estimates: {
    en: "Quarterly Estimates",
    fr: "Estimations trimestrielles",
    ht: "Estimasyon chak twa mwa"
  },
  form_1099: {
    en: "Form 1099-NEC",
    fr: "Formulaire 1099-NEC",
    ht: "Fòm 1099-NEC"
  },
  earnings_statement: {
    en: "Earnings Statement",
    fr: "Relevé de revenus",
    ht: "Deklarasyon kòb ou fè"
  },
  transaction_history: {
    en: "Transaction History",
    fr: "Historique des transactions",
    ht: "Istwa tranzaksyon"
  }
}

// Mock data
const taxYearSummary = {
  currentYear: 2024,
  ytdEarnings: 18750.00,
  estimatedTax: 4687.50,
  quarterlyPayments: [
    { quarter: "Q1", paid: 1171.88, due: 1171.88, status: "paid" },
    { quarter: "Q2", paid: 1171.88, due: 1171.88, status: "paid" },
    { quarter: "Q3", paid: 1171.88, due: 1171.88, status: "paid" },
    { quarter: "Q4", paid: 0, due: 1171.88, status: "pending" }
  ],
  deductions: {
    business: 2500.00,
    home_office: 1200.00,
    equipment: 800.00,
    mileage: 350.00
  }
}

const taxDocuments = [
  {
    id: "1",
    year: 2024,
    type: "1099-NEC",
    description: "Non-Employee Compensation",
    status: "available" as const,
    date: "2024-01-31",
    amount: 18750.00
  },
  {
    id: "2",
    year: 2023,
    type: "1099-NEC",
    description: "Non-Employee Compensation",
    status: "available" as const,
    date: "2023-01-31",
    amount: 15420.00
  },
  {
    id: "3",
    year: 2024,
    type: "Earnings Statement",
    description: "Annual earnings summary",
    status: "pending" as const,
    date: "2025-01-15",
    amount: 18750.00
  },
  {
    id: "4",
    year: 2024,
    type: "Transaction Report",
    description: "Detailed transaction history",
    status: "available" as const,
    date: "2024-12-31",
    amount: null
  }
]

const taxDeadlines = [
  { date: "2025-01-15", description: "Q4 2024 Estimated Tax Payment", status: "upcoming" },
  { date: "2025-01-31", description: "1099-NEC Forms Available", status: "upcoming" },
  { date: "2025-04-15", description: "2024 Tax Return Due", status: "future" },
  { date: "2025-04-15", description: "Q1 2025 Estimated Tax Payment", status: "future" }
]

export default function TaxDocumentsPage() {
  const t = useTranslations()
  const [selectedYear, setSelectedYear] = useState("2024")
  const [activeTab, setActiveTab] = useState("overview")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  
  const tCustom = (key: string) => {
    return taxTranslations[key]?.['en'] || taxTranslations[key]?.en || key
  }
  
  const getStatusBadge = (status: string) => {
    const config = {
      available: { label: "Available", className: "bg-green-500 text-white" },
      pending: { label: "Pending", className: "bg-orange-500 text-white" },
      paid: { label: "Paid", className: "bg-blue-500 text-white" },
      overdue: { label: "Overdue", className: "bg-red-500 text-white" }
    }
    const statusConfig = config[status as keyof typeof config]
    return statusConfig ? <Badge className={statusConfig.className}>{statusConfig.label}</Badge> : null
  }
  
  const handleDownloadDocument = (docId: string) => {
    console.log("Downloading document:", docId)
  }
  
  const handleViewDocument = (docId: string) => {
    setSelectedDocument(docId)
    console.log("Viewing document:", docId)
  }
  
  const handleEmailDocument = (docId: string) => {
    console.log("Emailing document:", docId)
  }
  
  const calculateTaxRate = () => {
    return ((taxYearSummary.estimatedTax / taxYearSummary.ytdEarnings) * 100).toFixed(1)
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
            <h1 className="text-3xl font-bold text-gray-900">{t('tax_center')}</h1>
            <p className="text-gray-600 mt-1">{t('manage_tax_documents')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              onClick={() => handleDownloadDocument("all")}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('download_all')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('tax_year')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{selectedYear}</p>
              <p className="text-xs text-gray-500 mt-1">Current filing year</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('ytd_earnings')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(taxYearSummary.ytdEarnings, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Gross income</p>
            </div>
            <Calculator className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('estimated_tax')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(taxYearSummary.estimatedTax, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">~{calculateTaxRate()}% rate</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('documents_ready')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {taxDocuments.filter(d => d.status === 'available').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">For download</p>
            </div>
            <FileCheck className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>
      
      {/* Important Deadlines Alert */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Upcoming deadline:</strong> Q4 2024 Estimated Tax Payment due January 15, 2025. 
          Amount due: {formatCurrency(1171.88, language)}
        </AlertDescription>
      </Alert>
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="documents">{t('documents')}</TabsTrigger>
          <TabsTrigger value="settings">{t('tax_settings')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Tax Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tax_summary')}</CardTitle>
                <CardDescription>Your tax overview for {selectedYear}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Earnings</span>
                    <span className="font-bold">{formatCurrency(taxYearSummary.ytdEarnings, language)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Expenses</span>
                    <span className="font-bold text-red-600">
                      -{formatCurrency(Object.values(taxYearSummary.deductions).reduce((a, b) => a + b, 0), language)}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-gray-600">Taxable Income</span>
                    <span className="font-bold">
                      {formatCurrency(taxYearSummary.ytdEarnings - Object.values(taxYearSummary.deductions).reduce((a, b) => a + b, 0), language)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(taxYearSummary.estimatedTax, language)}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Deductions Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(taxYearSummary.deductions).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                        <span>{formatCurrency(value, language)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quarterly Payments */}
            <Card>
              <CardHeader>
                <CardTitle>{t('quarterly_estimates')}</CardTitle>
                <CardDescription>Estimated tax payment schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {taxYearSummary.quarterlyPayments.map((payment) => (
                    <div key={payment.quarter} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          payment.status === 'paid' ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          {payment.status === 'paid' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{payment.quarter} {selectedYear}</p>
                          <p className="text-sm text-gray-500">
                            Due: {formatCurrency(payment.due, language)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(payment.status)}
                        {payment.status === 'pending' && (
                          <Button size="sm" className="mt-2">
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Estimated Tax</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(taxYearSummary.estimatedTax, language)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Paid to date</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(3515.64, language)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Important Tax Deadlines</CardTitle>
              <CardDescription>Don't miss these important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taxDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{deadline.description}</p>
                        <p className="text-sm text-gray-500">{format(new Date(deadline.date), 'MMMM d, yyyy')}</p>
                      </div>
                    </div>
                    <Badge variant={deadline.status === 'upcoming' ? 'default' : 'secondary'}>
                      {deadline.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tax Documents</CardTitle>
                  <CardDescription>Download your tax forms and statements</CardDescription>
                </div>
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Tax Document</DialogTitle>
                      <DialogDescription>
                        Upload expense receipts or other tax-related documents
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="doc-type">Document Type</Label>
                        <Select>
                          <SelectTrigger id="doc-type">
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receipt">Expense Receipt</SelectItem>
                            <SelectItem value="1099">1099 Form</SelectItem>
                            <SelectItem value="w9">W-9 Form</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="file">Select File</Label>
                        <Input id="file" type="file" accept=".pdf,.jpg,.png" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input id="notes" placeholder="Add any relevant notes" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsUploadDialogOpen(false)}>
                        Upload Document
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doc.type}</p>
                          <p className="text-sm text-gray-500">{doc.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{doc.year}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {doc.amount ? formatCurrency(doc.amount, language) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocument(doc.id)}
                            disabled={doc.status === 'pending'}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc.id)}
                            disabled={doc.status === 'pending'}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEmailDocument(doc.id)}
                            disabled={doc.status === 'pending'}
                          >
                            <Mail className="h-4 w-4" />
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
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
              <CardDescription>Your tax profile and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID Number (SSN/EIN)</Label>
                  <Input
                    id="tax-id"
                    type="password"
                    value="XXX-XX-1234"
                    disabled
                  />
                  <p className="text-xs text-gray-500">Last 4 digits: 1234</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filing-status">Filing Status</Label>
                  <Select defaultValue="single">
                    <SelectTrigger id="filing-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                      <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                      <SelectItem value="head">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State of Residence</Label>
                  <Select defaultValue="ny">
                    <SelectTrigger id="state">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                      <SelectItem value="fl">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="withholding">Tax Withholding Preference</Label>
                  <Select defaultValue="quarterly">
                    <SelectTrigger id="withholding">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Withholding</SelectItem>
                      <SelectItem value="quarterly">Quarterly Estimates</SelectItem>
                      <SelectItem value="automatic">Automatic Withholding (28%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your tax information is encrypted and securely stored. We use this information to generate your tax documents and ensure compliance with IRS requirements.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Get Tax Help
                </Button>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}