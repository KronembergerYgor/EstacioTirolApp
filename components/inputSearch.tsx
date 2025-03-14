import { StyleSheet, View, TextInput, useColorScheme, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useState } from 'react';

// Pega a largura da tela
const { width } = Dimensions.get('window');

interface InputSearchProps {
  placeholder: string;
  onSearch: (query: string) => void; // Função de busca que será passada de fora
  widthInput?: string;
  marginBottomValue?: number;
  marginTopValue?: number;
}

export default function InputSearch({
  marginBottomValue = 10,
  marginTopValue = 20,
  placeholder,
  onSearch,
  widthInput = '70%',
}: InputSearchProps) {
  const theme = useColorScheme();
  const [textString, setTextString] = useState('');
    const inputWidth = widthInput || width * 0.7;

  const handleChangeText = (text: string) => {
    setTextString(text);
    onSearch(text); // Chama a função de busca com o texto digitado
  };

  return (
    <View style={[styles.inputContainer, { width: widthInput, marginTop: marginTopValue, marginBottom: marginBottomValue }]}>
      <Icon name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={[{ color: '#000', width: '100%' }]}
        placeholder={placeholder}
        value={textString}
        onChangeText={handleChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
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
  icon: {
    marginRight: 8,
  },
});
