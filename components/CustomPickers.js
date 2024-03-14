import React, { useState } from 'react';
import {Picker} from '@react-native-picker/picker';

const CustomPicker = ({ onSelect }) => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <Picker
      selectedValue={selectedValue}
      style={{ height: 50, width: '100%' }}
      onValueChange={(itemValue, itemIndex) => {
        setSelectedValue(itemValue);
        onSelect(itemValue); // Die Anbieter werden vermutlich aus dem Backend geladen
      }}
    >
      <Picker.Item label="Aldi Süd" value="id1" />
        <Picker.Item label="Allego" value="id2" />
        <Picker.Item label="Aral pulse" value="id3" />
        <Picker.Item label="be.ENERGISED" value="id5" />
        <Picker.Item label="Berliner Stadtwerke" value="id6" />
        <Picker.Item label="Chargepoint" value="id7" />
        <Picker.Item label="Citywatt" value="id8" />
        <Picker.Item label="Comfort Charge" value="id9" />
        <Picker.Item label="Compleo / Innogy" value="id10" />
        <Picker.Item label="Elli" value="id11" />
        <Picker.Item label="EnBW" value="id4" />
        <Picker.Item label="E.ON" value="id12" />
        <Picker.Item label="EWE SWB" value="id13" />
        <Picker.Item label="Fastnet" value="id14" />
        <Picker.Item label="Ionity" value="id15" />
        <Picker.Item label="Kaufland" value="id16" />
        <Picker.Item label="Ladenetz" value="id17" />
        <Picker.Item label="Ladeverbund+" value="id18" />
        <Picker.Item label="Lichtblick (ChargeIT)" value="id19" />
        <Picker.Item label="Lidl" value="id20" />
        <Picker.Item label="Mer Germany" value="id21" />
        <Picker.Item label="Pfalzwerke" value="id22" />
        <Picker.Item label="Shell Recharge" value="id23" />
        <Picker.Item label="Stromnetz Hamburg" value="id24" />
        <Picker.Item label="TankE" value="id25" />
    </Picker>
  );
};

export default CustomPicker;
