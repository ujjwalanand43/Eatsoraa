from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.utils import ImageReader
from pathlib import Path
from PIL import Image as PILImage

ROOT = Path('/Volumes/SSD/Work/EatSoraa/soraa')
OUT = ROOT / 'output/pdf/soraa-ai-graphics-designer-brief.pdf'
PREVIEW_DIR = ROOT / 'tmp/pdfs/brief-previews'
FONT = ROOT / 'public/fonts/poppins-regular.ttf'
BOLD = ROOT / 'public/fonts/poppins-bold.ttf'

pdfmetrics.registerFont(TTFont('Poppins', str(FONT)))
pdfmetrics.registerFont(TTFont('PoppinsBold', str(BOLD)))

ORANGE = colors.HexColor('#FE5100')
INK = colors.HexColor('#32180F')
CREAM = colors.HexColor('#FFF9EE')
PEACH = colors.HexColor('#FFE0C8')
MUTED = colors.HexColor('#66574E')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleS', fontName='PoppinsBold', fontSize=25, leading=30, textColor=INK, spaceAfter=8))
styles.add(ParagraphStyle(name='Sub', fontName='Poppins', fontSize=9.2, leading=14, textColor=MUTED, spaceAfter=9))
styles.add(ParagraphStyle(name='H1x', fontName='PoppinsBold', fontSize=16, leading=20, textColor=INK, spaceBefore=4, spaceAfter=8))
styles.add(ParagraphStyle(name='H2x', fontName='PoppinsBold', fontSize=10.2, leading=13, textColor=INK, spaceBefore=4, spaceAfter=3))
styles.add(ParagraphStyle(name='Bodyx', fontName='Poppins', fontSize=8.2, leading=11.8, textColor=INK))
styles.add(ParagraphStyle(name='Small', fontName='Poppins', fontSize=7.1, leading=9.2, textColor=MUTED))
styles.add(ParagraphStyle(name='Tag', fontName='PoppinsBold', fontSize=7.1, leading=9, textColor=colors.white, backColor=ORANGE, borderPadding=(3,5,3), spaceAfter=4))

def P(text, style='Bodyx'):
    return Paragraph(text, styles[style])

def thumb(path, w=40*mm, h=25*mm):
    p = ROOT / path
    if not p.exists(): return P('Preview unavailable', 'Small')
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    preview = PREVIEW_DIR / (path.replace('/', '__') + '.jpg')
    if not preview.exists() or preview.stat().st_mtime < p.stat().st_mtime:
        with PILImage.open(p) as source:
            source.thumbnail((900, 900), PILImage.Resampling.LANCZOS)
            if source.mode in ('RGBA', 'LA', 'P'):
                base = PILImage.new('RGB', source.size, '#fff9ee')
                if source.mode == 'P': source = source.convert('RGBA')
                base.paste(source, mask=source.getchannel('A') if source.mode == 'RGBA' else None)
                source = base
            else:
                source = source.convert('RGB')
            source.save(preview, 'JPEG', quality=82, optimize=True)
    ir = ImageReader(str(preview)); iw, ih = ir.getSize()
    scale = min(w/iw, h/ih)
    return Image(str(preview), iw*scale, ih*scale)

def asset_table(rows):
    data = [[P('<b>Asset / current file</b>','Small'), P('<b>Used on screen</b>','Small'), P('<b>Designer brief / replacement requirement</b>','Small')]]
    for name, screen, brief in rows:
        data.append([P(name,'Small'), P(screen,'Small'), P(brief,'Small')])
    t = Table(data, colWidths=[46*mm, 39*mm, 91*mm], repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([
      ('BACKGROUND',(0,0),(-1,0),PEACH), ('TEXTCOLOR',(0,0),(-1,0),INK),
      ('GRID',(0,0),(-1,-1),0.35,colors.HexColor('#D8C6B9')),
      ('VALIGN',(0,0),(-1,-1),'TOP'), ('LEFTPADDING',(0,0),(-1,-1),4),('RIGHTPADDING',(0,0),(-1,-1),4),
      ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
      ('BACKGROUND',(0,1),(-1,-1),colors.white),
    ]))
    return t

