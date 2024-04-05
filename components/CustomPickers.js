import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

const CustomPicker = ({ onSelect }) => {
  const [operators, setOperators] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const token = '52549df1e0cda21772f34c6244c9cb7e2ab24ff4'; // Hier setzen Sie Ihren API-Token ein
        const response = await fetch('https://api.ladefuchs.app/v3/operators?standard=false', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch operators');
        }
        const data = await response.json();
        setOperators(data.operators); // Beachten Sie den Unterschied hier
      } catch (error) {
        console.error(error);
      }
    };

    fetchOperators();
  }, []);

  if (!operators) {
    return null;
  }

  return (
    <Picker
      selectedValue={selectedValue}
      style={{ height: 50, width: '100%' }}
      itemStyle={{ fontSize: 20 }}
      onValueChange={(itemValue, itemIndex) => {
        setSelectedValue(itemValue);
        onSelect(itemValue);
      }}
    >
      {operators.map(operator => (
        <Picker.Item key={operator.identifier} label={operator.name} value={operator.identifier} />
      ))}
    </Picker>
  );
};

export default CustomPicker;
