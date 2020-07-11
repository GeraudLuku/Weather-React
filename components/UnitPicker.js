import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';

import {Picker} from '@react-native-community/picker';

export default function UnitPicker({unitsSystem, setUnitSystem}) {
  return (
    <View style={styles.unitsSystem}>
      <Picker
        selectedValue={unitsSystem}
        onValueChange={item => {
          setUnitSystem (item);
        }}
        mode="dropdown"
        itemStyle={styles.PickerStyle}
      >
        <Picker.Item label="C°" value="metric" />
        <Picker.Item label="F°" value="imperial" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create ({
  unitsSystem: {
    position: 'absolute',
    ...Platform.select ({
      ios: {
        top: -20,
      },
      android: {
        top: 30,
      },
    }),
    height: 50,
    width: 100,
    left: 20,
  },
  PickerStyle: {
    fontSize: 12,
  },
});
