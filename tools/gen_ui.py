"""背景・UI素材を ComfyUI(Anima) で生成する。スクイーズと同じ画風（パステル・やわらかい塗り・細い茶色の線）。

  python tools/gen_ui.py bg plate banner --n 4
出力: tools/raw/<name>_<seed>.png
背景(bg)はそのまま使う（tools/make_bg.py で縮小）。plate/banner は cutout.py で透過にする。
"""
import argparse, os, random
from gen_squishy import run_prompt, RAW

QUALITY = "masterpiece, best quality, score_9, score_8, safe, "
LOOK = "kawaii, soft pastel colors, soft shading, clean thin brown lineart, cozy, warm soft light, "
NEG = ("worst quality, low quality, score_1, score_2, score_3, blurry, jpeg artifacts, "
       "text, letters, words, watermark, signature, logo, humans, girl, character, animal, face")

UI = {
    # 縦長のお店。下3割がカウンター天板＋前板、中央は空けておく（スクイーズを置く場所）
    "bg": (QUALITY + LOOK + "no humans, interior of a cute pastel pink sweets shop, front view, "
           "a wide cream wooden display counter across the bottom third of the image, empty flat countertop, "
           "pastel pink striped wallpaper, shelves with candy jars and small pastries in the upper background, "
           "string lights, small plants, empty space in the center, symmetrical composition, background art, scenery",
           NEG + ", food on counter, plate, cluttered center", 832, 1216),
    "bg_mint": (QUALITY + LOOK + "no humans, interior of a cute pastel mint green and cream sweets shop, front view, "
                "a wide cream wooden display counter across the bottom third of the image, empty flat countertop, "
                "mint green striped wallpaper, shelves with candy jars and macarons in the upper background, "
                "small plants, empty space in the center, symmetrical composition, background art, scenery",
                NEG + ", food on counter, plate, cluttered center", 832, 1216),
    "bg_night": (QUALITY + LOOK + "no humans, interior of a cute sweets shop at night, front view, deep navy blue and lavender colors, "
                 "a wide cream wooden display counter across the bottom third of the image, empty flat countertop, "
                 "big window showing starry night sky and crescent moon, warm glowing lamps, fairy lights, candy jars on shelves, "
                 "empty space in the center, symmetrical composition, background art, scenery",
                 NEG + ", food on counter, plate, cluttered center", 832, 1216),
    "bg_halloween": (QUALITY + LOOK + "no humans, interior of a cute halloween themed sweets shop, front view, cute not scary, "
                     "purple and orange decorations, small jack-o-lanterns on shelves, bat garlands, candles, candy jars, "
                     "a wide cream wooden display counter across the bottom third of the image, empty flat countertop, "
                     "empty space in the center, symmetrical composition, background art, scenery",
                     NEG + ", food on counter, plate, cluttered center, scary, skull, blood", 832, 1216),
    "plate_berry": (QUALITY + LOOK + "no humans, a single empty round white plate with a cute red strawberry pattern on the rim, "
                    "seen from the front at a low angle, flat elliptical shape, isolated, simple background, plain solid light blue background, no shadow",
                    NEG + ", food, cup, table, multiple plates", 1024, 1024),
    "plate_mint": (QUALITY + LOOK + "no humans, a single empty round pastel mint green plate with white polka dots and a scalloped edge, "
                   "seen from the front at a low angle, flat elliptical shape, isolated, simple background, plain solid light pink background, no shadow",
                   NEG + ", food, cup, table, multiple plates", 1024, 1024),
    "plate": (QUALITY + LOOK + "no humans, a single empty round white plate with a pink lace paper doily on it, "
              "seen from the front at a low angle, flat elliptical shape, isolated, simple background, plain solid light blue background, no shadow",
              NEG + ", food, cup, table, multiple plates", 1024, 1024),
    "gacha": (QUALITY + LOOK + "no humans, a cute pastel pink capsule toy vending machine, gachapon machine, "
              "big round clear glass dome on top filled with colorful pastel capsules, cream body, a round crank handle in the front, "
              "a capsule outlet opening at the bottom front, heart decorations, front view, full view, single object, centered, "
              "isolated, simple background, plain solid light blue background, no shadow",
              NEG + ", multiple machines, store, shelf", 1024, 1024),
    "banner": (QUALITY + LOOK + "no humans, a blank horizontal pastel pink ribbon banner with folded ends, "
               "cream border, small hearts and sparkles decoration, empty center with no text, isolated, "
               "simple background, plain solid light blue background, no shadow",
               NEG, 1216, 832),
}

