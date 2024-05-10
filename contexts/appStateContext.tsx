import React, { createContext, useState } from "react";
import { AppData, AppState } from "../types/app";
import { TariffCondition } from "../types/conditions";

// Create a context for AppData
export const AppStateContext = createContext<AppState | undefined>(undefined);

// hier lagern wir unseren globalen state
export function AppStateProvider(props: {
	value: AppData;
	children: React.ReactNode;
}): JSX.Element {
	const { value, children } = props;
	const [operatorId, setOperatorId] = useState<string | undefined>(undefined);
	const [tariffConditions, setTariffConditions] = useState<TariffCondition[]>(
		[]
	);

	return (
		<AppStateContext.Provider
			value={{
				...value,
				operatorId,
				setOperatorId,
				tariffConditions,
				setTariffConditions,
			}}
		>
			{children}
		</AppStateContext.Provider>
	);
}
