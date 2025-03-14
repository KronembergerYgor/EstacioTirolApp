import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Certifique-se de importar a instância correta do Firebase

// Definir a interface do Comércio
interface Commerce {
  id: string;
  commerceName: string;
  category: string;
  whatsApp: string;
  owner: string;
  address: string;
  description: string;
  createdAt: Date;
  User_created: string;
  iconName: string; // Adicionando o campo iconName
}

// Definir a interface para as categorias
interface Category {
  name: string;
  iconName: string;
}

// Função para buscar todas as categorias e seus ícones
const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'Categorys');
    const querySnapshot = await getDocs(categoriesRef);

    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({ name: doc.id, iconName: doc.data().iconName });
    });

    return categories;
  } catch (error) {
    console.error('Erro ao buscar categorias: ', error);
    return [];
  }
};

// Função para buscar os comércios com paginação
const getMyCommercers = async (lastDoc: any, pageSize: number): Promise<{ commerces: Commerce[], lastVisible: any }> => {
  try {
    // Verificar se o usuário está autenticado
    const user = auth.currentUser;

    if (!user) {
      console.error('Usuário não autenticado');
      return { commerces: [], lastVisible: null };
    }

    // Obter o UID do usuário logado
    const userId = user.uid;

    // Buscar as categorias com seus ícones
    const categories = await getCategories();

    // Referência para a coleção de comércios no Firestore
    const commercesRef = collection(db, 'Commerces');

    let q;

    // Se 'lastDoc' é fornecido, usamos 'startAfter' para buscar os próximos itens após o último documento
    if (lastDoc) {
      q = query(commercesRef, where('user_created', '==', userId), orderBy('createdAt'), startAfter(lastDoc), limit(pageSize));
    }else{
      // Cria a consulta básica para ordenar por 'createdAt' e limitar o número de resultados
      q = query(commercesRef, where('user_created', '==', userId), orderBy('createdAt'), limit(pageSize));
    }

    // Obter os documentos da coleção "Commerces"
    const querySnapshot = await getDocs(q);

    // Armazenar os resultados
    const commerces: Commerce[] = [];
    let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]; // Último documento da consulta

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const category = data.category;

      // Procurar o ícone da categoria com base no nome da categoria
      const categoryData = categories.find((cat) => cat.name === category);
      const iconName = categoryData ? categoryData.iconName : 'default-icon'; // Caso não encontre, usa o ícone padrão

      commerces.push({
        id: doc.id,
        ...data,
        iconName, // Adicionando o iconName ao comércio
      } as Commerce);
    });

    // Retornar os comércios encontrados e o último documento para a próxima página
    return { commerces, lastVisible };
  } catch (error) {
    console.error('Erro ao buscar comércios com paginação: ', error);
    return { commerces: [], lastVisible: null };
  }
};

export default getMyCommercers;
