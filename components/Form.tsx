import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardTypeOptions, useColorScheme, ScrollView  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Separator from '../components/Separator';
import { User } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';


interface Campo {
    name: string;
    label: string;
    placeholder: string;
    keyboardType: string;
    itemValues?: string;
    options?: { name: string; iconName: string; value: string }[]; // opcional
    multilineValue?: boolean; // opcional
  }
  

interface FormProps {
    titleForm: string;
    campos: Campo[];
    titleButton: string;
    nameIcon: string;
    showResetLink?: boolean;
    handleSubmit?: (formData: Record<string, string>) => void;
    handleSubmitResetPassword?: (formData: Record<string, string>) => void;
    handleSubmitDeleteAccount?: (formData: Record<string, string>) => void;
    showButtonDeleteAccount?: boolean;
  }


export default function Form({titleForm, campos, titleButton, nameIcon, showResetLink = false, handleSubmit, handleSubmitResetPassword, handleSubmitDeleteAccount, showButtonDeleteAccount = false }: FormProps) {
    const theme = useColorScheme();

    const handleChange = (name: string, value: string) => {
        setForm({ ...form, [name]: value });
      };
      

    // Defina o estado do formulário
    const [form, setForm] = useState<Record<string, string>>({});

    // Atualize o estado do formulário com os valores iniciais fornecidos em campos
    useEffect(() => {
        const initialForm = campos.reduce((acc, { name, itemValues }) => {
            acc[name] = itemValues || '';
            return acc;
        }, {} as Record<string, string>);
        
        setForm(initialForm);
    }, [campos]); // Atualize quando os campos mudarem


   
    return (
        <View style={styles.container}>
            <ScrollView> 
                <Text style={styles.titleForm}>  <Icon name={nameIcon} size={20}/> {titleForm}</Text>
            
                    <Separator enableDarkMode={false} />

                        {campos.map(({ name, label, placeholder, keyboardType, options, multilineValue }) => (
                            <View key={name}>
                            <Text style={styles.label}>{label}</Text>
                            
                            {keyboardType === 'select' && options ? (
                                
                                <View style={styles.pickerContainer}> 
                                    <Picker
                                        selectedValue={form[name]}
                                        onValueChange={(value) => handleChange(name, value)}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Selecione uma opção." value="" color="gray" />
                                        {options.map((option) => (
                                            <Picker.Item style={styles.options} key={option.value} label={option.name} value={option.value} />
                                        ))}
                                    </Picker>
                                </View>
                           
                            ) : (
                                <TextInput
                                    style={styles.input}
                                    value={form[name]}
                                    onChangeText={(value) => handleChange(name, value)}
                                    placeholder={placeholder}
                                    keyboardType={keyboardType === 'password' ? 'default' : (keyboardType as KeyboardTypeOptions)}
                                    secureTextEntry={keyboardType === 'password'}
                                    multiline={multilineValue}
                                    numberOfLines= {6}

                                    
                                />
                            )}
                            </View>

                     
                        ))}

                    <Separator enableDarkMode={false} />
            

            

                <TouchableOpacity style={styles.button} onPress={() => handleSubmit?.(form)}>
                    <Text style={styles.buttonText}>{titleButton}</Text>
                </TouchableOpacity>

                {showResetLink && (
                    <TouchableOpacity style={styles.linkReset} onPress={() => handleSubmitResetPassword?.(form)}>
                        <Text style={styles.linkResetPassword}>Esqueceu a senha?</Text>
                    </TouchableOpacity>
                )}

                {showButtonDeleteAccount &&   (

                    <TouchableOpacity style={styles.deleteAccountContainer} onPress={() => handleSubmitDeleteAccount?.(form)}>
                        <Text style={styles.linkResetPassword}>Excluir Conta</Text>
                    </TouchableOpacity>
                   
                )}
          
            </ScrollView>
        </View>
        );
};

  
  

const styles = StyleSheet.create({
    deleteAccountContainer: {
        alignItems: 'center',
        alignSelf:'center',
        marginTop: 12,
      },
    linkResetPassword:{
        color: '#0065bb',
        textDecorationLine: 'underline'
  
    },
    linkReset:{
        alignItems: 'center',
        alignSelf:'center',
        marginTop: 12,

    },
    boxSubmit:{
        flexDirection: 'row', // Alinha os botões horizontalmente
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    titleForm:{

        fontSize:20,
        textAlign:  'center',
        marginBottom: 12,

    },
    container: {
        padding: 30,
        margin: 25,
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginBottom: 15,
    },
    button: {
        backgroundColor: 'rgb(28 39 117)',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        alignSelf:'center',
        marginTop: 12,
        width: '50%',
        // Sombras no iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        // Sombra no Android
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    picker: {
        // height: 40,  
        color: '#000',   
        // padding:0
      },
      pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        paddingVertical: 5,
        height: 37,
        justifyContent: 'center',
    },
    options:{
        fontSize: 14,
        textAlign: 'center', // Centraliza texto no iOS (Android não suporta diretamente)


    }
});

