import { type Data } from "~/generated/data";

/**
 * Helper type to extend page props with SharedProps
 * Use this for all page components to automatically include shared props
 */
export type PageProps<T = {}> = T & Data.SharedProps;

/**
 * Breadcrumb item for navigation
 */
export interface BreadcrumbItem {
  title: string;
  href?: string;
}

/**
 * Navigation item for menus and sidebars
 */
export interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}
