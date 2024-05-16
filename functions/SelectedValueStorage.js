//Funktion um aus operator.identifier = cardimage and price zu verknüpfen

// SelectedValueStorage.js
let selectedValue = null;

export const setSelectedValue = (value) => {
  selectedValue = value;
};

export const getSelectedValue = () => {
  return selectedValue;
};

