import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDKVrqShH9dmRmkvMcPkOho0wnGrxED-BE",
  authDomain: "hercegovina-tours.firebaseapp.com",
  projectId: "hercegovina-tours",
  storageBucket: "hercegovina-tours.firebasestorage.app",
  messagingSenderId: "774348710921",
  appId: "1:774348710921:web:49d75294f1b154056f84d8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;