def visual_grid(items, cols, image_w=38*mm, image_h=32*mm):
    """A labelled reference sheet; visual files remain unchanged in public/."""
    cells = []
    for path, label in items:
        cells.append([thumb(path, image_w, image_h), P('<b>'+label+'</b><br/>'+path, 'Small')])
    rows = []
    for i in range(0, len(cells), cols):
        row = cells[i:i+cols]
        row += [[P('', 'Small'), P('', 'Small')]] * (cols-len(row))
        rows.append(row)
    widths = []
    for _ in range(cols): widths.extend([image_w + 5*mm, (176*mm/cols) - image_w - 5*mm])
    flat_rows = []
    for row in rows:
        flat=[]
        for pair in row: flat += pair
        flat_rows.append(flat)
    t=Table(flat_rows, colWidths=widths, hAlign='LEFT')
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE'), ('GRID',(0,0),(-1,-1),.35,colors.HexColor('#D8C6B9')),('BACKGROUND',(0,0),(-1,-1),colors.white),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    return t

def page_num(canvas, doc):
    canvas.saveState(); canvas.setFillColor(CREAM); canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor('#E8DACE')); canvas.line(17*mm, 14*mm, 193*mm, 14*mm)
    canvas.setFont('Poppins', 7); canvas.setFillColor(MUTED)
    canvas.drawString(17*mm, 8*mm, 'SORAA - AI Graphics & Illustration Brief')
    canvas.drawRightString(193*mm, 8*mm, f'{doc.page}')
    canvas.restoreState()

story=[]
story += [P('SORAA: AI Graphics & Illustration Brief', 'TitleS'), P('Designer handoff - based on the assets currently used in the storefront code. The UI structure, crop areas and placement should remain unchanged; only the artwork may be refreshed.', 'Sub')]
story += [P('What this document covers','H1x'), P('Local banners, campaign images, illustrations and photo-composites in <b>/public</b>. Shopify product, collection and blog images are live CMS content, so they are listed as ongoing photography requirements rather than fixed local files.', 'Bodyx'), Spacer(1,5)]
story += [P('Decision key','H2x'), P('<b>Confirmed AI-origin:</b> a matching image-generation prompt file is present. <b>Likely AI / campaign composite:</b> no prompt file beside it, but its visual role and file family indicate generated campaign artwork. <b>Not AI artwork to recreate:</b> retailer logos, SVG icons, logo, and product media from Shopify.', 'Bodyx'), Spacer(1,8)]
summary = [
 ['Confirmed AI-origin','7 source families / 18+ files','Hero artwork, Why SORAA variants, lifestyle contact sheet, category sprite concept, Snack Squad concept'],
 ['Likely AI / campaign composites','20+ local files','Hero colour variants, category tile imagery, product campaign cards, PDP/editorial background shots'],
 ['Do not recreate as AI','Retailer logos + UI SVGs','Use official supplied logo files and existing vector UI details'],
 ['CMS photography needed','All product / collection / blog screens','Provide product packshots and lifestyle images through Shopify']]
t=Table([[P('<b>Status</b>','Small'),P('<b>Count</b>','Small'),P('<b>Scope</b>','Small')]]+[[P(x,'Small') for x in r] for r in summary],colWidths=[41*mm,37*mm,98*mm])
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),INK),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#D8C6B9')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
story += [t, Spacer(1,10), P('Global creative rules','H1x'), P('Keep the SORAA palette: warm cream #FFF9EE, brand orange #FE5100, deep brown #32180F, peach #FFE0C8, plus product-pack colours. Premium but playful, young Indian snack brand, clean studio / editorial lighting, generous negative space, real packaging only. Never add a fake CTA, navigation, watermark, new logo or unapproved copy into a supplied image.', 'Bodyx'), PageBreak()]

