import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { ScreenLayout } from './src/components/ScreenLayout';
import { SongListItem } from './src/components/SongListItem';
import { COLORS, SPACING, BORDER_RADIUS } from './src/constants/theme';
import { useMediaLibrary, Track } from './src/hooks/useMediaLibrary';
import { useAudioPlayer } from './src/hooks/useAudioPlayer';
import { GlassContainer } from './src/components/GlassContainer';
import { PlayerModal } from './src/components/PlayerModal';

const formatTime = (millis: number) => {
  if (!millis || millis < 0) return '0:00';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function App() {
  const { tracks, loading, error } = useMediaLibrary();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    isShuffle,
    repeatMode,
    playTrack,
    playNext,
    playPrevious,
    togglePlayback,
    seek,
    toggleShuffle,
    toggleRepeat
  } = useAudioPlayer(tracks);

  const handleSongPress = (track: Track) => {
    playTrack(track);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Your Library</Text>
      <Text style={styles.subtitle}>{tracks.length} Tracks found</Text>
    </View>
  );

  return (
    <ScreenLayout>
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={COLORS.primary} size="large" />
            <Text style={styles.status}>Scanning your device...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={tracks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SongListItem track={item} onPress={handleSongPress} />
              )}
              ListHeaderComponent={renderHeader}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />

            {currentTrack && (
              <View style={styles.miniPlayerWrapper}>
                <TouchableOpacity onPress={() => setIsModalVisible(true)} activeOpacity={0.9}>
                  <GlassContainer style={styles.miniPlayer} intensity={60}>
                    <View style={styles.miniProgressBar}>
                      <View
                        style={[
                          styles.miniProgressFill,
                          { width: `${(position / (duration || 1)) * 100}%` }
                        ]}
                      />
                    </View>

                    <View style={styles.playerMainControls}>
                      <View style={styles.miniPlayerInfo}>
                        <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                          {currentTrack.title}
                        </Text>
                      </View>

                      <View style={styles.miniPlayerControls}>
                        <TouchableOpacity onPress={playPrevious} style={styles.miniControlBtn}>
                          <Ionicons name="play-skip-back" size={24} color={COLORS.text} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={togglePlayback} style={styles.miniPlayBtn}>
                          <Ionicons
                            name={isPlaying ? "pause-circle" : "play-circle"}
                            size={38}
                            color={COLORS.text}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={playNext} style={styles.miniControlBtn}>
                          <Ionicons name="play-skip-forward" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </GlassContainer>
                </TouchableOpacity>
              </View>
            )}

            <PlayerModal
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              track={currentTrack}
              isPlaying={isPlaying}
              togglePlayback={togglePlayback}
              playNext={playNext}
              playPrevious={playPrevious}
              position={position}
              duration={duration}
              seek={seek}
              isShuffle={isShuffle}
              toggleShuffle={toggleShuffle}
              repeatMode={repeatMode}
              toggleRepeat={toggleRepeat}
            />
          </>
        )}
      </SafeAreaView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textDim,
    marginTop: SPACING.xs,
  },
  status: {
    fontSize: 14,
    color: COLORS.textDim,
    marginTop: SPACING.m,
  },
  error: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 120,
  },
  miniPlayerWrapper: {
    position: 'absolute',
    bottom: SPACING.l,
    left: SPACING.m,
    right: SPACING.m,
  },
  miniPlayer: {
    padding: SPACING.m,
    paddingTop: 0,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  miniProgressBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '120%',
    marginLeft: '-10%',
    marginBottom: SPACING.m,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  playerMainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniPlayerInfo: {
    flex: 1,
    marginRight: SPACING.s,
  },
  miniPlayerTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  miniControlBtn: {
    padding: SPACING.s,
  },
  miniPlayBtn: {
    padding: SPACING.xs,
  },
});

