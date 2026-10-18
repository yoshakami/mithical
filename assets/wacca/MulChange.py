import json

ratingBorders = []

# Your original breakpoints
points = [
    
                (1000000, 10.90),
                (996000,  10.60),
                (992000,  10.30),
                (988000,  10.00),
                (980000,   9.40),
                (968000,   8.80),
                (800000,   0.40),
                (792000,   0.00)
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

# Add the last point explicitly
ratingBorders.append({
    "min": points[-1][0],
    "multiplier": points[-1][1]
})

# Convert to JS format
js_output = "const ratingBorders = " + json.dumps(ratingBorders, indent=2) + ";\n\nexport default ratingBorders;"

print(js_output)
