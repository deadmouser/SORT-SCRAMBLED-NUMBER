/* ═══════════════════════════════════════════════════════════════
   renderer.js — Renders bars and DS panel from a Step object
   ═══════════════════════════════════════════════════════════════ */

const Renderer = (() => {
    // ── DOM refs ────────────────────────────────────────────
    const barChart = document.getElementById('bar-chart');
    const dsContent = document.getElementById('ds-panel-content');
    const dsType   = document.getElementById('ds-panel-type');

    // ── Bar Rendering ──────────────────────────────────────
    function renderBars(step) {
        const arr = step.arr;
        const states = step.barStates || {};
        const maxVal = Math.max(...arr, 1);
        const showNums = arr.length <= 30;  // hide numbers if too many bars

        barChart.innerHTML = '';

        arr.forEach((val, i) => {
            const bar = document.createElement('div');
            const state = states[String(i)] || 'default';
            const pct = (val / maxVal) * 100;

            bar.className = `bar bar--${state}`;
            bar.style.height = `${pct}%`;

            if (showNums) {
                bar.setAttribute('data-value', val);
            }

            barChart.appendChild(bar);
        });
    }

    // ── DS Panel Routing ───────────────────────────────────
    function renderDS(step) {
        const type = step.dsType || 'array';
        const data = step.dsData || {};

        switch (type) {
            case 'array':
                dsType.textContent = 'Array Visualization';
                renderArrayDS(step.arr, data);
                break;
            case 'merge':
                dsType.textContent = 'Merge — Auxiliary Arrays';
                renderMergeDS(data);
                break;
            case 'stack':
                dsType.textContent = 'Quick Sort — Call Stack';
                renderStackDS(data);
                break;
            case 'buckets':
                dsType.textContent = `Radix Sort — Digit Buckets (${data.digitLabel || ''})`;
                renderBucketsDS(data);
                break;
            default:
                dsType.textContent = type;
                dsContent.innerHTML = '';
        }
    }

    // ── Array DS ───────────────────────────────────────────
    function renderArrayDS(arr, data) {
        const highlights = data.highlights || {};
        const markers = data.markers || {};
        const regions = data.regions || {};

        dsContent.innerHTML = '';

        // Optional region labels
        if (regions.sorted || regions.unsorted) {
            const regContainer = document.createElement('div');
            regContainer.style.cssText = 'display:flex; width:100%; margin-bottom:4px; gap:2px;';

            if (regions.sorted) {
                const lbl = document.createElement('span');
                lbl.className = 'ds-region-label ds-region-label--sorted';
                lbl.textContent = 'SORTED';
                regContainer.appendChild(lbl);
            }
            if (regions.unsorted) {
                const lbl = document.createElement('span');
                lbl.className = 'ds-region-label ds-region-label--unsorted';
                lbl.textContent = 'UNSORTED';
                regContainer.appendChild(lbl);
            }

            dsContent.appendChild(regContainer);
        }

        // Array boxes row
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; gap:2px; align-items:flex-end;';

        arr.forEach((val, i) => {
            const box = document.createElement('div');
            box.className = 'ds-box';

            // Marker above
            const marker = document.createElement('div');
            marker.className = 'ds-marker';
            marker.textContent = markers[String(i)] || '';
            box.appendChild(marker);

            // Cell
            const cell = document.createElement('div');
            const hlState = highlights[String(i)] || '';
            cell.className = `ds-cell${hlState ? ` ds-cell--${hlState}` : ''}`;
            cell.textContent = val;
            box.appendChild(cell);

            // Index below
            const idx = document.createElement('div');
            idx.className = 'ds-index';
            idx.textContent = i;
            box.appendChild(idx);

            row.appendChild(box);
        });

        dsContent.appendChild(row);
    }

    // ── Merge DS ───────────────────────────────────────────
    function renderMergeDS(data) {
        dsContent.innerHTML = '';

        const container = document.createElement('div');
        container.style.cssText = 'display:flex; gap:24px; align-items:flex-start;';

        // Left array
        const leftGroup = createMergeGroup('L', data.left || [], data.leftIndex || 0);
        container.appendChild(leftGroup);

        // Arrow
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            font-family: var(--font-mono); font-size: 16px;
            color: var(--text-muted); align-self: center;
        `;
        arrow.textContent = '\u2192';
        container.appendChild(arrow);

        // Right array
        const rightGroup = createMergeGroup('R', data.right || [], data.rightIndex || 0);
        container.appendChild(rightGroup);

        // Merge range
        if (data.mergeRange) {
            const rangeLabel = document.createElement('div');
            rangeLabel.className = 'ds-merge-label';
            rangeLabel.style.cssText = 'align-self:center; margin-left:16px;';
            rangeLabel.textContent = `Merging into [${data.mergeRange[0]}..${data.mergeRange[1]}]`;
            container.appendChild(rangeLabel);
        }

        dsContent.appendChild(container);
    }

    function createMergeGroup(label, arr, ptrIdx) {
        const group = document.createElement('div');
        group.className = 'ds-merge-group';

        const lbl = document.createElement('div');
        lbl.className = 'ds-merge-label';
        lbl.textContent = `${label}:`;
        group.appendChild(lbl);

        const cells = document.createElement('div');
        cells.className = 'ds-merge-cells';

        if (arr.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'ds-cell';
            empty.style.cssText = 'color:var(--text-muted); font-style:italic; width:60px;';
            empty.textContent = 'empty';
            cells.appendChild(empty);
        } else {
            arr.forEach((val, i) => {
                const cell = document.createElement('div');
                cell.className = `ds-cell${i === 0 ? ' ds-cell--comparing' : ''}`;
                cell.textContent = val;
                cells.appendChild(cell);
            });
        }

        group.appendChild(cells);
        return group;
    }

    // ── Stack DS ───────────────────────────────────────────
    function renderStackDS(data) {
        dsContent.innerHTML = '';

        const frames = data.frames || [];
        const current = data.currentFrame ?? -1;

        if (frames.length === 0) {
            dsContent.innerHTML = '<div style="color:var(--text-muted);font-family:var(--font-mono);font-size:12px;">Stack empty</div>';
            return;
        }

        const stack = document.createElement('div');
        stack.className = 'ds-stack';

        frames.forEach((frame, i) => {
            const el = document.createElement('div');
            el.className = `ds-frame${i === current ? ' ds-frame--active' : ''}`;

            const label = document.createElement('span');
            label.className = 'ds-frame-label';
            label.textContent = i === current ? 'TOP' : `#${i}`;
            el.appendChild(label);

            const range = document.createElement('span');
            range.textContent = `sort(${frame.low}, ${frame.high})`;
            el.appendChild(range);

            stack.appendChild(el);
        });

        dsContent.appendChild(stack);
    }

    // ── Bucket DS ──────────────────────────────────────────
    function renderBucketsDS(data) {
        dsContent.innerHTML = '';

        const buckets = data.buckets || [];
        const container = document.createElement('div');
        container.className = 'ds-buckets';

        for (let b = 0; b < 10; b++) {
            const bucket = document.createElement('div');
            bucket.className = 'ds-bucket';

            // Items (bottom to top)
            const items = buckets[b] || [];
            items.forEach(val => {
                const item = document.createElement('div');
                item.className = 'ds-bucket-item';
                item.textContent = val;
                bucket.appendChild(item);
            });

            // Header
            const header = document.createElement('div');
            header.className = 'ds-bucket-header';
            header.textContent = b;
            bucket.appendChild(header);

            container.appendChild(bucket);
        }

        // Phase + digit info
        if (data.phase || data.digitLabel) {
            const info = document.createElement('div');
            info.style.cssText = `
                font-family: var(--font-mono); font-size: 11px;
                color: var(--text-muted); margin-left: 16px; align-self: center;
            `;
            info.textContent = `${data.phase || ''} (${data.digitLabel || ''})`;
            container.appendChild(info);
        }

        dsContent.appendChild(container);
    }

    // ── Public API ─────────────────────────────────────────
    return { renderBars, renderDS };
})();
