import { StyleSheet, View, useColorScheme, Text, ScrollView } from 'react-native';
import { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import getCategorys from '../scripts/getCategorys';
import InputSearch from '../components/inputSearch';
import LineCategory from '../components/lineCategory';
import Separator from '../components/Separator';

export default function CategoryPage() {
  const navigation = useNavigation();
  const theme = useColorScheme();
  const router = useRouter();
  const [categorys, setCategories] = useState<{ name: string; iconName: string; value: string }[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<{ name: string; iconName: string; value: string }[]>([]); // Estado para categorias filtradas
  const [searchQuery, setSearchQuery] = useState(''); // Estado para armazenar a consulta de pesquisa

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={[styles.title, { textAlign: 'right', marginRight: 15, color: theme === 'dark' ? '#ffffff' : '#000' }]}>
          Categorias
        </Text> // Título à direita
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getCategorys(setCategories); // Chama getCategorys e passa setCategories para atualizar o estado
  }, []);

  // Filtrar categorias com base no texto de pesquisa
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCategories(categorys);
    } else {
      const filtered = categorys.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categorys]); // Atualiza sempre que a consulta ou as categorias mudarem

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#353636' : '#D0D0D0', shadowColor: theme === 'dark' ? '#fff' : '#000' }]}>
      {/* Barra de pesquisa */}
      <InputSearch
        placeholder="Pesquise sua categoria"
        onSearch={(query) => setSearchQuery(query)} // Passando a consulta para o estado
      />
      <ScrollView style={{ flex: 2 }}>
        <Separator />
        {filteredCategories.length === 0 ? (
          <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#000', marginTop: 15 }]}>
            Nenhuma categoria encontrada.
          </Text>
        ) : (
          filteredCategories.map((category, index) => (
     
            <View key={index}>
              <LineCategory
                nameIcon={category.iconName} // Usando o nome do ícone da categoria
                titleLine={category.name} // Usando o nome da categoria como título
                onPress={() => router.push(`/commercesForCategory?id=${category.value}&nameCategory=${category.name}&nameIcon=${category.iconName}`)}
              />
              <Separator />
            </View>
          ))
        )}
      </ScrollView>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    width: '80%',
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: '#fff',
    // Sombras no iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Sombra no Android
    elevation: 5,
  },
  icon: {
    marginRight: 8, // Espaço entre o ícone e o input
  },
  lineCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '80%',
  },
  textLine: {
    fontSize: 40,
  },
  iconRounded: {
    width: 60, // Tamanho do fundo redondo
    height: 60, // Tamanho do fundo redondo
    borderRadius: 40, // Para deixar o fundo redondo (50/2)
    backgroundColor: '#fff', // Cor do fundo
    justifyContent: 'center', // Alinha o ícone no centro
    alignItems: 'center', // Alinha o ícone no centro

    // Sombras no iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Sombra no Android
    elevation: 5,
  },
});
