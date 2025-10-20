// firebase.js (version modulaire - à utiliser avec <script type="module">)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  onIdTokenChanged,
  signOut
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

/* ---------- Fonction utilitaire pour vider la session locale ----------
   (utile sur iPhone / Safari quand IndexedDB / localStorage garde une session)
   On ne l'exécute PAS automatiquement au chargement pour éviter des effets de bord :
   tu peux l'appeler manuellement ou via le bouton "Réinitialiser".
*/
function clearLocalSession() {
  try {
    // supprime la base où Firebase stocke ses données locales
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  } catch (e) {
    console.warn("Erreur suppression IndexedDB (peut être normal) :", e);
  }

  try {
    localStorage.clear();
  } catch (e) {
    console.warn("Erreur suppression localStorage :", e);
  }

  console.log("🧹 Cache local Firebase supprimé (si présent)");
}

/* ---------- Fonction pour forcer la déconnexion et vider le cache
   (utile en debug ou pour un bouton sur mobile) */
async function forceLogoutAndClear() {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn("Erreur lors de la déconnexion :", e);
  }
  clearLocalSession();
  // recharge la page pour refléter l'état (optionnel)
  try { window.location.reload(); } catch {}
}

/* ---------- Initialisation de l'auth et listeners ---------- */
async function initAuth() {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("✅ Persistance activée (browserLocalPersistence)");
  } catch (e) {
    console.error("Erreur de persistance:", e);
  }

  // Surveille l'état de l'utilisateur. NE redirige PAS automatiquement ici :
  // laisse chaque page décider de la redirection (évite les boucles).
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Utilisateur connecté :", user.email ?? user.uid);
      // ici tu peux charger des données liées à l'utilisateur
    } else {
      console.log("Aucun utilisateur connecté");
      // Par exemple, page2.html peut rediriger vers inscription.html si pas d'user.
    }
  });

  // Si le token est invalide, on force la déconnexion proprement
  onIdTokenChanged(auth, async (user) => {
    if (!user) return;
    try {
      // forcer refresh token pour valider
      await user.getIdToken(true);
    } catch (e) {
      console.warn("Token invalide — déconnexion forcée", e);
      try { await signOut(auth); } catch (err) { console.error(err); }
      clearLocalSession();
    }
  });
}

/* Lancer l'init au chargement du module */
initAuth().catch(e => console.error("Erreur initAuth:", e));

/* Rendre certaines fonctions accessibles globalement (utile pour boutons dans HTML) */
window.forceLogoutAndClear = forceLogoutAndClear;
window.clearLocalSession = clearLocalSession;

/* ---------- Exports (si tu veux importer ce module ailleurs) ---------- */
export { app, auth, clearLocalSession, forceLogoutAndClear };
