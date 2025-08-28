window.utils = (()=>{

  // Parse CSV thẳng (đơn giản): trả về mảng object theo header
  function parseCSV(csvText){
    const lines = csvText.trim().split(/\r?\n/);
    const headers = lines.shift().split(",").map(h=>h.trim());
    return lines.map(l=>{
      const cells = splitCSVRow(l);
      const obj = {};
      headers.forEach((h,i)=>obj[h] = (cells[i]||"").trim());
      return obj;
    });
  }

  // xử lý dấu phẩy trong dấu ngoặc kép
  function splitCSVRow(row){
    const out=[], re=/("([^"]|"")*"|[^,]+)|(?<=,)(?=,)|^$/g;
    let m; while((m=re.exec(row))!==null){
      let cell = m[0] || "";
      if(cell.startsWith('"') && cell.endsWith('"')){
        cell = cell.slice(1,-1).replace(/""/g,'"');
      }
      if(cell==="" && row[m.index-1]===',') cell=""; // empty
      out.push(cell);
    }
    return out;
  }

  async function fetchCSV(url){
    const res = await fetch(url, {cache:'no-store'});
    if(!res.ok) throw new Error("Fetch CSV failed");
    const text = await res.text();
    return parseCSV(text);
  }

  // Modal helpers
  function openModal(sel){ const el = document.querySelector(sel); if(el){ el.setAttribute('aria-hidden','false'); } }
  function closeModal(sel){ const el = document.querySelector(sel); if(el){ el.setAttribute('aria-hidden','true'); } }
  document.addEventListener('click', (e)=>{
    const closeSel = e.target?.dataset?.close;
    if(closeSel){ closeModal(closeSel); }
  });

  // Tiny notify
  function notify(msg, type='info'){
    const n = document.createElement('div');
    n.textContent = msg;
    n.className = 'toast pop-in';
    Object.assign(n.style,{
      position:'fixed', right:'16px', bottom:'16px', background:'#111827', color:'#fff',
      padding:'10px 14px', borderRadius:'10px', zIndex:100, boxShadow:'0 10px 30px rgba(0,0,0,.2)'
    });
    if(type==='ok'){ n.style.background = '#16a34a'; }
    if(type==='err'){ n.style.background = '#dc2626'; }
    document.body.appendChild(n);
    setTimeout(()=>n.remove(), 2200);
  }

  return { fetchCSV, parseCSV, openModal, closeModal, notify };
})();
