// Simple toast utility for mobile admin
export interface Toast {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function toast({ title, description, variant = "default" }: Toast) {
  // For now, just use console.log and setTimeout for a simple implementation
  // In a real app, this would integrate with a toast notification system
  const message = `${title ? title + ": " : ""}${description || ""}`
  
  if (variant === "destructive") {
    console.error("Error:", message)
  } else {
    console.log("Toast:", message)
  }
  
  // Show native notification if available
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title || "Notification", {
      body: description,
      icon: "/icon-192x192.png",
      tag: "admin-toast"
    })
  }
}