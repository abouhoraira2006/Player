import { useState, useEffect, useCallback } from 'react';
import { useAudioPlayer as useExpoAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Audio, InterruptionModeAndroid } from 'expo-av';
import { useKeepAwake } from 'expo-keep-awake';
import { Track } from './useMediaLibrary';

export const useAudioPlayer = (tracks: Track[]) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');

    // Keep the CPU awake whenever the player is active
    useKeepAwake();

    // Persistent player with background support enabled
    const player = useExpoAudioPlayer(currentTrack?.uri || null, {
        updateInterval: 500,
        keepAudioSessionActive: true,
    });
    const status = useAudioPlayerStatus(player);

    // Sync metadata and enable system-level background playback
    useEffect(() => {
        if (currentTrack && player) {
            const metadata = {
                title: currentTrack.title,
                artist: 'Local Audio',
                albumTitle: 'Your Library',
            };

            // This tells the OS to keep the audio active for lock screen/background
            player.setActiveForLockScreen(true, metadata, {
                showSeekForward: true,
                showSeekBackward: true,
            });
        }
    }, [currentTrack, player]);

    // Auto-play when track is selected
    useEffect(() => {
        if (currentTrack && player) {
            player.play();
        }
    }, [currentTrack, player]);

    // Handle track finishing
    useEffect(() => {
        if (status.didJustFinish) {
            if (repeatMode === 'one') {
                player.seekTo(0);
                player.play();
            } else {
                playNext();
            }
        }
    }, [status.didJustFinish, repeatMode]);

    const playTrack = useCallback((track: Track) => {
        setCurrentTrack(track);
    }, []);

    const playNext = useCallback(() => {
        if (!tracks.length) return;
        let nextIndex = 0;

        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * tracks.length);
        } else {
            const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
            nextIndex = (currentIndex + 1) % tracks.length;
        }

        setCurrentTrack(tracks[nextIndex]);
    }, [tracks, isShuffle, currentTrack]);

    const playPrevious = useCallback(() => {
        if (!tracks.length) return;
        const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        setCurrentTrack(tracks[prevIndex]);
    }, [tracks, currentTrack]);

    const togglePlayback = useCallback(() => {
        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
    }, [player, status.playing]);

    const seek = useCallback((millis: number) => {
        player.seekTo(millis / 1000);
    }, [player]);

    const toggleShuffle = () => setIsShuffle(!isShuffle);

    const toggleRepeat = () => {
        const modes: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
        const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
        setRepeatMode(nextMode);
    };

    return {
        isPlaying: status.playing,
        currentTrack,
        position: (status.currentTime || 0) * 1000,
        duration: (status.duration || 0) * 1000,
        isShuffle,
        repeatMode,
        playTrack,
        playNext,
        playPrevious,
        togglePlayback,
        seek,
        toggleShuffle,
        toggleRepeat,
    };
};
