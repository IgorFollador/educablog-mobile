import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';

export default function Main({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground 
        source={require('@/assets/images/bg3.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
        <View style={styles.container}>
    
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>EducaBlog</Text>
          </View>

          <Text style={styles.title}>Seja Bem-Vindo!</Text>

        
          <View style={{ 
            position: 'absolute',
            bottom: 130}}>
          <Text style={styles.subTitle}>Entre aqui:</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginAluno')}>
                <Text style={styles.buttonText}>Sou Aluno</Text>
              </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginProfessor')}>
              <Text style={styles.buttonText}>Sou Professor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center', 
    padding: 10,
    borderRadius: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  logoText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: "underline",
 
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    
    color: '#f3f4f6',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 80,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#f3f4f6',
    textAlign: 'left',
    width: 350,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 40,
  },
  button: {
    width: '45%',
    backgroundColor: '#d2a209', 
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
});
