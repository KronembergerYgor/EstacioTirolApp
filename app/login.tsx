import { StyleSheet, View, useColorScheme, Text, ScrollView  } from 'react-native';
import { useLayoutEffect, useState  } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Form from '../components/Form';
import { loginWithEmailAndPassword } from '../firebase'; // Caminho para seu arquivo de configuração



export default function Login() {
    const navigation = useNavigation();
    const theme = useColorScheme();
    const router = useRouter();

    
    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: () => (
            <Text style={[styles.title, { textAlign: 'right',  marginRight:15, color: theme ==='dark' ? '#ffffff' : '#000' }]}> Login</Text> // Título à direita
          ),
        });
      }, [navigation]);

      const handleLogin = async (formData: Record<string, string>) => {
        const { name, email, password, confirmPassword } = formData;
        if (!email || !password) {
          alert('Por favor, preencha todos os campos.');
          return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
          alert("Formato de e-mail inválido");
          return;
        }

        try {
          let statusLogin = await loginWithEmailAndPassword(email, password);
          if(statusLogin){
            router.push('/'); // Redireciona para a página de login
          }
        } catch (err) {
          // console.error("Erro no login:", err);
          if (err instanceof Error) {
            console.error(err.message); // Atualiza o erro com a mensagem
          } else {
            console.error("Erro desconhecido.");
          }
        }
      
      };
      

      const campos = [
        { name: 'email', label: 'E-mail', placeholder: 'Digite seu email', keyboardType: 'default' },
        { name: 'password', label: 'Senha', placeholder: 'Digite sua senha', keyboardType: 'password' },
    ];
    
      return <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#353636' : '#D0D0D0', shadowColor: theme === 'dark' ? '#fff' : '#000'  }]}>
            <Form 
              showResetLink={true}
              nameIcon='user-circle' 
              titleForm='Login' 
              campos={campos} 
              titleButton='Entrar'
              handleSubmit={handleLogin}
              handleSubmitResetPassword={() => router.push('/resetPassword')}
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