import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS } from '../constants/theme';

interface GlassContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
    showHighlight?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
    children,
    style,
    intensity = 40,
    showHighlight = true
}) => {
    return (
        <View style={[styles.container, style]}>
            <BlurView
                intensity={intensity}
                tint="dark"
                style={StyleSheet.absoluteFillObject}
            />
            {showHighlight && (
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.02)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                />
            )}
            <View style={styles.borderOverlay} />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: BORDER_RADIUS.l,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    borderOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: BORDER_RADIUS.l,
        opacity: 0.8,
    },
    content: {
        zIndex: 1,
    },
});
