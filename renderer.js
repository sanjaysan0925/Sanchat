// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  push, 
  onChildAdded 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Config
const firebaseConfig = {
   apiKey: "AIzaSyBVQ0bMyjMEWODH9tXAvhm7SpuhyKVKyRA",
  authDomain: "sanchat-ad9e6.firebaseapp.com",
  databaseURL: "https://sanchat-ad9e6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sanchat-ad9e6",
  storageBucket: "sanchat-ad9e6.firebasestorage.app",
  messagingSenderId: "885908522846",
  appId: "1:885908522846:web:669884fb5ce2dd681231cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- AUTH FUNCTIONS ---

window.signUp = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("authError");

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    errorBox.innerText = "";
    alert("✅ Account created successfully!");
  } catch (error) {
    errorBox.innerText = error.message;
  }
};

window.login = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("authError");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    errorBox.innerText = "";
    alert("✅ Logged in successfully!");
  } catch (error) {
    errorBox.innerText = error.message;
  }
};

window.logout = async function() {
  try {
    await signOut(auth);
    alert("✅ Logged out successfully!");
  } catch (error) {
    alert("❌ Logout error: " + error.message);
  }
};

// Track auth state
onAuthStateChanged(auth, user => {
  if(user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("chat-section").style.display = "block";
    loadMessages();
  } else {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("chat-section").style.display = "none";
  }
});

// --- CHAT FUNCTIONS ---

window.sendMessage = async function() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if(!text) return;

  try {
    await push(ref(db, "messages"), {
      text: text,
      user: auth.currentUser.email,
      time: new Date().toLocaleTimeString()
    });
    input.value = "";
  } catch(error) {
    alert("❌ Error sending message: " + error.message);
  }
};

function loadMessages() {
  const messagesRef = ref(db, "messages");
  const messagesDiv = document.getElementById("messages");

  onChildAdded(messagesRef, snapshot => {
    const msg = snapshot.val();
    const p = document.createElement("p");
    p.textContent = `${msg.user} (${msg.time}): ${msg.text}`;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}
