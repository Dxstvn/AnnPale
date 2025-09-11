/**
 * Data Access Layer (DAL) - Central export point
 * 
 * Following SOTA 2025 patterns:
 * - Server-only operations (no client-side data fetching)
 * - DTOs to control data exposure
 * - Proper authorization checks
 * - Cached operations for performance
 * - No middleware dependency
 */

// Auth DAL
export {
  getCurrentUser,
  getSession,
  requireAuth,
  requireRole,
  requireCreator,
  requireAdmin,
  canAccessResource,
  signOut,
  getUserStats,
  refreshSession,
  verifyEmail,
  isAuthenticated,
  getUserSubscriptions,
  hasCreatorAccess,
  type UserDTO,
  type SessionDTO,
} from './auth.dal'

// Orders DAL
export {
  getUserOrders,
  getCreatorOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  cancelOrder,
  type OrderDTO,
} from './orders.dal'

// Profiles DAL
export {
  getProfileById,
  getCreatorProfile,
  updateProfile,
  getFeaturedCreators,
  searchCreators,
  getCreatorsByCategory,
  getTopCreators,
  canEditProfile,
  type ProfileDTO,
  type CreatorProfileDTO,
} from './profiles.dal'