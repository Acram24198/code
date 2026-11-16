'use strict';
// Standard Pigpen: A-I first tic-tac-toe grid, J-R dotted grid,
// S-V first X grid, W-Z dotted X grid.
const $ = id => document.getElementById(id);
const imageInput = $('imageInput'), plainText = $('plainText'), output = $('output');
const status = $('status'), progress = $('progress'), progressBar = $('progressBar');
const buttons = ['pngBtn','svgBtn','copyBtn','pdfBtn'];
let currentSvg = null;
const NS = 'http://www.w3.org/2000/svg';
const CELL = 43, SPACE = 24, LINE = 64, MARGIN = 22, STROKE = 2.8;
function element(tag, attrs = {}) { const e = document.createElementNS(NS, tag); for (const [k,v] of Object.entries(attrs)) e.setAttribute(k,String(v)); return e; }
function segment(parent,x1,y1,x2,y2){parent.append(element('line',{x1,y1,x2,y2,stroke:'#f5f5f5','stroke-width':STROKE,'stroke-linecap':'round'}));}
function glyph(parent,letter,x,y){
  const idx=letter.charCodeAt(0)-65;
  const g=element('g',{transform:`translate(${x} ${y})`}); parent.append(g);
  const c=CELL/2, p=7, q=CELL-7;
  if(idx<18){
    const k=idx%9, row=Math.floor(k/3), col=k%3;
    // Each grid square contributes only its own bordering grid lines.
    if(col>0)segment(g,p,p,p,q);
    if(col<2)segment(g,q,p,q,q);
    if(row>0)segment(g,p,p,q,p);
    if(row<2)segment(g,p,q,q,q);
    if(idx>=9)g.append(element('circle',{cx:c,cy:c,r:3.1,fill:'#f5f5f5'}));
  }else{
    // X grid: four triangular sectors: top, right, bottom, left.
    const k=(idx-18)%4;
    const vertices=[[[p,p],[c,c],[q,p]],[[q,p],[c,c],[q,q]],[[p,q],[c,c],[q,q]],[[p,p],[c,c],[p,q]]];
    const [a,b,d]=vertices[k]; segment(g,...a,...b);segment(g,...b,...d);
    if(idx>=22){const dots=[[c,c-8],[c+8,c],[c,c+8],[c-8,c]];g.append(element('circle',{cx:dots[k][0],cy:dots[k][1],r:3.1,fill:'#f5f5f5'}));}
  }
}
function encode(text){
  const svg=element('svg',{xmlns:NS,role:'img','aria-label':'Encoded message'});
  svg.append(element('rect',{width:'100%',height:'100%',fill:'#000000'}));
  let x=MARGIN,y=MARGIN, maxX=0;
  const maxWidth=850;
  for(const ch of text.toUpperCase()){
    if(ch==='\n'){maxX=Math.max(maxX,x);x=MARGIN;y+=LINE;continue;}
    const width=ch===' '?SPACE:CELL;
    if(x+width>maxWidth && x>MARGIN){maxX=Math.max(maxX,x);x=MARGIN;y+=LINE;}
    if(ch>='A'&&ch<='Z')glyph(svg,ch,x,y);
    else if(ch!==' '){const t=element('text',{x:x+CELL/2,y:y+CELL/2+6,'text-anchor':'middle','font-family':'sans-serif','font-size':20,fill:'#f5f5f5'});t.textContent=ch;svg.append(t);}
    x+=width;
  }
  maxX=Math.max(maxX,x);
  svg.setAttribute('viewBox',`0 0 ${Math.max(180,Math.min(maxWidth,maxX+MARGIN))} ${y+CELL+MARGIN}`);
  svg.setAttribute('width',Math.max(180,Math.min(maxWidth,maxX+MARGIN)));
  svg.setAttribute('height',y+CELL+MARGIN);
  return svg;
}
function serialize(){return new XMLSerializer().serializeToString(currentSvg);}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);}
async function toPng(){
  if(!currentSvg)throw Error('Encode a message first.');
  const markup=serialize(), blob=new Blob([markup],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob);
  try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
    const scale=3,canvas=document.createElement('canvas');canvas.width=Number(currentSvg.getAttribute('width'))*scale;canvas.height=Number(currentSvg.getAttribute('height'))*scale;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Could not export image.')),'image/png'));
  }finally{URL.revokeObjectURL(url);}
}
$('encodeBtn').addEventListener('click',()=>{
  if(!plainText.value.trim()){status.textContent='Enter or extract text first.';return;}
  currentSvg=encode(plainText.value);output.replaceChildren(currentSvg);buttons.forEach(id=>$(id).disabled=false);status.textContent='Encoded. No letter shift was applied.';
});
$('clearBtn').addEventListener('click',()=>{plainText.value='';imageInput.value='';$('previewBox').hidden=true;output.innerHTML='<p class="placeholder">Your encoded message will appear here.</p>';currentSvg=null;buttons.forEach(id=>$(id).disabled=true);status.textContent='';progress.hidden=true;});
$('svgBtn').addEventListener('click',()=>download(new Blob([serialize()],{type:'image/svg+xml;charset=utf-8'}),'code.svg'));
$('pngBtn').addEventListener('click',async()=>{try{download(await toPng(),'code.png');}catch(e){status.textContent=e.message;}});
$('copyBtn').addEventListener('click',async()=>{try{if(!navigator.clipboard?.write)throw Error('Image copying is not supported in this browser. Use Download PNG.');const blob=await toPng();await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);status.textContent='Image copied.';}catch(e){status.textContent=`Could not copy: ${e.message}`;}});
$('pdfBtn').addEventListener('click',()=>window.print());
imageInput.addEventListener('change',async()=>{
  const file=imageInput.files?.[0];if(!file)return;
  if(!file.type.startsWith('image/')){status.textContent='Please choose an image.';return;}
  const previewUrl=URL.createObjectURL(file);$('preview').src=previewUrl;$('previewBox').hidden=false;
  $('preview').onload=()=>URL.revokeObjectURL(previewUrl);
  progress.hidden=false;progressBar.style.width='0%';status.textContent='Loading text recognition...';
  imageInput.disabled=true;$('encodeBtn').disabled=true;
  let worker;
  try{
    if(!window.Tesseract)throw Error('OCR library did not load. Check your internet connection.');
    worker=await Tesseract.createWorker('eng',1,{logger:m=>{if(m.status)status.textContent=m.status;if(typeof m.progress==='number')progressBar.style.width=`${Math.round(m.progress*100)}%`;}});
    const result=await worker.recognize(file);plainText.value=result.data.text.trim();
    status.textContent=plainText.value?'Text extracted. Review and correct it, then click Encode.':'No text found. Try a sharper image or type the text manually.';
  }catch(e){status.textContent=`Text recognition failed: ${e.message}`;}
  finally{if(worker)await worker.terminate();imageInput.disabled=false;$('encodeBtn').disabled=false;progress.hidden=true;}
});
