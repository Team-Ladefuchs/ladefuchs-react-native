import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../theme";
import { CardHeader } from "./cardHeader";
import { ItalicText } from "./ItalicText";
import HighlightCornerSvg from "../../assets/highlightCorner.svg";

export function BlockingFee({
  feeStart,
  fee,
}: {
  feeStart?: number | null;
  fee?: number | null;
}): JSX.Element {
  let textBlock: JSX.Element;
  let shouldHighlightCorner = false;

  if (feeStart && fee) {
    textBlock = (
      <View>
        <ItalicText text={`› ab Minute ${feeStart}`} />
        <ItalicText text={`› ${fee.toFixed(2)} € / Minute`} />
      </View>
    );
    shouldHighlightCorner = true;
  } else {
    textBlock = <ItalicText text="› keine" />;
  }

  return (
    <View style={styles.container}>
      {shouldHighlightCorner && <HighlightCorner />}
      <CardHeader text="Blockiergebühr" />
      {textBlock}
    </View>
  );
}

function HighlightCorner() {
  return (
    <View style={styles.highlightCorner}>
      <HighlightCornerSvg width={20} height={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: colors.ladefuchsLightGrayBackground,
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
    height: 81,
  },
  highlightCorner: {
    position: "absolute",
    top: -1,
    right: -1,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default BlockingFee;
