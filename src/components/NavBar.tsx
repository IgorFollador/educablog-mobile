import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const Navbar = ({isLoggedIn}: { isLoggedIn: Boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    // TODO signIn do Next
    // signIn();
  };

  const handleLogout = () => {
    // TODO signOut do Next
    // signOut({ callbackUrl: '/' });
  };

  const handleRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigation.navigate('Admin');
    } else {
      navigation.navigate('Home');;
    }
  };

  return (
      <View className="z-50 bg-blue-950 fixed top-0 left-0 w-full z-100 shadow-black">
        <View className="container mx-auto flex justify-between items-center">

          {/* Logo centralizado em telas pequenas e alinhado à esquerda em telas grandes */}
          <View className="md:flex-1 md:justify-start flex justify-center p-5">
            <TouchableWithoutFeedback onPress={() => handleRedirect}>
              <View className="flex items-center">
                <Image
                  width={20}
                  height={20}
                  className='mr-1'
                  alt="Logo"
                  source={require('../../assets/images/logo.png')}
                />
                <Text className="text-white text-2xl">EducaBlog</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Botão de menu sanduíche visível apenas em telas pequenas (à direita) */}
          <View className="md:hidden">
            <TouchableWithoutFeedback
              className="text-white p-2 focus:outline-none"
              onPress={() => setIsOpen(!isOpen)}
            >
              {/* TODO svg - SvgExample*/}
              {/* <svg
                className={`w-8 h-8 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg> */}
              <Text>Teste</Text>
            </TouchableWithoutFeedback>
          </View>

          {/* Menu de login/logout visível em telas maiores */}
          <View className="hidden md:flex space-x-4">
            {isLoggedIn ? (
              <TouchableOpacity
                onPress={handleLogout}
                className="text-white hover:bg-yellow-500 p-6"
              >
                <Text>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleLogin}
                className="text-white hover:bg-yellow-500 p-6"
              >
                <Text>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Menu de login/logout visível em telas pequenas quando o botão de menu é ativado */}
        {isOpen && (
          <View className="absolute left-0 w-full bg-sky-900 z-10 top-full">
            <View className="flex flex-col items-center w-full">
              {isLoggedIn ? (
                <TouchableOpacity
                  onPress={handleLogout}
                  className="text-white px-4 py-2 w-full text-center"
                >
                  <Text>Logout</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleLogin}
                  className="text-white px-4 py-2 w-full text-center"
                >
                  <Text>Login</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
  );
};

export default Navbar;
