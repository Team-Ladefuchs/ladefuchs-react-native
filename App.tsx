import React, { useEffect } from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AboutScreen } from "./screens/about";
import { HomeScreen } from "./screens/home";
import { colors } from "./theme";
import { AppHeader } from "./components/header/appHeader";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { fetchAllApiData } from "./functions/api";
import { DetailScreen } from "./screens/detailView";
import { Tariff } from "./types/tariff";
import { CloseButton } from "./components/header/closeButton";
import { DetailHeader } from "./components/detail/detailHeader";
import { StatusBar } from "react-native";
import { useAppStore } from "./state/state";
import { useShallow } from "zustand/react/shallow";
import { useCustomFonts } from "./hooks/customFont";
import { useAppStateListener } from "./hooks/AppStateListener";

disableAutoFontScaling();
const queryClient = new QueryClient();
const RootStack = createStackNavigator();

export default function App(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<AppWrapper />
		</QueryClientProvider>
	);
}

function AppWrapper(): JSX.Element {
	const [setAppData, setAppError, operators] = useAppStore(
		useShallow((state) => [
			state.setAppData,
			state.setAppError,
			state.operators,
		])
	);

	const allApiData = useQuery({
		queryKey: ["AllApiData"],
		queryFn: async () => {
			return await fetchAllApiData({
				writeToCache: !operators.length,
			});
		},
	});

	useAppStateListener();
	useEffect(() => {
		setAppError(allApiData?.error);
		if (!allApiData.data) {
			return;
		}
		setAppData(allApiData.data);
	}, [allApiData.data, allApiData.error]);

	const fontsLoaded = useCustomFonts();
	const statusBar = <StatusBar barStyle="default" backgroundColor="#fff" />;
	if (!fontsLoaded) {
		return statusBar;
	}

	return (
		<NavigationContainer>
			{statusBar}
			<RootStack.Navigator>
				<RootStack.Group>
					<RootStack.Screen
						name="Home"
						component={HomeScreen}
						options={({}) => ({
							header: () => {
								return <AppHeader />;
							},
							headerStyle: {
								backgroundColor: colors.ladefuchsDarkBackground,
							},
							headerTintColor: colors.ladefuchsOrange,
						})}
					/>
				</RootStack.Group>
				<RootStack.Group
					screenOptions={{
						presentation: "modal",
					}}
				>
					<RootStack.Screen
						component={DetailScreen}
						options={({ navigation, route }: any): object => ({
							headerBackTitleVisible: false,
							headerLeft: null,
							header: () => {
								const tariff = route.params["tariff"] as Tariff;
								return (
									<DetailHeader
										tariff={tariff}
										navigation={navigation}
									/>
								);
							},
							headerRight: null,
							headerTitleStyle: {
								display: "none",
							},
						})}
						name="detailScreen"
					/>
				</RootStack.Group>
				<RootStack.Group
					screenOptions={{
						presentation: "modal",
					}}
				>
					<RootStack.Screen
						name="Einstellungen"
						options={modalHeader}
						component={AboutScreen}
					/>
				</RootStack.Group>
			</RootStack.Navigator>
		</NavigationContainer>
	);
}

function modalHeader({
	navigation,
}: {
	navigation: { goBack: () => void };
}): object {
	return {
		headerBackTitleVisible: false,
		headerLeft: null,
		headerRight: () => {
			return (
				<CloseButton
					onPress={() => navigation.goBack()}
					style={{ marginRight: 16 }}
				/>
			);
		},
		headerStyle: {
			backgroundColor: colors.ladefuchsLightBackground,
		},
		headerTintColor: colors.ladefuchsOrange, // Farbe für den Header-Text
	};
}

function disableAutoFontScaling(): void {
	interface TextWithDefaultProps extends Text {
		defaultProps?: { allowFontScaling?: boolean };
	}
	(Text as unknown as TextWithDefaultProps).defaultProps =
		(Text as unknown as TextWithDefaultProps).defaultProps || {};
	(Text as unknown as TextWithDefaultProps).defaultProps!.allowFontScaling =
		false;
}
