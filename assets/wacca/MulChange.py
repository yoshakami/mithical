import json

# Your original breakpoints
points = [
    (1000000, 1.1),
    (950000, 0.85),
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
# Your original breakpoints
points = [
    (950000, 0.85),
    (900000, 0.6),
    (850000, 0.25),
    (800000, 0.2)
]

step = 1000
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
# Your original breakpoints
points = [
    (800000, 0.2),
    (400000, 0)
]

step = 10000
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
