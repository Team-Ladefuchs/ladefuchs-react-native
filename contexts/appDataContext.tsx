import React, { createContext } from "react";
import { AppData } from "../types/app";

// Create a context for AppData
export const AppDataContext = createContext<AppData | undefined>(undefined);


// hier speichern wir unseren globalen state
export function AppDataProvider(props: {
	value: AppData;
	children: React.ReactNode;
}): JSX.Element {
	const { value, children } = props;

	return (
		<AppDataContext.Provider value={value}>
			{children}
		</AppDataContext.Provider>
	);
}
