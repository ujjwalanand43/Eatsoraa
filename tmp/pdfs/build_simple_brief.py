from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

root=Path('/Volumes/SSD/Work/EatSoraa/soraa')
out=root/'output/pdf/soraa-graphics-simple-list.pdf'
pdfmetrics.registerFont(TTFont('P',str(root/'public/fonts/poppins-regular.ttf')))
pdfmetrics.registerFont(TTFont('PB',str(root/'public/fonts/poppins-bold.ttf')))
from reportlab.lib.styles import StyleSheet1
styles=StyleSheet1()
for name,size,lead,font in [('title',22,28,'PB'),('head',13,18,'PB'),('text',10,15,'P'),('cell',9,13,'P')]:
    styles.add(ParagraphStyle(name=name,fontName=font,fontSize=size,leading=lead,textColor=colors.HexColor('#35251f'),spaceAfter=8))
def p(s,style='text'): return Paragraph(s,styles[style])
def table(rows):
    data=[[p('<b>'+s+'</b>','cell') for s in ['Kahan / section','Kitne chahiye','Size (pixels)']]]
    data += [[p(s,'cell') for s in row] for row in rows]
    t=Table(data,colWidths=[277,80,150],repeatRows=1)
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#ffe1cc')),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#e4d7cd')),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
    return t
def previews(files):
    cells=[]
    for file,label in files:
        path=root/'tmp/pdfs/brief-previews'/('public/'+file).replace('/','__')
        path=Path(str(path)+'.jpg')
        from reportlab.lib.utils import ImageReader
        w,h=ImageReader(str(path)).getSize(); ratio=min(112/w,70/h)
        cells.append([Image(str(path),w*ratio,h*ratio),p(label,'cell')])
    return Table([[[*cell] for cell in cells]],colWidths=[507/len(cells)]*len(cells))
story=[p('SORAA - Graphics ki simple list','title'),p('Designer ko dene ke liye | 7 October 2026'),p('Size ka matlab: width x height. Sab sizes pixels mein hain. Ye final image files ke sizes hain; mobile par website inhe chhota dikhayegi.'),p('1. Home page','head'),table([
['Sabse upar wala main banner','1','8192 x 3641'],
['Usi slider ke baaki banners<br/>Orange, peach aur berry/red','3','2066 x 761<br/>har image'],
['Shop by Category<br/>Nuts, seeds, trail mix, flavoured nuts, spices, gift packs, dry fruits','7','2000 x 2000<br/>har image'],
['Feel-good snacks / Better For You<br/>Breakfast mix, Date Bites, walnuts, flavoured nuts, best sellers','5','1121 x 1403<br/>har image'],
['Work / Gym / Travel / Chill<br/>4 scenes ek hi horizontal image mein','1 file<br/>4 scenes','2172 x 724 total<br/>543 x 724 per scene'],
['Why SORAA?<br/>Orange background par products ka group','1','1774 x 887'],
]),Spacer(1,14),p('<b>Home page: 18 final image files.</b><br/>Category images square rakhni hain. Baaki images ka shape upar diye size jaisa hi rakhein.'),previews([('soraa-website-banner.png','Main banner'),('categories/category-01.jpg','Category'),('feel-good/breakfast-mixes.png','Feel-good'),('why-soraa-orange.png','Why SORAA')]),PageBreak(),p('2. Product page aur baaki pages','title'),table([
['Product page - SORAA World<br/>Snack break photo + snack packs photo','2','1600 x 844<br/>har image'],
['Har product ki photos<br/>Front pack, side/back pack, ingredients, use karte hue photo','4 per<br/>product','2000 x 2000<br/>har photo'],
['Blog / Journal<br/>Har article ki cover image','1 per<br/>article','1600 x 900'],
['Collections list<br/>Har collection ki cover image','1 per<br/>collection','1600 x 1600'],
]),Spacer(1,12),p('3. Yahan purani images dobara use hongi','head'),p('• <b>About page:</b> orange range banner + Work/Gym/Travel/Chill image.<br/>• <b>Explore SORAA, homepage reviews:</b> Feel-good wali images.<br/>• <b>Welcome popup, product-page offer:</b> Feel-good wali images.<br/>• <b>Shop collections, search, cart, wishlist:</b> product ki photos.<br/>• <b>Real People / Real Snacking:</b> abhi product photos use hoti hain. Customer videos milne par add honge.'),p('In sections ke liye extra image files nahi banani hain.'),p('4. Designer ko bas ye bolna hai','head'),p('• <b>20 fixed graphic files</b> banani hain: home ke 18 + product page ke 2.<br/>• Product photos, collection covers aur blog covers alag hain; unki quantity products/articles ke hisaab se hogi.<br/>• Main banner ka text reference jaisa rakhein. Baaki photos mein button, heading ya price na likhein.<br/>• Product packet, logo aur colours clear aur sahi hone chahiye.<br/>• JPG/PNG files aur editable design file de dein.<br/>• Mobile ke liye alag files abhi zaroori nahi; image ke kinare par zaroori cheezein na rakhein.'),p('Logo, retailer logos, globe/map aur small website icons ke liye nayi illustration nahi chahiye.','cell')]
def footer(c,d):
    c.setFont('P',8);c.setFillColor(colors.HexColor('#79665b'));c.drawString(44,23,'SORAA | Simple graphics list');c.drawRightString(551,23,str(d.page))
SimpleDocTemplate(str(out),pagesize=A4,leftMargin=44,rightMargin=44,topMargin=30,bottomMargin=38).build(story,onFirstPage=footer,onLaterPages=footer)
print(out)
