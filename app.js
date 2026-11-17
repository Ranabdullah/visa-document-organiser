'use strict';
const $=selector=>document.querySelector(selector);
const key='visa-organiser-sample-v1';
const groups=[
 {id:'application',title:'Application',items:[{id:'form',title:'Application summary',note:'Add the reference for your sample application.'},{id:'fee',title:'Payment record',note:'Keep a note of the payment reference, if needed.'}]},
 {id:'identity',title:'Identity',items:[{id:'identity',title:'Identity document',note:'Use a fictional file to try the document viewer.'},{id:'photo',title:'Photograph',note:'An example image can be previewed here.'}]},
 {id:'supporting',title:'Supporting documents',items:[{id:'letter',title:'Supporting letter',note:'Write a personal checklist note for this item.'},{id:'evidence',title:'Additional evidence',note:'Adapt this example to your own checklist.'}]}
];
let saved={};
try{saved=JSON.parse(localStorage.getItem(key))||{};}catch{}
const attachments=new Map();
let activeGroup=groups[0].id;
let activeItem='form';
let url;
const mobile=()=>window.innerWidth<=900;
const element=(tag,text,cls='')=>{const node=document.createElement(tag);node.textContent=text;if(cls)node.className=cls;return node;};
function persist(){try{localStorage.setItem(key,JSON.stringify(saved));}catch{alert('This browser could not save your checklist. Export it before leaving.');}}
function view(name){$('#main').dataset.view=name;$('#back').hidden=!mobile()||name==='cats';}
function rowButton(label,action,cls){const node=element('button',label,cls);node.type='button';node.onclick=action;return node;}
function render(){
 const done=groups.flatMap(group=>group.items).filter(item=>saved[item.id]?.done).length;
 $('#progress').textContent=done+'/6 complete';
 $('#categories').replaceChildren();
 for(const group of groups){
  const count=group.items.filter(item=>saved[item.id]?.done).length;
  const button=rowButton(group.title+' · '+count+'/'+group.items.length,()=>{activeGroup=group.id;activeItem=group.items[0].id;render();view(mobile()?'list':'reader');},'cat'+(activeGroup===group.id?' active':''));
  $('#categories').append(button);
 }
 const group=groups.find(group=>group.id===activeGroup);
 $('#categoryTitle').textContent=group.title;
 $('#items').replaceChildren();
 for(const item of group.items){
  const button=rowButton((saved[item.id]?.done?'✓ ':'')+item.title,()=>{activeItem=item.id;render();view('reader');},'row'+(activeItem===item.id?' selected':''));
  $('#items').append(button);
 }
 renderReader();
}
function renderReader(){
 if(url){URL.revokeObjectURL(url);url=null;}
 const item=groups.flatMap(group=>group.items).find(item=>item.id===activeItem);
 const reader=$('#reader');
 reader.replaceChildren(element('h2',item.title),element('p',item.note,'meta'));
 const form=document.createElement('form');
 const label=element('label','Your checklist note');
 const note=document.createElement('textarea');
 note.name='note';note.maxLength=3000;note.value=saved[item.id]?.note||'';label.append(note);
 const doneLabel=element('label','');
 const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.name='done';checkbox.checked=!!saved[item.id]?.done;
 doneLabel.append(checkbox,' Ready for review');
 const save=element('button','Save checklist item','btn primary');save.type='submit';
 const status=element('p','','meta');status.setAttribute('role','status');
 form.append(label,doneLabel,save,status);
 form.onsubmit=event=>{
  event.preventDefault();
  saved[item.id]={note:note.value,done:checkbox.checked};
  persist();render();view('reader');
  $('#reader form [role=status]').textContent='Checklist item saved in this browser.';
 };
 reader.append(form);
 const fileLabel=element('label','Preview a sample PDF or image');
 const file=document.createElement('input');file.type='file';file.accept='application/pdf,image/png,image/jpeg,image/webp';
 fileLabel.append(file);
 const preview=document.createElement('div');preview.id='preview';
 file.onchange=()=>{
  const picked=file.files[0];
  if(!picked)return;
  if(picked.size>10*1024*1024||!['application/pdf','image/png','image/jpeg','image/webp'].includes(picked.type)){
   alert('Choose a PDF, PNG, JPEG or WebP up to 10 MB.');file.value='';return;
  }
  attachments.set(item.id,picked);renderReader();
 };
 reader.append(fileLabel,element('p','Files stay in this page’s memory until reload.','local-note'),preview);
 const attachment=attachments.get(item.id);
 if(!attachment)return;
 url=URL.createObjectURL(attachment);
 preview.append(element('p',attachment.name,'meta'));
 if(attachment.type==='application/pdf'){
  const frame=document.createElement('iframe');frame.src=url;frame.title='Sample PDF preview';frame.className='pdf-view';preview.append(frame);
 }else{
  const image=document.createElement('img');image.src=url;image.alt='Selected sample document';image.style.maxWidth='100%';preview.append(image);
 }
 preview.append(rowButton('Remove preview',()=>{attachments.delete(item.id);renderReader();},'btn'));
}
$('#back').onclick=()=>view($('#main').dataset.view==='reader'?'list':'cats');
$('#helpLink').onclick=event=>{event.preventDefault();$('#help').showModal();};
$('#closeHelp').onclick=()=>$('#help').close();
$('#clear').onclick=()=>{
 if(!confirm('Reset the sample checklist and remove file previews?'))return;
 saved={};attachments.clear();persist();render();view(mobile()?'cats':'reader');
};
$('#export').onclick=()=>{
 const output=groups.map(group=>({category:group.title,items:group.items.map(item=>({title:item.title,done:!!saved[item.id]?.done,note:saved[item.id]?.note||''}))}));
 const blob=new Blob([JSON.stringify({checklist:output},null,2)],{type:'application/json'});
 const target=URL.createObjectURL(blob);const anchor=document.createElement('a');
 anchor.href=target;anchor.download='visa-document-checklist.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(target),1000);
};
window.addEventListener('resize',()=>{if(!mobile()){view('reader');}else $('#back').hidden=$('#main').dataset.view==='cats';});
render();view(mobile()?'cats':'reader');
