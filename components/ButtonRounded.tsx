import { StyleSheet, View, Text, useColorScheme, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';

interface ButtonProps {
  nameIcon: string;
  sizeIcon: number;
  nameButton: string;
  handlePress?: () => void; 
  buttonColor?: string; // Cor do botão (pode ser personalizada)
}

export default function ButtonRounded({
  nameIcon,
  sizeIcon,
  nameButton,
  handlePress,
  buttonColor = '#fff', // Define a cor de fundo padrão como branco
}: ButtonProps) {
  const theme = useColorScheme();
  
  return (
    <TouchableOpacity style={styles.boxButton} onPress={handlePress}>
      <View 
        style={[
          styles.iconRounded, 
          { backgroundColor: buttonColor, shadowColor: theme === 'dark' ? '#fff' : '#000' }
        ]}
      >
        <Icon name={nameIcon} size={sizeIcon} color='#000' />
      </View>
      <Text 
        style={[
          styles.textStyle,  
          { color: theme === 'dark' ? '#fff' : '#000', fontSize: nameButton.length > 12 ? 8 : 10 } // Ajusta o tamanho do texto dependendo do comprimento
        ]}
      >
        {nameButton}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconRounded: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombras no iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Sombra no Android
    elevation: 5,
  },
  boxButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5, 
    marginRight: 5,
    // Sombras no iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Sombra no Android
    elevation: 30,
  },
  textStyle: {
    fontSize: 10,
    margin: 4,
    textAlign: 'center', // Adiciona centralização no texto
  }
});
