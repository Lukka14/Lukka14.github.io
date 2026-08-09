/**
 * Mirrors the server-side checks in AuthUtils (movieplus-back) so the client rejects
 * the same input the API would, instead of surfacing a 409 after a round trip.
 *
 * Keep these in sync with:
 *   src/main/java/me/luka/movieplus_back/auth/utils/AuthUtils.java
 */

/** AuthUtils.isValidEmail — note there is no `%` in the local part. */
export const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

/** AuthUtils.isValidUsername */
export const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;

/** AuthUtils.isValidPassword — length plus at least one letter. */
export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 50;
export const PASSWORD_LETTER_REGEX = /[A-Za-z]/;

export const isValidEmail = (value: string): boolean =>
  value.trim().length > 0 && EMAIL_REGEX.test(value);

export const isValidPassword = (value: string): boolean =>
  value.length >= PASSWORD_MIN &&
  value.length <= PASSWORD_MAX &&
  PASSWORD_LETTER_REGEX.test(value);

/**
 * The API answers registration problems with 409 and a body that may be a bare string
 * or an object, depending on the failure. Pull a usable message out of either shape.
 */
export const extractApiError = (error: any, fallback: string): string => {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }

  return data?.detail || data?.message || data?.error || fallback;
};
