// firebase.js (version modulaire - compatible iPhone / Safari / Android / Windows)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

/* ---------- CONFIG ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyAbI0fvcv9lIzpPViVBx2BlO8c6L3w-rbc",
  authDomain: "affxx-copy.firebaseapp.com",
  databaseURL: "https://affxx-copy-default-rtdb.firebaseio.com",
  projectId: "affxx-copy",
  storageBucket: "affxx-copy.appspot.com",
  messagingSenderId: "763273288933",
  appId: "1:763273288933:web:d0083f5f6ab7284661c80c"
};

/* ---------- INITIALISATION ---------- */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ---------- Persistance locale pour Safari/iPhone/Android/Windows ---------- */
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Session Firebase persistée localement"))
  .catch(e => console.error("Erreur persistance :", e));

/* ---------- Fonction pour vider cache local Firebase ---------- */
function clearLocalSession() {
  try {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    localStorage.clear();
    sessionStorage.clear();
    console.log("🧹 Cache Firebase local supprimé");
  } catch (e) {
    console.warn("Erreur suppression cache :", e);
  }
}

/* ---------- Déconnexion complète et nettoyage ---------- */
async function forceLogoutAndClear() {
  try { await signOut(auth); } catch (e) { console.warn("Erreur déconnexion :", e); }
  clearLocalSession();
  try { window.location.reload(); } catch {}
}

/* ---------- Suivi de l’état utilisateur ---------- */
onAuthStateChanged(auth, (user) => {
  if (user) console.log("👤 Utilisateur connecté :", user.email ?? user.uid);
  else console.log("🚫 Aucun utilisateur connecté");
});

onIdTokenChanged(auth, async (user) => {
  if (!user) return;
  try { await user.getIdToken(true); }
  catch (e) {
    console.warn("Token invalide — déconnexion forcée");
    try { await signOut(auth); } catch {}
    clearLocalSession();
  }
});

/* ---------- Correctif iPhone/Safari : email déjà utilisé localement ---------- */
async function fixEmailAlreadyInUse(auth, email, password, createUserFn) {
  try {
    return await createUserFn(auth, email, password);
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      console.warn("⚠️ Email bloqué localement. Réinitialisation du cache...");
      clearLocalSession();
      // Réessayer automatiquement une seule fois
      return await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const result = await createUserFn(auth, email, password);
            resolve(result);
          } catch (err2) {
            reject(err2);
          }
        }, 1200);
      });
    } else {
      throw e;
    }
  }
}

/* ---------- Exports ---------- */
window.forceLogoutAndClear = forceLogoutAndClear;
window.clearLocalSession = clearLocalSession;
window.fixEmailAlreadyInUse = fixEmailAlreadyInUse;

export { app, auth, clearLocalSession, forceLogoutAndClear, fixEmailAlreadyInUse };
