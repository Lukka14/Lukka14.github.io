import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { openModal } from "../shared/modals/modal-utils";

/**
 * Sign-up lives in a modal now. Existing /register links land on the home page
 * with the sign-up modal already open. The modal itself is mounted outside the
 * router, so it survives this component redirecting away immediately.
 */
export default function RegisterRedirect() {
  useEffect(() => {
    openModal("registerModal");
  }, []);

  return <Navigate to="/" replace />;
}
