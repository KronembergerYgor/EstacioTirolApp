import { StyleSheet, View, useColorScheme, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import ButtonRounded from '../components/ButtonRounded';
import CardCommerce from '../components/CardCommerce';
import { useRouter } from 'expo-router';
import InputSearch from '../components/inputSearch';
import getAllCommercers from '../scripts/getAllCommercers';
import getCategorys from '../scripts/getCategorys';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

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

export default function SearchTrade() {
  const navigation = useNavigation();
  const theme = useColorScheme();
  const router = useRouter();

  const [categorys, setCategories] = useState<{ name: string; iconName: string; value: string }[]>([]);
  const [commerces, setCommerces] = useState<Commerce[]>([]);
  const [filteredCommerces, setFilteredCommerces] = useState<Commerce[]>([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingCommerces, setIsLoadingCommerces] = useState(false);

  const itemsPerPage = 4;

  // Cabeçalho da navegação
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={[styles.title, { textAlign: 'right', marginRight: 15, color: theme === 'dark' ? '#ffffff' : '#000' }]}>
          Buscar Comércio
        </Text>
      ),
    });
  }, [navigation, theme]);

  // Carrega os comércios quando há mudanças no lastDoc
  useEffect(() => {
    const loadCommerces = async () => {
      if (loading) return;
      setIsLoadingCommerces(true);
      const pageSize = itemsPerPage;
      try {
        const { commerces: newCommerces, lastVisible } = await getAllCommercers(lastDoc, pageSize);
        if (newCommerces.length > 0) {
          setCommerces((prevCommerces) => [...prevCommerces, ...newCommerces]);
          setLastDoc(lastVisible);
        }
      } catch (error) {
        console.error('Erro ao carregar comércios:', error);
      } finally {
        setIsLoadingCommerces(false);
        setLoading(false);
      }
    };
    loadCommerces();
  }, [lastDoc, loading]);

  // Filtra os comércios com base na pesquisa e na categoria selecionada
  useEffect(() => {
    let filtered = commerces;
    if (searchQuery) {
      filtered = filtered.filter((commerce) =>
        commerce.commerceName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((commerce) => commerce.category === selectedCategory);
    }
    setFilteredCommerces(filtered);
  }, [searchQuery, commerces, selectedCategory]);

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommerces = filteredCommerces.slice(indexOfFirstItem, indexOfLastItem);

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

  // Carrega as categorias
  useEffect(() => {
    getCategorys((categorys) => {
      const firstFourCategories = Array.isArray(categorys) ? categorys.slice(0, 4) : [];
      setCategories(firstFourCategories);
    });
  }, []);

  // Alterna o filtro de categoria
  const toggleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  // Exclui um comércio
  const deleteCommerce = (id: string) => {
    Alert.alert(
      'Confirmação de exclusão',
      'Você tem certeza que deseja excluir este comércio?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Exclusão cancelada'),
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const docRef = doc(db, 'Commerces', id);
              await deleteDoc(docRef);
              Alert.alert('Sucesso', 'Comércio excluído com sucesso!');
              router.push('/searchTrade');
            } catch (error) {
              console.error('Erro ao excluir o comércio:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o comércio. Tente novamente.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#353636' : '#D0D0D0', shadowColor: theme === 'dark' ? '#fff' : '#000' }]}>
      <InputSearch placeholder='Pesquise seu comércio' onSearch={(query) => setSearchQuery(query)} />

      <View style={styles.styleButton}>
        {categorys.length > 0 && categorys.slice(0, 4).map((category, index) => (
          <ButtonRounded
            key={index}
            nameButton={category.name}
            nameIcon={category.iconName}
            sizeIcon={15}
            handlePress={() => toggleCategoryFilter(category.value)}
          />
        ))}
        <ButtonRounded nameButton='Ver todas' nameIcon='bars' sizeIcon={15} handlePress={() => router.push('/categoryPage')} />
      </View>

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
              handleDelete={() => deleteCommerce(commerce.id)}
            />
          ))
        )}
      </ScrollView>

      {isLoadingCommerces && <ActivityIndicator size="large" color="#007bff" />}

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
  styleButton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
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
});
