import React from 'react';
import { View, Text } from 'react-native';
import { styles } from "../theme";

function FeedbackView() {
  return (
	<View style={styles.headerView}>
	<Text style={styles.headLine}>Dein Feedback ist uns wichtig</Text>
	<Text style={styles.headerText}>
		Hast Du Futter für den Fuchs?.
	</Text>
	<Text style={styles.headerText}>
		Gibt es einen neuen Preis?.
	</Text>
	<Text style={styles.headerText}>
		Gibt es einen neuen Tarif?.
	</Text>
</View>
  );
}

export default FeedbackView;
