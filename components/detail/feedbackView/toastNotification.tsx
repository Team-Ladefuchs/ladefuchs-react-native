import React from "react";
import { scale } from "react-native-size-matters";
import Toast, {
	BaseToast,
	ToastConfig,
	ToastConfigParams,
} from "react-native-toast-message";
import { colors } from "../../../theme";

export function ToastNotification(): JSX.Element {
	const toastConfig = {
		success: baseToastConfig,
		error: baseToastConfig,
	} satisfies ToastConfig;
	return <Toast config={toastConfig} />;
}

function baseToastConfig(props: ToastConfigParams<object>) {
	return (
		<BaseToast
			{...props}
			style={{
				backgroundColor: colors.ladefuchsOrange,
				borderLeftWidth: 0,
				height: "100%",
				borderRadius: scale(16),
				top: scale(68),
			}}
			contentContainerStyle={{
				paddingVertical: scale(12),
			}}
			text1Style={{
				fontSize: scale(15),
				color: "#fff",
				marginTop: 1,
				textAlign: "center",
			}}
		/>
	);
}
