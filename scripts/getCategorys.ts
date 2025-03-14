import { db } from '../firebase'; // Certifique-se de importar a instância correta do Firebase
import { collection, getDocs  } from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react'; // Importar os tipos para a função de setState

// Atualize o getCategorys para usar setCategories corretamente
const getCategorys = async (setCategories: Dispatch<SetStateAction<{ name: string; iconName: string; value: string }[]>>) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Categorys'));
      const categoriesList = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        iconName: doc.data().iconName || '', 
        value: doc.id || '' 
      }));
      setCategories(categoriesList); // Atualize o estado aqui
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
};

  export default getCategorys;
