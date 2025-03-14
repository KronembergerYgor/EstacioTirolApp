import { StyleSheet, View, useColorScheme, Text, Alert   } from 'react-native';
import { useLayoutEffect, useState, useEffect  } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Form from '../components/Form';
import getUserById from '../scripts/getUserById';
// import auth2 from '@react-native-firebase/auth';

import { createUserWithEmailAndPassword, onAuthStateChanged, User,  updateProfile, updateEmail, updatePassword, sendEmailVerification, deleteUser  } from 'firebase/auth';
import { db, auth } from '../firebase'; // Certifique-se de importar a instância correta do Firebase
import { collection, addDoc, DocumentData, query, where, updateDoc, getDocs, doc, deleteDoc    } from 'firebase/firestore';

export default function RegisterUsers() {
    const navigation = useNavigation();
    const theme = useColorScheme();
    const router = useRouter();
    const [user, setUser] = useState< User | null >(null);
    const [userDoc, setUserDoc] = useState<DocumentData | null>(null);

    // Verifica o estado de autenticação do usuário
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user); // Atualiza o estado conforme o usuário se autentica
      });
  
      // Limpa o listener quando o componente for desmontado
      return () => unsubscribe();
    }, []);

    //Definindo UserDoc
    useEffect(() => {
      if (user) {
        // Chama a função assíncrona para pegar os dados do usuário
        getUserById(user.uid).then((data) => {
          if (data) {
            setUserDoc(data)
          }
        });
      }
    }, [user]);  // Executa toda vez que o 'user' muda
    
    // Função para atualizar o usuário logado
    const updateUserData = async (formData: Record<string, string>) => {
      if (!auth.currentUser) {
        alert("Nenhum usuário autenticado.");
        return;
      }

      const { name, email, password, confirmPassword} = formData;
      const user = auth.currentUser;

      try {
        // Atualizar nome no Firebase Auth se necessário
        if (name && name !== user.displayName) {
          await updateProfile(user, { displayName: name });
        }

        // Atualizar e-mail no Firestore (sem alterar no Firebase Auth ainda)
        if (email && email !== user.email) {
          await updateEmail(user, email);
          // alert("Um e-mail de verificação foi enviado para o novo endereço de e-mail. Verifique seu e-mail antes de concluir a atualização.");
        }

        // Atualizar senha no Firebase Auth se nova senha for fornecida
        if (password) {
          if(password != confirmPassword){
            alert("Senha digitadas de forma divergentes, verifique novamente");
            return;
          }

          await updatePassword(user, password);
        }

        // Atualizar dados no Firestore
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          return;
        }

        querySnapshot.forEach(async (docSnapshot) => {
          const userDocRef = doc(db, "Users", docSnapshot.id);
          await updateDoc(userDocRef, {
            name: name || user.displayName,  // Atualiza o nome se fornecido, caso contrário, mantém o nome atual
            email: email || user.email,       // Atualiza o e-mail se fornecido, caso contrário, mantém o e-mail atual
          });
        });

        alert("Dados atualizados com sucesso!");
      } catch (error: any) {
        console.error("Erro ao atualizar os dados:", error);
        alert("Erro ao atualizar os dados: " + error.message);
      }
    };

  
    //Função para cadastrar usuário
    const handleRegister = async (formData: Record<string, string>) => {

        const { name, email, password, confirmPassword } = formData;
        // Validando se os campos estão prenchidos
        if (!name || !email || !password || !confirmPassword) {
            alert('Preencha todos os campos!');
            return;
        }

        // Verificando se os campos de validação de senha são compativeis 
        if (password !== confirmPassword) {
            alert('Digite as senhas iguais!');
            return;
        }

        // Verificando se o campo de e-mail é válido
        if (!email.includes("@") || !email.includes(".")) {
          alert('O campo e-mail, necessita que seja digitado um e-mail válido');
          return;
        }

        try {
          // Criar usuário no Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
          // Agora, você pode armazenar dados adicionais no Firestore (sem duplicar o e-mail)
          await addDoc(collection(db, 'Users'), {
              name: name,
              email: email,  // Armazenando o e-mail também, mas não para autenticação
              uid: userCredential.user.uid,  // O Firebase Authentication fornece um UID único para cada usuário
          });
          
          alert('Usuário registrado com sucesso!');
          
          router.push('/'); // Redireciona para a página de login
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message); // Atualiza o erro com a mensagem
        } else {
          console.error("Erro desconhecido.");
        }
      }
    };

    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: () => (
          <Text style={[styles.title, { textAlign: 'right', marginRight: 15, color: theme === 'dark' ? '#ffffff' : '#000' }]}>
            {!user ? 'Cadastro Usuário' : 'Editar Usuário'}
          </Text>
        ),
      });
    }, [navigation, user]); // Adicionando `user` como dependência


    const deleteAccount = async () => {
      if (!user) {
        alert("Nenhum usuário autenticado.");
        return;
      }
    
      // Exibe um pop-up de confirmação
      Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza que deseja excluir sua conta? Esta ação é irreversível.",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                // Deletando dados no Firestore
                const usersRef = collection(db, "Users");
                const q = query(usersRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
    
                querySnapshot.forEach(async (docSnapshot) => {
                  const userDocRef = doc(db, "Users", docSnapshot.id);
                  await deleteDoc(userDocRef); // Deleta os dados do usuário no Firestore
                });
    
                // Deletando o usuário no Firebase Authentication
                await deleteUser(user); // Deleta a conta do Firebase Authentication
    
                alert("Conta excluída com sucesso!");
                router.push('/'); // Redireciona para a página de login ou inicial
              } catch (error: any) {
                console.error("Erro ao excluir a conta:", error);
                alert("Erro ao excluir a conta: " + error.message);
              }
            },
          },
        ],
        { cancelable: true }
      );
    };



    const campos = [
      { name: 'name', label: 'Nome', placeholder: !userDoc ? 'Digite seu nome' : 'Digite seu novo nome' , keyboardType: 'default', itemValues: !userDoc ? '' : userDoc.name },
      { name: 'email', label: 'Email', placeholder: !userDoc ? 'Digite seu email' : 'Digite seu novo email', keyboardType: 'email-address', itemValues: !userDoc ? '' : userDoc.email },
      { name: 'password', label: !userDoc ? 'Senha' : 'Nova senha' , placeholder: !userDoc ? 'Digite sua senha' : 'Digite sua nova senha', keyboardType: 'password' },
      { name: 'confirmPassword', label: !userDoc ? 'Confirmar Senha' : 'Confirmar nova senha' , placeholder: !userDoc ? 'Confirme sua senha' : 'Confirme sua nova senha', keyboardType: 'password' }
    ];
    
return <View style={[
            styles.container, 
            { 
              backgroundColor: theme === 'dark' ? '#353636' : '#D0D0D0', 
              shadowColor: theme === 'dark' ? '#fff' : '#000'  
            }
        ]}>

    <Form 
      nameIcon='file-signature' 
      titleForm = {!user ? 'Cadastro Usuário' : 'Editar Usuário'}
      campos={campos} 
      titleButton={!user ? 'Cadastrar' : 'Salvar'}
      handleSubmit={!user ? handleRegister : updateUserData}    
      showButtonDeleteAccount={user ? true : false}
      handleSubmitDeleteAccount={user ? deleteAccount : () => {}}
    />
    

</View>


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        padding: 20
      },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      icon: {
        marginRight: 8, // Espaço entre o ícone e o input
      },
      textLine:{
        fontSize: 40,

      },

})