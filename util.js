import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export function handlesuccess(msg) {
  toast.success(msg, {
    position: "top-right",
  });
}

export function handleerror(msg) {
  toast.error(msg, {
    position: "top-right",
  });
}

export function isTokenExpired(token) {
  try {
    if (!token) return true; // Treat missing token as expired

    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decoded.exp < currentTime) {
      toast.error("Token has expired", {
        position: "top-right",
      });
      return true; // ✅ Token is expired
    }

    return false; // ✅ Token is still valid
  } catch (error) {
    toast.error("Invalid token", { position: "top-right" });
    return true; // Treat invalid tokens as expired
  }
}
