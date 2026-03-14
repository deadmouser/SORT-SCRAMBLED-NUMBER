"""SortViz algorithm package — contains all sorting step generators."""

ALGO_INFO = {
    "bubble": {
        "name": "Bubble Sort",
        "best": "O(n)", "average": "O(n^2)", "worst": "O(n^2)",
        "space": "O(1)", "stable": True,
        "ds": "Array",
        "description": "Repeatedly compares adjacent elements and swaps them if out of order."
    },
    "selection": {
        "name": "Selection Sort",
        "best": "O(n^2)", "average": "O(n^2)", "worst": "O(n^2)",
        "space": "O(1)", "stable": False,
        "ds": "Array + Min Pointer",
        "description": "Finds minimum in unsorted region, places it at the sorted boundary."
    },
    "insertion": {
        "name": "Insertion Sort",
        "best": "O(n)", "average": "O(n^2)", "worst": "O(n^2)",
        "space": "O(1)", "stable": True,
        "ds": "Array (Sorted + Unsorted regions)",
        "description": "Inserts each element into its correct position in the growing sorted region."
    },
    "merge": {
        "name": "Merge Sort",
        "best": "O(n log n)", "average": "O(n log n)",
        "worst": "O(n log n)", "space": "O(n)", "stable": True,
        "ds": "Auxiliary Arrays (Left + Right)",
        "description": "Divides array recursively, merges halves using auxiliary left/right arrays."
    },
    "quick": {
        "name": "Quick Sort",
        "best": "O(n log n)", "average": "O(n log n)",
        "worst": "O(n^2)", "space": "O(log n)", "stable": False,
        "ds": "Recursion Call Stack",
        "description": "Picks pivot, partitions elements around it, recursively sorts partitions."
    },
    "radix": {
        "name": "Radix Sort",
        "best": "O(nk)", "average": "O(nk)", "worst": "O(nk)",
        "space": "O(n + k)", "stable": True,
        "ds": "10 Digit Buckets (0-9)",
        "description": "Sorts digit by digit using 10 buckets, least significant to most significant."
    }
}
