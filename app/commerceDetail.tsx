import { StyleSheet, View, useColorScheme, Text, ScrollView  } from 'react-native';
import { useLayoutEffect, useState, useEffect  } from 'react';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';  
import getAllCommercers from '../scripts/getAllCommercers';
import Separator from '../components/Separator';
import CardCommerceDetail from '@/components/CardCommerceDetail';

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
  iconName: string;
}

export default function CommerceDetail() {
    const theme = useColorScheme();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const [commerces, setCommerces] = useState<Commerce[]>([]);
    const [commerce, setCommerce] = useState<Commerce | undefined>();
    const [loading, setLoading] = useState<boolean>(true); // Estado para verificar se está carregando

    // Efeito para carregar os commerces
    useEffect(() => {
      const fetchCommerce = async () => {
        const commerceId = typeof id === 'string' ? id : String(id);
        const { commerces } = await getAllCommercers(null, 10, commerceId); // Passa o commerceId
        setCommerces(commerces); // Atualiza o estado com os commerces encontrados
        setLoading(false); // Definir como carregamento finalizado
      };
      fetchCommerce();
    }, [id]); // Apenas quando o id mudar, a requisição será feita

    // Atualizar o commerce quando os commerces estiverem carregados
    useEffect(() => {
      if (commerces.length > 0 && !commerce) {
        setCommerce(commerces[0]); // Atualiza o commerce com o primeiro item
      }

    }, [commerces, commerce]); // Reexecuta quando 'commerces' ou 'commerce' mudarem

    // Ajustar as opções do cabeçalho
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
            <Text style={[styles.title, { textAlign: 'right',  marginRight:15, color: theme ==='dark' ? '#ffffff' : '#000' }]}> 
              Informações comércio
            </Text>
            ),
        });
    }, [navigation, commerce, theme]); // Executa quando navigation, commerce ou theme mudarem

    // Verificar se os dados estão carregando
    if (loading) {
      return <Text>Carregando...</Text>; // Exibe uma mensagem de carregamento
    }

    return ( 
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#353636' : '#D0D0D0', shadowColor: theme === 'dark' ? '#fff' : '#000'  }]}>
                   
      <CardCommerceDetail 
        nameCommerce={commerce?.commerceName} 
        nameIcon={commerce?.iconName} 
        whatsApp={commerce?.whatsApp} 
        description={commerce?.description} 
        address={commerce?.address}
        owner={commerce?.owner}
      />

      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 50
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    boxCommerce:{
      padding: 30,
      // Sombras no iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      // Sombra no Android
      elevation: 3,
      borderRadius: 10, // Para deixar o fundo redondo (50/2)
      backgroundColor: "#fff"
    },
    textStyle:{
      fontSize: 25
    }
});
