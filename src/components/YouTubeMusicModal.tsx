import React, { useRef } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS } from '../constants/theme';

interface YouTubeMusicModalProps {
    visible: boolean;
    onClose: () => void;
}

export const YouTubeMusicModal: React.FC<YouTubeMusicModalProps> = ({ visible, onClose }) => {
    const webViewRef = useRef<WebView>(null);

    // Block external navigation and keep music playing
    const injectedJS = `
        (function() {
            // Prevent visibility change from stopping playback
            Object.defineProperty(document, 'hidden', { value: false, writable: false });
            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
            window.addEventListener('visibilitychange', function(e) {
                e.stopImmediatePropagation();
            }, true);
        })();
        true;
    `;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

                <WebView
                    ref={webViewRef}
                    source={{ uri: 'https://music.youtube.com' }}
                    style={styles.webview}
                    allowsBackgroundPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    injectedJavaScript={injectedJS}
                    onShouldStartLoadWithRequest={(request) => {
                        // Keep it inside YT Music
                        return request.url.includes('music.youtube.com');
                    }}
                />

                {/* Close Button with Glass Effect */}
                <View style={styles.closeButtonContainer}>
                    <BlurView intensity={20} tint="dark" style={styles.closeButton}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButtonInner}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </BlurView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 999,
    },
    closeButton: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    closeButtonInner: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});
