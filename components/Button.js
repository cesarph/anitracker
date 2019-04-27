import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import {colors} from '../constants/Colors'

export function PrimaryButton(props) {
  return (
    <TouchableOpacity {...props} style={{ ...styles.button, ...styles[props.size]}}>
      <Text style={styles.text}>{props.children}</Text>
    </TouchableOpacity>
  )
}

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
  text: {
    color: colors.white,
    fontSize: 25,
  },
  small: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  big: {
    paddingHorizontal: 35,
    paddingVertical: 25,
    maxWidth:250,
    
  }
})