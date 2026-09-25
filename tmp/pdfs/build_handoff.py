from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from PIL import Image
from reportlab.lib.utils import ImageReader
from io import BytesIO
from pathlib import Path
from xml.sax.saxutils import escape
ROOT=Path('/Volumes/SSD/Work/EatSoraa/soraa'); OUT=ROOT/'output/pdf/SORAA-Homepage-Graphics-Designer-Brief.pdf'
W,H=595.28,841.89; M=40; CW=W-2*M
c=canvas.Canvas(str(OUT),pagesize=(W,H));c.setTitle('SORAA | Homepage graphics designer handoff');c.setAuthor('SORAA design handoff')
INK='#482c22'; ORANGE='#ff4911'; CREAM='#fff9ee'; MUTED='#766052'; page=0; y=0
styles={
 'body':ParagraphStyle('body',fontName='Helvetica',fontSize=10,leading=14,textColor=HexColor(INK),spaceAfter=7),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=8,leading=11,textColor=HexColor(MUTED)),
 'cell':ParagraphStyle('cell',fontName='Helvetica',fontSize=8.4,leading=11.5,textColor=HexColor(INK)),
 'head':ParagraphStyle('head',fontName='Helvetica-Bold',fontSize=11,leading=14,textColor=HexColor(INK)),
}
def txt(s,style='body',width=CW,x=M):
 global y
 p=Paragraph(s,styles[style]);_,h=p.wrap(width,900);p.drawOn(c,x,y-h);y-=h+8
 if y<42: raise RuntimeError(f'Page {page} overflow {y}')
def start(title,kicker='DESIGNER HANDOFF'):
 global page,y
 if page:c.showPage()
 page+=1;c.setFillColor(HexColor(CREAM));c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(HexColor(ORANGE));c.rect(M,H-40,34,4,fill=1,stroke=0)
 c.setFont('Helvetica-Bold',8);c.drawString(M,H-58,kicker+'  /  SORAA')
 c.setFillColor(HexColor(INK));c.setFont('Helvetica-Bold',25);c.drawString(M,H-94,title)
 c.setStrokeColor(HexColor('#dfcbb9'));c.line(M,34,W-M,34);c.setFont('Helvetica',8);c.setFillColor(HexColor(MUTED));c.drawString(M,22,'23 SEP 2026  |  Homepage asset audit + production brief');c.drawRightString(W-M,22,f'{page:02d}')
 y=H-116

def heading(s):
 global y
 y-=4;txt(s,'head')
