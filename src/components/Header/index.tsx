import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, showBackButton = false }) => {
  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
      )}
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
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#182454',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
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
  },
});

export default Header;
