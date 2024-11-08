import Svg, {
  Path,
} from 'react-native-svg';

import React from 'react';
import { View, StyleSheet } from 'react-native';

export default class SvgExample extends React.Component {
  render() {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { alignItems: 'center', justifyContent: 'center' },
        ]}>
        <Svg
          height="50%"
          width="50%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          // xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </Svg>
      </View>
    );
  }
}