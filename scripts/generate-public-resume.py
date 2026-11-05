"""Generate the public A4 resume from the website's exported public data.
Run: npm run resume (requires reportlab and pypdf).
"""
import json
import hashlib
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'tmp/public-resume.json').read_text())
p = data['profile']
ink, muted, green, line = [colors.HexColor(c) for c in ['#232c26', '#536053', '#355640', '#d4dbce']]
styles = {
 'name': ParagraphStyle('name', fontName='Times-Roman', fontSize=36, leading=40, textColor=ink, spaceAfter=8),
 'subtitle': ParagraphStyle('subtitle', fontName='Helvetica', fontSize=11, leading=16, textColor=ink, spaceAfter=9),
 'body': ParagraphStyle('body', fontName='Helvetica', fontSize=9.7, leading=14.8, textColor=muted, spaceAfter=8),
 'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=8.3, leading=12, textColor=green, spaceBefore=17, spaceAfter=10),
 'role': ParagraphStyle('role', fontName='Helvetica-Bold', fontSize=10.7, leading=15, textColor=ink),
 'company': ParagraphStyle('company', fontName='Helvetica', fontSize=9.4, leading=14, textColor=ink),
 'small': ParagraphStyle('small', fontName='Helvetica', fontSize=8.2, leading=12, textColor=muted),
 'links': ParagraphStyle('links', fontName='Helvetica', fontSize=8.5, leading=13.5, textColor=green),
 'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=9.2, leading=13.5, textColor=muted, leftIndent=9, firstLineIndent=0, bulletIndent=0, spaceAfter=3),
 'project': ParagraphStyle('project', fontName='Times-Roman', fontSize=16, leading=20, textColor=ink, spaceAfter=5),
 'page-title': ParagraphStyle('page-title', fontName='Times-Roman', fontSize=27, leading=33, textColor=ink, spaceAfter=7),
}
def clean(s): return escape(s.replace('—','-').replace('–','-').replace('·',' / '))
def para(s, style='body'): return Paragraph(clean(s), styles[style])
def a(url, label): return f'<link href="{escape(url, {chr(34): "&quot;"})}" color="#355640">{clean(label)}</link>'
def links(items): return Paragraph(' &nbsp; / &nbsp; '.join(a(url,label) for url,label in items), styles['links'])
def section(text): return para(text, 'section')

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
doc=SimpleDocTemplate(str(out),pagesize=A4,rightMargin=46,leftMargin=46,topMargin=39,bottomMargin=51,title='Al Liu - Public Resume',author='Al Liu',invariant=True)
story=[para(p['name'],'name'),para(p['title'],'subtitle'),links([(f"mailto:{p['email']}",p['email']),(p['site'], 'al8n.github.io')]),links([(p['github'],'github.com/al8n'),(p['linkedin'],'linkedin.com/in/al8n'),(p['crates'],'crates.io/users/al8n')]),Spacer(1,13),HRFlowable(width='100%',thickness=.6,color=line),section('PROFILE'),para(p['summary']),section('PROFESSIONAL EXPERIENCE')]
for e in data['experience']:
 head=Table([[para(e['role'],'role'),para(e['start']+' - '+e['end'],'small')]],colWidths=[355,148])
 head.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),2)]))
 block=[head,para(e['company'],'company'),para(e['arrangement'],'small'),Spacer(1,6)]
 for bullet in e['bullets']: block.append(Paragraph(clean(bullet),styles['bullet'],bulletText='-'))
 block.append(Spacer(1,11))
 story.append(KeepTogether(block))
story += [PageBreak(),para('Open-source engineering','page-title'),para('Selected Rust libraries for distributed systems, storage, networking, and parsing.','body'),Spacer(1,6)]
for project in data['projects']:
 block=[para(project['name'],'project'),para(project['detail'])]
 urls=[(project['github'],'github.com/al8n/'+project['name'])]
 if project.get('crate'): urls.append(('https://crates.io/crates/'+project['crate'],'crates.io/'+project['crate']))
 block += [links(urls),Spacer(1,6)]
 story.append(KeepTogether(block))
story += [links([(p['site']+'/projects/','Explore the full project collection')]),section('TECHNICAL EXPERTISE')]
for skill in data['skills']:
 story.append(Paragraph(f'<b>{clean(skill["name"])}</b> &nbsp; {clean(" / ".join(skill["items"]))}',styles['small']))
story += [section('EDUCATION'),para(p['education']['school'],'role'),para(p['education']['degree'],'company'),para(p['education']['dates']+' / '+p['education']['graduation'],'small')]
doc.build(story,onFirstPage=footer,onLaterPages=footer)
reader=PdfReader(out)
assert len(reader.pages)==2, f'Expected 2 pages, got {len(reader.pages)}'
assert all(page.extract_text().strip() for page in reader.pages)
assert all(abs(float(page.mediabox.width)-A4[0])<1 and abs(float(page.mediabox.height)-A4[1])<1 for page in reader.pages)
(ROOT / 'public/resume-data.sha256').write_text(hashlib.sha256((ROOT / 'tmp/public-resume.json').read_bytes()).hexdigest()+'\n')
print(f'Generated {out.name}: 2 A4 pages, selectable text, {sum(len(page.get("/Annots",[])) for page in reader.pages)} links.')
