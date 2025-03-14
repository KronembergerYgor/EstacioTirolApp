import { StyleSheet, View, useColorScheme, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import Button from '../components/Button';
import CardCommerce from '../components/CardCommerce';
import { useRouter } from 'expo-router';
import InputSearch from '../components/inputSearch';
import getMyCommercers from '../scripts/getMyCommercers';
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

export default function MyCommerces() {
  const navigation = useNavigation();
  const theme = useColorScheme();
  const [commerces, setCommerces] = useState<Commerce[]>([]);
  const [lastDoc, setLastDoc] = useState(null); // Para controlar a página
  // const [loading, setLoading] = useState(false); // Estado de carregamento
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;  // Número de comércios por página
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(''); // Estado para armazenar a consulta de pesquisa
  const [filteredCommerces, setFilteredCommerces] = useState<Commerce[]>([]); // Estado para armazenar os resultados filtrados

  // Filtrar comércios com base no texto de pesquisa
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCommerces(commerces);
    } else {
      const filtered = commerces.filter((commerce) =>
        commerce.commerceName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommerces(filtered);
    }
  }, [searchQuery, commerces]); // A consulta vai ser atualizada sempre que 'searchQuery' ou 'commerces' mudar

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={[styles.title, { textAlign: 'right', marginRight: 15, color: theme === 'dark' ? '#ffffff' : '#000' }]}>
          Meus Comércios
        </Text>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const loadCommerces = async () => {

      const pageSize = itemsPerPage; // Tamanho da página

      try {
        const { commerces: newCommerces, lastVisible } = await getMyCommercers(lastDoc, pageSize);
        
        if (newCommerces.length > 0) {
          setCommerces((prevCommerces) => [...prevCommerces, ...newCommerces]);
          setLastDoc(lastVisible); // Atualiza a referência para o próximo lote de dados
        }
      } catch (error) {
        console.error("Erro ao carregar comércios:", error);
      }
    };
    loadCommerces();
  }, [lastDoc]); // Vai ser chamado quando `lastDoc` ou `loading` mudar

  // Paginação - Pega os comércios da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommerces = filteredCommerces.slice(indexOfFirstItem, indexOfLastItem);

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

  const deleteCommerce = (id: string) => {
    // Exibe o pop-up de confirmação
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
              // Referência ao documento no Firestore
              const docRef = doc(db, 'Commerces', id);
  
              // Exclui o documento
              await deleteDoc(docRef);
  
              // Exibe um alerta de sucesso
              Alert.alert('Sucesso', 'Comércio excluído com sucesso!');
  
              // Redireciona ou atualiza a página, conforme necessário
              router.push('/myCommerces'); // Redireciona para a página principal
            } catch (error) {
              // Exibe erro, caso ocorra
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
      
        {/* Barra de pesquisa e botão para adicionar comércio */}
        <View style={styles.boxHead}>
            <Button 
                nameIcon='plus'
                titeButton= 'Cadastrar'
                handlePress={() => router.push('/registerCommerces')} 
                colorDark='#c1d1fb' 
                colorLigth='rgb(28 39 117)' 
                shadowColorResult={true} 
                colorTextLigth="#ffffff"
                colorTextDark="#000"
                paddingValue = {10}
                fontSizeButton = {10}     
                marginTopValue= {0}
                marginLeftValue= {0}
                marginRightValue= {5}
            />

              {/* Barra de pesquisa */}
                  <InputSearch 
                    widthInput='70%' 
                    placeholder='Nome comércio' 
                    marginBottomValue= {0}
                    marginTopValue= {0}
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
              handleDelete={() => deleteCommerce(commerce.id)}

            />
          ))
        )}
      </ScrollView>

      {/* Botões de navegação de página */}
      {filteredCommerces.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={prevPage} style={[styles.paginationButton, { backgroundColor: currentPage === 1 ? '#ccc' : '#007bff' }]}>
            <Text style={[styles.paginationText, { color: theme === 'dark' ? '#ffffff' : '#000'}]}>Anterior</Text>
          </TouchableOpacity>
          <Text style={[styles.paginationText, { color: theme === 'dark' ? '#ffffff' : '#000'}]}>Página {currentPage}</Text>
          <TouchableOpacity onPress={nextPage} style={[styles.paginationButton, { backgroundColor: currentPage >= Math.ceil(commerces.length / itemsPerPage) ? '#ccc' : '#007bff' }]}>
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
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    boxHead: {
        flexDirection: 'row',  // Ícone e texto lado a lado
        alignItems: 'center',  // Alinha verticalmente
        marginHorizontal: 50,
        marginTop:20,
        marginBottom:10
    },
});