# ---- 着せかえ 第2弾（背景8・お皿6）とジェムアイコン ----
def shop_bg(theme, extra=""):
    return (QUALITY + LOOK + f"no humans, interior of a cute {theme} sweets shop, front view, "
            "a wide cream wooden display counter across the bottom third of the image, empty flat countertop, "
            f"shelves with candy jars in the upper background, {extra}empty space in the center, symmetrical composition, background art, scenery",
            NEG + ", food on counter, plate, cluttered center", 832, 1216)

def plate(desc, bg="light blue"):
    return (QUALITY + LOOK + f"no humans, a single empty round {desc} plate, seen from the front at a low angle, flat elliptical shape, "
            f"isolated, simple background, plain solid {bg} background, no shadow",
            NEG + ", food, cup, table, multiple plates", 1024, 1024)

UI.update({
    "bg_lavender": shop_bg("pastel lavender purple", "lavender flowers in vases, "),
    "bg_lemon":    shop_bg("pastel lemon yellow", "lemons in glass jars, bright sunny light, "),
    "bg_soda":     shop_bg("pastel soda blue", "soda bottles and bubbles decoration, "),
    "bg_choco":    shop_bg("chocolate brown and cream", "chocolate bars and truffles on shelves, warm cozy light, "),
    "bg_sakura":   shop_bg("pink cherry blossom themed", "cherry blossom branches and falling petals, "),
    "bg_snow":     shop_bg("winter snowy white and light blue", "snowy window, snowflake decorations, warm fairy lights, "),
    "bg_sunset":   shop_bg("warm orange sunset", "big window with orange sunset sky, "),
    "bg_house":    shop_bg("gingerbread house themed", "walls made of cookies and candy canes and icing, "),
    "plate_lav":   plate("pastel lavender plate with a white scalloped lace edge"),
    "plate_lemon": plate("pastel lemon yellow plate with a cute lemon slice pattern on the rim"),
    "plate_choco": plate("chocolate brown plate with a white drizzle pattern on the rim"),
    "plate_heart": plate("heart shaped pastel pink", "light blue"),
    "plate_star":  plate("star pattern pastel blue plate with small yellow stars on the rim", "light pink"),
    "plate_gold":  plate("elegant cream white plate with a shiny gold rim and gold ornaments"),
    # おかしのお庭（もちもちルーム）
    "garden_bg": (QUALITY + LOOK + "no humans, no characters, background art, scenery, a cute pastel candy garden seen from slightly above, "
                  "soft green lawn filling the lower two thirds, a winding cookie stone path, pastel flower beds at the edges, "
                  "small chocolate fence and candy trees far in the background, pale blue sky with fluffy clouds at the top, "
                  "large empty open lawn in the center, symmetrical composition, cozy, storybook",
                  NEG + ", people, animals, characters, food on lawn, cluttered center, text", 832, 1216),
    "g_tree":   (QUALITY + LOOK + "no humans, game item, a single cute small tree with a fluffy pink and blue cotton candy crown and a candy cane striped trunk, "
                 "full body, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", multiple trees, ground, scenery", 1024, 1024),
    "g_bench":  (QUALITY + LOOK + "no humans, game item, a single cute small garden bench made of cookies and biscuits with pink icing, front view slightly from above, "
                 "centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, multiple benches", 1024, 1024),
    "g_flowers": (QUALITY + LOOK + "no humans, game item, a small round flower bed with pastel tulips and daisies and two tiny cute honey bees, "
                 "centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, house", 1024, 1024),
    "g_honey":  (QUALITY + LOOK + "no humans, game item icon, a single cute round glass honey jar with golden honey and a wooden honey dipper, small cloth lid with a ribbon, "
                 "sparkle, front view, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", multiple jars, table, text, label text", 1024, 1024),
    "g_swing": (QUALITY + LOOK + "no humans, game item, a cute small garden swing whose seat is a pink frosted donut hanging from a candy cane frame, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, multiple objects, text", 1024, 1024),
    "g_house": (QUALITY + LOOK + "no humans, game item, a cute tiny round pet house shaped like a strawberry shortcake with a small arched door, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, multiple objects, text", 1024, 1024),
    "g_lamp": (QUALITY + LOOK + "no humans, game item, a cute garden street lamp shaped like a tall swirl lollipop with a warm glowing light, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, multiple objects, text", 1024, 1024),
    "g_fountain": (QUALITY + LOOK + "no humans, game item, a cute small chocolate fountain with three tiers and flowing melted chocolate, pastel pink base, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, multiple objects, text", 1024, 1024),
    "g_mushroom": (QUALITY + LOOK + "no humans, game item, two cute marshmallow mushrooms with pink and white spotted caps, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, multiple objects, text", 1024, 1024),
    "g_pond": (QUALITY + LOOK + "no humans, game item, a small round pastel soda pond with fizzy bubbles and a lily pad made of a mint cookie, seen from slightly above, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, multiple objects, text", 1024, 1024),
    "g_s1_trophy": (QUALITY + LOOK + "no humans, game item, a cute garden statue of a big shiny golden trophy cup decorated with pastel macarons and a pink ribbon, on a small cream pedestal, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, multiple objects, text, letters", 1024, 1024),
    "g_s1_crown": (QUALITY + LOOK + "no humans, game item, a cute small round garden gazebo shaped like a golden crown made of cookies with pastel lilac frosting and tiny jewels, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", people, scenery, multiple objects, text, letters", 1024, 1024),
    # シーズン1の報酬（ハイスコア／ライバル）
    "plate_s1a":   plate("pastel pink plate with a shiny gold rim and a cute pattern of small gold trophies and stars on the rim"),
    "plate_s1b":   plate("pastel lilac purple plate with a shiny gold rim and a cute pattern of small gold crowns on the rim", "light yellow"),
    "coin": (QUALITY + LOOK + "no humans, game item icon, a single cute shiny round gold coin, embossed small heart in the center, thick rim, "
            "golden yellow, sparkling highlights, small sparkles around, front view, centered, "
            "isolated, simple background, plain solid light blue background, no shadow",
            NEG + ", multiple coins, stack, money bag, hand, text, letters", 1024, 1024),
    "tab_home": (QUALITY + LOOK + "no humans, game item icon, a single cute small pastel pink sweets shop house with a cream roof and a heart window, front view, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", multiple objects, text, letters", 1024, 1024),
    "tab_dex": (QUALITY + LOOK + "no humans, game item icon, a single cute closed pastel pink picture book with a heart on the cover and a ribbon bookmark, front view, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", multiple objects, text, letters", 1024, 1024),
    "tab_shop": (QUALITY + LOOK + "no humans, game item icon, a single cute pastel mint shopping bag with a pink bow, front view, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", multiple objects, text, letters", 1024, 1024),
    "tab_rank": (QUALITY + LOOK + "no humans, game item icon, a single cute shiny golden trophy cup with a pink ribbon, front view, centered, isolated, simple background, plain solid light pink background, no shadow", NEG + ", multiple objects, text, letters", 1024, 1024),
    "tab_menu_bell": (QUALITY + LOOK + "no humans, game item icon, a single cute small golden bell with a pink ribbon, front view, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", multiple objects, text, letters", 1024, 1024),
    "ui_gear": (QUALITY + LOOK + "no humans, game item icon, a single cute pastel lavender gear cog with a heart in the center, front view, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", multiple objects, text, letters", 1024, 1024),
    "ui_mail": (QUALITY + LOOK + "no humans, game item icon, a single cute pastel pink envelope letter with a heart seal, front view, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", multiple objects, text, letters", 1024, 1024),
    "ui_event": (QUALITY + LOOK + "no humans, game item icon, a single cute pastel purple flag on a pole with a star, front view, centered, isolated, simple background, plain solid light yellow background, no shadow", NEG + ", multiple objects, text, letters", 1024, 1024),
    "ui_gift": (QUALITY + LOOK + "no humans, game item icon, a single cute pastel pink gift box with a gold ribbon bow, front view, centered, isolated, simple background, plain solid light blue background, no shadow", NEG + ", multiple objects, text, letters", 1024, 1024),
    "snack": (QUALITY + LOOK + "no humans, game item icon, a single cute round cookie with pink heart icing and colorful sprinkles, "
              "golden brown, sparkle, front view, centered, isolated, simple background, plain solid light blue background, no shadow",
              NEG + ", multiple cookies, plate, hand, text, letters", 1024, 1024),
    "drink": (QUALITY + LOOK + "no humans, game item icon, a single cute small round glass potion bottle filled with glowing pink drink, "
              "cork stopper, a white heart shaped label, sparkles, front view, centered, isolated, simple background, plain solid light yellow background, no shadow",
              NEG + ", multiple bottles, cup, hand, text, letters, label text", 1024, 1024),
    "gem": (QUALITY + LOOK + "no humans, game item icon, a single cute shiny faceted gemstone jewel, pastel purple and pink gradient, "
            "brilliant cut diamond shape, sparkling highlights, small sparkles around, front view, centered, "
            "isolated, simple background, plain solid light yellow background, no shadow",
            NEG + ", multiple gems, ring, necklace, hand", 1024, 1024),
})

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("names", nargs="+", choices=sorted(UI))
    ap.add_argument("--n", type=int, default=4)
    a = ap.parse_args()
    os.makedirs(RAW, exist_ok=True)
    for name in a.names:
        pos, neg, w, h = UI[name]
        for _ in range(a.n):
            run_prompt(name, pos, neg, w, h, random.randint(1, 2**31))
