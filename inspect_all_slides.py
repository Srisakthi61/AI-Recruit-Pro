import json

with open("ref_design_details.json", "r", encoding="utf-8") as f:
    slides = json.load(f)

with open("ref_shapes_breakdown.txt", "w", encoding="utf-8") as out:
    for s in slides:
        out.write(f"\n================ SLIDE {s['slide']} ================\n")
        for sh in s["shapes"]:
            name = sh["name"]
            left = sh["left"] / 914400.0
            top = sh["top"] / 914400.0
            w = sh["width"] / 914400.0
            h = sh["height"] / 914400.0
            text_preview = ""
            if "text_frame" in sh:
                text_preview = " | ".join([p["text"] for p in sh["text_frame"]])
            fill = sh.get("fill_color", "None")
            line = sh.get("line_color", "None")
            tbl = f"tbl({sh['table_rows']}x{sh['table_cols']})" if "table_rows" in sh else ""
            out.write(f"  {name:<15} ({left:5.2f}, {top:5.2f}, {w:5.2f}, {h:5.2f}) fill={fill:<8} line={line:<8} {tbl}\n")
            if text_preview:
                out.write(f"      Text: {text_preview}\n")

print("Wrote ref_shapes_breakdown.txt")
