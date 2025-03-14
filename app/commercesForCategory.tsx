import { StyleSheet, View, useColorScheme, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';  // Corrigido para FontAwesome5
import CardCommerce from '../components/CardCommerce';
import InputSearch from '../components/inputSearch';
import getAllCommercers from '../scripts/getAllCommercers';

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
  iconName: string;
}

export default function CommercesForCategory() {
  const navigation      = useNavigation();
  const theme           = useColorScheme();
  const router          = useRouter();
  const itemsPerPage    = 4;  // Número de comércios por página

  const [commerces, setCommerces]                   = useState<Commerce[]>([]);
  const [filteredCommerces, setFilteredCommerces]   = useState<Commerce[]>([]); // Para armazenar os comércios filtrados
  const [lastDoc, setLastDoc]                       = useState<any>(null); // Para controlar a página (use 'any' por agora, até resolver a tipagem)
  const [searchQuery, setSearchQuery]               = useState(''); // Estado para armazenar a consulta de pesquisa
  const { id, nameCategory, nameIcon }              = useLocalSearchParams();
  const [categoryId, setCategoryId]                 = useState('');
  const [isLoadingCommerces, setIsLoadingCommerces] = useState(false); // Estado para o carregamento de comércios
  const [currentPage, setCurrentPage]               = useState(1); // Página atual para a paginação


  // Obtendo o parâmetro da URL para filtrar os comércios pela categoria
  useEffect(() => {
      const categoryId = id;
    // const { categoryId } = router.query;
    if (categoryId) {
      setCategoryId(categoryId as string); // Definindo o id da categoria com base na URL
    }
  }, [categoryId]);

  // Filtrar comércios com base no texto de pesquisa e na categoria
  useEffect(() => {
    if (categoryId) {
      // Filtra os comércios pela categoria e também pelo texto de pesquisa
      const filtered = commerces.filter((commerce) => 
        commerce.category === categoryId &&
        commerce.commerceName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommerces(filtered);
    } else {
      // Se não houver categoryId, retorna todos os comércios
      setFilteredCommerces(commerces);
    }
  }, [searchQuery, commerces, categoryId]); // A consulta vai ser atualizada sempre que 'searchQuery', 'commerces', ou 'categoryId' mudar
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={[styles.title, { textAlign: 'right', marginRight: 15, color: theme === 'dark' ? '#ffffff' : '#000' }]}>
           <Icon name={nameIcon ? nameIcon : 'store'} size={20} color="#fff" />  {nameCategory}
        </Text>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const loadCommerces = async () => {
      // if (loading) return;
      setIsLoadingCommerces(true);
      const pageSize = itemsPerPage;
      try {
        const { commerces: newCommerces, lastVisible } = await getAllCommercers(lastDoc, pageSize);
        if (newCommerces.length > 0) {
          setCommerces((prevCommerces) => [...prevCommerces, ...newCommerces]);
          setLastDoc(lastVisible);
        }
      } catch (error) {
        console.error("Erro ao carregar comércios:", error);
      } finally {
        setIsLoadingCommerces(false);
        // setLoading(false);
      }
    };
    loadCommerces();
  }, [lastDoc]);

  // Funções para navegação entre as páginas
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCommerces.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Paginação - Pega os comércios da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommerces = filteredCommerces.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#353636' : '#D0D0D0', shadowColor: theme === 'dark' ? '#fff' : '#000' }]}>
      {/* Barra de pesquisa */}
      <View style={styles.boxHead}>
        <InputSearch 
          widthInput='100%' 
          placeholder='Nome comércio' 
          marginBottomValue={0}
          marginTopValue={0}
          onSearch={(query) => setSearchQuery(query)} // Passando o valor da pesquisa
        />
      </View>

      {/* Lista de comércios */}
      <ScrollView style={{ flex: 1 }}>
        {filteredCommerces.length === 0 ? (
          <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#000', marginTop: 15 }]}>Nenhum comércio encontrado.</Text>
        ) : (
          currentCommerces.map((commerce, index) => (
            <CardCommerce
              key={index}
              nameIcon={commerce.iconName} 
              titleCard={commerce.commerceName} 
              value={commerce.id}
              handlePress={() => router.push(`/commerceDetail?id=${commerce.id}`)} 
              handleEdit={() => router.push(`/registerCommerces?id=${commerce.id}`)}
   
            />
          ))

            // handleEdit 
            // handleDelete

        )}
      </ScrollView>

      

      {/* Botões de navegação de página */}
      {filteredCommerces.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={prevPage} style={[styles.paginationButton, { backgroundColor: currentPage === 1 ? '#ccc' : '#007bff' }]}>
            <Text style={[styles.paginationText, { color: theme === 'dark' ? '#ffffff' : '#000' }]}>Anterior</Text>
          </TouchableOpacity>
          <Text style={[styles.paginationText, { color: theme === 'dark' ? '#ffffff' : '#000' }]}>Página {currentPage}</Text>
          <TouchableOpacity onPress={nextPage} style={[styles.paginationButton, { backgroundColor: currentPage >= Math.ceil(filteredCommerces.length / itemsPerPage) ? '#ccc' : '#007bff' }]}>
            <Text style={styles.paginationText}>Próxima</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  paginationText: {
    color: '#fff',
    fontSize: 16,
  },
  boxHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 50,
    marginTop: 20,
    marginBottom: 10,
  },
});
