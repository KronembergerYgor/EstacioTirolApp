import { StyleSheet, View, useColorScheme, Text } from 'react-native';
import { useLayoutEffect  } from 'react';

import { useNavigation, useRouter } from 'expo-router';
import Form from '../components/Form';


import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; // Certifique-se de importar a instância correta do Firebase

export default function ResetPassword() {
    const navigation = useNavigation();
    const theme = useColorScheme();
    const router = useRouter();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
            <Text style={[styles.title, { textAlign: 'right',  marginRight:15, color: theme ==='dark' ? '#ffffff' : '#000' }]}> Redefinição de Senha</Text> // Título à direita
            ),
        });
        }, [navigation]);
    

    // Função para lidar com a recuperação de senha
    const handleSendEmail =  async (formData: Record<string, string>) => {

        const {email} = formData;
        // Atualizar e-mail no Firestore (sem alterar no Firebase Auth ainda)
        if ((!email.includes("@") || !email.includes("."))) {
            alert("Digite um e-mail válido");
            return;
        }

        try {
            if (!email) {
                alert('Por favor, forneça um e-mail.');
                return;
            }
        
            // Envia o e-mail de redefinição de senha
            await sendPasswordResetEmail(auth, email);
            alert('Um e-mail foi enviado com instruções para redefinir sua senha.');
            router.push('/login'); // Redireciona para a página de login

        } catch (error: any) {
            console.error('Erro ao enviar o e-mail de redefinição de senha:', error);
            alert('Erro ao enviar o e-mail de redefinição de senha. Tente novamente.');
        }
    };


 
    const campos = [
        { name: 'email', label: 'E-mail', placeholder: 'Digite seu e-mail' , keyboardType: 'default' },
      ];

    return <View style={[
                styles.container, 
                { 
                  backgroundColor: theme === 'dark' ? '#353636' : '#D0D0D0', 
                  shadowColor: theme === 'dark' ? '#fff' : '#000'  
                }
            ]}>
    
        <Form 
          nameIcon='paper-plane' 
          titleForm = {'Redefinição de senha'}
          campos={campos} 
          titleButton='Enviar'
          handleSubmit={handleSendEmail}    
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

})