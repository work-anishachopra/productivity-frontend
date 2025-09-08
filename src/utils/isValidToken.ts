import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

/**
 * Checks if a JWT token exists and is not expired.
 * Removes token from localStorage if invalid or expired.
 * @param token - JWT token string or null
 * @returns boolean indicating if token is valid
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
}
