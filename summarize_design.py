import json
from collections import Counter

with open("ref_design_details.json", "r", encoding="utf-8") as f:
    details = json.load(f)

fonts = Counter()
colors = Counter()
fills = Counter()
lines = Counter()

for s in details:
    for sh in s["shapes"]:
        if "fill_color" in sh:
            fills[sh["fill_color"]] += 1
        if "line_color" in sh:
            lines[sh["line_color"]] += 1
        if "text_frame" in sh:
            for p in sh["text_frame"]:
                for r in p.get("runs", []):
                    if "font" in r:
                        fonts[r["font"]] += 1
                    if "color" in r:
                        colors[r["color"]] += 1

print("Top Fonts:", fonts.most_common(10))
print("Top Text Colors:", colors.most_common(10))
print("Top Fill Colors:", fills.most_common(10))
print("Top Line Colors:", lines.most_common(10))

# Also check slide 1 and slide 2 structure
for i in [0, 1, 2]:
    s = details[i]
    print(f"\n--- Slide {s['slide']} Shapes ---")
    for sh in s["shapes"]:
        t = [p['text'] for p in sh.get('text_frame', [])]
        print(f"  Shape {sh['name']} ({sh['type']}): pos=({sh['left']}, {sh['top']}, {sh['width']}, {sh['height']}) fill={sh.get('fill_color')} text={t[:2]}")
