from pathlib import Path
from io import BytesIO
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, DecodedStreamObject, NameObject
import pypdfium2 as pdfium

source = '/Users/ujjwalanand/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/7865E9F4-3781-408C-A335-8585A112ABC1/Soraa Website Banner- 1st slide.ps'
reader = PdfReader(source)
page = reader.pages[0]
stream = ContentStream(page.get_contents(), reader)
out = Path('public/banner-first')
out.mkdir(exist_ok=True)

def render(operations, filename, transparent=False):
    writer = PdfWriter()
    writer.add_page(page)
    content = ContentStream(None, writer)
    content.operations = operations
    serialized = DecodedStreamObject()
    serialized.set_data(content.get_data())
    writer.pages[0][NameObject('/Contents')] = writer._add_object(serialized)
    data = BytesIO()
    writer.write(data)
    doc = pdfium.PdfDocument(data.getvalue())
    bitmap = doc[0].render(scale=2560/8192, fill_color=(0,0,0,0) if transparent else (255,255,255,255))
    img = bitmap.to_pil()
    if transparent:
        bbox = img.getbbox()
        img = img.crop(bbox)
        print(filename, bbox, img.size)
    img.save(out / filename, 'WEBP', quality=92)

render([(a,o) for a,o in stream.operations if o != b'Do'], 'background.webp')
matrix = (1,0,0,1,0,0)
stack = []
def multiply(m, t):
    a,b,c,d,e,f=m; A,B,C,D,E,F=t
    return (A*a+B*c,A*b+B*d,C*a+D*c,C*b+D*d,E*a+F*c+e,E*b+F*d+f)
for operands, operator in stream.operations:
    if operator == b'q': stack.append(matrix)
    elif operator == b'Q': matrix=stack.pop()
    elif operator == b'cm': matrix=multiply(matrix, tuple(float(x) for x in operands))
    elif operator == b'Do':
        name = str(operands[0])
        content = DecodedStreamObject()
        content.set_data(('q '+' '.join(str(x) for x in matrix)+' cm '+name+' Do Q').encode())
        ops=ContentStream(content, reader).operations
        render(ops, name[1:]+'.webp', True)
