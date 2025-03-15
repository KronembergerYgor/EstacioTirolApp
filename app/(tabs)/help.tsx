import { StyleSheet, Image, Platform , View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (<ParallaxScrollView
    headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
    headerImage={ <Icon size={310} color="#808080" name="question-circle" style={styles.headerImage} /> } >

      <Collapsible title="Objetivo">
        <ThemedText>
          <Text>
            Aplicativo criado para ajudar os moradores da comunidade da <Text style={{fontWeight:'bold'}} >Tirol</Text>, localizada no bairro da <Text style={{fontWeight:'bold'}} >Freguesia Jacarepágua</Text>.
            {'\n'}
            E tem como objetivo auxiliar os moradores a locaizarem os comércios presentes na comunidade.
          </Text>
        </ThemedText>
      </Collapsible>

      <Collapsible title="Como funciona?">
        <ThemedText>
          <Text>
            Nesse app como <Text style={{fontWeight:'bold'}} >morador</Text> você pode entrar e buscar os comércios presentes na comunidade, através do nome ou da categoria do mesmo{'(bar, alimentação, moda etc...)'}
            {'\n'}
            E como <Text style={{fontWeight:'bold'}} >comerciante</Text> é possível criar uma conta, e cadastrar seu/seus comércios, assim servindo para divulgar e permitir que o mesmo seja mais fácil o cliente encontrar seu comércio.
          </Text>
        </ThemedText>
      </Collapsible>

      <Collapsible title="Feito por">
        <ThemedText>
          <Text>
            Feito por <Text style={{fontWeight:'bold'}} >Ygor Kronemberger</Text>, desenvolvedor de software.
            {'\n'}
            Projeto solicitado pela faculdade <Text style={{fontWeight:'bold'}} >Estácio de Sá</Text>
          </Text>
    
        </ThemedText>
      </Collapsible>

      <Collapsible title="Contatos">
        <ThemedText>
          <Text>
            🚀 Transforme sua ideia em realidade! Desenvolvo softwares sob medida, sites e apps para tornar seu negócio mais eficiente e lucrativo.  {'\n'}
            💻✨ Entre em contato e leve sua solução para o próximo nível!  {'\n'}
            Contato: {'(21) 98657-6510'}
          </Text>
    
        </ThemedText>
      </Collapsible>

    </ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
