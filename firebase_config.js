import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, addDoc, getDoc, getDocs, collection, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCO0vCwWyMnOngX4xj7_8i8LgXRIPPSSkM",
    authDomain: "todo-demo-d566e.firebaseapp.com",
    projectId: "todo-demo-d566e",
    storageBucket: "todo-demo-d566e.appspot.com",
    messagingSenderId: "691114655729",
    appId: "1:691114655729:web:324a45980918712555ce50",
    measurementId: "G-FZ0NJ7VEK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export {
    app,
    db,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    collection,
    updateDoc,
    deleteDoc
}