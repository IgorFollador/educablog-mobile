import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, showBackButton = false }) => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
      )}
      
      {/* Botão de Menu deve vir antes do logo */}
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <Ionicons name="menu" size={32} color="white" />
      </TouchableOpacity>

      <Image
        source={require('@/assets/images/logo.png')} // Caminho para o logo
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#182454',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  logo: {
    width: 25,
    height: 25,
    marginLeft: 10, 
    justifyContent: 'center',
  },
  menuButton: {
    marginRight: 60,
    marginLeft: 0,
  },
});

export default Header;
