"""スクイーズ画像を ComfyUI(Anima) で生成する。

使い方:
  python tools/gen_squishy.py onigiri --n 4
  python tools/gen_squishy.py onigiri --seed 12345        # 1枚だけ撮り直し

出力: tools/raw/<id>_<seed>.png（背景つきの生画像）
背景抜きは tools/cutout.py で行う。
"""
import argparse, json, os, random, shutil, time, urllib.request

COMFY = "http://127.0.0.1:8188"
HERE = os.path.dirname(os.path.abspath(__file__))
WF_PATH = os.path.expanduser("~/projects/anima-webui/anima-t2i.json")
COMFY_OUT = os.path.expanduser("~/projects/ComfyUI/output")
RAW = os.path.join(HERE, "raw")

# 全スクイーズ共通の画風（クオリティ重視のかわいいイラスト）
STYLE = ("masterpiece, best quality, score_9, score_8, safe, no humans, "
         "kawaii squishy toy, soft squishy mascot, chibi food character, "
         "{face}, "
         "soft pastel colors, soft shading, subtle highlight, clean lineart, "
         "single object, centered, front view, full view, "
         "isolated, simple background, plain solid {bg} background, no shadow")
NEG = ("worst quality, low quality, score_1, score_2, score_3, blurry, jpeg artifacts, "
       "multiple objects, duplicate, text, watermark, signature, logo, frame, border, "
       "cropped, cut off, hands, human, girl, plate, table, cast shadow, gradient background, scenery")

# 個別の中身（背景色は本体と被らない色にする＝切り抜きやすくする）
FACE = "simple cute face, small dot eyes, tiny smile, light blush"
ITEMS = {
    "onigiri": ("onigiri, triangular rice ball, white rice grains texture, black nori seaweed wrapped at bottom", "light blue"),
    "bombo":   ("bomboloni, round filled donut ball without hole, golden brown fluffy dough, coated in white sugar, cute face on the donut itself", "light blue"),
    "mochi":   ("daifuku mochi, white soft round rice cake, slightly flat dome shape, dusted with white powder", "light blue"),
    "pudding": ("custard pudding, purin, yellow custard, glossy brown caramel sauce on top, trapezoid shape", "light blue"),
    "macaron": ("pink macaron, two pastel pink shells, white cream filling sandwiched, round", "light blue"),
    "melon":   ("melon pan, round sweet bread bun, light green cookie crust, crosshatch grid pattern on top", "light blue"),
    "dubai":   ("chocolate mochi dome, cocoa dusted brown, green pistachio cream oozing out from a crack, crunchy shredded pastry", "light pink"),
    "sago":    ("round pink jelly ball, translucent, many small white tapioca sago pearls inside, chewy", "light blue"),
    "yoajon":  ("frozen yogurt dome, white yogurt ice cream, topped with strawberries and blueberries and mango cubes and honeycomb", "light blue"),
    "mari":    ("maritozzo, golden brioche bun sliced open, overflowing with fluffy whipped cream, one strawberry on top", "light blue"),
    "mizu":    ("mizu manju, clear transparent water jelly dome, small pink sweet bean ball inside, glossy, translucent", "light pink"),
    "kuma":    ("pink gummy bear, translucent jelly, glitter sparkles inside, chubby round bear with round ears", "light blue"),
    # ---- 追加分（第2弾）----
    "ichigo":   ("ichigo daifuku, round white mochi with a red strawberry peeking out from the top, soft and powdery", "light blue"),
    "takoyaki": ("takoyaki ball, round golden brown octopus ball, brown sauce and white mayo drizzle, green aonori flakes, bonito flakes on top", "light blue"),
    "kurocchi": ("croissant mochi hybrid pastry, flaky golden croissant layers on the outside, chewy mochi inside, crescent shape", "light blue"),
    "fruitsand":("japanese fruit sandwich, fluffy white bread with whipped cream, strawberry and kiwi and orange cross section, triangle cut", "light blue"),
    "pancake":  ("fluffy souffle pancake stack, three thick jiggly pancakes, butter and maple syrup on top", "light blue"),
    "wataame":  ("rainbow cotton candy cloud, fluffy pastel rainbow colors, round puffy cloud shape, sparkles", "light yellow"),
    # ---- 追加分（第3弾）----
    "butter":   ("pat of butter, soft pale yellow butter cube with rounded corners, a little melting glossy on top, cute face on the front side", "light blue"),
    "sushi":    ("salmon nigiri sushi, glossy orange salmon slice with white fat stripes draped over an oval block of white rice, cute face on the rice", "light blue"),
    "shortcake":("strawberry shortcake slice, triangle slice of fluffy white sponge cake, whipped cream layers, strawberry slices in the cross section, one whole strawberry on top", "light blue"),
    "parfait":  ("dreamy pastel strawberry parfait in a short round glass cup, layers of pink ice cream and whipped cream and berries, a macaron and a wafer stick on top, sparkles", "light yellow"),
    # ---- ハロウィン限定 ----
    "hw_witch":   ("chocolate mont blanc cake wearing a small purple witch hat, swirled brown chestnut cream, small star sprinkles, round", "light blue"),
    "hw_candy":   ("candy corn jelly, translucent jelly in three layers of yellow orange and white, triangle shape", "light blue"),
    "hw_mummy":   ("mummy daifuku, round white mochi wrapped in cream colored bandage strips, one eye peeking, cute not scary", "light blue"),
    "hw_pumpkin": ("pumpkin pudding, orange custard pudding shaped like a small pumpkin, caramel sauce on top, tiny green stem and leaf on top", "light blue"),
    "hw_ghost":   ("white ghost shaped marshmallow, soft and fluffy, round head with a wavy floating tail, small purple and orange sprinkles", "light blue"),
    "hw_bat":     ("purple macaron with two small black bat wings on the sides, white cream filling, round", "light yellow"),
    "spicy":   ("bright red chili pepper ball, round, spicy, small yellow chili seeds, tiny green stem on top, tiny flames", "light blue",
                "angry cute face, small dot eyes, angry eyebrows, pouting"),
}


