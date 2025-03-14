import { StyleSheet, View, useColorScheme, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Button from '../../components/Button';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../firebase'; // Importa a configuração do Firebase
import { getFirestore, doc, getDoc, collection, query, where, getDocs  } from 'firebase/firestore';

// Inicialize o Firestore
const db = getFirestore();

export default function Index() {
  const theme = useColorScheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>(''); // Estado para armazenar o nome do usuário

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser); // Atualiza o estado com o usuário autenticado
  
        // Busca o nome do usuário no Firestore usando o 'userId' no lugar do 'uid'
        const usersCollectionRef = collection(db, 'Users'); // Referência à coleção de usuários
        const q = query(usersCollectionRef, where('uid', '==', authUser.uid)); // Filtra pelo campo 'userId'
  
        getDocs(q)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docSnap = querySnapshot.docs[0]; // Pega o primeiro documento encontrado
              const data = docSnap.data();
              setUserName(data.name); // Atualiza o nome do usuário
            }
          })
          .catch((error) => {
            console.error('Erro ao buscar dados do usuário:', error);
          });
      } else {
        setUser(null); // Se não estiver autenticado, define o usuário como null
      }
    });
  
    // Limpa o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Função de logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desloga o usuário
      router.push('/'); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#353636' : '#D0D0D0' }]}>
      <Text
        style={[
          styles.title,
          {
            color: theme === 'dark' ? '#fff' : '#333',
            textShadowColor: theme === 'dark' ? '#000' : '#fff',
          },
        ]}
      >
        Olá {user ? userName : 'morador'}, {'\n'}Seja bem-vindo!
      </Text>
      <View style={styles.containerOptions}>
        <Button
          nameIcon={!user ? 'file-signature' : 'user'}
          titeButton={!user ? 'Cadastre-se' : 'Meus dados'}
          handlePress={() => router.push('/registerUsers')}
          colorDark="#c1d1fb"
          colorLigth="rgb(28 39 117)"
          shadowColorResult={true}
          colorTextLigth="#ffffff"
          colorTextDark="#000"
        />

        <Button
          nameIcon="search"
          titeButton="Buscar Comércio"
          handlePress={() => router.push('/searchTrade')}
          colorDark="#c1d1fb"
          colorLigth="rgb(28 39 117)"
          shadowColorResult={true}
          colorTextLigth="#ffffff"
          colorTextDark="#000"
        />

        {!user && (
          <Button
            nameIcon="user-circle"
            titeButton="Acessar sua conta"
            colorDark="#c1d1fb"
            colorLigth="rgb(28 39 117)"
            shadowColorResult={true}
            colorTextLigth="#ffffff"
            colorTextDark="#000"
            handlePress={() => router.push('/login')}
          />
        )}

        {user && (
          <Button
            nameIcon="folder-open"
            titeButton="Meus Comércios"
            colorDark="#c1d1fb"
            colorLigth="rgb(28 39 117)"
            shadowColorResult={true}
            colorTextLigth="#ffffff"
            colorTextDark="#000"
            handlePress={() => router.push('/myCommerces')}
          />
        )}

        {user && (
          <Button
            nameIcon="power-off"
            titeButton="Deslogar"
            handlePress={handleLogout}
            colorDark="rgb(223 137 137)"
            colorLigth="rgb(203 0 0)"
            shadowColorResult={true}
            colorTextLigth="#ffffff"
            colorTextDark="#000"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32, // Define um tamanho grande como um H1
    fontWeight: 'bold', // Deixa o texto em negrito
    textShadowOffset: { width: 2, height: 2 }, // Direção da sombra (x, y)
    textShadowRadius: 5, // Intensidade do desfoque
  },
  button: {
    flexDirection: 'row', // Ícone e texto lado a lado
    alignItems: 'center', // Alinha verticalmente
    backgroundColor: 'rgb(28 39 117)', // Cor do botão
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'space-between', // Distribui o espaço entre os itens
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8, // Espaço entre ícone e texto
    alignSelf: 'flex-end',
  },
  containerOptions: {
    margin: 20,
  },
});
