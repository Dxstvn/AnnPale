"use client"

import * as React from "react"
import { UseFormReturn, Controller, FieldValues, Path } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ValidatedField } from "./validation"
import { 
  EmailInput,
  PhoneInput,
  URLInput,
  CurrencyInput,
  NumberInput,
  DateInput,
  TimeInput,
  CreditCardInput,
  PercentageInput,
  TagInput,
  LocationInput
} from "./enhanced-inputs"
import { Info } from "lucide-react"

// Base field props
interface BaseFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  required?: boolean
  hint?: string
  className?: string
}

// Text field
interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  type?: "text" | "password" | "email" | "url" | "tel"
  autoComplete?: string
}

export function TextField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  placeholder,
  type = "text",
  autoComplete,
  className
}: TextFieldProps<T>) {
  const { control, formState: { errors } } = form
  const error = errors[name]?.message as string | undefined
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (type) {
            case "email":
              return <EmailInput {...field} placeholder={placeholder} autoComplete={autoComplete} />
            case "tel":
              return <PhoneInput {...field} placeholder={placeholder} />
            case "url":
              return <URLInput {...field} placeholder={placeholder} />
            default:
              return (
                <input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  className={cn(
                    "flex h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-base",
                    "transition-all outline-none",
                    "focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
              )
          }
        }}
      />
    </ValidatedField>
  )
}

// Textarea field
interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  rows?: number
  maxLength?: number
  showCount?: boolean
}

export function TextareaField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  placeholder,
  rows = 4,
  maxLength,
  showCount = false,
  className
}: TextareaFieldProps<T>) {
  const { control, formState: { errors }, watch } = form
  const error = errors[name]?.message as string | undefined
  const value = watch(name) || ""
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
              className={cn(
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {showCount && maxLength && (
              <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                {value.length}/{maxLength}
              </span>
            )}
          </div>
        )}
      />
    </ValidatedField>
  )
}

// Select field
interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  options: { value: string; label: string; disabled?: boolean }[]
}

export function SelectField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  placeholder = "Select an option",
  options,
  className
}: SelectFieldProps<T>) {
  const { control, formState: { errors } } = form
  const error = errors[name]?.message as string | undefined
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className={cn(
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </ValidatedField>
  )
}

// Checkbox field
interface CheckboxFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  text?: string
  description?: string
}

export function CheckboxField<T extends FieldValues>({
  form,
  name,
  label,
  text,
  description,
  required,
  className
}: CheckboxFieldProps<T>) {
  const { control, formState: { errors } } = form
  const error = errors[name]?.message as string | undefined
  
  return (
    <div className={cn("space-y-2", className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              id={name}
              className={cn(error && "border-red-500")}
            />
            <div className="space-y-1">
              <Label htmlFor={name} className="cursor-pointer">
                {label || text}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
            </div>
          </div>
        )}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

// Radio group field
interface RadioGroupFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: { value: string; label: string; description?: string }[]
  orientation?: "horizontal" | "vertical"
}

export function RadioGroupField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  options,
  orientation = "vertical",
  className
}: RadioGroupFieldProps<T>) {
  const { control, formState: { errors } } = form
  const error = errors[name]?.message as string | undefined
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className={cn(
              orientation === "horizontal" ? "flex gap-6" : "space-y-3"
            )}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-start space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${name}-${option.value}`}
                  className={cn(error && "border-red-500")}
                />
                <div className="space-y-1">
                  <Label htmlFor={`${name}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-sm text-gray-500">{option.description}</p>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </ValidatedField>
  )
}

// Switch field
interface SwitchFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  description?: string
}

export function SwitchField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  className
}: SwitchFieldProps<T>) {
  const { control } = form
  
  return (
    <div className={cn("space-y-2", className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor={name}>{label}</Label>
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
            </div>
            <Switch
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />
    </div>
  )
}

// Slider field
interface SliderFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  unit?: string
}

export function SliderField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  unit = "",
  className
}: SliderFieldProps<T>) {
  const { control, formState: { errors }, watch } = form
  const error = errors[name]?.message as string | undefined
  const value = watch(name) || min
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Slider
              value={[field.value || min]}
              onValueChange={(value) => field.onChange(value[0])}
              min={min}
              max={max}
              step={step}
              className={cn(error && "opacity-50")}
            />
            {showValue && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>{min}{unit}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {value}{unit}
                </span>
                <span>{max}{unit}</span>
              </div>
            )}
          </div>
        )}
      />
    </ValidatedField>
  )
}

// Date field
interface DateFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  min?: string
  max?: string
}

export function DateField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  min,
  max,
  className
}: DateFieldProps<T>) {
  const { control, formState: { errors } } = form
  const error = errors[name]?.message as string | undefined
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DateInput {...field} min={min} max={max} />
        )}
      />
    </ValidatedField>
  )
}

// Time field
interface TimeFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  min?: string
  max?: string
  step?: number
}

export function TimeField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  min,
  max,
  step,
  className
}: TimeFieldProps<T>) {
  const { control, formState: { errors } } = form
  const error = errors[name]?.message as string | undefined
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TimeInput {...field} min={min} max={max} step={step} />
        )}
      />
    </ValidatedField>
  )
}

// Currency field
interface CurrencyFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  currency?: "USD" | "EUR" | "HTG"
  min?: number
  max?: number
}

export function CurrencyField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  currency = "USD",
  min,
  max,
  className
}: CurrencyFieldProps<T>) {
  const { control, formState: { errors } } = form
  const error = errors[name]?.message as string | undefined
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CurrencyInput {...field} currency={currency} min={min} max={max} />
        )}
      />
    </ValidatedField>
  )
}

// Number field
interface NumberFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  min?: number
  max?: number
  step?: number
  showControls?: boolean
}

export function NumberField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  min,
  max,
  step,
  showControls,
  className
}: NumberFieldProps<T>) {
  const { control, formState: { errors } } = form
  const error = errors[name]?.message as string | undefined
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <NumberInput
            {...field}
            min={min}
            max={max}
            step={step}
            showControls={showControls}
          />
        )}
      />
    </ValidatedField>
  )
}

// Tag field
interface TagFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  maxTags?: number
}

export function TagField<T extends FieldValues>({
  form,
  name,
  label,
  required,
  hint,
  placeholder,
  maxTags,
  className
}: TagFieldProps<T>) {
  const { control, formState: { errors } } = form
  const error = errors[name]?.message as string | undefined
  
  return (
    <ValidatedField
      name={name}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TagInput
            value={field.value || []}
            onChange={field.onChange}
            placeholder={placeholder}
            maxTags={maxTags}
          />
        )}
      />
    </ValidatedField>
  )
}