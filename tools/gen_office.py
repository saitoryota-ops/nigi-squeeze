"""Punimaru Games の AI社員オフィス：社員（スクイーズ）と オフィスの背景を ComfyUI(Anima) で作る。
  python tools/gen_office.py all --n 2
出力: tools/raw/office_<id>_<seed>.png
"""
import argparse, os, random
from gen_squishy import run_prompt, RAW, STYLE, NEG

STAFF = {
    "planner":  "caramel custard pudding character wearing tiny round glasses, holding a small clipboard with a checklist",
    "engineer": "pink macaron character typing on a tiny pastel laptop, small headset",
    "artist":   "rainbow cotton candy character wearing a little red beret, holding a paintbrush and a tiny palette",
    "sound":    "fluffy white marshmallow character wearing big pastel pink headphones, tiny music notes floating",
    "designer": "strawberry daifuku character holding a tiny pencil and a small ruler",
    "qa":       "melon bread character holding a big magnifying glass, curious",
    "release":  "golden taiyaki fish cake character riding a tiny pastel rocket",
    "liveops":  "rice ball onigiri character holding a small pastel megaphone, cheerful",
    "legal":    "white mochi daifuku character wearing tiny glasses, holding a small book with a heart",
}
BG = ("masterpiece, best quality, score_9, score_8, safe, no humans, kawaii, soft pastel colors, soft shading, clean thin brown lineart, cozy, "
      "interior of a cute small game studio office, front view, pastel pink and mint walls, wooden floor, several small cute desks with computers, "
      "shelves with sweets jars and plants, big window with blue sky and clouds, string lights, warm soft light, background art, scenery, wide shot",
      "worst quality, low quality, blurry, text, letters, watermark, people, humans, characters, animals, cluttered", 1216, 832)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("items", nargs="+")
    ap.add_argument("--n", type=int, default=2)
    a = ap.parse_args()
    os.makedirs(RAW, exist_ok=True)
    items = list(STAFF) + ["bg"] if a.items == ["all"] else a.items
    for it in items:
        for _ in range(a.n):
            seed = random.randint(1, 2**31)
            if it == "bg":
                run_prompt("office_bg", BG[0], BG[1], BG[2], BG[3], seed)
            else:
                pos = STAFF[it] + ", " + STYLE.format(bg="light blue", face="happy cute face, small dot eyes, tiny smile, light blush")
                run_prompt("office_" + it, pos, NEG, 1024, 1024, seed)
