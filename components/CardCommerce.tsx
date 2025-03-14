import { StyleSheet, View, useColorScheme, Text, TextInput, TouchableOpacity  } from 'react-native';
import { useLayoutEffect, useState, useEffect  } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { collection ,where, getDocs, query} from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, User,  updateProfile, updateEmail, updatePassword, sendEmailVerification, deleteUser  } from 'firebase/auth';
import { db, auth } from '../firebase'; // Certifique-se de importar a instância correta do Firebase
import getMyCommercers from '../scripts/getMyCommercers';

interface Props {
    nameIcon: string;
    handlePress?:  () => void; 
    titleCard: string;
    marginValueBox?: number;
    handleEdit?:  () => void; 
    handleDelete?:  () => void; 
    value?: string;
  }

export default function CardCommerce({titleCard, nameIcon, handlePress, marginValueBox = 20,  handleEdit, handleDelete, value}: Props) {
    
    const theme = useColorScheme();
    const user = auth.currentUser;
    let [showEditCommerces, setshowEditCommerces] = useState(false);


    useEffect(() => {
      async function fetchData() {
        if (user) {
          const userId = user.uid;
          const commercesRef = collection(db, "Commerces");

          // Filtrando documentos onde 'user_created' == userId
          const queryConsult = query(commercesRef, where("user_created", "==", userId));

          // Obtendo os documentos da query
          const querySnapshot = await getDocs(queryConsult);
          
          querySnapshot.forEach((doc) => {
            if (doc.id === value) {
              setshowEditCommerces(true); // Ativa a edição apenas se o comércio corresponder
            }
          });
        }
      }

      fetchData();
    }, [user, value]); // Remova 'showEditCommerces' da lista de dependências




    return   <View style={[styles.boxCommerce, { shadowColor: theme === 'dark' ? '#fff' : '#000', margin: marginValueBox }]}>
              <Text style={[styles.titleBox]}> <Icon name={nameIcon} size={20} color='#000' style={styles.icon} /> {titleCard}</Text>
      
              <TouchableOpacity style={[styles.buttonBoxStyle]} onPress={handlePress}>
                <Text style={[styles.titleTextButtonBox]}>Detalhes Comércio</Text>
              </TouchableOpacity>

              
              {/* Botões de Edição e Exclusão (Aparecem apenas se showEditCommerces for true) */}
              {showEditCommerces && (
                <View style={styles.actionButtonsContainer}>
                  {/* Botão de Editar */}
                  <TouchableOpacity style={[styles.editButton]} onPress={handleEdit}>
                    <Icon name="pen" size={16} color="#fff" />
                    <Text style={styles.textButton}>Editar</Text>
                  </TouchableOpacity>

                  {/* Botão de Excluir */}
                  <TouchableOpacity style={[styles.deleteButton]} onPress={handleDelete}>
                    <Icon name="trash" size={16} color="#fff" />
                    <Text style={styles.textButton}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
    
            </View>
}


const styles = StyleSheet.create({
  boxCommerce: {
    borderRadius: 4,
    padding: 15,
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginRight: 8,
  },
  titleBox: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonBoxStyle: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 50,
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 20,
    backgroundColor: 'rgb(28 39 117)',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleTextButtonBox: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(34, 139, 34)', // Verde
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(220, 20, 60)', // Vermelho
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});