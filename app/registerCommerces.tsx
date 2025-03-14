import { StyleSheet, View, useColorScheme, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
import { db, auth } from '../firebase';
import { collection, addDoc, deleteDoc, query, where, updateDoc, getDoc, doc } from 'firebase/firestore';
import Form from '../components/Form';
import getCategorys from '../scripts/getCategorys';
import { Alert } from 'react-native';

export default function RegisterCommerces() {

    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const theme = useColorScheme();
    const router = useRouter();
    const [categorys, setCategories] = useState<{ name: string; iconName: string, value: string }[]>([]);
    const [loading, setLoading] = useState(false); // Set loading initially to false
    const [commerceData, setCommerceData] = useState<any>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text style={[styles.title, { textAlign: 'right', marginRight: 15, color: theme === 'dark' ? '#ffffff' : '#000' }]}>
                    {!id ? 'Cadastrar Comércio' : 'Editar Comércio'}
                </Text> // Título à direita
            ),
        });
    }, [navigation]);

    useEffect(() => {
        setLoading(true); // Start loading when fetching categories
        getCategorys(setCategories).finally(() => setLoading(false)); // Ensure loading is stopped after categories are fetched
    }, []);

    // Função para registrar o comércio no Firebase
    const handleRegisterCommerce = async (formData: Record<string, string>) => {

        if (!auth.currentUser) {
            alert("Nenhum usuário autenticado.");
            return;
        }

        const userId = auth.currentUser.uid; // Obtendo o UID do usuário autenticado

        const { commerceName, category, whatsApp, owner, address, description } = formData;

        // Validação dos campos obrigatórios
        if (!commerceName || !category || !owner || !whatsApp) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        if (whatsApp.length !== 11) {
            alert('O número do celular deve ser digitado com 11 digitos númericos, incluindo o DDD');
            return;
        }

        try {
            setLoading(true); // Start loading during the request
            // Adicionando dados do comércio ao Firestore
            await addDoc(collection(db, 'Commerces'), {
                commerceName,
                category,
                whatsApp: whatsApp || '', // Pode ser vazio
                owner,
                address: address || '', // Pode ser vazio
                description: description || '', // Pode ser vazio
                createdAt: new Date(), // Armazenando a data de criação
                user_created: userId
            });

            alert('Comércio registrado com sucesso!');
            router.back(); // Redireciona para a página principal ou de sucesso
        } catch (error) {
            console.error('Erro ao registrar o comércio:', error);
            alert('Erro ao registrar o comércio: ' + error);
        } finally {
            setLoading(false); // Stop loading after the request finishes
        }
    };

    useEffect(() => {
        const fetchCommerceData = async () => {
            if (!id || Array.isArray(id)) return; // Garantir que id seja uma string

            try {
                setLoading(true); // Start loading when fetching commerce data
                // Refere-se ao documento pelo ID da coleção 'Commerces'
                const docRef = doc(db, 'Commerces', id); // Usando id diretamente, sem ser um array

                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCommerceData(docSnap.data());
                } else {
                    setCommerceData(null);
                }
            } catch (error) {
                console.error('Erro ao carregar o comércio:', error);
                alert('Erro ao carregar os dados do comércio. Tente novamente mais tarde.');
            } finally {
                setLoading(false); // Stop loading after the request finishes
            }
        };

        fetchCommerceData();
    }, [id]); // Executa quando o id mudar

    // Função para atualizar os dados do comércio no Firestore
    const updateCommerceData = async (formData: Record<string, string>) => {
        if (!auth.currentUser) {
            alert("Nenhum usuário autenticado.");
            return;
        }

        const userId = auth.currentUser.uid; // Obtendo o UID do usuário autenticado

        const { commerceName, category, whatsApp, owner, address, description } = formData;

        // Validação dos campos obrigatórios
        if (!commerceName || !category || !owner || !whatsApp) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        if (whatsApp.length !== 11) {
            alert('O número do celular deve ser digitado com 11 digitos númericos, incluindo o DDD');
            return;
        }

        try {
            setLoading(true); // Start loading during the request
            // Verifique se o id está presente para garantir que estamos editando o documento correto
            if (!id || Array.isArray(id)) {
                alert('ID inválido ou não encontrado');
                return;
            }

            // Refere-se ao documento pelo ID da coleção 'Commerces'
            const docRef = doc(db, 'Commerces', id); // Usando id diretamente, sem ser um array

            // Atualizando os dados no Firestore
            await updateDoc(docRef, {
                commerceName,
                category,
                whatsApp,
                owner,
                address: address || '', // Caso não tenha valor, o endereço será vazio
                description: description || '', // Caso não tenha valor, a descrição será vazia
                updatedAt: new Date(), // Atualiza a data de modificação
            });

            alert('Comércio atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar o comércio:', error);
            alert('Erro ao atualizar o comércio: ' + error);
        } finally {
            setLoading(false); // Stop loading after the request finishes
        }
    };

    const campos = [
        { name: 'commerceName', label: 'Nome Comércio', placeholder: 'EX: Bar da Rua', keyboardType: 'default', itemValues: !commerceData ? '' : commerceData.commerceName },
        { name: 'category', label: 'Categoria', placeholder: 'Selecione a categoria', keyboardType: 'select', itemValues: !commerceData ? '' : commerceData.category,
            options: categorys.map(category => ({
                name: category.name,
                iconName: category.iconName,
                value: category.value
            }))
        },
        { name: 'whatsApp', label: 'Contato(Cel)', placeholder: 'EX: 21900000000', keyboardType: 'number-pad', itemValues: !commerceData ? '' : commerceData.whatsApp },
        { name: 'owner', label: 'Proprietário', placeholder: 'EX: João da Silva', keyboardType: 'default', itemValues: !commerceData ? '' : commerceData.owner },
        { name: 'address', label: 'Endereço', placeholder: 'EX: Rua 2, casa 103, apt 4 (Opcional)', keyboardType: 'default', itemValues: !commerceData ? '' : commerceData.address },
        { name: 'description', label: 'Descrição', placeholder: 'EX: Bar funciona até as 22:00 horas, realize entra entrega, e vendemos bebidas e petiscos (Opcional)', keyboardType: 'default', multilineValue: true, itemValues: !commerceData ? '' : commerceData.description },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#353636' : '#D0D0D0', shadowColor: theme === 'dark' ? '#fff' : '#000' }]}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" /> // Show loading spinner while fetching data
            ) : (
                <Form
                    nameIcon="dumpster"
                    titleForm={!id ? 'Cadastro Comércio' : 'Editar Comércio'}
                    campos={campos}
                    titleButton={!id ? 'Cadastrar' : 'Salvar'}
                    handleSubmit={!id ? handleRegisterCommerce : updateCommerceData}
                    handleSubmitResetPassword={() => router.push('/resetPassword')}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 50,
        paddingTop: 50
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    picker: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
