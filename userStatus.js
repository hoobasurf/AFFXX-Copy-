import { getDatabase, ref, onDisconnect, update } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "./firebase.js";

const db = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if(user){
    const userRef = ref(db, "users/" + user.uid);

    // ✅ Mettre online à true ET lastActive en même temps
    update(userRef, {
      online: true,
      lastActive: Date.now()  // <- ici
    });

    // Quand l'utilisateur se déconnecte ou ferme le navigateur
    onDisconnect(userRef).update({
      online: false,
      lastActive: Date.now()
    });
  }
});
