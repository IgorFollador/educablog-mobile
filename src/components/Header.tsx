import { View } from 'react-native';
import Navbar from './NavBar';

const Header = ({ isLoggedIn = false}) => {
  return (
    <View>
        <Navbar isLoggedIn={isLoggedIn} />
    </View>
  );
};

export default Header;
