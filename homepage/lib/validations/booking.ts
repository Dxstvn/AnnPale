import { z } from "zod"

// Step 1: Occasion Selection
export const occasionSchema = z.object({
  occasion: z.string().min(1, "Please select an occasion"),
  customOccasion: z.string().optional(),
  recipient: z.string().min(1, "Recipient name is required").max(100, "Name is too long"),
})

// Step 2: Message Details  
export const messageSchema = z.object({
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
  pronunciation: z.string().max(200, "Pronunciation help is too long").optional(),
  additionalNotes: z.string().max(500, "Additional notes are too long").optional(),
})

// Step 3: Gift Options
export const giftSchema = z.object({
  isGift: z.boolean(),
  giftFrom: z.string().optional(),
  giftMessage: z.string().max(500, "Gift message is too long").optional(),
  giftDeliveryMethod: z.enum(["email", "link"]).optional(),
  recipientEmail: z.string().email("Invalid email address").optional(),
}).refine(
  (data) => {
    if (data.isGift && data.giftDeliveryMethod === "email") {
      return !!data.recipientEmail
    }
    return true
  },
  {
    message: "Recipient email is required for email delivery",
    path: ["recipientEmail"],
  }
)

// Step 4: Delivery Options
export const deliverySchema = z.object({
  rushDelivery: z.boolean(),
  deliveryDate: z.date().optional(),
  scheduledDate: z.date().optional(),
  sendReminders: z.boolean().default(true),
})

// Step 5: Payment Processing
export const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "paypal", "apple", "google"]),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  
  // Card details (only required if payment method is card)
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  cardName: z.string().optional(),
}).refine(
  (data) => {
    if (data.paymentMethod === "card") {
      return !!(data.cardNumber && data.cardExpiry && data.cardCvv && data.cardName)
    }
    return true
  },
  {
    message: "Card details are required",
    path: ["cardNumber"],
  }
)

// Complete booking schema combining all steps
export const completeBookingSchema = z.object({
  creatorId: z.string(),
  ...occasionSchema.shape,
  ...messageSchema.shape,
  ...giftSchema.shape,
  ...deliverySchema.shape,
  ...paymentSchema.shape,
})

// Type exports
export type OccasionData = z.infer<typeof occasionSchema>
export type MessageData = z.infer<typeof messageSchema>
export type GiftData = z.infer<typeof giftSchema>
export type DeliveryData = z.infer<typeof deliverySchema>
export type PaymentData = z.infer<typeof paymentSchema>
export type CompleteBookingData = z.infer<typeof completeBookingSchema>

// Validation helpers
export const validateStep = (step: number, data: any) => {
  switch (step) {
    case 1:
      return occasionSchema.safeParse(data)
    case 2:
      return messageSchema.safeParse(data)
    case 3:
      return giftSchema.safeParse(data)
    case 4:
      return deliverySchema.safeParse(data)
    case 5:
      return paymentSchema.safeParse(data)
    default:
      return { success: true }
  }
}

// Error message translations
export const errorMessages = {
  en: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    messageTooShort: "Message must be at least 10 characters",
    messageTooLong: "Message must be less than 500 characters",
    nameTooLong: "Name is too long",
    invalidCard: "Please enter valid card details",
  },
  fr: {
    required: "Ce champ est requis",
    invalidEmail: "Veuillez entrer une adresse email valide",
    messageTooShort: "Le message doit contenir au moins 10 caractères",
    messageTooLong: "Le message doit contenir moins de 500 caractères",
    nameTooLong: "Le nom est trop long",
    invalidCard: "Veuillez entrer des détails de carte valides",
  },
  ht: {
    required: "Chan sa a obligatwa",
    invalidEmail: "Tanpri antre yon adrès imel ki valab",
    messageTooShort: "Mesaj la dwe gen omwen 10 karaktè",
    messageTooLong: "Mesaj la dwe gen mwens pase 500 karaktè",
    nameTooLong: "Non an twò long",
    invalidCard: "Tanpri antre detay kat ki valab",
  }
}