import React from "react";
import { Modal, View, Text, Button, TouchableOpacity, Linking } from "react-native";
import { styles } from "../theme";

type InfoModalProps = {
    visible: boolean;
    onClose: () => void;
};

export function InfoModal({ visible, onClose }: InfoModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
            }}>
                <View style={{
                    backgroundColor: "white",
                    padding: 24,
                    borderRadius: 12,
                    maxWidth: "80%",
                }}>
                    <Text style={styles.headLine}>Liebe Ladefuchs-User:innen,</Text>
                    <Text style={styles.italicText}>
                        vielleicht habt ihr schon bemerkt, dass sich im Fuchsbau einiges verschoben hat und gerade nicht alles so steht,
                        wie es soll. Wir wissen, dass dringend der Renovierungstrupp losgeschickt werden muss – und genau das haben wir bereits getan!
                        {"\n"}{"\n"}
                        Alles wieder in Ordnung zu bringen ist ein Fulltime-Job. Allerdings ist der Ladefuchs schon immer ein ehrenamtliches Projekt, an dem zwei Entwickler in ihrer Freizeit tüfteln. 
                        Wir geben unser Bestes, um euch die volle Funktionalität vom Ladefuchs schnellstmöglich zurückzubringen, müssen euch aber um ein wenig Geduld bitten. 
                        {"\n"}
                        Alle aktuellen Updates findet ihr unter: 
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={async () => await Linking.openURL('https://electroverse.tech/@ladefuchs')}
                        style={{ marginVertical: 8 }}
                    >
                        <Text style={styles.settingsLink}>
                            electroverse.tech/@ladefuchs
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.italicText}>
                        Liebe Grüße{"\n"}eure Ladefüchse            
                    </Text>
                    <Button
                        title="Schließen"
                        onPress={onClose}
                    />
                </View>
            </View>
        </Modal>
    );
}