story += [P('1. Homepage - Hero carousel','H1x'), P('Exactly 4 slides currently rotate every 5 seconds. Desktop stage is 480-760 px tall; on mobile each photographic slide uses a 200-320 px image block plus live HTML copy below. Keep the image safe areas clear, especially the left copy zone on slides 2-4.', 'Sub')]
hero_rows=[
 ('<b>Confirmed AI</b><br/>soraa-website-banner.png<br/>8192 x 3641, 2.25:1', 'Homepage hero, slide 1', 'Master campaign banner. Cream base; orange playful headline and handwritten captions on left; five product packs, stone slab and loose nuts on right. Preserve all existing embedded text/design as-is. Empty lower-left area is intentionally reserved for an HTML Shop Now button.'),
 ('<b>Likely AI</b><br/>hero-snack-range.jpg / .png<br/>2066 x 761, 2.71:1', 'Homepage slide 2; About hero', 'Warm orange snack-range campaign. Product group must sit right / centre-right. Keep left 42% visually calm for live headline, description and two CTAs. Produce one master, 2x web export and a mobile crop with product detail still visible.'),
 ('<b>Likely AI</b><br/>hero-snack-peach.jpg / .png<br/>2066 x 761, 2.71:1', 'Homepage slide 3', 'Peach campaign variation with colourful SORAA packs. No text inside image. Keep left 42% quiet and high-contrast for white HTML copy; packs on right.'),
 ('<b>Likely AI</b><br/>hero-snack-berry.jpg / .png<br/>2066 x 761, 2.71:1', 'Homepage slide 4', 'Berry/red campaign variation. No text inside image. Same safe area and pack treatment as slide 3; ensure white typography remains readable.'),
 ('Reference / legacy<br/>hero-reference.png, hero.png, hero-wide.png', 'Not currently rendered', 'Keep as reference/source only. Do not deliver as live files unless the developer explicitly swaps the hero implementation.')]
story += [asset_table(hero_rows), Spacer(1,9), P('Delivery for all hero images: final master in PSD/AI/Figma + flattened WebP/JPG. No text baked in except slide 1 where the original creative already contains approved lettering. Keep every pack fully inside a 16:9 mobile crop.', 'Bodyx'), PageBreak()]

story += [P('2. Homepage - Categories, social and lifestyle','H1x'), P('These areas are image-led but the surrounding labels, arrows, captions and section headings are HTML. The graphic designer should supply visual-only artwork.', 'Sub')]
rows=[
 ('<b>Likely AI</b><br/>categories/category-01.jpg to category-07.jpg<br/>7 x 5001 x 5001', 'Homepage Shop by Category', 'Seven square top-down food photographs: (1) nuts & raisins, (2) seeds & superfoods, (3) trail mix, (4) flavoured nuts & mixes, (5) spices & masalas, (6) bundles & giftpacks, (7) dry fruits. Same warm light, cream / neutral base, central product arrangement. No title or arrow within the image. Supply 1:1 images, 2400 px minimum; website labels sit below each card.'),
 ('<b>Confirmed AI concept</b><br/>category-artwork.png<br/>2172 x 724, 3:1', 'Legacy / CSS sprite; visual reference', 'Seven evenly-spaced overhead food arrangements on warm cream #FFF9EE, one horizontal row, no text/labels. It is not the current category-card source, but retains the desired visual language.'),
 ('<b>Confirmed AI</b><br/>snack-squad.png<br/>wide 3:1 contact sheet', 'Homepage Real People, Real Snacking', 'Five equal vertical lifestyle panels edge-to-edge: Sikh man at home; woman at work desk; man outdoors; woman after yoga; man relaxing. Indian adults, candid waist-up, food/hands visible, warm editorial light. No pack shots, logos, text, gutters or fake play icons.'),
 ('<b>Confirmed AI</b><br/>lifestyle-scenes.png<br/>2172 x 724, 3:1', 'Homepage lifestyle cards; About SORAA', 'Four equal scenes in one horizontal sheet: desk/laptop, gym bag, train travel, book/tea. Warm cream/orange/green palette, no faces/logos/type. Current site crops it into four 4:5 cards, so each quarter must have its subject centred with breathing room.'),
]
story += [asset_table(rows), PageBreak()]