def table(rows,widths=None):
 global y
 widths=widths or [CW/len(rows[0])]*len(rows[0]); data=[[Paragraph(escape(str(v)).replace('\n','<br/>'),styles['cell']) for v in row] for row in rows]
 t=Table(data,colWidths=widths,hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#ffe5d5')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,-1),.4,HexColor('#dfcbb9'))]));_,h=t.wrap(CW,1000);t.drawOn(c,M,y-h);y-=h+12
 if y<42:raise RuntimeError(f'Table overflow page {page}: {y}')
def image_ref(path):
 im=Image.open(path).convert('RGB');im.thumbnail((1600,1600));buf=BytesIO();im.save(buf,format='JPEG',quality=88);buf.seek(0);return ImageReader(buf)

def pic(name,maxh=230):
 global y
 path=ROOT/'public'/name; iw,ih=Image.open(path).size;w=min(CW,maxh*iw/ih);h=w*ih/iw;c.drawImage(image_ref(path),M+(CW-w)/2,y-h,width=w,height=h,mask='auto');y-=h+9

def bullets(items):
 for t in items:txt('&#8226; '+t)

start('Graphics replacement brief','HOME / LANDING PAGE')
pic('why-soraa-orange.png',220)
txt('<b>Goal:</b> replace the current AI concept artwork with production-ready SORAA graphics, while preserving the approved homepage composition, orange theme and compact spacing.')
heading('What the designer should quote')
bullets(['<b>14 core visual compositions:</b> 1 desktop hero + 1 mobile hero + 7 category visuals + 4 lifestyle scenes + 1 desktop Why SORAA scene.', '<b>1 additional mobile Why SORAA composition</b> is recommended to avoid cutting off the outer products. This needs a small responsive code change.', '<b>19 current product packshots</b> are sourced from Shopify, not proven AI-generated. Audit and replace only if approved originals are missing.', '<b>8 review video slots</b> currently have no media. Budget authentic videos and posters separately; do not recreate the old AI people image.'])
txt('Scope: current homepage at /, including its five visible collection tabs. This is a design handoff, not a website redesign. Other product-detail gallery images are outside this audit. Sizes below are width x height in pixels.','small')

start('01 / Active asset inventory')
table([['ID / role','Current active file','Source pixels'],['H01 desktop hero','hero-wide.png','1881 x 836'],['H02 mobile hero','hero.png','1536 x 1024'],['C01-C07 categories','category-artwork.png\n7 scenes in one sheet','2172 x 724'],['L01-L04 lifestyle','lifestyle-scenes.png\n4 scenes in one sheet','2172 x 724'],['W01 Why SORAA','why-soraa-orange.png','1774 x 887']],[135,260,120])
txt('These five active local rasters total approximately 10.0 MiB on disk as PNG files. They are concept/reference artwork, not approved packaging masters.')
heading('Homepage sequence')
txt('Header / announcement > Hero > Shop by category > Review videos > Moving ticker > Shop our collections > Lifestyle > Why SORAA > Newsletter > Footer wordmark.')
heading('Keep these as real interface elements')
bullets(['Buttons, navigation, prices, category names, product titles, review controls, newsletter fields and footer text must remain HTML/SVG, not flattened into pictures.', 'Desktop hero currently has its headline/body copy baked into the image; only its Shop Now button is live. Supply an editable layered version and a background-only version as well.', 'Newsletter has no separate raster illustration. Header/footer SORAA wordmarks are live font text. The moving ticker is live text plus an inline SVG megaphone.'])

start('02 / Responsive dimensions')
txt('Measured from the running homepage at four viewport sizes. Browser scrollbars reserve 15 px here; the content widths are 375, 753, 1425 and 1905 px. Rounded CSS pixels, not required export pixels.')
table([['Visible image slot','390 x 844','768 x 1024','1440 x 900','1920 x 1080'],['Desktop hero','Hidden','753 x 335','1425 x 633','1905 x 847'],['Mobile hero','375 x 250','Hidden','Hidden','Hidden'],['Category circle','156 x 156','154 x 154','155 x 155','213 x 213'],['Review media, active','231 x 231','193 x 235','239 x 292','320 x 391'],['Collection image box','250 x 300','223 x 250','245 x 331','326 x 410'],['Lifestyle photo','140 x 140','136 x 136','275 x 275','278 x 278'],['Why SORAA image','563 x 281*','753 x 377','1425 x 713','1905 x 953'],['Ticker megaphone','90 x 68','92 x 69','173 x 130','205 x 154']],[135,95,95,95,95])
txt('*Mobile Why artwork is 150% of the container width; only 375 px of the 563 px image is visible. Its outer thirds are partially clipped. See section 10.','small')
heading('Breakpoint rules to design for')
bullets(['Hero changes to a separate mobile composition at 767 px and below.', 'Category grid: 7 columns above 900 px; 4 at 541-900 px; 2 at 540 px and below.', 'Lifestyle grid: 4 columns above 600 px; 2 at 600 px and below.', 'Review media: square at 600 px and below; 9:11 above. Collection cards use contain, not cover.', 'Export at roughly 2x display size. Large desktop banners need genuine high-resolution masters, not enlarged AI previews.'])

start('03 / H01 desktop hero')
pic('hero-wide.png',235)
table([['Deliverable','Specification'],['Composition / ratio','Wide hero; 2.25:1. Preserve current geometry for direct replacement.'],['Editable master','4500 x 2000 px, layered PSD/PSB or equivalent.'],['Web exports','3600 x 1600 large; 2250 x 1000 standard; 1530 x 680 tablet.'],['Current display','Width = min(content width, (viewport height - 110) x 2.25). Height = width / 2.25. No cover crop.']],[130,385])
heading('Art direction + safe areas')
bullets(['Cream backdrop, orange expressive headline on left; five approved SORAA packs with nuts/fruit on right. Keep friendly doodles and food photography, not synthetic labels.', 'Reserve the live CTA rectangle: left 5.8%, top 85%, width 17%, height 8.5%. On the 4500 x 2000 master this is x=261, y=1700, w=765, h=170. Do not draw the button.', 'Maintain at least 3% trim-safe space around essential labels. Keep copy editable on its own layer. Supply separate product cutouts and background.'])

heading('Desktop copy to keep editable')
txt('SNACK GOOD FEEL GOOD / Real ingredients. Real good vibes. / Premium dry fruits, nuts, seeds, trail mixes, dates, healthy snacks and spice blends - made for your everyday adventures. Decorative callouts: Same Snack Different Energy; Fuel Your Fun; Healthy Looks Good On You.', 'small')

start('04 / H02 mobile hero')
pic('hero.png',255)
table([['Deliverable','Specification'],['Master / ratio','1800 x 1200 px; 3:2 landscape product collage.'],['Web exports','1536 x 1024 and 900 x 600; WebP or AVIF.'],['Current usage','Full mobile content width below live heading, paragraph and CTA; no crop. 375 x 250 at the tested phone width.']],[130,385])
bullets(['Do not put the main headline, body paragraph or Shop Now button inside this image. Those already render above it in HTML.', 'Include all five packs. Prioritize clear silhouettes and approved brand labels rather than tiny ingredient text.', 'Keep important products within central 90% of the canvas. Decorative doodles may sit near edges. Keep cream edge colours consistent with the page.', 'The existing Fuel Your Fun decorative badge can be retained as an editable layer; supply a clean artwork-only version too.'])

start('05 / Category artwork system')
pic('category-artwork.png',180)
txt('<b>C01-C07:</b> seven distinct square category compositions; one shared photography style, bowl scale, camera angle, shadow and cream edge treatment.')
table([['File family','Required exports / format'],['Each of 7 individual images','1200 x 1200 editable master; 800 x 800 desktop; 400 x 400 mobile. Transparent PNG/WebP or cream-backed WebP.'],['Compatibility sprite, if retained','7 equal square tiles in fixed order: 5600 x 800 (desktop) and 2800 x 400 (mobile). Do not add gaps between tiles.'],['Crop rule','Circular mask in website. Keep bowl/food within central 84% diameter; transparent corners preferred. No embedded title or arrow.']],[150,365])
heading('Current implementation issue to correct')
txt('The existing 2172 x 724 sheet is a 3:1 image, not a 7:1 square-tile strip. Its seven source panels are about 310 x 724 each, and CSS crops the middle. Do not copy these source panel dimensions as the new specification.')
txt('Preferred integration: replace the sprite with seven individual images. That requires a developer mapping update. If a same-URL swap is required, use the 7:1 compatibility sprite with the exact left-to-right order on the next page.','small')

start('06 / Seven category briefs')
table([['ID / filename stem','Subject and direction'],['C01 category-dry-fruits','Overhead bowl: almonds, cashews, walnuts, raisins and pistachios. Full bowl visible; warm natural textures.'],['C02 category-seeds','Overhead seeds mix: pumpkin, sunflower, flax, chia and watermelon seeds. Distinct texture from C01.'],['C03 category-trail-mixes','Colourful mixed nuts, berries, raisins and seeds. Use real ingredients belonging to the actual assortment.'],['C04 category-flavoured-nuts','Golden seasoned cashews/almonds; visible seasoning, appetizing texture. Avoid implying a flavour not sold.'],['C05 category-spices','Small bowls of real spice powders and whole spices on one circular tray. Consistent top-down angle.'],['C06 category-giftpacks','Approved SORAA packs arranged as a gift bundle. Replace blank AI pouches with actual approved packaging.'],['C07 category-best-sellers','Distinct bowl/assortment of hero ingredients. Different visual mix from C01 and C03.']],[165,350])
heading('Consistency checklist')
bullets(['Same object footprint in all seven tiles; no one bowl should appear much smaller.', 'One lighting direction and soft grounded shadow. No heavy drop-shadow baked around the square canvas.', 'No labels, prices, sale badges, category names or arrows inside exports.', 'Category wording and order stay in the website. Deliver clearly named files, never category1-final-final.png.'])

start('07 / Lifestyle photography')
pic('lifestyle-scenes.png',180)
txt('<b>L01-L04:</b> four moments - Work, Gym, Travel and Chill. The final layout is a clean 4-card row, or 2 x 2 on phones. No tilted polaroids or side bubble.')
table([['Deliverable','Specification'],['Each individual scene','1600 x 1600 layered/master file; 1000 x 1000 desktop and 600 x 600 mobile WebP. 1:1 composition.'],['Compatibility sheet','4 equal squares in one row: 4000 x 1000 (desktop), 2400 x 600 (mobile). No gutters or labels.'],['Current display','Square photo, rounded 8 px corners in CSS. Largest audited slot about 278 x 278 px; same scene on all devices.']],[140,375])
heading('Avoid the current distortion')
txt('Current sheet is 2172 x 724, so each scene is 543 x 724 (3:4). CSS stretches each panel to a square. New delivery must be native square compositions, or switch to individual images with object-fit: cover.')
txt('The white card border, corner radius, Work/Gym/Travel/Chill captions and hover effect are UI. Do not bake them into photos.','small')

start('08 / Four lifestyle briefs')
table([['ID / filename stem','Scene + focal point'],['L01 lifestyle-work','Warm desk with laptop, notebook and a bowl of nuts. Hand reaching for snack optional. Laptop should be secondary to the snack; no third-party logos.'],['L02 lifestyle-gym','Gym bag, towel/mat and a reusable trail-mix container on a bench. Natural daylight, clean composition, no fabricated fitness claims.'],['L03 lifestyle-travel','Backpack or train-window moment, hand holding nuts in a pouch/container. Keep snack and hand in central square-safe area.'],['L04 lifestyle-chill','Cozy sofa, book, tea and pistachio bowl. Tactile fabric, relaxed warm light; avoid overcrowding.']],[150,365])
heading('Shared visual direction')
bullets(['Real editorial photography or approved compositing. Warm cream, cocoa, muted olive and orange accents. Keep all four at similar exposure and contrast.', 'Place the snack within the central 70% square; hands and key props should not be cut at awkward joints.', 'If packaging is shown, use supplied real SORAA artwork. No invented logos, nutrition panels or product names.', 'Request model/property releases where needed, and retain source photo licences with the layered files.'])
heading('Deliverables')
txt('Four editable source files, eight web exports (four desktop + four mobile), and an optional compatibility sprite. Supply 5-10% extra working room around the intended square crop in the layered master.')

start('09 / W01 Why SORAA desktop')
pic('why-soraa-orange.png',250)
table([['Deliverable','Specification'],['Master / ratio','3840 x 1920 px minimum; 2:1 wide composition.'],['Web exports','3840 x 1920 large; 2880 x 1440 standard; 1536 x 768 tablet.'],['Composition','Five upright approved packs; orange clouds; warm stone podium with nuts and fruit. Full-width image, no side border.'],['Live content','Why SORAA title, description and Find Your Favourite button sit above image in HTML. Do not bake them in.']],[130,385])
bullets(['Match the bold orange cloud reference, not the older blue or pale-cream sky versions. Fade the top 10-16% into the page cream (#fff9ee); no hard top seam.', 'Keep Date Bites, Walnut Kernels, Super Seed Mix, Cranberries and Pistachios identifiable. Brand team must approve the exact pack variants.', 'Preserve package colours. Orange belongs to clouds/background, not an overall filter on the products.'])

start('10 / W02 mobile Why SORAA')
heading('Current behaviour: centre crop, not responsive art direction')
txt('At 600 px and below the 2:1 desktop artwork renders at 150% width with a -25% left offset. The viewport reveals only the middle 66.7% of the image: approximately x=16.7% to 83.3%. Outer products can disappear.')
# annotated source crop as a diagram; no raster asset modification
p=ROOT/'public/why-soraa-orange.png';hh=CW/2;c.drawImage(image_ref(p),M,y-hh,width=CW,height=hh)
c.setStrokeColor(HexColor(ORANGE));c.setLineWidth(2);c.rect(M+CW/6,y-hh,CW*2/3,hh,fill=0,stroke=1);y-=hh+12
txt('Orange rectangle = area retained by current phone crop. Reference image shown in full for comparison.','small')
table([['Recommended new delivery','Specification'],['Mobile composition','W02 why-soraa-mobile: 1600 x 1600 master; 1080 x 1080 web export. Optional 720 x 720 lightweight export.'],['Layout','Recompose all five packs into a compact group; step/overlap packs naturally. Keep central 90% safe and top edge cream.'],['Implementation needed','Add a picture/source at <=600 px; use width:100%, remove 150% width and negative left margin. This PDF does not change code.']],[150,365])
txt('If no developer change is planned, do not deliver a square file for the existing URL. Instead supply an additional 1800 x 900 mobile-safe 2:1 version with all essential subjects inside the middle two-thirds, then wire that version at the mobile breakpoint.','small')

start('11 / Shopify product packshots')
txt('These are live Shopify featured images shown in collection cards and review-product thumbnails. Their provenance is not known from the app; do not label them as AI. Current tab audit found 19 unique products (next page).')
table([['Asset','Production requirement'],['Master per product','2000 x 2000 px minimum; transparent background preferred. One approved front-facing packshot for each distinct product/pack.'],['Web sizes','1200 x 1200 catalogue; 800 x 800 card; 160 x 220 or 220 x 220 thumbnail derivative. Let Shopify CDN resize in production.'],['Framing','Package occupies 80-85% of canvas height. Consistent visual baseline and relative scale. Keep soft shadow separate.'],['Current render','Collection box uses object-fit: contain; responsive width 17vw desktop, 29vw tablet, 64vw phone. Height 250-410 px; phone 300 px.'],['Thumbnail reuse','Review row uses 42 x 58 CSS px, contain. Reuse packshot source; do not create an unrelated thumbnail.']],[135,380])
heading('Quality requirements')
bullets(['Use original approved packaging files or real product photography. Correct names, variants, weights, vegetarian mark and logo. AI reference text is not a packaging proof.', 'Remove baked rectangular borders and uneven white margins; do not invent star ratings, sale badges or discounts.', 'Keep product titles, prices, cart buttons and hover highlight out of the image.', 'Product list is a snapshot, not a fixed catalogue total. Collection query currently loads up to 10 products per exposed tab; new catalogue items will need the same packshot standard.'])

start('12 / Packshot request list')
products=['Authentic Chettinad Meat Masala','Morning Energy Breakfast Mix','Lakadong Turmeric Powder','5-in-1 Roasted Super Seed Mix','Antioxidant Berry Blast Mix','Date Bites','Royal Awadhi Biryani Masala','Artisanal Kadak Chai Masala','Date Bites Jar','Seedless Long Green Raisins','Premium Afghan Anjeer (Figs)','Jumbo Medjool Dates','premium-kalmi-fard-dates [store title; confirm wording]','Premium Walnut Kernels (Akhrot)','Espresso Almond & Date Energy Mix','Southern Pepper & Sea Salt Cashews','Cheese & Jalapeno Cashews','Smoked BBQ Almonds','Peri-Peri Roasted Cashews']
table([['ID','Current homepage product']] + [[f'P{i:02d}',p] for i,p in enumerate(products,1)],[50,465])
txt('Audited tabs: BEST SELLERS, Breakfast Mixes, Dates & Date Bites, Dry Fruits, Flavored Nuts. Category links expose more collections than these tabs; those additional catalogue images are not counted here. Hero/Why compositions also show Cranberries and Pistachios: obtain approved pack masters for those separately if not already in the brand library.','small')

start('13 / Reviews, vectors and branding')
heading('R01-R08: review videos + posters (not AI customer imagery)')
table([['Deliverable','Specification'],['Video masters','8 authentic product-linked clips for the current 8 slots; 1080 x 1920, 9:16, 24/25/30 fps. Suggested 15-30 seconds each, MP4 H.264 + AAC.'],['Current crop','Desktop/tablet media slot is 9:11; phone is 1:1; object-fit: cover. Keep face, product and essential gesture within central 56% of video height.'],['Posters / captions','1080 x 1080 square-safe poster per clip, plus 1080 x 1320 desktop crop if needed; WebP. Separate .vtt captions; do not bake controls or Add to Cart into media.'],['Current state','reviewVideos mapping is empty; app shows Coming soon. No actual clips or posters are currently used.']],[130,385])
heading('Vector request, if designer is refreshing brand graphics')
bullets(['SORAA logo: approved SVG master + outlined source. Header/footer currently use Chunko font text, not a raster logo. Footer wordmark scales up to 460 px font size.', 'Ticker megaphone: SVG viewBox 0 0 160 120 (4:3). On screen it scales from 90 x 68 to 205 x 154. Supply orange/cocoa version without embedded ticker text.', 'Category rays: SVG 90 x 70. Review crown: SVG 90 x 75. Keep thin doodle character; no PNG required.', 'Search, account, cart, hearts, arrows and video placeholder are code/vector UI. No extra photography required for newsletter or footer.'])
txt('Confirm a commercial/web licence for Chunko Bold Demo before production use, or supply a licensed replacement approved by the brand.','small')

start('14 / Delivery and acceptance')
heading('Package structure')
txt('01_hero / 02_categories / 03_lifestyle / 04_why-soraa / 05_packshots / 06_review-media / 07_vectors / 08_sources-and-licences')
table([['Rule','Requirement'],['Naming','soraa-[asset-id]-[subject]-[desktop|mobile]-[width]w-v01.webp. Keep source/master names consistent.'],['Colour / formats','sRGB RGB, no CMYK. WebP or AVIF for photos; PNG only where required for transparency; SVG for vector graphics. Layered PSD/AI/Figma source plus linked originals.'],['Suggested file budgets','Hero/Why: 250-700 KB each web export, large desktop <=1 MB if feasible. Category 30-80 KB each; lifestyle 80-180 KB each; packshot 80-200 KB. Quality targets, not hard limits.'],['Source layers','Background/clouds, podium, each product pack, food props, shadows, doodles and editable lettering separated. Do not flatten the only master.'],['Palette','Orange #FF4911; deep CTA orange #BD350C; cocoa #482C22; cream #FFF9EE; peach #FFE5D5. Product colours remain authentic.']],[130,385])
heading('Approval checklist')
bullets(['Check at 390, 768, 1440 and 1920 px viewports; also test 320 px phone for clipping.', 'All packaging approved by brand; all 5 hero/Why products visible in intended compositions.', 'No image-baked CTA, price, review rating or UI border. No sprite seams, stretch, cut-off bowls or mismatched backgrounds.', 'Designer supplies exports + editable sources + rights/licences + a file manifest. Developer wires responsive sources and checks performance before publishing.'])

start('15 / Exclusions and audit notes')
table([['Not active / do not commission again','Reason'],['hero-reference.png - 1536 x 1024','Original reference, not used in the current homepage render.'],['snack-squad.png - 2172 x 724','Old AI review-person sheet. Earlier CSS reference is overridden by background-image:none; current slots need real videos.'],['why-soraa-sky.png - 1774 x 887','Superseded blue background.'],['why-soraa-cream.png - 1774 x 887','Superseded pale cloud background; orange cloud version is active.'],['Collection image field','Fetched in loader but not rendered by current collection showcase. Product featured images are used instead.']],[245,270])
heading('What was verified')
txt('Source audit of app/routes/_index.tsx; app/styles/app.css (including final overrides); CollectionShowcase, HomeProductCard, SnackSquad, BrandTicker and Footer components; app/lib/reviewVideos.ts; all PNG dimensions in public/. Live homepage and all 5 visible collection tabs reviewed on 23 Sep 2026. Responsive DOM dimensions measured at 4 viewport sizes.')
heading('Implementation boundaries')
bullets(['This document specifies delivery; no website layout or image mapping was changed for this handoff.', 'Individual category/lifestyle files, new responsive size variants and W02 mobile artwork need developer wiring. Current app generally requests one file per local image, not srcset variants.', 'Numbers under Current are audited implementation facts; sizes under Master/Web exports are recommended designer deliverables.', 'Request real package artwork from SORAA before producing final graphics. Treat the included AI previews as composition references only.'])
c.save();print(OUT);print('pages',page)
