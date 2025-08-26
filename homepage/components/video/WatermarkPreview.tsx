"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Eye,
  Settings,
  Paintbrush,
  Type,
  Move,
  Palette,
  RotateCcw,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type WatermarkConfig,
  type WatermarkPosition,
  defaultWatermarkConfig,
  watermarkPresets,
  generateWatermarkPreview,
  validateWatermarkConfig
} from "@/lib/utils/watermark"

interface WatermarkPreviewProps {
  previewImage?: string // Base image to show watermark on
  config: WatermarkConfig
  onChange: (config: WatermarkConfig) => void
  className?: string
}

export function WatermarkPreview({
  previewImage = '/placeholder.svg', // Default preview image
  config,
  onChange,
  className
}: WatermarkPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [validation, setValidation] = useState({ isValid: true, errors: [] as string[] })

  // Generate preview when config changes
  useEffect(() => {
    if (config.enabled && config.text.trim()) {
      generatePreview()
    } else {
      setPreviewUrl(null)
    }
  }, [config, previewImage])

  // Validate config on change
  useEffect(() => {
    setValidation(validateWatermarkConfig(config))
  }, [config])

  const generatePreview = async () => {
    if (!config.enabled || !config.text.trim()) return

    setIsGenerating(true)
    try {
      const url = await generateWatermarkPreview(previewImage, config, 400, 300)
      setPreviewUrl(url)
    } catch (error) {
      console.error('Preview generation error:', error)
      setPreviewUrl(null)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleConfigChange = (updates: Partial<WatermarkConfig>) => {
    onChange({ ...config, ...updates })
  }

  const handlePresetSelect = (presetName: keyof typeof watermarkPresets) => {
    const preset = watermarkPresets[presetName]
    onChange({ ...preset, text: config.text, enabled: config.enabled })
  }

  const handleReset = () => {
    onChange({ ...defaultWatermarkConfig, text: config.text })
  }

  const positions: { value: WatermarkPosition; label: string }[] = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'center', label: 'Center' }
  ]

  const colorOptions = [
    { value: '#FFFFFF', label: 'White', bg: 'bg-white' },
    { value: '#000000', label: 'Black', bg: 'bg-black' },
    { value: '#9333EA', label: 'Purple', bg: 'bg-purple-600' },
    { value: '#EC4899', label: 'Pink', bg: 'bg-pink-500' },
    { value: '#EF4444', label: 'Red', bg: 'bg-red-500' },
    { value: '#10B981', label: 'Green', bg: 'bg-green-500' },
    { value: '#3B82F6', label: 'Blue', bg: 'bg-blue-500' },
    { value: '#F59E0B', label: 'Yellow', bg: 'bg-yellow-500' }
  ]

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Watermark Preview & Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Validation Errors */}
        {!validation.isValid && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label className="text-base font-medium">Enable Watermark</Label>
            <p className="text-sm text-muted-foreground">
              Add your branding to recorded videos
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => handleConfigChange({ enabled })}
          />
        </div>

        {config.enabled && (
          <>
            {/* Preview */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Live Preview
              </Label>
              
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                {isGenerating ? (
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Generating preview...</p>
                    </div>
                  </div>
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Watermark preview"
                    className="w-full aspect-video object-cover"
                  />
                ) : config.text.trim() ? (
                  <div className="aspect-video flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Preview will appear here</p>
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Enter watermark text to see preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Quick Presets
              </Label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(watermarkPresets).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect(key as keyof typeof watermarkPresets)}
                    className="capitalize"
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </div>

            {/* Watermark Text */}
            <div className="space-y-2">
              <Label htmlFor="watermark-text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Watermark Text
              </Label>
              <Input
                id="watermark-text"
                placeholder="Enter your name or brand"
                value={config.text}
                onChange={(e) => handleConfigChange({ text: e.target.value })}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                This text will appear on your recorded videos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Position */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Position
                </Label>
                <Select
                  value={config.position}
                  onValueChange={(position: WatermarkPosition) => 
                    handleConfigChange({ position })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Font Size: {config.fontSize}px
                </Label>
                <Slider
                  value={[config.fontSize]}
                  min={12}
                  max={72}
                  step={2}
                  onValueChange={(value) => handleConfigChange({ fontSize: value[0] })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Text Color
              </Label>
              
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={cn(
                      "relative w-10 h-10 rounded-lg border-2 transition-all hover:scale-105",
                      color.bg,
                      config.color === color.value 
                        ? "border-purple-600 ring-2 ring-purple-600 ring-offset-1" 
                        : "border-gray-300 hover:border-gray-400"
                    )}
                    onClick={() => handleConfigChange({ color: color.value })}
                    title={color.label}
                  >
                    {config.color === color.value && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Opacity */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Paintbrush className="h-4 w-4" />
                  Opacity: {Math.round(config.opacity * 100)}%
                </Label>
                <Slider
                  value={[config.opacity]}
                  min={0.1}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => handleConfigChange({ opacity: value[0] })}
                  className="w-full"
                />
              </div>

              {/* Padding */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Padding: {config.padding}px
                </Label>
                <Slider
                  value={[config.padding]}
                  min={0}
                  max={50}
                  step={2}
                  onValueChange={(value) => handleConfigChange({ padding: value[0] })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Background Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Paintbrush className="h-4 w-4" />
                  Background
                </Label>
                <Switch
                  checked={!!config.backgroundColor}
                  onCheckedChange={(enabled) => 
                    handleConfigChange({ 
                      backgroundColor: enabled ? 'rgba(0, 0, 0, 0.7)' : undefined 
                    })
                  }
                />
              </div>
              
              {config.backgroundColor && (
                <div className="pl-6 space-y-2">
                  <Label className="text-sm">Background Opacity</Label>
                  <Slider
                    value={[config.backgroundColor ? parseFloat(config.backgroundColor.split(',')[3] || '0.7') : 0.7]}
                    min={0.1}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => 
                      handleConfigChange({ 
                        backgroundColor: `rgba(0, 0, 0, ${value[0]})` 
                      })
                    }
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Reset Button */}
            <div className="flex justify-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Defaults
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}