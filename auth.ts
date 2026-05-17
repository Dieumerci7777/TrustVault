// ============================================================
//  TrustBridge – Auth Module
//  Handles: register, login, logout, password reset,
//           Google sign-in, session guard, role redirect
// ============================================================

import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ─────────────────────────────────────────────
//  REGISTER  (buyer or seller)
// ─────────────────────────────────────────────
export async function register({ name, email, password, role, phone, country, businessName, regNumber, category }) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid      = userCred.user.uid;

    // Set display name in Firebase Auth
    await updateProfile(userCred.user, { displayName: name || businessName });

    // Base user document
    const userData = {
      uid,
      name:      name || businessName,
      email,
      role,          // "buyer" | "seller"
      phone:     phone    || null,
      country:   country  || null,
      createdAt: serverTimestamp(),
      status:    role === "seller" ? "pending" : "active",  // sellers need approval
      verified:  false,
      avatar:    null
    };

    // Extra seller fields
    if (role === "seller") {
      Object.assign(userData, {
        businessName: businessName || null,
        regNumber:    regNumber    || null,
        category:     category     || null,
        rating:       0,
        totalSales:   0,
        escrowBalance: 0
      });
    }

    await setDoc(doc(db, "users", uid), userData);

    showToast("Account created successfully! " + (role === "seller" ? "Pending verification." : ""), "success");
    return { success: true, uid, role };

  } catch (err) {
    showToast(friendlyError(err.code), "error");
    return { success: false, error: err.code };
  }
}

// ─────────────────────────────────────────────
//  LOGIN
// ─────────────────────────────────────────────
export async function login(email, password) {
  try {
    const userCred  = await signInWithEmailAndPassword(auth, email, password);
    const userSnap  = await getDoc(doc(db, "users", userCred.user.uid));

    if (!userSnap.exists()) throw new Error("user-not-found");

    const user = userSnap.data();

    if (user.status === "suspended") {
      await signOut(auth);
      showToast("Your account has been suspended.", "error");
      return { success: false };
    }

    showToast(`Welcome back, ${user.name}!`, "success");

    // Role-based redirect
    setTimeout(() => {
      window.location.href = user.role === "seller" ? "dashboard.html" : "marketplace.html";
    }, 800);

    return { success: true, role: user.role };

  } catch (err) {
    showToast(friendlyError(err.code), "error");
    return { success: false, error: err.code };
  }
}

// ─────────────────────────────────────────────
//  GOOGLE SIGN-IN
// ─────────────────────────────────────────────
export async function signInWithGoogle(defaultRole = "buyer") {
  try {
    const provider   = new GoogleAuthProvider();
    const userCred   = await signInWithPopup(auth, provider);
    const uid        = userCred.user.uid;
    const userSnap   = await getDoc(doc(db, "users", uid));

    // First-time Google user → create profile
    if (!userSnap.exists()) {
      await setDoc(doc(db, "users", uid), {
        uid,
        name:      userCred.user.displayName,
        email:     userCred.user.email,
        role:      defaultRole,
        avatar:    userCred.user.photoURL,
        createdAt: serverTimestamp(),
        status:    "active",
        verified:  false
      });
    }

    const role = userSnap.exists() ? userSnap.data().role : defaultRole;
    showToast("Signed in with Google!", "success");

    setTimeout(() => {
      window.location.href = role === "seller" ? "dashboard.html" : "marketplace.html";
    }, 800);

    return { success: true };
  } catch (err) {
    showToast(friendlyError(err.code), "error");
    return { success: false };
  }
}

// ─────────────────────────────────────────────
//  LOGOUT
// ─────────────────────────────────────────────
export async function logout() {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (err) {
    showToast("Logout failed. Try again.", "error");
  }
}

// ─────────────────────────────────────────────
//  FORGOT PASSWORD
// ─────────────────────────────────────────────
export async function forgotPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    showToast("Reset link sent! Check your email.", "success");
    return { success: true };
  } catch (err) {
    showToast(friendlyError(err.code), "error");
    return { success: false };
  }
}

// ─────────────────────────────────────────────
//  SESSION GUARD
//  Call on protected pages.
//  role: "seller" | "buyer" | null (any logged-in user)
// ─────────────────────────────────────────────
export function requireAuth(role = null, redirectTo = "signup.html") {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = redirectTo;
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        window.location.href = redirectTo;
        return;
      }

      const userData = snap.data();

      if (role && userData.role !== role) {
        showToast("Access denied for your role.", "error");
        window.location.href = userData.role === "seller" ? "dashboard.html" : "marketplace.html";
        return;
      }

      resolve({ user, profile: userData });
    });
  });
}

// ─────────────────────────────────────────────
//  GET CURRENT USER PROFILE
// ─────────────────────────────────────────────
export async function getCurrentUserProfile() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) { resolve(null); return; }
      const snap = await getDoc(doc(db, "users", user.uid));
      resolve(snap.exists() ? { uid: user.uid, ...snap.data() } : null);
    });
  });
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function friendlyError(code) {
  const map = {
    "auth/email-already-in-use":    "This email is already registered.",
    "auth/invalid-email":           "Invalid email address.",
    "auth/weak-password":           "Password must be at least 6 characters.",
    "auth/user-not-found":          "No account found with this email.",
    "auth/wrong-password":          "Incorrect password.",
    "auth/too-many-requests":       "Too many attempts. Try again later.",
    "auth/network-request-failed":  "Network error. Check your connection.",
    "auth/popup-closed-by-user":    "Google sign-in was cancelled."
  };
  return map[code] || "Something went wrong. Please try again.";
}

export function showToast(message, type = "info") {
  // Remove any existing toast
  document.querySelectorAll(".tb-toast").forEach(t => t.remove());

  const colors = { success: "#2eff9b", error: "#ff6b6b", info: "#FFD700" };
  const toast  = document.createElement("div");

  toast.className = "tb-toast";
  toast.textContent = message;

  Object.assign(toast.style, {
    position:     "fixed",
    bottom:       "30px",
    right:        "30px",
    background:   "#111",
    color:        colors[type] || colors.info,
    border:       `1px solid ${colors[type] || colors.info}`,
    padding:      "14px 22px",
    borderRadius: "14px",
    fontWeight:   "700",
    fontSize:     "14px",
    zIndex:       "99999",
    boxShadow:    "0 10px 30px rgba(0,0,0,0.5)",
    animation:    "fadeUp 0.4s ease"
  });

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}