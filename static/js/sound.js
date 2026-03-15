/**
 * sound.js - Web Audio API for sorting sounds
 */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let soundEnabled = false;

// We use an oscillator node mapped to the array values.
// Higher value = higher frequency.
function playNote(freq, type = 'sine', duration = 0.05) {
    if (!soundEnabled) return;
    
    // Resume context if suspended (browser auto-play policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Envelope to avoid clicking
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// Map value to a frequency range
// Assuming typical value range is 10 to 100
function getFrequency(val, maxVal = 100) {
    const minFreq = 120; // Approx B2
    const maxFreq = 1200; // Approx D6
    // Normalize val
    const normalized = Math.max(0, Math.min(1, val / maxVal));
    return minFreq + normalized * (maxFreq - minFreq);
}

const SoundPlayer = {
    toggle: function() {
        soundEnabled = !soundEnabled;
        if (soundEnabled && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return soundEnabled;
    },
    
    isEnabled: function() {
        return soundEnabled;
    },

    playCompare: function(val1, val2, maxVal) {
        if (!soundEnabled) return;
        const f1 = getFrequency(val1, maxVal);
        playNote(f1, 'sine', 0.05);
        if (val2 !== undefined) {
            const f2 = getFrequency(val2, maxVal);
            // Play a slightly different type or just a chord
            playNote(f2, 'sine', 0.05);
        }
    },

    playSwap: function(val1, val2, maxVal) {
        if (!soundEnabled) return;
        const f1 = getFrequency(val1, maxVal);
        playNote(f1, 'triangle', 0.1);
    },

    playSorted: function(val, maxVal) {
        if (!soundEnabled) return;
        const f = getFrequency(val, maxVal);
        playNote(f, 'sine', 0.1);
    },
    
    playComplete: function() {
        if (!soundEnabled) return;
        // Play a little chime
        playNote(440, 'sine', 0.1);
        setTimeout(() => playNote(554.37, 'sine', 0.1), 100);
        setTimeout(() => playNote(659.25, 'sine', 0.2), 200);
        setTimeout(() => playNote(880, 'sine', 0.4), 300);
    }
};

window.SoundPlayer = SoundPlayer;
