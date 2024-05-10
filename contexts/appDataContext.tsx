import React, { createContext, useState } from "react";
import { AppData } from "../types/app";
import { TariffCondition } from "../types/conditions";

// Create a context for AppData
export const AppDataContext = createContext<AppData | undefined>(undefined);

// hier speichern wir unseren globalen state
export function AppDataProvider(props: {
	value: AppData;
	children: React.ReactNode;
}): JSX.Element {
	const { value, children } = props;
	const [operatorId, setOperatorId] = useState<string | undefined>(undefined);
	const [tariffConditions, setTariffConditions] = useState<TariffCondition[]>(
		[]
	);

	return (
		<AppDataContext.Provider
			value={{
				...value,
				operatorId,
				setOperatorId,
				tariffConditions,
				setTariffConditions,
			}}
		>
			{children}
		</AppDataContext.Provider>
	);
}