story += [P('3. Homepage - product campaign art','H1x'), P('These five portrait compositions are reused across the homepage, welcome offer, reviews, collection/product banners and overlays. They are the most important reusable illustration family after the hero.', 'Sub')]
rows=[
 ('<b>Likely AI / campaign composite</b><br/>feel-good/breakfast-mixes.png<br/>1121 x 1403, 4:5', 'Better For You, reviews, explore, product overlays', 'Morning Energy Breakfast Mix. Vertical premium snack moment; pack must be readable and remain the main focal point. Safe central crop; no embedded CTA.'),
 ('<b>Likely AI / campaign composite</b><br/>feel-good/dates-date-bites.png<br/>1121 x 1403, 4:5', 'Better For You, reviews, product overlays', 'Date Bites campaign card. Pack plus complementary ingredients. Same lighting, scale and visual density as the full set.'),
 ('<b>Likely AI / campaign composite</b><br/>feel-good/dry-fruits.png<br/>1121 x 1403, 4:5', 'Better For You; PDP banner back pack', 'Premium Walnut Kernels. Keep product pack centred and legible; transparent-ish / isolated composition works best because it layers in the PDP banner.'),
 ('<b>Likely AI / campaign composite</b><br/>feel-good/flavored-nuts.png<br/>1121 x 1403, 4:5', 'Better For You; Welcome Offer; PDP banner front pack', 'Peri-Peri Roasted Cashews. Same master family; designed to overlap another pack without a hard rectangular background.'),
 ('<b>Likely AI / campaign composite</b><br/>feel-good/best-sellers.png<br/>1121 x 1403, 4:5', 'Homepage reviews / explore', 'Best-sellers / Date Bites snack moment. Portrait product editorial. Keep the pack and food crop-safe at 4:5.'),
]
story += [asset_table(rows), Spacer(1,8), P('Designer delivery: five consistent 4:5 masters at 2240 x 2806 px (or larger), with layered source. Avoid small lettering, thin edge details or objects touching frame edges; the site scales and overlaps these files.', 'Bodyx'), PageBreak()]

story += [P('4. Homepage - Why SORAA campaign family','H1x'), P('The live homepage uses the orange version. The cream and sky versions are retained in the asset folder and show the approved alternate treatments.', 'Sub')]
rows=[
 ('<b>Confirmed AI</b><br/>why-soraa-orange.png<br/>1774 x 887, 2:1', 'Homepage Why SORAA', 'LIVE. Five upright SORAA packs: purple Date Bites, orange Walnut Kernels, green Super Seed Mix, magenta Cranberries, green Pistachios. Rich orange clouds (#FF681F / #FF8B40), ivory space at top, pale cream sandstone podium, scattered nuts. Preserve pack identities and composition. No new copy.'),
 ('<b>Confirmed AI</b><br/>why-soraa-cream.png<br/>1774 x 887, 2:1', 'Unused alternate', 'Same pack composition on warm ivory #FFF9EE, pale peach clouds and cream sandstone. Useful for a light-theme campaign or email.'),
 ('<b>Confirmed AI</b><br/>why-soraa-sky.png<br/>1774 x 887, 2:1', 'Unused alternate', 'Same pack composition on bright sky blue, wispy clouds and pale-blue podium. Useful alternate only; no headline/buttons in artwork.'),
 ('<b>Likely AI</b><br/>hero-snack-better.jpg<br/>1600 x 844, 1.9:1', 'Product detail editorial/review fallback', 'Date Bites snack-break lifestyle. Natural product editorial; keep usable space for overlay / text treatments.'),
 ('<b>Likely AI</b><br/>hero-grab-snack.jpg<br/>1600 x 844, 1.9:1', 'Product Extras close / CTA', 'Grab-and-go pack scene; product packs visually clear, modern lifestyle feel, no text baked in.')]
