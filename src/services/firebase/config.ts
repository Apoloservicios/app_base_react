import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase - REEMPLAZA CON TUS CREDENCIALES
const firebaseConfig = {
  apiKey: "AIzaSyD43uNhtAKMTEbjPtQBId67MnrKL81axXg",
  authDomain: "sisgimnasio.firebaseapp.com",
  projectId: "sisgimnasio",
  storageBucket: "sisgimnasio.firebasestorage.app",
  messagingSenderId: "434544305726",
  appId: "1:434544305726:web:676b935206eb174ecf136f",
  measurementId: "G-W89SRSVT3D"
};

// Inicializar Firebase solo si no hay apps inicializadas
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Inicializar Auth (la persistencia está habilitada por defecto en React Native)
const auth = getAuth(app);

// Inicializar Firestore
const db = getFirestore(app);

// Inicializar Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;


