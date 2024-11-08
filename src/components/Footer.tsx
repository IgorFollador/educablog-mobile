import { useNavigation } from '@react-navigation/native';
import { FaGithub, FaMailBulk } from 'react-icons/fa';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';

import ScrollToTopButton from './ScrollToTopButton';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <>
    <ScrollToTopButton />
      <View className="bg-sky-950 text-white py-4">
        <View className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo no canto esquerdo */}
          <View className="text-white text-2xl flex items-center mb-4 md:mb-0">
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Home')}>
              <View className="flex items-center">
                <Image
                  src="/logo.png"
                  width={20}
                  height={20}
                  className="mr-2"
                  alt="Logo"
                />
                <Text>EducaBlog</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Ícones */}
          <View className="flex items-center space-x-3 mb-4 md:mb-0">
            <a
              href="https://github.com/IgorFollador/educablog-web"
              target="_blank"
              className="hover:text-yellow-500"
            >
              <FaGithub className="w-6 h-6 md:w-7 md:h-7" />
            </a>
            <a
              href="mailto:fiap_grupo26@outlook.com"
              className="hover:text-yellow-500"
            >
              <FaMailBulk className="w-6 h-6 md:w-7 md:h-7" />
            </a>
          </View>
        </View>

        {/* Copyright centralizado */}
        <View className="text-center text-white mt-4">
          <Text>&copy; {new Date().getFullYear()} EducaBlog. Todos os direitos reservados.</Text>
        </View>
      </View>
    </>
  );
};

export default Footer;
