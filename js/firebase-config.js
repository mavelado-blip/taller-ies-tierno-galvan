// ✅ Configuración de Firebase (ajusta con tus claves del panel)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "taller-ies.firebaseapp.com",
  projectId: "taller-ies",
  storageBucket: "taller-ies.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXX"
};

// ✅ Inicializar Firebase
firebase.initializeApp(firebaseConfig);
console.log("✅ Firebase configurado correctamente");
