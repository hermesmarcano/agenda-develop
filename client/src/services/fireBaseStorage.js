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

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_APIKEY,
//   authDomain: process.env.FIREBASE_AUTHDOMAIN,
//   projectId: process.env.FIREBASE_PROJECTID,
//   storageBucket: process.env.FIREBASE_STORAGEBUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
//   appId: process.env.FIREBASE_APPID
// };


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);