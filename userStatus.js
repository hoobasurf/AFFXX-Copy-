import { getDatabase, ref, onDisconnect, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "./firebase.js";

const db = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if(user){
    const userStatusRef = ref(db, "users/" + user.uid + "/online");
    
    // Mettre online à true
    set(userStatusRef, true);

    // Quand l'utilisateur se déconnecte ou ferme le navigateur
    onDisconnect(userStatusRef).set(false);
  }
});
