"use client"

import * as React from "react"
import { debounce, throttle } from "lodash"

// Performance hooks for form optimization

/**
 * Debounced value hook - delays value updates
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Debounced callback hook - delays function execution
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T {
  const callbackRef = React.useRef(callback)
  callbackRef.current = callback

  const debouncedCallback = React.useMemo(
    () => debounce((...args) => callbackRef.current(...args), delay),
    [delay]
  )

  React.useEffect(() => {
    return () => {
      debouncedCallback.cancel()
    }
  }, [debouncedCallback])

  return debouncedCallback as T
}

/**
 * Throttled callback hook - limits execution frequency
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): T {
  const callbackRef = React.useRef(callback)
  callbackRef.current = callback

  const throttledCallback = React.useMemo(
    () => throttle((...args) => callbackRef.current(...args), delay),
    [delay]
  )

  React.useEffect(() => {
    return () => {
      throttledCallback.cancel()
    }
  }, [throttledCallback])

  return throttledCallback as T
}

/**
 * Lazy validation hook - validates only when needed
 */
export function useLazyValidation<T>(
  value: T,
  validator: (value: T) => Promise<string | null>,
  options: {
    validateOnChange?: boolean
    validateOnBlur?: boolean
    delay?: number
  } = {}
) {
  const { validateOnChange = false, validateOnBlur = true, delay = 300 } = options
  const [error, setError] = React.useState<string | null>(null)
  const [isValidating, setIsValidating] = React.useState(false)
  
  const debouncedValidator = useDebouncedCallback(async (val: T) => {
    setIsValidating(true)
    try {
      const result = await validator(val)
      setError(result)
    } catch (err) {
      setError("Validation error")
    } finally {
      setIsValidating(false)
    }
  }, delay)

  const validate = React.useCallback(() => {
    debouncedValidator(value)
  }, [value, debouncedValidator])

  React.useEffect(() => {
    if (validateOnChange && value) {
      validate()
    }
  }, [value, validateOnChange, validate])

  const handleBlur = React.useCallback(() => {
    if (validateOnBlur && value) {
      validate()
    }
  }, [validateOnBlur, value, validate])

  return {
    error,
    isValidating,
    validate,
    handleBlur,
    clearError: () => setError(null)
  }
}

/**
 * Memoized field component wrapper
 */
export const MemoizedField = React.memo(
  ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
    return <>{children}</>
  },
  (prevProps, nextProps) => {
    // Custom comparison - only re-render if value or error changed
    return (
      prevProps.value === nextProps.value &&
      prevProps.error === nextProps.error &&
      prevProps.disabled === nextProps.disabled
    )
  }
)

/**
 * Virtual scrolling for long forms
 */
interface VirtualFormProps {
  fields: Array<{ id: string; component: React.ReactNode }>
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function VirtualForm({ 
  fields, 
  itemHeight, 
  containerHeight, 
  overscan = 3 
}: VirtualFormProps) {
  const [scrollTop, setScrollTop] = React.useState(0)
  const scrollElementRef = React.useRef<HTMLDivElement>(null)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    fields.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleFields = fields.slice(startIndex, endIndex + 1)
  const totalHeight = fields.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = useThrottledCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, 50)

  return (
    <div
      ref={scrollElementRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflow: "auto" }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleFields.map((field) => (
            <div key={field.id} style={{ height: itemHeight }}>
              {field.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Field-level update wrapper to prevent unnecessary re-renders
 */
interface IsolatedFieldProps {
  name: string
  value: any
  onChange: (value: any) => void
  render: (props: { value: any; onChange: (value: any) => void }) => React.ReactNode
}

export const IsolatedField = React.memo(
  ({ name, value, onChange, render }: IsolatedFieldProps) => {
    const [localValue, setLocalValue] = React.useState(value)

    const handleChange = React.useCallback((newValue: any) => {
      setLocalValue(newValue)
      // Debounce the parent update
      debouncedUpdate(newValue)
    }, [])

    const debouncedUpdate = React.useMemo(
      () => debounce((val: any) => onChange(val), 300),
      [onChange]
    )

    React.useEffect(() => {
      setLocalValue(value)
    }, [value])

    return <>{render({ value: localValue, onChange: handleChange })}</>
  }
)

/**
 * Code splitting wrapper for dynamic form imports
 */
export function LazyFormField({ 
  loader, 
  ...props 
}: { 
  loader: () => Promise<{ default: React.ComponentType<any> }> 
  [key: string]: any 
}) {
  const LazyComponent = React.lazy(loader)
  
  return (
    <React.Suspense fallback={<FieldSkeleton />}>
      <LazyComponent {...props} />
    </React.Suspense>
  )
}

function FieldSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  )
}

/**
 * Performance monitoring wrapper
 */
export function FormPerformanceMonitor({ 
  children,
  onMetrics 
}: { 
  children: React.ReactNode
  onMetrics?: (metrics: FormMetrics) => void
}) {
  const renderTime = React.useRef<number>(0)
  const interactionTime = React.useRef<number>(0)
  const validationTime = React.useRef<number>(0)

  React.useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      renderTime.current = performance.now() - startTime
      
      if (onMetrics) {
        onMetrics({
          renderTime: renderTime.current,
          interactionTime: interactionTime.current,
          validationTime: validationTime.current,
          totalTime: renderTime.current + interactionTime.current + validationTime.current
        })
      }
    }
  }, [onMetrics])

  return <>{children}</>
}

interface FormMetrics {
  renderTime: number
  interactionTime: number
  validationTime: number
  totalTime: number
}

/**
 * Optimized form context to prevent unnecessary re-renders
 */
interface OptimizedFormContextValue {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  setValue: (name: string, value: any) => void
  setError: (name: string, error: string) => void
  setTouched: (name: string, touched: boolean) => void
}

const OptimizedFormContext = React.createContext<OptimizedFormContextValue | null>(null)

export function OptimizedFormProvider({ 
  children,
  initialValues = {}
}: { 
  children: React.ReactNode
  initialValues?: Record<string, any>
}) {
  const [values, setValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  const setValue = React.useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const setError = React.useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  const setTouched = React.useCallback((name: string, touched: boolean) => {
    setTouched(prev => ({ ...prev, [name]: touched }))
  }, [])

  const contextValue = React.useMemo(
    () => ({
      values,
      errors,
      touched,
      setValue,
      setError,
      setTouched
    }),
    [values, errors, touched, setValue, setError, setTouched]
  )

  return (
    <OptimizedFormContext.Provider value={contextValue}>
      {children}
    </OptimizedFormContext.Provider>
  )
}

export function useOptimizedForm() {
  const context = React.useContext(OptimizedFormContext)
  if (!context) {
    throw new Error("useOptimizedForm must be used within OptimizedFormProvider")
  }
  return context
}

/**
 * Batch form updates to reduce re-renders
 */
export function useBatchedFormUpdates() {
  const pendingUpdates = React.useRef<Array<() => void>>([])
  const rafId = React.useRef<number>()

  const batchUpdate = React.useCallback((update: () => void) => {
    pendingUpdates.current.push(update)
    
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }
    
    rafId.current = requestAnimationFrame(() => {
      const updates = pendingUpdates.current
      pendingUpdates.current = []
      
      // React 18 automatic batching handles this
      updates.forEach(fn => fn())
    })
  }, [])

  React.useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return batchUpdate
}