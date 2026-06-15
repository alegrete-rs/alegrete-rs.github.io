#!/usr/bin/env python3
"""Generate the June English Meetup poster (1280x1600) matching the Visit Alegrete brand."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1280, 1600
OUT = "assets/divulgacoes/english-meetup-junho.jpg"

# Brand palette
NAVY_TOP = (22, 41, 79)
NAVY_BOT = (12, 24, 48)
PAPER = (251, 248, 241)
INK = (24, 35, 60)
RED = (216, 68, 47)
GREEN = (67, 169, 114)
GOLD = (239, 177, 58)
GOLD2 = (246, 199, 99)
BLUE = (47, 125, 196)
TEAL = (20, 163, 149)
WHITE = (253, 253, 255)

F = "/System/Library/Fonts/Supplemental/"
def serif(sz, bold=True, italic=False):
    name = "Georgia Bold.ttf" if bold and not italic else \
           "Georgia Italic.ttf" if italic else "Georgia.ttf"
    return ImageFont.truetype(F + name, sz)
def sans(sz, w=0):
    return ImageFont.truetype("/System/Library/Fonts/Avenir Next.ttc", sz, index=w)

# ---- background gradient ----
img = Image.new("RGB", (W, H), NAVY_TOP)
top = Image.new("RGB", (1, H))
for y in range(H):
    t = y / (H - 1)
    top.putpixel((0, y), tuple(int(a + (b - a) * t) for a, b in zip(NAVY_TOP, NAVY_BOT)))
img = top.resize((W, H))
draw = ImageDraw.Draw(img, "RGBA")

# subtle vignette glow top
glow = Image.new("L", (W, H), 0)
gd = ImageDraw.Draw(glow)
gd.ellipse([W//2-520, -380, W//2+520, 360], fill=70)
img.paste(Image.new("RGB", (W, H), GOLD), (0, 0), glow.point(lambda v: int(v*0.16)))
draw = ImageDraw.Draw(img, "RGBA")

# ---- helpers ----
def tw(d, s, f, tracking=0):
    if not tracking:
        return d.textlength(s, font=f)
    return sum(d.textlength(c, font=f) + tracking for c in s) - tracking

def center(d, y, s, f, fill, tracking=0):
    x = (W - tw(d, s, f, tracking)) / 2
    if tracking:
        for c in s:
            d.text((x, y), c, font=f, fill=fill)
            x += d.textlength(c, font=f) + tracking
    else:
        d.text((x, y), s, font=f, fill=fill)

# ---- Union Jack badge (supersampled) ----
def union_jack(w, h, s=4):
    W2, H2 = w*s, h*s
    uj = Image.new("RGBA", (W2, H2), (10, 33, 92, 255))  # blue field
    d = ImageDraw.Draw(uj)
    # white saltire (diagonals)
    d.line([(0, 0), (W2, H2)], fill=WHITE, width=int(h*0.30*s))
    d.line([(W2, 0), (0, H2)], fill=WHITE, width=int(h*0.30*s))
    # red saltire (offset, thinner) using polygons for the counterchange look
    rw = int(h*0.11*s)
    d.line([(0, 0), (W2, H2)], fill=RED, width=rw)
    d.line([(W2, 0), (0, H2)], fill=RED, width=rw)
    # white cross
    d.rectangle([W2/2-h*0.20*s, 0, W2/2+h*0.20*s, H2], fill=WHITE)
    d.rectangle([0, H2/2-h*0.20*s, W2, H2/2+h*0.20*s], fill=WHITE)
    # red cross
    d.rectangle([W2/2-h*0.11*s, 0, W2/2+h*0.11*s, H2], fill=RED)
    d.rectangle([0, H2/2-h*0.11*s, W2, H2/2+h*0.11*s], fill=RED)
    uj = uj.resize((w, h), Image.LANCZOS)
    # rounded mask
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w-1, h-1], radius=int(h*0.16), fill=255)
    uj.putalpha(mask)
    return uj

ujw, ujh = 232, 145
uj = union_jack(ujw, ujh)
ujx = (W - ujw)//2
ujy = 118
# soft frame behind
draw.rounded_rectangle([ujx-7, ujy-7, ujx+ujw+7, ujy+ujh+7], radius=28,
                       fill=(255, 255, 255, 26), outline=(246, 199, 99, 120), width=2)
img.paste(uj, (ujx, ujy), uj)
draw = ImageDraw.Draw(img, "RGBA")

# ---- eyebrow ----
center(draw, ujy+ujh+34, "ENGLISH MEETUP  ·  ALEGRETE", sans(27, 1), GOLD2, tracking=6)

# ---- title ----
center(draw, 380, "Junho no", serif(94), WHITE)
center(draw, 484, "Meetup", serif(94), WHITE)
# accent underline swash
uy = 600
center(draw, 556, "Alegrete", serif(70, italic=True), GOLD2)

# tricolor divider
def tricolor(cy, total=460):
    segs = [RED, GOLD, GREEN, BLUE]
    sw = total / len(segs)
    x0 = (W - total)/2
    for i, c in enumerate(segs):
        draw.rounded_rectangle([x0+i*sw+3, cy, x0+(i+1)*sw-3, cy+7], radius=4, fill=c)
tricolor(672)

# subtitle
center(draw, 706, "Inglês na prática · novas amizades · boas conversas",
       sans(28, 0), (214, 224, 242))

# ---- "próximos encontros" label ----
center(draw, 800, "PRÓXIMOS ENCONTROS", sans(25, 1), TEAL_LBL := (122, 214, 200), tracking=5)

# ---- event card ----
def event_card(y, day, mon, title, place, when, accent):
    x0, x1 = 150, W-150
    ch = 196
    draw.rounded_rectangle([x0, y, x1, y+ch], radius=26,
                           fill=(255, 255, 255, 18), outline=(255, 255, 255, 38), width=2)
    # accent left bar
    draw.rounded_rectangle([x0, y, x0+10, y+ch], radius=5, fill=accent)
    # date badge
    bx, by, bs = x0+40, y+34, 128
    draw.rounded_rectangle([bx, by, bx+bs, by+bs], radius=22, fill=accent)
    df = serif(58)
    dl = draw.textlength(day, font=df)
    draw.text((bx+(bs-dl)/2, by+18), day, font=df, fill=WHITE)
    mf = sans(24, 1)
    ml = tw(draw, mon, mf, 3)
    mx = bx+(bs-ml)/2
    for c in mon:
        draw.text((mx, by+92), c, font=mf, fill=(255, 255, 255, 235)); mx += draw.textlength(c, font=mf)+3
    # text block
    tx = bx+bs+38
    draw.text((tx, y+38), title, font=serif(46), fill=WHITE)
    draw.text((tx, y+104), place, font=sans(28, 1), fill=GOLD2)
    draw.text((tx, y+146), when, font=sans(25, 0), fill=(206, 217, 236))

event_card(852, "17", "JUN", "La Boqueria", "Encontro · Quarta-feira",
           "19h30 às 21h30", RED)
event_card(1074, "24", "JUN", "Noite de Karaokê", "Cocktails and Dreams",
           "Quarta · 19h30 às 21h30", BLUE)

# ---- footer line ----
center(draw, 1308, "Ambiente leve e acolhedor — chame os amigos!",
       serif(34, italic=True), GOLD2)

# hashtags pill
hf = sans(26, 1)
htext = "#MeetupAlegrete   #EnglishClub"
hl = tw(draw, htext, hf, 1)
px = (W-hl)/2
draw.rounded_rectangle([px-34, 1392, px+hl+34, 1452], radius=30,
                       fill=(255, 255, 255, 16), outline=(246, 199, 99, 110), width=2)
xx = px
for c in htext:
    draw.text((xx, 1404), c, font=hf, fill=WHITE); xx += draw.textlength(c, font=hf)+1

# bottom tricolor bar
bar = ["#d8442f", RED],
segs = [RED, GOLD, GREEN, BLUE]
sw = W/len(segs)
for i, c in enumerate(segs):
    draw.rectangle([i*sw, H-14, (i+1)*sw, H], fill=c)

img.save(OUT, "JPEG", quality=92)
print("saved", OUT, img.size)
