"""生成画像の単色背景を抜いて、ゲーム用の透過PNGにする。

使い方:
  python tools/cutout.py raw/onigiri_1498104745.png onigiri
出力: ../assets/sq/<id>.png（被写体の外接矩形でトリミング、長辺512px）

仕組み: 外周の色を背景色とみなし、それに近い色で「外周とつながっている」領域だけを透明にする
（被写体の中の似た色は抜かない）。境界は色の距離に応じて半透明にしてギザギザを防ぐ。
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "assets", "sq")
T_IN, T_OUT = 38.0, 70.0   # この距離未満=背景、T_OUT以上=被写体、間は半透明


def cutout(src, item_id, size=512):
    global T_IN, T_OUT
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    h, w, _ = a.shape
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg = np.median(border, axis=0)
    # 背景はわずかにグラデーションするので、行ごとの外周色も混ぜて補正
    row_bg = np.median(np.stack([a[:, :8].reshape(h, -1, 3).mean(1), a[:, -8:].reshape(h, -1, 3).mean(1)]), axis=0)
    local_bg = 0.5 * bg + 0.5 * row_bg[:, None, :]
    dist = np.sqrt(((a - local_bg) ** 2).sum(-1))
    # しきい値は外周のばらつき（背景のムラ）から決める。白っぽい被写体を食わないよう控えめに
    bd = np.concatenate([dist[:6].ravel(), dist[-6:].ravel(), dist[:, :6].ravel(), dist[:, -6:].ravel()])
    T_IN = float(np.clip(np.percentile(bd, 99) * 1.5, 10, 30))
    T_OUT = T_IN + 18

    # 背景と同じ色味で暗いだけの画素（＝落ち影）も背景扱いにする
    gray = a.mean(-1, keepdims=True)
    chroma = a - gray
    bgc = bg - bg.mean()
    cos = (chroma * bgc).sum(-1) / (np.linalg.norm(chroma, axis=-1) * np.linalg.norm(bgc) + 1e-6)
    sat = np.linalg.norm(chroma, axis=-1)
    bright = a.mean(-1)
    shadow = (cos > 0.95) & (sat > 0.6 * np.linalg.norm(bgc)) & (bright > 0.45 * bg.mean()) & (bright < bg.mean() - 6)

    # 下端の落ち影：背景より暗く、背景から遠すぎない画素（色味は問わない）。被写体の下側15%だけ
    rows = np.where((dist > T_OUT).any(1))[0]
    if len(rows):
        top, bot = rows[0], rows[-1]
        yy = np.arange(h)[:, None]
        low = yy > bot - (bot - top) * 0.15
        shadow |= low & (dist < 62) & (bright < bg.mean() - 8)

    near = (dist < T_OUT) | shadow
    lab, _ = ndimage.label(near)
    edge_labels = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    connected = np.isin(lab, list(edge_labels))

    alpha = np.clip((dist - T_IN) / (T_OUT - T_IN), 0, 1)
    alpha = np.where(shadow & connected, 0.0, alpha)
    alpha = np.where(connected, alpha, 1.0)
    # 被写体の内側に残った小さな穴を埋める
    solid = ndimage.binary_fill_holes(alpha > 0.5)
    alpha = np.where(solid & (alpha < 0.5) & ~connected, 1.0, alpha)
    # 小さなゴミを消す（最大の塊だけ残す）
    lab2, n = ndimage.label(alpha > 0.5)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab2), lab2, range(1, n + 1))
        keep = 1 + int(np.argmax(sizes))
        alpha = np.where((lab2 == keep) | (alpha <= 0.5), alpha, 0)
        alpha = np.where(ndimage.binary_dilation(lab2 == keep, iterations=3), alpha, 0)

    # 半透明の縁に背景色がにじまないよう、縁の色を内側の色に寄せる（簡易デフリンジ）
    rgb = a.copy()
    edge = (alpha > 0) & (alpha < 1)
    if edge.any():
        blurred = np.asarray(Image.fromarray(np.uint8(rgb * (alpha[..., None] > 0.95))).filter(ImageFilter.MaxFilter(5))).astype(np.float32)
        rgb[edge] = blurred[edge]

    out = Image.fromarray(np.dstack([np.uint8(np.clip(rgb, 0, 255)), np.uint8(alpha * 255)]), "RGBA")
    bbox = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    out = out.crop(bbox)
    pad = int(max(out.size) * 0.03)
    canvas = Image.new("RGBA", (out.width + pad * 2, out.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(out, (pad, pad))
    canvas.thumbnail((size, size), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    dst = os.path.join(OUT, f"{item_id}.png")
    canvas.save(dst, optimize=True)
    print(f"OK {dst} {canvas.size}")
    return dst


if __name__ == "__main__":
    cutout(sys.argv[1], sys.argv[2])
