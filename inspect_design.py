import pptx
import json

prs = pptx.Presentation("Combined Review.pptx")
print("Presentation slide size:", prs.slide_width, prs.slide_height)

# Inspect styles of first few slides
details = []
for i, slide in enumerate(prs.slides):
    s_data = {"slide": i+1, "shapes": []}
    for s in slide.shapes:
        sh_info = {
            "name": s.name,
            "type": str(s.shape_type),
            "left": s.left, "top": s.top, "width": s.width, "height": s.height
        }
        if hasattr(s, "fill"):
            try:
                sh_info["fill_type"] = str(s.fill.type)
                if s.fill.type == 1: # solid
                    sh_info["fill_color"] = str(s.fill.fore_color.rgb)
            except Exception as e:
                sh_info["fill_err"] = str(e)
        if hasattr(s, "line"):
            try:
                if s.line.fill.type == 1:
                    sh_info["line_color"] = str(s.line.color.rgb)
            except:
                pass
        if s.has_text_frame:
            tf_data = []
            for p in s.text_frame.paragraphs:
                p_text = p.text.strip()
                if not p_text: continue
                run_data = []
                for r in p.runs:
                    run_info = {"text": r.text}
                    if r.font.name: run_info["font"] = r.font.name
                    if r.font.size: run_info["size"] = r.font.size.pt
                    if r.font.bold: run_info["bold"] = r.font.bold
                    try:
                        if r.font.color and r.font.color.rgb:
                            run_info["color"] = str(r.font.color.rgb)
                    except:
                        pass
                    run_data.append(run_info)
                tf_data.append({"text": p_text, "runs": run_data})
            sh_info["text_frame"] = tf_data
        if s.has_table:
            sh_info["table_rows"] = len(s.table.rows)
            sh_info["table_cols"] = len(s.table.columns)
        s_data["shapes"].append(sh_info)
    details.append(s_data)

with open("ref_design_details.json", "w", encoding="utf-8") as f:
    json.dump(details, f, indent=2)

print("Saved ref_design_details.json")
