#!/usr/bin/env python3
"""Rebuild checked, self-hosted portfolio fonts; see FONT-SOURCES.md."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
import json, shutil, hashlib
import base64, sys, tarfile, urllib.request
site=Path(__file__).resolve().parents[2]
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/tmp/linus-font-source-cache')
fonts=site/'public/fonts'
root.mkdir(parents=True, exist_ok=True)
pins=json.loads((fonts/'font-manifest.json').read_text())['packages']
for package, pin in pins.items():
 url=pin['tarball']
 if not url.startswith('https://registry.npmjs.org/@fontsource/'):
  raise ValueError('Font archives must come from the HTTPS npm fontsource registry')
 archive=root/(package+'.tgz')
 if not archive.exists():
  urllib.request.urlretrieve(url, archive)
 algorithm, expected=pin['integrity'].split('-',1)
 actual=base64.b64encode(hashlib.new(algorithm,archive.read_bytes()).digest()).decode()
 if actual!=expected:
  raise ValueError(f'{package} archive failed integrity verification; remove its cached archive and retry')
 destination=root/package
 destination.mkdir(exist_ok=True)
 with tarfile.open(archive) as tgz:
  tgz.extractall(destination,filter='data')
 (root/(package+'.json')).write_text(json.dumps({'version':pin['version'],'dist':{'tarball':url,'integrity':pin['integrity']}}))
text_inputs=['index.html','zh/index.html','ja/index.html','src/profile.js','src/translations.js','src/render.js']
# Include every translated character, plus punctuation that can appear in labels.
chars={ord(c) for p in text_inputs for c in (site/p).read_text() if ord(c)>255}
font_faces=[]
manifest={'licenses':'SIL Open Font License 1.1','textInputs':text_inputs,'subsetter':'fontTools 4.61.1 with Brotli 1.2.0','packages':{},'fonts':[]}
for family,package,source_subset,source_weight,weight,style in [
 ('LXGW WenKai','lxgw-wenkai','latin',500,400,'normal'),
 ('LXGW WenKai','lxgw-wenkai','latin',700,700,'normal'),
 ('Klee One','klee-one','japanese',400,400,'normal'),
 ('Klee One','klee-one','japanese',600,600,'normal'),
 ('Source Serif 4','source-serif-4','latin',400,400,'normal'),
 ('Source Serif 4','source-serif-4','latin',500,500,'normal'),
 ('Source Serif 4','source-serif-4','latin',600,600,'normal'),
 ('Source Serif 4','source-serif-4','latin',400,400,'italic')]:
 package_root=root/package/'package'
 meta=json.loads((root/(package+'.json')).read_text())
 manifest['packages'][package]={'version':meta['version'],'tarball':meta['dist']['tarball'],'integrity':meta['dist']['integrity'],'upstream':json.loads((package_root/'metadata.json').read_text())['source']}
 src=package_root/'files'/f'{package}-{source_subset}-{source_weight}-{style}.woff2'
 target=fonts/f'{package}-{"site" if package != "source-serif-4" else "latin"}-{weight}-{style}.woff2'
 if package!='source-serif-4':
  font=TTFont(src)
  present=chars & set(font.getBestCmap())
  opts=subset.Options()
  opts.flavor='woff2'
  opts.name_IDs=['*']
  opts.name_languages=['*']
  opts.recalc_timestamp=False
  sub=subset.Subsetter(options=opts)
  sub.populate(unicodes=present)
  sub.subset(font)
  font.save(target)
  ranges=','.join(f'U+{c:X}' for c in sorted(present))
 else:
  shutil.copyfile(src,target)
  css=(package_root/f'{weight}{"-italic" if style=="italic" else ""}.css').read_text()
  # Match the exact source filename: latin-ext is a different face.
  import re
  faces=re.findall(r'@font-face\s*\{[^}]+\}',css)
  matches=[face for face in faces if f'url(./files/{src.name})' in face]
  if len(matches)!=1:
   raise ValueError(f'Expected one exact font face for {src.name}, found {len(matches)}')
  ranges=re.search(r'unicode-range:\s*([^;]+)',matches[0]).group(1)
  allowed=set()
  for item in ranges.split(','):
   values=item.strip().removeprefix('U+').split('-')
   first=int(values[0],16)
   last=int(values[-1],16)
   allowed.update(range(first,last+1))
  present=set(TTFont(target).getBestCmap())
  if not set(range(32,127)) <= (allowed & present):
   raise ValueError(f'Latin face is missing printable ASCII coverage: {src.name}')
  # Fontsource's Latin mask omits five combining marks already in this file.
  # Include every actual glyph so decomposed accented names also use the face.
  extra=sorted(present-allowed)
  if extra:
   ranges+=','+','.join(f'U+{codepoint:04X}' for codepoint in extra)
   allowed.update(extra)
  if not present <= allowed:
   raise ValueError(f'Font glyphs fall outside its declared Unicode ranges: {src.name}')
 font_faces.append(f'/* {package} {meta["version"]}; original source weight {source_weight}. */\n@font-face {{\n  font-family: "{family}";\n  font-style: {style};\n  font-weight: {weight};\n  font-display: swap;\n  src: url("./{target.name}") format("woff2");\n  unicode-range: {ranges};\n}}')
 manifest['fonts'].append({'file':target.name,'family':family,'weight':weight,'style':style,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'glyphCoverage':len(present),'sourceFile':src.name})
 print(target.name,target.stat().st_size,'bytes',len(present),'codepoints')
for package in manifest['packages']:
 shutil.copyfile(root/package/'package/LICENSE',fonts/(package+'-LICENSE.txt'))
(fonts/'portfolio-fonts.css').write_text('/* Self-hosted, OFL-licensed fonts. See FONT-SOURCES.md. */\n\n'+'\n\n'.join(font_faces)+'\n')
(fonts/'font-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Total new WOFF2 bytes',sum(f['bytes'] for f in manifest['fonts']))
