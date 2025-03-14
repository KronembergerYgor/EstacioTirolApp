// Importando o Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHCCbVgrEfMvD67ex8NkOLNUd1u6jmd6Y",
  authDomain: "projetoestacio-de66c.firebaseapp.com",
  projectId: "projetoestacio-de66c",
  storageBucket: "projetoestacio-de66c.firebasestorage.app",
  messagingSenderId: "668293123607",
  appId: "1:668293123607:web:854ab0b5c6be8353731652"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando o Auth
const auth = getAuth(app);

// Inicializando o Firestore
const db = getFirestore(app);

// Funções de autenticação
const loginWithEmailAndPassword = async (email, password) => {
  let status = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Usuário logado com sucessso!")
  } catch (error) {
    if (error instanceof Error) {
      if(error.message.includes('Error (auth/invalid-credential).') || error.message.includes('Firebase: Error (auth/wrong-password).')){ 
        error.message = "Login ou Senha Inválidos, verifique as informações digitadas"
      }

      if(error.message.includes('Firebase: Error (auth/user-not-found).')){
        error.message = "Usuário não Cadastrado"
      }

      alert(error.message)
      status = false;
      
    }
    
  }

  return status;

};

const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // console.log('Usuário registrado:', userCredential.user);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
  }
};

const sendVerificationEmail = async (user) => {
  if (!user.emailVerified) {
      try {
          await sendEmailVerification(user);
          alert("Um e-mail de verificação foi enviado. Por favor, verifique seu e-mail.");
      } catch (error) {
          console.error("Erro ao enviar o e-mail de verificação:", error);
          alert("Erro ao enviar o e-mail de verificação: " + error.message);
      }
  } else {
      alert("O e-mail já foi verificado.");
  }
};

export { auth, db, loginWithEmailAndPassword, registerWithEmailAndPassword, sendVerificationEmail };
