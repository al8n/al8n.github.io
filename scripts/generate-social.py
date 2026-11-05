"""Recreate the local social preview with Pillow; no remote assets are used."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import os
root=Path(__file__).resolve().parents[1]
def font(candidates,size):
 for file in candidates:
  if Path(file).exists():return ImageFont.truetype(file,size)
 return ImageFont.load_default(size=size)
serif=font(['/System/Library/Fonts/Supplemental/Georgia.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'],152)
sans=font(['/System/Library/Fonts/Helvetica.ttc','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'],29)
mono=font(['/System/Library/Fonts/Menlo.ttc','/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'],17)
im=Image.new('RGB',(1200,630),'#f7f7f2'); d=ImageDraw.Draw(im)
d.line((72,80,1128,80),fill='#d6dcd1',width=2)
d.text((75,118),'ENGINEERING IN THE OPEN',font=mono,fill='#626d63')
d.text((65,170),'Al Liu.',font=serif,fill='#232c26')
d.text((77,365),'Rust Systems Engineer',font=sans,fill='#232c26')
d.text((77,408),'& Open-Source Maintainer',font=sans,fill='#626d63')
d.line((72,515,1128,515),fill='#d6dcd1',width=2)
d.text((77,550),'NETWORKING   /   DISTRIBUTED SYSTEMS   /   STORAGE',font=mono,fill='#476b4b')
d.text((987,550),'al8n',font=mono,fill='#476b4b')
im.save(root/'public/social-preview.png',optimize=True)
print('Generated 1200 × 630 social preview.')
