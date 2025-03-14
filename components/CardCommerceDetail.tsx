import { StyleSheet, View, useColorScheme, Text, TextInput, TouchableOpacity, ScrollView  } from 'react-native';
import { useLayoutEffect, useState  } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Separator from '../components/Separator';

interface Props {
    nameIcon?: string;
    nameCommerce?: string;
    whatsApp?: string;
    owner?: string;
    description?: string;
    address?: string;

  }

  function formatPhoneNumber(phone: string) {
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');

    // Verifica se é um número com DDD e formato correto
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    }

    return phone; // Retorna sem formatação se não for válido
}



export default function CardCommerceDetail({nameCommerce, nameIcon, whatsApp, owner, description, address}: Props) {
    const theme = useColorScheme();

     return  (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.card}>
                    {/* Nome do Comércio */}
                    <Text style={styles.title}>
                        <Icon name={nameIcon ? nameIcon : 'store'} size={24} style={styles.iconTitle} />  
                        {nameCommerce ? nameCommerce : 'Estabelecimento'}
                    </Text>
                    
                    <Separator enableDarkMode={false} />

                    {/* Informações do comércio */}
                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Icon name="whatsapp" size={20} style={styles.icon} /> 
                            <Text style={styles.infoText}>{whatsApp ? formatPhoneNumber(whatsApp) : 'Não informado'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="map-marker-alt" size={20} style={styles.icon} /> 
                            <Text style={styles.infoText}>{address ? address : 'Endereço não informado'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="user" size={20} style={styles.icon} /> 
                            <Text style={styles.infoText}>Proprietário: {owner ? owner : 'Não informado'}</Text>
                        </View>

                        <Separator enableDarkMode={false} />
                        
                        <Text style={styles.description}>
                            {description ? description : 'Nenhuma descrião cadastrada'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );  

            
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ocupa toda a tela
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center', // Centraliza horizontalmente
        // padding: 20,
        marginHorizontal:5,
        // marginVertical: auto;
    },
    card: {
        
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 40,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    iconTitle: {
        marginRight: 8,
    },
    infoContainer: {
        marginTop: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
        color: '#007bff',
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        // marginTop: 1,
    }
});