story += [asset_table(rows), PageBreak()]

story += [P('5. Screen-by-screen graphics checklist','H1x'), P('This is the production checklist for the graphic designer. Counts indicate artwork groups, not repeated responsive exports.', 'Sub')]
checks=[
 ['Homepage','4 hero slide masters + 7 category images + 1 Snack Squad contact sheet + 1 lifestyle contact sheet + 5 Feel Good portraits + 1 Why SORAA master','19 artwork groups','Most visual screen. Keep all composition safe areas detailed in this PDF.'],
 ['About SORAA','Hero range asset + lifestyle contact sheet','Reuses 2','No additional illustration required.'],
 ['Product detail page','2 portrait campaign layers + 2 editorial wides','Reuses 4','The actual product gallery is Shopify CMS, not a local AI asset.'],
 ['Cart / cart drawer','No external illustration','0','Nut ornaments are code-drawn SVG. Do not replace with raster art.'],
 ['Collections, search, wishlist','No fixed local graphics','0','Product cards use Shopify product images.'],
 ['Journal / blog','No fixed local graphics','0','Article imagery comes from Shopify CMS.'],
 ['Investor, policy, contact','No fixed local illustrations','0','Graphic UI is CSS typography / colour blocks.'],
 ['Header / footer','Brand logo + retailer logos + SVG icons','0 AI assets','Use official supplier files; do not generate logos or trademarks.']]
t=Table([[P('<b>Screen</b>','Small'),P('<b>Graphic requirement</b>','Small'),P('<b>Qty</b>','Small'),P('<b>Notes</b>','Small')]]+[[P(x,'Small') for x in r] for r in checks],colWidths=[29*mm,65*mm,25*mm,57*mm],repeatRows=1)
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),INK),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#D8C6B9')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),4),('RIGHTPADDING',(0,0),(-1,-1),4),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
story += [t, Spacer(1,10), P('CMS photography requirement','H2x'), P('For every sellable product: minimum <b>4 images</b> - 1 clean front packshot, 1 angled packshot, 1 ingredient/detail shot, 1 lifestyle / in-use shot. Recommended: 6-8 images with pack-size / flavour variants. For each collection: 1 cover image (landscape 3:2 or square). For each blog article: 1 landscape cover image (minimum 1600 x 900). These are uploaded in Shopify; no local file path is defined.', 'Bodyx'), PageBreak()]

story += [P('6. Handoff specifications','H1x'), P('Give the developer a final export folder which follows the existing file names, plus editable sources. The code already points to these paths, so replacement is safest when dimensions / aspect ratios do not change.', 'Sub')]
rules=[
 ('File format','WebP preferred for final photographic/composite exports; JPG is acceptable. PNG only where transparent background is truly required. Keep editable PSD/AI/Figma source files separately.'),
 ('Resolution','Export at least 2x the intended web display: hero 4128 x 1522 minimum; Why SORAA 3548 x 1774; portrait campaign art 2240 x 2806; category tiles 2400 x 2400. Do not upscale low-resolution AI output.'),
 ('Colour / print','Use sRGB for web exports. If printing is needed, create separate CMYK artwork - do not overwrite web files.'),
 ('Packaging','Use approved SORAA pack designs exactly. Labels must remain legible, accurate and free from hallucinated claims, ingredients or logos.'),
 ('Accessibility','All text that is required for meaning / action should remain HTML. If an image contains approved decorative lettering, never rely on it alone for important information.'),
 ('QA before handoff','Check desktop 1440 px and mobile 390 px crops. Verify no heads, packs or key ingredients are cut off; verify text space remains uncluttered; verify no watermarks, extra fingers, distorted packs or invented brand marks.'),
]
data=[]
for a,b in rules: data.append([P('<b>'+a+'</b>','Small'),P(b,'Small')])
t=Table(data,colWidths=[38*mm,138*mm]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(0,-1),PEACH),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#D8C6B9')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
story += [t, Spacer(1,12), P('Recommended delivery structure','H2x'), P('<b>/hero/</b> soraa-website-banner, hero-snack-range, hero-snack-peach, hero-snack-berry<br/><b>/categories/</b> category-01 through category-07<br/><b>/campaign/</b> five feel-good portraits, lifestyle-scenes, snack-squad, why-soraa-orange / cream / sky<br/><b>/pdp/</b> hero-snack-better, hero-grab-snack<br/><b>/source/</b> editable originals and a short readme naming all exports', 'Bodyx'), Spacer(1,10), P('Important: this document identifies image-generation provenance from the repository evidence. It does not claim that every unprompted local image was generated by AI; those assets are labelled “likely” so the designer can confirm ownership / source before recreating them.', 'Small')]

