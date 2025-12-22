import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassContainer } from './GlassContainer';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Track } from '../hooks/useMediaLibrary';

interface SongListItemProps {
    track: Track;
    onPress: (track: Track) => void;
}

const formatDuration = (ms: number) => {
    if (!ms || ms <= 0) return '--:--';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const SongListItem: React.FC<SongListItemProps> = ({ track, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPress(track)}
            style={styles.wrapper}
        >
            <GlassContainer style={styles.container} intensity={15}>
                <View style={styles.iconPlaceholder}>
                    <Text style={styles.iconText}>🎵</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
                </View>
                <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
            </GlassContainer>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: SPACING.m,
        marginHorizontal: SPACING.m,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
    },
    iconPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.m,
        backgroundColor: COLORS.backgroundMedium,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    iconText: {
        fontSize: 24,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    artist: {
        color: COLORS.textDim,
        fontSize: 14,
    },
    duration: {
        color: COLORS.textDim,
        fontSize: 12,
        marginLeft: SPACING.m,
    },
});
