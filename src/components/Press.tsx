import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';

type PressProps = {
  title: string;
  onPress: () => void;
};

export const Press = (props: PressProps) => {
  const {onPress, title} = props;

  return (
    <TouchableHighlight
      style={styles.buttonContainer}
      onPress={() => {
        onPress();
      }}>
      <Text style={styles.button}>{title}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 40,
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 2,
    textAlign: 'center',
    paddingVertical: 10,
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: '#00c',
  },
});
