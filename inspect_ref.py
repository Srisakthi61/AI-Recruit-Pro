import json
import sys

with open("ref_ppt_analysis.json", "r", encoding="utf-8") as f:
    slides = json.load(f)

with open("ref_summary.txt", "w", encoding="utf-8") as out:
    for s in slides:
        num = s["slide_num"]
        out.write(f"=== SLIDE {num} ===\n")
        for sh in s["shapes"]:
            if "text" in sh and sh["text"]:
                txt = " // ".join(sh["text"])
                out.write(f"  TXT: {txt}\n")
            elif "table" in sh:
                out.write(f"  TABLE ({len(sh['table'])} rows):\n")
                for r in sh["table"]:
                    out.write(f"    | {' | '.join(r)}\n")
print("Wrote ref_summary.txt")
