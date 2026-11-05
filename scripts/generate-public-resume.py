"""Generate the public A4 resume from the website's exported public data.
Run: npm run resume (requires reportlab and pypdf).
"""
import json
import hashlib
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'tmp/public-resume.json').read_text())
p = data['profile']
ink, muted, green, line = [colors.HexColor(c) for c in ['#232c26', '#536053', '#355640', '#d4dbce']]
styles = {
 'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=29, leading=34, textColor=ink, spaceAfter=8),
 'subtitle': ParagraphStyle('subtitle', fontName='Helvetica', fontSize=11, leading=16, textColor=ink, spaceAfter=9),
 'body': ParagraphStyle('body', fontName='Helvetica', fontSize=9.7, leading=14.8, textColor=muted, spaceAfter=8),
 'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=8.3, leading=12, textColor=green, spaceBefore=17, spaceAfter=10),
 'role': ParagraphStyle('role', fontName='Helvetica', fontSize=10, leading=14, textColor=ink),
 'company': ParagraphStyle('company', fontName='Helvetica-Bold', fontSize=10.5, leading=15, textColor=ink),
 'small': ParagraphStyle('small', fontName='Helvetica', fontSize=8.2, leading=12, textColor=muted),
 'links': ParagraphStyle('links', fontName='Helvetica', fontSize=8.5, leading=13.5, textColor=green),
 'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=9.2, leading=13.5, textColor=muted, leftIndent=9, firstLineIndent=0, bulletIndent=0, spaceAfter=3),
 'date': ParagraphStyle('date', fontName='Helvetica', fontSize=8.5, leading=13, textColor=muted, alignment=TA_RIGHT),
 'skill-label': ParagraphStyle('skill-label', fontName='Helvetica-Bold', fontSize=8.7, leading=13, textColor=ink),
 'skill-value': ParagraphStyle('skill-value', fontName='Helvetica', fontSize=8.7, leading=13, textColor=muted),
 'page-title': ParagraphStyle('page-title', fontName='Helvetica-Bold', fontSize=20, leading=27, textColor=ink, spaceAfter=7),
}
def clean(s): return escape(s.replace('—','-').replace('–','-').replace('·',' / '))
def para(s, style='body'): return Paragraph(clean(s), styles[style])
def a(url, label): return f'<link href="{escape(url, {chr(34): "&quot;"})}" color="#355640">{clean(label)}</link>'
def links(items): return Paragraph(' &nbsp; / &nbsp; '.join(a(url,label) for url,label in items), styles['links'])
def section(text):
 return KeepTogether([para(text, 'section'),HRFlowable(width='100%',thickness=.5,color=line,spaceAfter=10)])

def footer(canvas, doc):
 canvas.saveState()
 canvas.setTitle('Al Liu - Public Resume')
 canvas.setAuthor('Al Liu')
 canvas.setSubject('Rust systems engineering and open-source infrastructure')
 canvas.setCreator('Public resume generator')
 canvas.setStrokeColor(line)
 canvas.line(46,38,A4[0]-46,38)
 canvas.setFont('Helvetica',8)
 canvas.setFillColor(muted)
 canvas.drawString(46,25,'Al Liu / Rust systems engineering')
 canvas.drawRightString(A4[0]-46,25,f'{doc.page} / 2')
 canvas.restoreState()

out=ROOT/'public/resume.pdf'
doc=SimpleDocTemplate(str(out),pagesize=A4,rightMargin=40,leftMargin=40,topMargin=33,bottomMargin=45,title='Al Liu - Public Resume',author='Al Liu',invariant=True)
# SimpleDocTemplate's frame adds six points of padding on each side.
content_width=doc.width-12
def role(entry):
 head=Table([[para(entry['company'],'company'),para(entry['start']+' - '+entry['end'],'date')],[para(entry['role'],'role'),para(entry['arrangement'],'date')]],colWidths=[content_width-153,153],hAlign='LEFT')
 head.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),2)]))
 block=[head,Spacer(1,8),para(entry['overview'])]
 for bullet in entry['bullets']: block.append(Paragraph(clean(bullet),styles['bullet'],bulletText='-'))
 block.append(Spacer(1,12))
 return KeepTogether(block)

story=[para(p['name'],'name'),para(p['title'],'subtitle'),links([(f"mailto:{p['email']}",p['email']),(p['site'], 'al8n.github.io')]),links([(p['github'],'github.com/al8n'),(p['linkedin'],'linkedin.com/in/al8n'),(p['crates'],'crates.io/users/al8n')]),Spacer(1,11),HRFlowable(width='100%',thickness=.6,color=line),section('PROFILE'),para(p['summary']),section('TECHNICAL EXPERTISE')]
skill_rows=[[para(skill['name'],'skill-label'),para(' / '.join(skill['items']),'skill-value')] for skill in data['skills']]
skill_table=Table(skill_rows,colWidths=[116,content_width-116],hAlign='LEFT')
skill_table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),2),('BOTTOMPADDING',(0,0),(-1,-1),3)]))
story.append(skill_table)
story += [section('PROFESSIONAL EXPERIENCE'),role(data['experience'][0]),role(data['experience'][1]),PageBreak(),para('Al Liu / experience continued','page-title'),para('Rust systems engineering and open-source infrastructure.','body'),Spacer(1,7),role(data['experience'][2]),role(data['experience'][3]),section('OPEN-SOURCE ENGINEERING')]
for paragraph in p['publicWork']: story.append(para(paragraph))
story += [links([(p['site']+'/projects/','Explore the complete project collection')]),section('EDUCATION'),para(p['education']['school'],'role'),para(p['education']['degree'],'company'),para(p['education']['dates']+' / '+p['education']['graduation'],'small'),Spacer(1,7),para(p['education']['context'],'small'),Spacer(1,5),para(p['education']['award'],'small')]
doc.build(story,onFirstPage=footer,onLaterPages=footer)
reader=PdfReader(out)
assert len(reader.pages)==2, f'Expected 2 pages, got {len(reader.pages)}'
assert all(page.extract_text().strip() for page in reader.pages)
assert all(abs(float(page.mediabox.width)-A4[0])<1 and abs(float(page.mediabox.height)-A4[1])<1 for page in reader.pages)
(ROOT / 'public/resume-data.sha256').write_text(hashlib.sha256((ROOT / 'tmp/public-resume.json').read_bytes()).hexdigest()+'\n')
print(f'Generated {out.name}: 2 A4 pages, selectable text, {sum(len(page.get("/Annots",[])) for page in reader.pages)} links.')
