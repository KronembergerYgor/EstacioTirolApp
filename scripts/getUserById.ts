import { doc, getDoc, collection, query, where, getDocs, DocumentData  } from "firebase/firestore";
import { db } from "../firebase"; // Importando a instância do Firestore

const getUserById = async (userUid: string): Promise<DocumentData | null> => {

    try {
        const usersRef = collection(db, "Users"); // Referência à coleção 'Users'
        const q = query(usersRef, where("uid", "==", userUid)); // Consultando o campo "uid"

        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            // Verifica se algum documento foi encontrado
            const userDoc = querySnapshot.docs[0].data(); // Pega os dados do primeiro documento
            // console.log("Usuário encontrado:", userDoc);
            return userDoc; // Retorna os dados do usuário
        } else {
            // console.log("Usuário não encontrado.");
            return null; // Retorna null caso não encontre
        }
    } catch (error) {
        // console.error("Erro ao buscar usuário:", error);
        return null; // Retorna null em caso de erro
    }
};

export default getUserById;
