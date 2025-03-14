import { StyleSheet, View, useColorScheme, Text, ScrollView  } from 'react-native';
import { useLayoutEffect, useState  } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import InputSearch from '../components/inputSearch';
import LineCategory from '../components/lineCategory';

interface Props {
    enableDarkMode?: boolean;
  }


export default function Separator({enableDarkMode = true}) {
    const theme = useColorScheme();
    const router = useRouter();
    
    return <View style={[styles.separator, {
        backgroundColor: enableDarkMode
          ? theme === 'dark'
            ? '#ffffff'
            : '#000'
          : '#000',
    
    }
    ]} /> 
}

const styles = StyleSheet.create({
    separator: {
        height: 1, 
        width: '100%',
        marginVertical: 15, // Adiciona espaço acima e abaixo da linha
      }

})