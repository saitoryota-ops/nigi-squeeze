"""候補画像を一覧にする。
  python tools/sheet.py bombo           → raw/_sheet_bombo.jpg（4候補を2x2、左上に番号）
  python tools/sheet.py --final         → raw/_final.jpg（assets/sq の採用画像を全部並べる）
"""
import glob, os, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))


def item_sheet(item):
    fs = sorted(glob.glob(os.path.join(HERE, "raw", f"{item}_*.png")))
    cell = 384
    sh = Image.new("RGB", (cell * 2, cell * ((len(fs) + 1) // 2)), "white")
    d = ImageDraw.Draw(sh)
    for i, f in enumerate(fs):
        x, y = (i % 2) * cell, (i // 2) * cell
        sh.paste(Image.open(f).convert("RGB").resize((cell, cell)), (x, y))
        d.rectangle([x, y, x + 30, y + 26], fill="black")
        d.text((x + 9, y + 6), str(i), fill="white")
    out = os.path.join(HERE, "raw", f"_sheet_{item}.jpg")
    sh.save(out, quality=88)
    for i, f in enumerate(fs):
        print(i, os.path.basename(f))
    print(out)


def final_sheet():
    fs = sorted(glob.glob(os.path.join(HERE, "..", "assets", "sq", "*.png")))
    cell, cols = 220, 4
    rows = (len(fs) + cols - 1) // cols
    sh = Image.new("RGB", (cell * cols, (cell + 24) * rows), (255, 236, 243))
    d = ImageDraw.Draw(sh)
    for i, f in enumerate(fs):
        im = Image.open(f).convert("RGBA")
        im.thumbnail((cell - 20, cell - 20))
        x, y = (i % cols) * cell, (i // cols) * (cell + 24)
        sh.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2), im)
        d.text((x + 8, y + cell + 4), os.path.basename(f)[:-4], fill=(90, 58, 70))
    out = os.path.join(HERE, "raw", "_final.jpg")
    sh.save(out, quality=90)
    print(out)


if __name__ == "__main__":
    if sys.argv[1] == "--final":
        final_sheet()
    else:
        for it in sys.argv[1:]:
            item_sheet(it)
