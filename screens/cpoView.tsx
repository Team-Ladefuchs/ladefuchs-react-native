import React, { useState, useRef } from "react";
import {
  FlatList,
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  InteractionManager,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const DATA = Array.from({ length: 100 }, (_, i) => ({
  id: (i + 1).toString(),
  title: `${[
    "Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike",
    "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"
  ][i % 26]}`,
}));

const sortedData = DATA.sort((a, b) => a.title.localeCompare(b.title));

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

const Item = ({ item, onIncrement, onDecrement }) => {
  const swipeableRef = useRef(null);

  const renderRightActions = () => (
    <View style={styles.rightactionContainer}>
      <TouchableOpacity
        onPress={() => {
          onIncrement(item);
          swipeableRef.current?.close();
        }}
      >
        <Text style={styles.actionText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLeftActions = () => (
    <View style={styles.leftactionContainer}>
      <TouchableOpacity
        onPress={() => {
          onDecrement(item);
          swipeableRef.current?.close();
        }}
      >
        <Text style={styles.actionText}>-</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
    >
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </Swipeable>
  );
};

export function CPOView() {
  const [search, setSearch] = useState("");
  const flatListRef = useRef(null);

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handleAlphabetSearch = (letter) => {
    const index = sortedData.findIndex(
      (item) => item.title.charAt(0).toUpperCase() === letter,
    );
    if (index >= 0 && flatListRef.current) {
      InteractionManager.runAfterInteractions(() => {
        const itemCount = sortedData.length;
        if (index >= 0 && index < itemCount) {
          flatListRef.current.scrollToIndex({
            animated: true,
            index,
          });
        }
      });
    }
  };

  const handleIncrement = (item) => {
    console.log(1);
  };

  const handleDecrement = (item) => {
    console.log(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TextInput
        style={styles.searchBar}
        placeholder="Search by title..."
        value={search}
        onChangeText={handleSearch}
      />
      <View style={styles.mainContainer}>
        <FlatList
          ref={flatListRef}
          data={sortedData.filter((item) =>
            item.title.toLowerCase().includes(search.toLowerCase()),
          )}
          renderItem={({ item }) => (
            <Item
              item={item}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          )}
          keyExtractor={(item) => item.id}
        />
        {!search && (
          <View style={styles.alphabetContainer}>
            {ALPHABET.map((letter) => (
              <TouchableOpacity
                key={letter}
                onPress={() => handleAlphabetSearch(letter)}
              >
                <Text style={styles.letter}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#F3EEE2",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
  },
  mainContainer: {
    flexDirection: "row",
    flex: 1,
  },
  item: {
    backgroundColor: "rgba(194,180,156, 0.4)",
    padding: 20,
    marginVertical: 2,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
  },
  alphabetContainer: {
    justifyContent: "center",
    paddingRight: 10,
  },
  letter: {
    fontSize: 15,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  leftactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    backgroundColor: "red",
	borderRadius: 12,
  },
  rightactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    backgroundColor: "green",
	borderRadius: 12,
  },
  actionText: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
