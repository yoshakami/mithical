import json

# Your original breakpoints
points = [
    (1000000, 1.12),
    (995000, 1.08),
    (990000, 1.04),
    (985000, 1.00),
    (980000, 0.96),
    (965000, 0.88),
    (950000, 0.80),
    (935000, 0.72),
    (920000, 0.64),
    (905000, 0.56),
    (890000, 0.48),
    (875000, 0.40),
    (860000, 0.32),
    (845000, 0.24),
    (830000, 0.16),
    (815000, 0.08),
    (800000, 0.00),
]


step = 100
ratingBorders = []

# Loop through each segment of your points
for (score1, mult1), (score2, mult2) in zip(points[:-1], points[1:]):
    # How many steps between score1 and score2?
    num_steps = (score1 - score2) // step
    # Linear step for multiplier
    m_step = (mult2 - mult1) / num_steps
    for i in range(num_steps):
        score = score1 - i * step
        multiplier = mult1 + i * m_step
        ratingBorders.append({
            "min": score,
            "multiplier": round(multiplier, 5)
        })

# Add the last point explicitly
ratingBorders.append({
    "min": points[-1][0],
    "multiplier": points[-1][1]
})

# Convert to JS format
js_output = "const ratingBorders = " + json.dumps(ratingBorders, indent=2) + ";\n\nexport default ratingBorders;"

print(js_output)