def run(item_id, seed):
    subject, bg, *rest = ITEMS[item_id]
    face = rest[0] if rest else FACE
    return run_prompt(item_id, subject + ", " + STYLE.format(bg=bg, face=face), NEG, 1024, 1024, seed)


def run_prompt(name, pos, neg, width, height, seed):
    """任意のプロンプトで1枚生成して raw/<name>_<seed>.png に保存する（UI素材などにも使う）"""
    wf = json.load(open(WF_PATH, encoding="utf-8-sig"))
    wf["19"]["inputs"]["model"] = ["44", 0]
    for nid in [k for k in list(wf) if k.startswith("84:")]:
        del wf[nid]
    item_id = name
    wf["28"]["inputs"]["width"] = width
    wf["28"]["inputs"]["height"] = height
    wf["19"]["inputs"]["steps"] = 30
    wf["19"]["inputs"]["cfg"] = 4.5
    wf["19"]["inputs"]["seed"] = seed
    wf["11"]["inputs"]["text"] = pos
    wf["12"]["inputs"]["text"] = neg
    wf["52"]["inputs"]["filename_prefix"] = f"nigisq_{item_id}"
    req = urllib.request.Request(COMFY + "/prompt", data=json.dumps({"prompt": wf}).encode(),
                                 headers={"Content-Type": "application/json"})
    pid = json.load(urllib.request.urlopen(req))["prompt_id"]
    t0 = time.time()
    while time.time() - t0 < 600:
        h = json.load(urllib.request.urlopen(f"{COMFY}/history/{pid}"))
        if pid in h:
            st = h[pid].get("status", {})
            if st.get("completed"):
                for no in h[pid].get("outputs", {}).values():
                    for im in no.get("images", []):
                        src = os.path.join(COMFY_OUT, im.get("subfolder", ""), im["filename"])
                        dst = os.path.join(RAW, f"{item_id}_{seed}.png")
                        shutil.copy(src, dst)
                        print(f"OK {dst} ({time.time() - t0:.1f}s)")
                        return dst
            if st.get("status_str") == "error":
                raise RuntimeError(json.dumps(st.get("messages", []), ensure_ascii=False))
        time.sleep(2)
    raise TimeoutError(pid)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("items", nargs="+", help="アイテムID（all で全部）")
    ap.add_argument("--n", type=int, default=4)
    ap.add_argument("--seed", type=int)
    a = ap.parse_args()
    os.makedirs(RAW, exist_ok=True)
    items = sorted(ITEMS) if a.items == ["all"] else a.items
    for it in items:
        seeds = [a.seed] if a.seed is not None else [random.randint(1, 2**31) for _ in range(a.n)]
        for s in seeds:
            run(it, s)
