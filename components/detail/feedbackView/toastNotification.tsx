import React from "react";
import { scale } from "react-native-size-matters";
import Toast, {
	BaseToast,
	ToastConfig,
	ToastConfigParams,
} from "react-native-toast-message";
import { colors } from "../../../theme";
import { Platform } from "react-native";

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
				width: "90%",
				borderRadius: scale(16),
				top: Platform.OS === "ios" ? scale(68) : scale(40),
			}}
			contentContainerStyle={{
				paddingVertical: scale(11),
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
