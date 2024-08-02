import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ScaledSheet, scale } from "react-native-size-matters";
import { CardImage } from "../components/shared/cardImage";
import { SwipeList } from "../components/shared/swipeList";
import { useDebounceInput } from "../hooks/useDebounceInput";
import { colors } from "../theme";
import { SearchInput } from "../components/shared/searchInput";
import {
  readTariffSettings,
  saveTariffSettings,
} from "../functions/storage/tariffStorage";
import { Tariff } from "../types/tariff";
import { useFetchAppData } from "../hooks/usefetchAppData";
import { fetchTariffs } from "../functions/api/tariff";
import { AlphabetList } from "../components/shared/alphabetList";

const adHocRegex = /ad[-]?hoc/i;

export function TariffListScreen(): JSX.Element {
  const [search, setSearch] = useDebounceInput();
  const [tariffAddList, setTariffAddList] = useState<Tariff[]>([]);
  const { allChargeConditionsQuery } = useFetchAppData();
  const swipeListRef = useRef<any>(null); // Change `any` to the appropriate type if possible

  useEffect(() => {
    readTariffSettings().then(({ toAdd }) => {
      setTariffAddList(toAdd ?? []);
    });
  }, []);

  useEffect(() => {
    const saveSettings = () => {
      saveTariffSettings({
        toAdd: tariffAddList,
      }).then(() => {
        if (allChargeConditionsQuery.isFetching) {
          return;
        }
        allChargeConditionsQuery.refetch();
      });
    };

    return () => {
      saveSettings();
    };
  }, [allChargeConditionsQuery, tariffAddList]);
  useEffect(() => {
	console.log("Tariffs", tariffAddList);
}, [tariffAddList]);

  const allTariffsQuery = useQuery({
    queryKey: ["AllTariffs"],
    retry: 3,
    queryFn: async () => {
      const tariffs = await fetchTariffs({ standard: false });
      return tariffs
        .filter((tariff) => !tariff.isStandard)
        .filter((tariff) => !adHocRegex.test(tariff.name));
    },
  });

  const filteredTariffs = useMemo(() => {
    const tariffs = allTariffsQuery.data ?? [];
    return tariffs.filter((tariff) =>
      tariff.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, allTariffsQuery.data]);

  const scrollToTariff = (letter: string) => {
    const index = filteredTariffs.findIndex(
      (tariff) => tariff.name[0].toLowerCase() === letter.toLowerCase()
    );
    if (index >= 0 && swipeListRef.current) {
      swipeListRef.current.scrollToIndex(index);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={scale(110)} // Adjust this value as needed
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.listContainer}>
          <SwipeList
            ref={swipeListRef}
            containerStyle={styles.listItemContainer}
            data={filteredTariffs}
            onRemove={(item) => {
              setTariffAddList([
                ...tariffAddList.filter(
                  ({ identifier }) =>
                    identifier !== item.identifier,
                ),
              ]);
            }}
            onAdd={(item) => {
              setTariffAddList([item, ...tariffAddList]);
            }}
            renderItem={(item) => {
              return (
                <View style={styles.itemBody}>
                  <CardImage
                    tariff={item}
                    width={60}
                    hideFallBackText={true}
                  />
                  <View
                    style={{
                      flex: 2,
                      marginRight: scale(16),
                    }}
                  >
                    <Text style={styles.tariffText}>
                      {item.name}
                    </Text>
                    <Text style={styles.providerText}>
                      {item.providerName}
                    </Text>
                  </View>
                </View>
              );
            }}
            exists={(item) =>
              tariffAddList
                .map(({ identifier }) => identifier)
                .includes(item.identifier) || item.isStandard
            }
          />
        </View>
      </TouchableWithoutFeedback>
	  <AlphabetList onLetterPress={scrollToTariff} />
      <SearchInput
        setSearch={setSearch}
        placeHolder="Search by title..."
      />

    </KeyboardAvoidingView>
  );
}
const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.ladefuchsLightBackground,
    },
	mainContainer: {
    flexDirection: 'row',
  },
    listContainer: {
        marginHorizontal: "16@s",
		marginRight:"30@s",
        flex: 2,
        flexDirection: 'row',
    },
    listItemContainer: {
        paddingVertical: "5@s",
        paddingLeft: "12@s",
        paddingRight: "20@s",
        display: "flex",
        height: "86@s",
        gap: "10@s",
    },
    itemBody: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10@s",
    },
    tariffText: {
        fontSize: "14@s",
        fontWeight: "bold",
    },
    providerText: {
        color: "#605C54",
        fontSize: "14@s",
    },
});
