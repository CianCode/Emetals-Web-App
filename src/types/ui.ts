/**
 * User role types for access control
 */
export type UserRole = "user" | "admin";

/**
 * User profile information for UI display
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  createdAt: Date;
  emailVerified: boolean;
}

/**
 * Navigation item structure
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  requiresRole?: UserRole;
  badge?: string | number;
}

/**
 * Dropdown menu item
 */
export interface DropdownItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "destructive";
  separator?: boolean;
}
