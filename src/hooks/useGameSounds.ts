
import { useCallback, useEffect, useRef } from 'react';

// Sound effect URLs (using reliable public assets or placeholders)
const SOUND_URLS = {
    flip: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3', // Soft crisp click
    correct: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3', // Success bell
    wrong: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c6ccf3232f.mp3', // Negative beep
    win: 'https://cdn.pixabay.com/audio/2021/08/09/audio_88447e769f.mp3', // Victory tune
    hover: 'https://cdn.pixabay.com/audio/2022/03/24/audio_812328148b.mp3', // Subtle hover tick
    tick: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3', // Reusing crisp click for tick (placeholders)
};

export const useGameSounds = () => {
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
    const isMuted = useRef(false);

    useEffect(() => {
        // Preload sounds
        Object.entries(SOUND_URLS).forEach(([key, url]) => {
            const audio = new Audio(url);
            audio.preload = 'auto'; // Preload for instant playback
            audio.volume = key === 'bgm' ? 0.3 : 0.6; // Adjust volumes
            audioRefs.current[key] = audio;
        });

        return () => {
            // Cleanup
            Object.values(audioRefs.current).forEach(audio => {
                audio.pause();
                audio.src = '';
            });
            audioRefs.current = {};
        };
    }, []);

    const playSound = useCallback((type: keyof typeof SOUND_URLS) => {
        if (isMuted.current) return;

        const audio = audioRefs.current[type];
        if (audio) {
            if (type === 'tick') {
                audio.volume = 0.3; // Low volume for tick
            } else {
                audio.volume = 0.6;
            }

            // Clone node for overlapping sounds (e.g. rapid typing/clicking)
            // or just reset current time
            if (type === 'flip' || type === 'hover' || type === 'tick') {
                const clone = audio.cloneNode() as HTMLAudioElement;
                clone.volume = audio.volume;
                clone.play().catch(e => console.log('Audio playback failed', e));
            } else {
                audio.currentTime = 0;
                audio.play().catch(e => console.log('Audio playback failed', e));
            }
        }
    }, []);

    const playFlip = useCallback(() => playSound('flip'), [playSound]);
    const playCorrect = useCallback(() => playSound('correct'), [playSound]);
    const playWrong = useCallback(() => playSound('wrong'), [playSound]);
    const playWin = useCallback(() => playSound('win'), [playSound]);
    const playHover = useCallback(() => playSound('hover'), [playSound]);
    const playTick = useCallback(() => playSound('tick'), [playSound]);

    const toggleMute = useCallback(() => {
        isMuted.current = !isMuted.current;
    }, []);

    return {
        playFlip,
        playCorrect,
        playWrong,
        playWin,
        playHover,
        playTick,
        toggleMute
    };
};
