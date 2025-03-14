import { StyleSheet, View, useColorScheme, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props {
  nameIcon?: string;
  titleLine?: string;
  onPress?: () => void; // Função que será chamada quando o componente for clicado
}

export default function LineCategory({ nameIcon, titleLine, onPress }: Props) {
  const theme = useColorScheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.lineCategory}>
      <View style={[styles.iconRounded]}>
        <Icon name={nameIcon ? nameIcon : 'bars'} size={20} />
      </View>

      <Text style={[styles.textLine, { color: theme === 'dark' ? '#ffffff' : '#000' }]}>{titleLine}</Text>

      <Icon name="chevron-right" color={theme === 'dark' ? '#ffffff' : '#000'} size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  lineCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '80%',
  },
  textLine: {
    fontSize: 25,
  },
  iconRounded: {
    width: 40, // Tamanho do fundo redondo
    height: 40, // Tamanho do fundo redondo
    borderRadius: 40, // Para deixar o fundo redondo (50/2)
    backgroundColor: '#fff', // Cor do fundo
    justifyContent: 'center', // Alinha o ícone no centro
    alignItems: 'center', // Alinha o ícone no centro
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
