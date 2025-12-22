import React from 'react';
import { View, StyleSheet, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

interface ScreenLayoutProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children, style }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Background Gradient */}
            <LinearGradient
                // Deep blue gradient from top-left to bottom-right
                colors={[COLORS.backgroundMedium, COLORS.backgroundDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Content */}
            <View style={[styles.content, style]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundDark, // Fallback
    },
    content: {
        flex: 1,
        // Add safe area handling logic via padding if needed, 
        // or rely on SafeAreaView inside the children. 
        // For now assuming content might want to go edge-to-edge.
    },
});
