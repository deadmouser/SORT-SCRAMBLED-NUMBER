"""Quick Sort step generator for SortViz."""


def generate_steps(arr):
    """Generates step-by-step states for Quick Sort."""
    a = arr.copy()
    n = len(a)
    steps = []
    stats = {"comparisons": 0, "swaps": 0}
    call_stack = []
    sorted_indices = set()

    if n <= 1:
        bar_states = {str(i): "sorted" for i in range(n)}
        steps.append({
            "arr": a[:],
            "barStates": bar_states,
            "dsType": "stack",
            "dsData": {
                "frames": [],
                "currentFrame": -1
            },
            "message": "Array is already sorted." if n > 0 else "Empty array.",
            "operation": "sorted",
            "stats": {**stats}
        })
        return steps

    def get_bar_states():
        """Build barStates with current sorted indices."""
        bs = {str(k): "default" for k in range(n)}
        for s in sorted_indices:
            bs[str(s)] = "sorted"
        return bs

    def get_ds_data():
        """Build dsData snapshot of current call stack."""
        return {
            "frames": [{"low": f["low"], "high": f["high"]} for f in call_stack],
            "currentFrame": len(call_stack) - 1
        }

    def partition(low, high):
        """Lomuto partition with pivot = arr[high]."""
        pivot = a[high]

        # Show pivot selection
        bs = get_bar_states()
        bs[str(high)] = "pivot"
        steps.append({
            "arr": a[:],
            "barStates": bs,
            "dsType": "stack",
            "dsData": get_ds_data(),
            "message": f"Pivot selected: arr[{high}]={pivot}",
            "operation": "pivot",
            "stats": {**stats}
        })

        i = low - 1

        for j in range(low, high):
            stats["comparisons"] += 1

            # Compare step
            bs_cmp = get_bar_states()
            bs_cmp[str(high)] = "pivot"
            bs_cmp[str(j)] = "comparing"

            steps.append({
                "arr": a[:],
                "barStates": bs_cmp,
                "dsType": "stack",
                "dsData": get_ds_data(),
                "message": f"Comparing arr[{j}]={a[j]} with pivot={pivot}",
                "operation": "compare",
                "stats": {**stats}
            })

            if a[j] <= pivot:
                i += 1
                if i != j:
                    a[i], a[j] = a[j], a[i]
                    stats["swaps"] += 1

                    bs_swap = get_bar_states()
                    bs_swap[str(high)] = "pivot"
                    bs_swap[str(i)] = "swapping"
                    bs_swap[str(j)] = "swapping"

                    steps.append({
                        "arr": a[:],
                        "barStates": bs_swap,
                        "dsType": "stack",
                        "dsData": get_ds_data(),
                        "message": f"Swapped arr[{i}]={a[i]} and arr[{j}]={a[j]}",
                        "operation": "swap",
                        "stats": {**stats}
                    })

        # Place pivot in final position
        a[i + 1], a[high] = a[high], a[i + 1]
        stats["swaps"] += 1

        pivot_pos = i + 1
        sorted_indices.add(pivot_pos)

        bs_placed = get_bar_states()
        bs_placed[str(pivot_pos)] = "sorted"

        steps.append({
            "arr": a[:],
            "barStates": bs_placed,
            "dsType": "stack",
            "dsData": get_ds_data(),
            "message": f"Pivot {a[pivot_pos]} placed at final position {pivot_pos}",
            "operation": "sorted",
            "stats": {**stats}
        })

        return pivot_pos

    def quick_sort(low, high):
        """Recursively sort subarray a[low..high]."""
        call_stack.append({"low": low, "high": high})

        if low < high:
            pi = partition(low, high)
            quick_sort(low, pi - 1)
            quick_sort(pi + 1, high)
        else:
            if low == high:
                sorted_indices.add(low)

        call_stack.pop()

    quick_sort(0, n - 1)

    # Final step: all sorted
    bar_states_final = {str(k): "sorted" for k in range(n)}
    steps.append({
        "arr": a[:],
        "barStates": bar_states_final,
        "dsType": "stack",
        "dsData": {
            "frames": [],
            "currentFrame": -1
        },
        "message": "Quick Sort complete. Array is sorted.",
        "operation": "sorted",
        "stats": {**stats}
    })

    return steps
