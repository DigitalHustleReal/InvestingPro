import { NAVIGATION_CONFIG, NavigationCategory } from "./config";

/**
 * Navigation Service
 * Returns the navigation structure from static config.
 * DB-driven ordering can be added in Phase 2 via a `navigation_nodes` table.
 */
export async function getNavigation(): Promise<NavigationCategory[]> {
  return NAVIGATION_CONFIG;
}
