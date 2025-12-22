import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from './ScreenLayout';
import { GlassContainer } from './GlassContainer';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Track } from '../hooks/useMediaLibrary';

const { width } = Dimensions.get('window');

interface PlayerModalProps {
    visible: boolean;
    onClose: () => void;
    track: Track | null;
    isPlaying: boolean;
    togglePlayback: () => void;
    playNext: () => void;
    playPrevious: () => void;
    position: number;
    duration: number;
    seek: (millis: number) => void;
    isShuffle: boolean;
    toggleShuffle: () => void;
    repeatMode: 'none' | 'one' | 'all';
    toggleRepeat: () => void;
}

const formatTime = (millis: number) => {
    if (!millis || millis < 0) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const PlayerModal: React.FC<PlayerModalProps> = ({
    visible,
    onClose,
    track,
    isPlaying,
    togglePlayback,
    playNext,
    playPrevious,
    position,
    duration,
    seek,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
}) => {
    if (!track) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <ScreenLayout style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="chevron-down" size={32} color={COLORS.text} />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerSubtitle}>Now Playing</Text>
                            <Text style={styles.headerTitle}>Your Library</Text>
                        </View>
                        <TouchableOpacity style={styles.closeBtn}>
                            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Album Art Section with Glow */}
                    <View style={styles.artSection}>
                        <View style={styles.artGlowContainer}>
                            <View style={styles.glowCircle} />
                        </View>
                        <View style={styles.artShadow}>
                            <GlassContainer style={styles.glassArt} intensity={40}>
                                <Ionicons name="musical-notes" size={width * 0.28} color={COLORS.primary} />
                            </GlassContainer>
                        </View>
                    </View>

                    {/* Info & Progress */}
                    <View style={styles.bottomContent}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
                            <Text style={styles.trackDetails}>Local Audio • {formatTime(duration)}</Text>
                        </View>

                        <View style={styles.progressSection}>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={duration || 100}
                                value={position}
                                onSlidingComplete={seek}
                                minimumTrackTintColor={COLORS.primary}
                                maximumTrackTintColor="rgba(255,255,255,0.08)"
                                thumbTintColor="#fff"
                            />
                            <View style={styles.timeRow}>
                                <Text style={styles.timeLabel}>{formatTime(position)}</Text>
                                <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
                            </View>
                        </View>

                        {/* Main Controls */}
                        <View style={styles.controlsSection}>
                            <View style={styles.secondaryControls}>
                                <TouchableOpacity onPress={toggleShuffle} style={styles.utilBtn}>
                                    <Ionicons
                                        name="shuffle"
                                        size={22}
                                        color={isShuffle ? COLORS.primary : COLORS.textDim}
                                    />
                                    {isShuffle && <View style={styles.activeDot} />}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={toggleRepeat} style={styles.utilBtn}>
                                    <Ionicons
                                        name={repeatMode === 'one' ? "repeat-outline" : "repeat"}
                                        size={22}
                                        color={repeatMode !== 'none' ? COLORS.primary : COLORS.textDim}
                                    />
                                    {repeatMode !== 'none' && <View style={styles.activeDot} />}
                                </TouchableOpacity>
                            </View>

                            <View style={styles.mainControls}>
                                <TouchableOpacity onPress={playPrevious} style={styles.navBtn}>
                                    <Ionicons name="play-skip-back" size={40} color={COLORS.text} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={togglePlayback}>
                                    <GlassContainer style={styles.playBtnGlass} intensity={60}>
                                        <Ionicons
                                            name={isPlaying ? "pause" : "play"}
                                            size={40}
                                            color={COLORS.text}
                                        />
                                    </GlassContainer>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={playNext} style={styles.navBtn}>
                                    <Ionicons name="play-skip-forward" size={40} color={COLORS.text} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </ScreenLayout>
        </Modal >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.m, // Reduced from L
        marginBottom: SPACING.s, // Reduced from M
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerSubtitle: {
        color: COLORS.primary,
        fontSize: 9, // Slightly smaller
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 2,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 13, // Slightly smaller
        fontWeight: 'bold',
        opacity: 0.9,
    },
    closeBtn: {
        padding: SPACING.s,
        width: 44,
        alignItems: 'center',
    },
    artSection: {
        flex: 1, // Reduced flex from 1.2
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginVertical: SPACING.s,
    },
    artGlowContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    glowCircle: {
        width: width * 0.5, // Reduced from 0.6
        height: width * 0.5,
        borderRadius: width * 0.25,
        backgroundColor: COLORS.primary,
        opacity: 0.15,
        shadowColor: COLORS.primary,
        shadowRadius: 80,
        shadowOpacity: 1,
        elevation: 20,
    },
    artShadow: {
        width: width * 0.65, // Reduced from 0.8
        height: width * 0.65,
        borderRadius: BORDER_RADIUS.xxxl,
        backgroundColor: 'rgba(0,0,0,0.4)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 20,
    },
    glassArt: {
        width: '100%',
        height: '100%',
        borderRadius: BORDER_RADIUS.xxxl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContent: {
        flex: 1.2, // Give more space to controls if needed
        paddingBottom: SPACING.xl, // Reduced from XXL
    },
    infoContainer: {
        marginBottom: SPACING.l, // Reduced from XL
        paddingHorizontal: SPACING.s,
    },
    title: {
        color: COLORS.text,
        fontSize: 26, // Reduced from 32
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    trackDetails: {
        color: COLORS.textDim,
        fontSize: 13, // Reduced from 14
        fontWeight: '500',
    },
    progressSection: {
        marginBottom: SPACING.l, // Reduced from XL
    },
    slider: {
        width: '106%',
        height: 36, // Reduced from 40
        alignSelf: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xs,
        marginTop: -6,
    },
    timeLabel: {
        color: COLORS.textDim,
        fontSize: 11, // Reduced from 12
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },
    controlsSection: {
        marginTop: SPACING.s, // Reduced from L
    },
    secondaryControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: width * 0.2, // Reduced from 0.3
        marginBottom: SPACING.l, // Reduced from XXL
    },
    utilBtn: {
        padding: SPACING.s,
        position: 'relative',
        alignItems: 'center',
    },
    activeDot: {
        position: 'absolute',
        bottom: -2,
        width: 3.5,
        height: 3.5,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
    },
    mainControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
    },
    navBtn: {
        padding: SPACING.m,
    },
    playBtnGlass: {
        width: 76, // Reduced from 90
        height: 76,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.25)',
    },
});
