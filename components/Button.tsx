import { StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';  // Corrigido para FontAwesome5
import { useRouter } from 'expo-router';

interface ButtonProps {
  nameIcon?: string;
  titeButton?: string;
  handlePress?:  () => void; 
  colorDark: string;
  colorLigth: string;
  shadowColorResult: boolean;
  colorTextLigth: string; 
  colorTextDark: string;
  paddingValue?: number;
  fontSizeButton?: number;
  marginTopValue?: number;
  marginLeftValue?: number;
  marginRightValue?: number;
}


export default function Button({marginLeftValue = 0, marginRightValue= 0, marginTopValue = 20, fontSizeButton = 16, paddingValue = 20, nameIcon, titeButton, handlePress,  colorDark= '#RRGGBBAA', colorLigth= '#RRGGBBAA', shadowColorResult= false,   colorTextLigth= '#RRGGBBAA', colorTextDark= '#RRGGBBAA' }: ButtonProps) {  
  const router = useRouter();
  const theme = useColorScheme();

    return  <TouchableOpacity  
            style={[styles.button, 
            { backgroundColor: theme === 'dark' ? colorDark : colorLigth, 
              shadowColor: shadowColorResult == true ? (theme === 'dark' ? '#414141' : '#000') : '#00000000',
              padding: paddingValue,
              marginTop: marginTopValue,
              marginLeft: marginLeftValue,
              marginRight: marginRightValue,
            }
            ]} 
            onPress={handlePress}>
                  <Icon style={ {color: theme ==='dark' ? colorTextDark : colorTextLigth, fontSize: fontSizeButton} } name={nameIcon ? nameIcon : 'bars'} size={20} color="#fff" />
                  <Text style={[styles.buttonText, {color: theme ==='dark' ? colorTextDark : colorTextLigth}]}>{titeButton}</Text>
            </TouchableOpacity>

}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',  // Alinha os itens horizontalmente
    alignItems: 'center',  // Alinha verticalmente
    borderRadius: 8,
    justifyContent: 'space-between', // Distribui o espaço entre os itens
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
  },
  buttonText: {
    marginLeft: 8, // Espaço entre ícone e texto
    alignSelf: 'flex-end',
  },
  });
