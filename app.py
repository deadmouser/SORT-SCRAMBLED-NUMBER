from flask import Flask, render_template, request, jsonify
from algorithms import ALGO_INFO

# ── Import algorithm step generators ──────────────────────────
# Dev will create these files. Until then, we use a mock.
try:
    from algorithms.bubble_sort import generate_steps as bubble_steps
except ImportError:
    bubble_steps = None

try:
    from algorithms.selection_sort import generate_steps as selection_steps
except ImportError:
    selection_steps = None

try:
    from algorithms.insertion_sort import generate_steps as insertion_steps
except ImportError:
    insertion_steps = None

try:
    from algorithms.merge_sort import generate_steps as merge_steps
except ImportError:
    merge_steps = None

try:
    from algorithms.quick_sort import generate_steps as quick_steps
except ImportError:
    quick_steps = None

try:
    from algorithms.radix_sort import generate_steps as radix_steps
except ImportError:
    radix_steps = None

# ── Flask App ─────────────────────────────────────────────────
app = Flask(__name__)

ALGORITHMS = {
    "bubble": bubble_steps,
    "selection": selection_steps,
    "insertion": insertion_steps,
    "merge": merge_steps,
    "quick": quick_steps,
    "radix": radix_steps,
}


def mock_steps(arr):
    """Fallback mock if Dev's algorithm file is not ready yet."""
    n = len(arr)
    sorted_arr = sorted(arr)
    return [
        {
            "arr": arr[:],
            "barStates": {str(i): "default" for i in range(n)},
            "dsType": "array",
            "dsData": {"highlights": {}, "markers": {}, "regions": {}},
            "message": "Algorithm not implemented yet. Showing initial state.",
            "operation": "compare",
            "stats": {"comparisons": 0, "swaps": 0},
        },
        {
            "arr": sorted_arr,
            "barStates": {str(i): "sorted" for i in range(n)},
            "dsType": "array",
            "dsData": {"highlights": {}, "markers": {}, "regions": {}},
            "message": "Sorting complete!",
            "operation": "sorted",
            "stats": {"comparisons": 0, "swaps": 0},
        },
    ]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/info")
def info():
    return jsonify(ALGO_INFO)


@app.route("/api/sort", methods=["POST"])
def sort():
    data = request.get_json()
    algo = data.get("algorithm", "bubble")
    arr = data.get("array", [])

    step_fn = ALGORITHMS.get(algo)
    if step_fn is None:
        steps = mock_steps(arr)
    else:
        steps = step_fn(arr)

    return jsonify({"steps": steps, "info": ALGO_INFO.get(algo, {})})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
