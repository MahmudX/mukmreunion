import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCODofw0J0IzzLt15hIFTp9K2worFBpOoE",
    authDomain: "mukmreunion.firebaseapp.com",
    projectId: "mukmreunion",
    storageBucket: "mukmreunion.appspot.com",
    messagingSenderId: "1000386570270",
    appId: "1:1000386570270:web:3072edb84013a0391da60f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
