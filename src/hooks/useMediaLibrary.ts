import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

export interface Track {
    id: string;
    title: string;
    artist: string;
    duration: number;
    uri: string;
    albumId?: string;
}

export const useMediaLibrary = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    const fetchAudioFiles = async () => {
        try {
            setLoading(true);
            // Fetch assets of type Audio
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: 'audio',
            });

            // Map to our simplified Track interface
            const formattedTracks: Track[] = media.assets.map((asset) => ({
                id: asset.id,
                title: asset.filename.split('.').slice(0, -1).join('.') || asset.filename, // Basic filename as title
                artist: 'Unknown Artist', // Artist/Album meta-data depends on library version/Android API
                duration: asset.duration,
                uri: asset.uri,
                albumId: asset.albumId,
            }));

            setTracks(formattedTracks);
            setError(null);
        } catch (err) {
            console.error('Error fetching audio files:', err);
            setError('Failed to load music files.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (permissionResponse?.status === 'granted') {
            fetchAudioFiles();
        } else if (permissionResponse?.canAskAgain) {
            requestPermission();
        }
    }, [permissionResponse]);

    return {
        tracks,
        loading,
        error,
        permissionStatus: permissionResponse?.status,
        refresh: fetchAudioFiles,
    };
};