# Visual appendix: these previews make the brief immediately usable without opening the repository.
story += [PageBreak(), P('Visual appendix A - Hero banners', 'H1x'), P('Current live / campaign hero assets. The first image has approved embedded campaign typography; the other three are used with live HTML copy over the left side.', 'Sub')]
hero_visuals=[
 ('public/soraa-website-banner.png','Hero 01 - embedded campaign artwork'),
 ('public/hero-snack-range.jpg','Hero 02 - orange range'),
 ('public/hero-snack-peach.jpg','Hero 03 - peach range'),
 ('public/hero-snack-berry.jpg','Hero 04 - berry range'),
]
story += [visual_grid(hero_visuals, 1, 75*mm, 30*mm)]

story += [PageBreak(), P('Visual appendix B - Category imagery', 'H1x'), P('Seven current homepage category card images. HTML labels appear below these images in the UI and are not part of the artwork.', 'Sub')]
category_visuals=[
 ('public/categories/category-01.jpg','01 - Nuts & Raisins'),('public/categories/category-02.jpg','02 - Seeds & Superfoods'),('public/categories/category-03.jpg','03 - Trail Mixes'),('public/categories/category-04.jpg','04 - Flavoured Nuts & Mixes'),('public/categories/category-05.jpg','05 - Spices & Masalas'),('public/categories/category-06.jpg','06 - Bundles & Giftpacks'),('public/categories/category-07.jpg','07 - Dry Fruits')]
story += [visual_grid(category_visuals, 2, 31*mm, 31*mm)]

story += [PageBreak(), P('Visual appendix C - Portrait campaign art', 'H1x'), P('Reusable 4:5 compositions used in the Better For You section, reviews, overlays, welcome offer and product-page promotional banner.', 'Sub')]
campaign_visuals=[
 ('public/feel-good/breakfast-mixes.png','Breakfast Mixes'),('public/feel-good/dates-date-bites.png','Date Bites'),('public/feel-good/dry-fruits.png','Dry Fruits'),('public/feel-good/flavored-nuts.png','Flavoured Nuts'),('public/feel-good/best-sellers.png','Best Sellers')]
story += [visual_grid(campaign_visuals, 2, 30*mm, 42*mm)]

story += [PageBreak(), P('Visual appendix D - Lifestyle and Why SORAA', 'H1x'), P('Approved references for the lifestyle strip and the three Why SORAA colour treatments.', 'Sub')]
story += [visual_grid([
 ('public/lifestyle-scenes.png','Lifestyle contact sheet'),('public/snack-squad.png','Snack Squad contact sheet'),('public/why-soraa-orange.png','Why SORAA - live orange'),('public/why-soraa-cream.png','Why SORAA - cream alternate'),('public/why-soraa-sky.png','Why SORAA - sky alternate'),
], 1, 75*mm, 28*mm)]

doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=17*mm,leftMargin=17*mm,topMargin=16*mm,bottomMargin=19*mm,title='SORAA AI Graphics & Illustration Brief',author='Codex')
doc.build(story,onFirstPage=page_num,onLaterPages=page_num)
print(OUT)
