import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ScrollTopButtonProps {
  isVisible: boolean;
  scrollToTop: () => void;
}

const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({ isVisible, scrollToTop }) => {
  if (!isVisible) return null;

  return (
    <TouchableOpacity style={styles.scrollButton} onPress={scrollToTop}>
      <Icon name="angle-up" size={25} color="#FFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollButton: {
    position: 'absolute',
    bottom: 80, 
    right: 16,  
    backgroundColor: 'rgba(0, 51, 102, 0.8)', 
    width: 35,    
    height: 35,   
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',   
    elevation: 5, 
    zIndex: 9999, 
  },
});

export default ScrollTopButton;
