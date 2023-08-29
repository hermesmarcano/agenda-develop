import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA1tn-w8aHRTNf7YGmdi7IewFeEjZn008s",
  authDomain: "agenda-image-upload.firebaseapp.com",
  projectId: "agenda-image-upload",
  storageBucket: "agenda-image-upload.appspot.com",
  messagingSenderId: "24995092287",
  appId: "1:24995092287:web:97203200e3ba22646e258a"
};

const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app);