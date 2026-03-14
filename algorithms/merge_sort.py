"""Merge Sort step generator for SortViz."""


def generate_steps(arr):
    """Generates step-by-step states for Merge Sort."""
    a = arr.copy()
    n = len(a)
    steps = []
    stats = {"comparisons": 0, "swaps": 0}

    if n <= 1:
        bar_states = {str(i): "sorted" for i in range(n)}
        steps.append({
            "arr": a[:],
            "barStates": bar_states,
            "dsType": "merge",
            "dsData": {
                "left": [],
                "right": [],
                "leftIndex": 0,
                "rightIndex": 0,
                "mergeRange": [0, n - 1] if n > 0 else []
            },
            "message": "Array is already sorted." if n > 0 else "Empty array.",
            "operation": "sorted",
            "stats": {**stats}
        })
        return steps

    def merge_sort(lo, hi):
        """Recursively divide and merge subarrays."""
        if lo >= hi:
            return

        mid = (lo + hi) // 2
        merge_sort(lo, mid)
        merge_sort(mid + 1, hi)
        merge(lo, mid, hi)

    def merge(lo, mid, hi):
        """Merge two sorted subarrays a[lo..mid] and a[mid+1..hi]."""
        left = a[lo:mid + 1]
        right = a[mid + 1:hi + 1]

        # Show merge start
        bar_states = {str(k): "default" for k in range(n)}
        for k in range(lo, hi + 1):
            bar_states[str(k)] = "comparing"

        steps.append({
            "arr": a[:],
            "barStates": bar_states,
            "dsType": "merge",
            "dsData": {
                "left": left[:],
                "right": right[:],
                "leftIndex": 0,
                "rightIndex": 0,
                "mergeRange": [lo, hi]
            },
            "message": f"Merging L:{left} and R:{right} into [{lo}..{hi}]",
            "operation": "merge",
            "stats": {**stats}
        })

        li = 0
        ri = 0
        k = lo

        while li < len(left) and ri < len(right):
            stats["comparisons"] += 1

            bar_states_cmp = {str(idx): "default" for idx in range(n)}
            bar_states_cmp[str(lo + li)] = "comparing"
            bar_states_cmp[str(mid + 1 + ri)] = "comparing"

            steps.append({
                "arr": a[:],
                "barStates": bar_states_cmp,
                "dsType": "merge",
                "dsData": {
                    "left": left[:],
                    "right": right[:],
                    "leftIndex": li,
                    "rightIndex": ri,
                    "mergeRange": [lo, hi]
                },
                "message": f"Comparing left[{li}]={left[li]} with right[{ri}]={right[ri]}",
                "operation": "compare",
                "stats": {**stats}
            })

            if left[li] <= right[ri]:
                a[k] = left[li]
                stats["swaps"] += 1
                li += 1
            else:
                a[k] = right[ri]
                stats["swaps"] += 1
                ri += 1

            bar_states_place = {str(idx): "default" for idx in range(n)}
            bar_states_place[str(k)] = "swapping"

            steps.append({
                "arr": a[:],
                "barStates": bar_states_place,
                "dsType": "merge",
                "dsData": {
                    "left": left[:],
                    "right": right[:],
                    "leftIndex": li,
                    "rightIndex": ri,
                    "mergeRange": [lo, hi]
                },
                "message": f"Placed {a[k]} at position {k}",
                "operation": "merge",
                "stats": {**stats}
            })

            k += 1

        # Copy remaining left elements
        while li < len(left):
            a[k] = left[li]
            stats["swaps"] += 1

            bar_states_rem = {str(idx): "default" for idx in range(n)}
            bar_states_rem[str(k)] = "swapping"

            steps.append({
                "arr": a[:],
                "barStates": bar_states_rem,
                "dsType": "merge",
                "dsData": {
                    "left": left[:],
                    "right": right[:],
                    "leftIndex": li,
                    "rightIndex": ri,
                    "mergeRange": [lo, hi]
                },
                "message": f"Placed remaining left[{li}]={left[li]} at position {k}",
                "operation": "merge",
                "stats": {**stats}
            })

            li += 1
            k += 1

        # Copy remaining right elements
        while ri < len(right):
            a[k] = right[ri]
            stats["swaps"] += 1

            bar_states_rem = {str(idx): "default" for idx in range(n)}
            bar_states_rem[str(k)] = "swapping"

            steps.append({
                "arr": a[:],
                "barStates": bar_states_rem,
                "dsType": "merge",
                "dsData": {
                    "left": left[:],
                    "right": right[:],
                    "leftIndex": li,
                    "rightIndex": ri,
                    "mergeRange": [lo, hi]
                },
                "message": f"Placed remaining right[{ri}]={right[ri]} at position {k}",
                "operation": "merge",
                "stats": {**stats}
            })

            ri += 1
            k += 1

    merge_sort(0, n - 1)

    # Final step: all sorted
    bar_states_final = {str(k): "sorted" for k in range(n)}
    steps.append({
        "arr": a[:],
        "barStates": bar_states_final,
        "dsType": "merge",
        "dsData": {
            "left": [],
            "right": [],
            "leftIndex": 0,
            "rightIndex": 0,
            "mergeRange": [0, n - 1]
        },
        "message": "Merge Sort complete. Array is sorted.",
        "operation": "sorted",
        "stats": {**stats}
    })

    return steps
