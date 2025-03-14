import { collection, getDocs, query, orderBy, limit, startAfter, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Certifique-se de importar a instância correta do Firebase

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

// Função de busca de comércios com paginação
const getAllCommercers = async (lastDoc: any, pageSize: number, commerceId?: string): Promise<{ commerces: Commerce[], lastVisible: any }> => {
  try {
    // Buscar as categorias com seus ícones
    const categories = await getCategories();

    // Referência para a coleção de comércios no Firestore
    const commercesRef = collection(db, 'Commerces');

    let q;

    if (commerceId) {
      // Se o commerceId foi passado, buscar um comércio específico pelo id
      const commerceDoc = doc(commercesRef, commerceId);
      const docSnapshot = await getDoc(commerceDoc);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const category = data?.category;

        // Procurar o ícone da categoria com base no nome da categoria
        const categoryData = categories.find((cat) => cat.name === category);
        const iconName = categoryData ? categoryData.iconName : 'default-icon'; // Caso não encontre, usa o ícone padrão

        const commerce: Commerce = {
          id: docSnapshot.id,
          commerceName: data?.commerceName || '', // Garantir que todos os campos obrigatórios sejam preenchidos
          category: data?.category || '',
          whatsApp: data?.whatsApp || '',
          owner: data?.owner || '',
          address: data?.address || '',
          description: data?.description || '',
          createdAt: data?.createdAt?.toDate() || new Date(), // Ajuste para garantir que a data seja um objeto Date
          User_created: data?.User_created || '',
          iconName,
        };

        return { commerces: [commerce], lastVisible: null }; // Retorna o comércio encontrado
      } else {
        return { commerces: [], lastVisible: null }; // Retorna vazio se não encontrar o documento
      }
    } else {
      // Cria a consulta básica para ordenar por 'createdAt' e limitar o número de resultados
      q = query(commercesRef, orderBy('createdAt'), limit(pageSize));

      // Se 'lastDoc' é fornecido, usamos 'startAfter' para buscar os próximos itens após o último documento
      if (lastDoc) {
        q = query(commercesRef, orderBy('createdAt'), startAfter(lastDoc), limit(pageSize));
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
    }
  } catch (error) {
    console.error('Erro ao buscar comércios com paginação: ', error);
    return { commerces: [], lastVisible: null };
  }
};

export default getAllCommercers;
