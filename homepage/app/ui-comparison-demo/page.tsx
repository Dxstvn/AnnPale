"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  ChevronLeft, ChevronRight, Download, Share2, Heart, 
  Upload, HelpCircle, CheckCircle2, PartyPopper, 
  Filter, Copy, Eye, EyeOff, Sparkles, ArrowRight,
  Star, MessageSquare, RotateCw
} from "lucide-react"
import confetti from "canvas-confetti"

export default function UIComparisonDemo() {
  const [showOld, setShowOld] = useState(true)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const triggerSuccess = () => {
    setShowSuccessAnimation(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    setTimeout(() => setShowSuccessAnimation(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            UI Modernization Demo
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UI Component Comparison
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            See the transformation of our UI components from old to new design
          </p>
          
          {/* Toggle Switch */}
          <div className="inline-flex items-center gap-4 p-2 bg-white rounded-full shadow-lg">
            <button
              onClick={() => setShowOld(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                showOld 
                  ? "bg-gray-200 text-gray-700" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Old Design
            </button>
            <button
              onClick={() => setShowOld(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                !showOld 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              New Design
            </button>
          </div>
        </div>

        {/* Component Sections */}
        <div className="space-y-12">
          {/* Section 1: Buttons with Hover States */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Button Hover States</h2>
              <p className="text-gray-600">Hover over buttons to see the effect</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Back Button */}
              <Card className={showOld ? "" : "border-purple-200 shadow-lg"}>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation Button</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className={
                      showOld 
                        ? "hover:bg-gray-100 hover:border-2 hover:border-black"
                        : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md transition-all duration-300"
                    }
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </CardContent>
              </Card>

              {/* Share Button */}
              <Card className={showOld ? "" : "border-purple-200 shadow-lg"}>
                <CardHeader>
                  <CardTitle className="text-lg">Action Button</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setShareMenuOpen(!shareMenuOpen)}
                      className={
                        showOld 
                          ? "w-full hover:bg-gray-100 hover:border-2 hover:border-black"
                          : "w-full hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md transition-all duration-300"
                      }
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    {shareMenuOpen && (
                      <div className={
                        showOld 
                          ? "absolute top-12 left-0 right-0 bg-white border rounded-lg shadow-xl p-2 z-10"
                          : "absolute top-12 left-0 right-0 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-xl p-2 z-10"
                      }>
                        <button
                          className={
                            showOld 
                              ? "w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                              : "w-full text-left px-3 py-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded flex items-center gap-2 transition-all duration-200"
                          }
                        >
                          <Copy className="h-4 w-4" />
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Like Button */}
              <Card className={showOld ? "" : "border-purple-200 shadow-lg"}>
                <CardHeader>
                  <CardTitle className="text-lg">Toggle Button</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                    className={
                      isLiked 
                        ? "bg-red-500 hover:bg-red-600" 
                        : showOld 
                          ? "hover:bg-gray-100 hover:border-2 hover:border-black"
                          : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md transition-all duration-300"
                    }
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-white" : ""}`} />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Section 2: Cards */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Card Components</h2>
              <p className="text-gray-600">Enhanced elevation and hover effects</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {showOld ? (
                <>
                  <div className="bg-white border-gray-200 shadow-sm hover:shadow-lg cursor-pointer p-6 rounded-xl border transition-all duration-200">
                    <h3 className="text-lg font-semibold mb-2">Default Card (Old)</h3>
                    <p className="text-gray-600">Basic border with simple shadow</p>
                  </div>
                  <div className="bg-white border-gray-200 shadow-md hover:shadow-xl p-6 rounded-xl border transition-all duration-200">
                    <h3 className="text-lg font-semibold mb-2">Elevated Card (Old)</h3>
                    <p className="text-gray-600">Medium shadow with hover effect</p>
                  </div>
                </>
              ) : (
                <>
                  <Card variant="default">
                    <CardHeader>
                      <CardTitle>Default Card (New)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Modern gradient border with backdrop blur</p>
                    </CardContent>
                  </Card>
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle>Elevated Card (New)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Enhanced shadow with purple accent</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </section>

          <Separator />

          {/* Section 3: File Upload Areas */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">File Upload Areas</h2>
              <p className="text-gray-600">Hover to see the interactive states</p>
            </div>
            
            <div className="flex justify-center gap-8">
              {showOld ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 font-medium">Click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer group">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-purple-400 group-hover:text-purple-600 transition-colors" />
                  <p className="text-sm text-gray-700 font-medium">Click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Section 4: Tooltips */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Tooltips & Help Icons</h2>
              <p className="text-gray-600">Hover over the icons to see tooltips</p>
            </div>
            
            <div className="flex justify-center gap-8">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className={showOld ? "bg-black text-white" : ""}>
                    <p>{showOld ? "Old style tooltip" : "Modern gradient tooltip"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </section>

          <Separator />

          {/* Section 5: Dropdowns & Selects */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Dropdowns & Selects</h2>
              <p className="text-gray-600">Interactive dropdown components</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {/* Select Component */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Option</label>
                <Select value={selectedOption} onValueChange={setSelectedOption}>
                  <SelectTrigger className={
                    showOld 
                      ? "border-gray-200"
                      : ""
                  }>
                    <SelectValue placeholder="Choose an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dropdown Menu */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Dropdown Menu</label>
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={
                      showOld 
                        ? ""
                        : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                    }>
                      <Filter className="h-4 w-4 mr-2" />
                      Menu Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </section>

          <Separator />

          {/* Section 6: Success Animation */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Success Animations</h2>
              <p className="text-gray-600">Click to trigger completion animation</p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={triggerSuccess}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete Action
              </Button>
            </div>

            <AnimatePresence>
              {showSuccessAnimation && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={
                    showOld 
                      ? "fixed inset-0 z-50 flex items-center justify-center bg-white/90"
                      : "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50/95 via-white/95 to-pink-50/95 backdrop-blur-sm"
                  }
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 1 }}
                    className="relative"
                  >
                    <div className="h-32 w-32 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center">
                      <CheckCircle2 className="h-20 w-20 text-white" />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-4 -right-4"
                    >
                      <PartyPopper className="h-12 w-12 text-yellow-500" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <Separator />

          {/* Summary Section */}
          <section className="space-y-6">
            <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <Sparkles className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <strong>Design Improvements:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Replaced flat gray backgrounds with gradient hover effects</li>
                  <li>Added backdrop blur for modern glass morphism effect</li>
                  <li>Enhanced shadows and elevation for better depth</li>
                  <li>Improved color scheme with purple/pink gradient accents</li>
                  <li>Smoother transitions and animations</li>
                  <li>Better accessibility with improved contrast</li>
                </ul>
              </AlertDescription>
            </Alert>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-600">
            Toggle between old and new designs to see the improvements
          </p>
        </div>
      </div>
    </div>
  )
}