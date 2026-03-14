/* ═══════════════════════════════════════════════════════════════
   animator.js — Plays back pre-computed Step arrays
   ═══════════════════════════════════════════════════════════════ */

const Animator = (() => {
    let steps = [];
    let index = 0;
    let playing = false;
    let timerId = null;
    let speed = 200;        // ms between steps (lower = faster)

    // ── DOM refs ────────────────────────────────────────────
    const playIcon   = document.getElementById('play-icon');
    const pauseIcon  = document.getElementById('pause-icon');
    const progressEl = document.getElementById('progress-fill');
    const messageBar = document.getElementById('message-bar');
    const statComparisons = document.getElementById('stat-comparisons');
    const statSwaps  = document.getElementById('stat-swaps');
    const statStep   = document.getElementById('stat-step');

    // ── Core ────────────────────────────────────────────────
    function loadSteps(newSteps) {
        stop();
        steps = newSteps;
        index = 0;
        renderCurrent();
    }

    function renderCurrent() {
        if (steps.length === 0) return;
        const step = steps[index];

        Renderer.renderBars(step);
        Renderer.renderDS(step);
        updateStats(step);
        updateProgress();
        messageBar.textContent = step.message || '';
    }

    function updateStats(step) {
        const s = step.stats || {};
        statComparisons.textContent = s.comparisons ?? 0;
        statSwaps.textContent = s.swaps ?? 0;
        statStep.textContent = `${index + 1} / ${steps.length}`;
    }

    function updateProgress() {
        const pct = steps.length > 1
            ? (index / (steps.length - 1)) * 100
            : 100;
        progressEl.style.width = `${pct}%`;
    }

    // ── Playback Controls ──────────────────────────────────
    function play() {
        if (steps.length === 0) return;
        if (index >= steps.length - 1) {
            index = 0;  // restart
        }
        playing = true;
        showPauseIcon();
        tick();
    }

    function tick() {
        if (!playing || index >= steps.length - 1) {
            stop();
            return;
        }
        index++;
        renderCurrent();
        timerId = setTimeout(tick, speed);
    }

    function pause() {
        playing = false;
        clearTimeout(timerId);
        timerId = null;
        showPlayIcon();
    }

    function stop() {
        pause();
        // keep current index, don't reset
    }

    function togglePlay() {
        playing ? pause() : play();
    }

    function stepForward() {
        if (index < steps.length - 1) {
            pause();
            index++;
            renderCurrent();
        }
    }

    function stepBack() {
        if (index > 0) {
            pause();
            index--;
            renderCurrent();
        }
    }

    function reset() {
        pause();
        index = 0;
        if (steps.length > 0) {
            renderCurrent();
        }
    }

    function setSpeed(value) {
        // value: 1 (slowest) to 100 (fastest)
        // Map to delay: 500ms (slow) to 10ms (fast)
        speed = Math.round(500 - (value / 100) * 490);
    }

    // ── Icon toggling ──────────────────────────────────────
    function showPlayIcon() {
        playIcon.style.display = '';
        pauseIcon.style.display = 'none';
    }

    function showPauseIcon() {
        playIcon.style.display = 'none';
        pauseIcon.style.display = '';
    }

    // ── State queries ──────────────────────────────────────
    function isPlaying() { return playing; }
    function hasSteps()  { return steps.length > 0; }

    // ── Public API ─────────────────────────────────────────
    return {
        loadSteps,
        play,
        pause,
        togglePlay,
        stepForward,
        stepBack,
        reset,
        setSpeed,
        isPlaying,
        hasSteps
    };
})();
