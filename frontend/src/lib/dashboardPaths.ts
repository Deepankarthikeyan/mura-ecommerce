export const USER_DASHBOARD_PREFIX = "/user-dashboard";
export const STAFF_DASHBOARD_PREFIX = "/staff-dashboard";

/** Accepted userType values on Mongo users */
export const USER_TYPES = ["customer", "staff", "admin"] as const;
export type UserType = (typeof USER_TYPES)[number];

/** Default first screen after login / dashboard root redirect */
export const USER_DASHBOARD_LANDING = `${USER_DASHBOARD_PREFIX}/order`;
export const STAFF_DASHBOARD_LANDING = `${STAFF_DASHBOARD_PREFIX}/inventory`;

export function isStaffLike(userType?: string | null): boolean {
  return userType === "staff" || userType === "admin";
}

export function isAdmin(userType?: string | null): boolean {
  return userType === "admin";
}

export function normalizeUserType(userType?: string | null): UserType {
  if (userType === "staff" || userType === "admin" || userType === "customer") {
    return userType;
  }
  return "customer";
}

export function userTypeLabel(userType?: string | null): string {
  const type = normalizeUserType(userType);
  if (type === "admin") return "Admin";
  if (type === "staff") return "Staff";
  return "Customer";
}

export function getDashboardPrefix(userType?: string | null): string {
  return isStaffLike(userType) ? STAFF_DASHBOARD_PREFIX : USER_DASHBOARD_PREFIX;
}

export function dashboardLandingPath(userType?: string | null): string {
  return isStaffLike(userType) ? STAFF_DASHBOARD_LANDING : USER_DASHBOARD_LANDING;
}
