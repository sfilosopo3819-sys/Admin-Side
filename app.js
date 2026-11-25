/* Only job: open/close popups. data-open="id" opens a dialog, data-close closes it. */
document.addEventListener('click',e=>{
 const c=e.target.closest('[data-close]'),o=e.target.closest('[data-open]');
 if(c)c.closest('dialog').close();
 if(o){
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  if(o.matches('button.les')){
   const location=o.querySelector('.les-location');
   const detail=document.querySelector('#m-sres .lesson-place span');
   if(location&&detail)detail.textContent=location.textContent;
  }
  document.getElementById(o.dataset.open).showModal();
 }});
/* Dashboard: show month pickers for "Custom". Students: filter rows by program (also from ?program= link). */
const pre=document.getElementById('pre');if(pre)pre.onchange=()=>document.getElementById('cus').hidden=pre.value!='custom';
const fp=document.getElementById('fp');if(fp){const f=()=>document.querySelectorAll('tr[data-p]').forEach(r=>r.hidden=fp.value&&r.dataset.p!=fp.value);
 const q=new URLSearchParams(location.search).get('program');if(q)fp.value=q;fp.onchange=f;f()}

const programs={
 Infantry:{label:'Infantry',sessions:'6',frequency:'2× / week',validity:'1 month',price:'₱8,300',color:'infantry'},
 'Basic Combat':{label:'Basic Combat',sessions:'8',frequency:'2× / week',validity:'1 month',price:'₱10,200',color:'basic'},
 'A-Team':{label:'A-Team Level',sessions:'15',frequency:'3× / week',validity:'5 weeks',price:'₱18,400',color:'ateam'},
 'Special Forces':{label:'Special Forces',sessions:'24',frequency:'2× / week',validity:'3 months',price:'₱29,100',color:'special'},
 'Band Coaching':{label:'Band Coaching',sessions:'By arrangement',frequency:'By arrangement',validity:'By arrangement',price:'By arrangement',color:'band'}
};
const supportMessage='Students with additional support needs are welcome to apply to any program. Before confirming enrollment, discuss the student’s needs with their family and agree whether practical adjustments can make the program a good fit.';
const colorClass=name=>`program-${programs[name]?programs[name].color:'band'}`;

const studentView=document.getElementById('fp');
if(studentView){
 const view=document.getElementById('view');
 const rulesCard=view.querySelector('.card');
 const support=document.createElement('div');
 support.className='support-note';
 support.innerHTML='<b>Inclusive enrollment</b><span></span>';
 support.querySelector('span').textContent=supportMessage;
 view.insertBefore(support,rulesCard);
 rulesCard.querySelector('small').textContent='Each one-on-one session is 1 hour. Discuss support needs with the family and agree on practical adjustments before enrollment.';

 const rules=rulesCard.querySelectorAll('table tr');
 const headings=['Program','Sessions','Frequency','Validity from enrollment','Price','Support arrangements'];
 rules[0].innerHTML=headings.map(text=>`<th>${text}</th>`).join('');
 Object.entries(programs).forEach(([name,program],index)=>{
  const row=rules[index+1];
  if(!row)return;
  row.innerHTML=`<td><span class="pill program-tag ${colorClass(name)}">${program.label}</span></td><td>${program.sessions}</td><td>${program.frequency}</td><td>${program.validity}</td><td>${program.price}</td><td><span class="pill support-tag">Discuss and agree</span></td>`;
 });

 document.querySelectorAll('tr[data-p]').forEach(row=>{
  const program=programs[row.dataset.p];
  if(!program)return;
  const cell=row.cells[2];
  cell.innerHTML=`<span class="pill program-tag ${colorClass(row.dataset.p)}">${program.label}</span><br><small>${program.frequency}</small>`;
 });

 const select=document.getElementById('fp');
 Array.from(select.options).forEach(option=>{
  if(programs[option.value])option.textContent=programs[option.value].label;
 });
 document.querySelectorAll('select').forEach(select=>{
  Array.from(select.options).forEach(option=>{
   if(programs[option.value])option.textContent=programs[option.value].label;
  });
 });

}

document.querySelectorAll('.prog[href*="program="]').forEach(tile=>{
 const name=new URL(tile.href).searchParams.get('program');
 const program=programs[name];
 if(!program)return;
 tile.classList.add(colorClass(name));
 if(tile.childNodes[0])tile.childNodes[0].textContent=program.label;
 const summary=tile.querySelector('small');
 if(summary)summary.textContent=name==='Band Coaching'?'By arrangement':`${program.sessions} one-on-one sessions · 1 hour each · ${program.frequency} · use within ${program.validity}`;
});

document.querySelectorAll('.row').forEach(row=>{
 const label=row.querySelector('span');
 const name=label&&Object.keys(programs).find(program=>label.textContent.trim()===programs[program].label||label.textContent.trim()===program);
 if(!name)return;
 label.textContent=programs[name].label;
 label.classList.add('program-label',colorClass(name));
 const bar=row.querySelector('.trk i');
 if(bar)bar.classList.add('program-fill',colorClass(name));
});

const dashboardView=document.querySelector('.grid.g4');
if(dashboardView){
 const support=document.createElement('div');
 support.className='support-note';
 support.innerHTML='<b>Inclusive programs</b><span></span>';
 support.querySelector('span').textContent=supportMessage;
 dashboardView.insertAdjacentElement('afterend',support);
}

const scheduleGrid=document.querySelector('.sched');
if(scheduleGrid){
 const locations={
  'Alex Cruz':{branch:'Acacia Town Center',room:'Room 1'},
  'Kit Morales':{branch:'Poblacion',room:'Room 2'},
  'Mina Santos':{branch:'BGC',room:'Room 1'},
  'Diego Tan':{branch:'Acacia Town Center',room:'Drum Room'},
  'Paolo Reyes':{branch:'Poblacion',room:'Room 1'},
  'Lara Uy':{branch:'BGC',room:'Room 1'},
  'Nina Villanueva':{branch:'BGC',online:true},
  'Rafi Gomez':{branch:'Acacia Town Center',room:'Vocal Room'}
 };
 scheduleGrid.querySelectorAll('button.les').forEach(lesson=>{
  const teacher=Object.keys(locations).find(name=>lesson.textContent.includes(name));
  const location=teacher&&locations[teacher];
  if(!location)return;
  const line=document.createElement('small');
  line.className=`les-location${location.online?' online':''}`;
  line.textContent=location.online?`Online · ${location.branch}`:`Face-to-face · ${location.branch} · ${location.room}`;
  lesson.appendChild(line);
 });
 const locationDetail=document.createElement('div');
 locationDetail.className='lesson-place';
 locationDetail.innerHTML='<b>Location</b><span></span>';
 const rescheduleDialog=document.getElementById('m-sres');
 rescheduleDialog.insertBefore(locationDetail,rescheduleDialog.querySelector('.bar'));
 const note=scheduleGrid.closest('.card').querySelector('p small');
 if(note)note.textContent='Color identifies the instrument. Each lesson shows its branch and room, or Online with its branch. Click a lesson to reschedule and see its location.';
}
