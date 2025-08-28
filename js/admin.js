(async function adminBoot(){
  const CFG = window.APP_CONFIG;

  // Gắn link Drive
  const openDrive = document.getElementById('openDrive');
  if(openDrive) openDrive.href = CFG.DRIVE_FOLDER_URL;

  // Load data
  let USERS = [];
  try {
    USERS = await utils.fetchCSV(CFG.USERS_SHEET_CSV);
  } catch(err){
    console.error(err);
    utils.notify("Không tải được Users từ Sheet. Dùng dữ liệu mẫu.", "err");
    USERS = sampleUsers(); // fallback
  }

  // ===== Render KPI =====
  renderKPIs(USERS);

  // ===== Render bảng Users =====
  const $tbody = document.getElementById('userTableBody');
  function renderTable(rows){
    $tbody.innerHTML = rows.map(row=> rowToTR(row)).join("");
    bindRowActions();
  }
  renderTable(USERS);

  // ===== Tìm kiếm / Lọc =====
  const $search = document.getElementById('searchUser');
  const $role = document.getElementById('filterRole');
  const $refresh = document.getElementById('refreshUsers');

  function applyFilter(){
    const q = ($search.value||"").toLowerCase();
    const r = ($role.value||"").toLowerCase();
    const rows = USERS.filter(u=>{
      const hay = `${u.Email} ${u.Name||""} ${u.Role||""}`.toLowerCase();
      const okQ = !q || hay.includes(q);
      const okR = !r || (u.Role||"").toLowerCase()===r;
      return okQ && okR;
    });
    renderTable(rows);
  }
  $search?.addEventListener('input', applyFilter);
  $role?.addEventListener('change', applyFilter);
  $refresh?.addEventListener('click', async ()=>{
    utils.notify("Đang tải lại Users…");
    try{
      USERS = await utils.fetchCSV(CFG.USERS_SHEET_CSV);
      renderKPIs(USERS); applyFilter();
      utils.notify("Đã cập nhật Users", "ok");
    }catch(e){ utils.notify("Tải lại thất bại", "err"); }
  });

  // ===== Tạo tài khoản (modal) – demo ghi tạm =====
  document.getElementById('userForm')?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const row = {
      Email: document.getElementById('uEmail').value.trim(),
      Name: document.getElementById('uName').value.trim(),
      Role: document.getElementById('uRole').value,
      Status: 'active',
      Password: document.getElementById('uPassword').value.trim()
    };
    USERS.unshift(row);
    applyFilter();
    utils.closeModal('#userModal');
    utils.notify("Đã thêm tài khoản (demo – nếu không dùng API, bạn cần thêm trên Sheet thực tế)", "ok");
  });

  // ===== Reset mật khẩu =====
  let resetTargetEmail = null;
  document.getElementById('doResetPwd')?.addEventListener('click', ()=>{
    if(!resetTargetEmail) return;
    // DEMO: cập nhật trong mảng; thực tế: chỉnh trực tiếp trên Google Sheet (hoặc Apps Script)
    const u = USERS.find(x=> (x.Email||"").toLowerCase() === resetTargetEmail.toLowerCase());
    if(u){ u.Password = CFG.DEFAULT_RESET_PASSWORD; }
    applyFilter();
    utils.closeModal('#resetModal');
    utils.notify(`Đã reset mật khẩu cho ${resetTargetEmail} (nhớ cập nhật trên Sheet!)`, "ok");
  });

  // ===== Helpers =====
  function rowToTR(u){
    const roleChip = roleToChip(u.Role);
    const status = u.Status || 'active';
    return `
      <tr data-email="${u.Email}">
        <td>${u.Email||''}</td>
        <td>${u.Name||''}</td>
        <td>${roleChip}</td>
        <td>${status}</td>
        <td class="right">
          <button class="btn ghost btn-edit">Sửa</button>
          <button class="btn danger btn-delete">Xoá</button>
          <button class="btn outline btn-reset">Reset MK</button>
        </td>
      </tr>`;
  }

  function roleToChip(r){
    const map = { admin:['#1e3a8a','Admin'], instructor:['#047857','Giáo viên'], student:['#6b21a8','Học sinh'] };
    const key = (r||'').toLowerCase();
    const [bg,label] = map[key] || ['#4b5563', r||'N/A'];
    return `<span style="background:${bg};color:#fff;padding:4px 10px;border-radius:999px;font-size:.8rem">${label}</span>`;
  }

  function bindRowActions(){
    document.querySelectorAll('.btn-reset').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const tr = e.target.closest('tr');
        resetTargetEmail = tr.dataset.email;
        document.getElementById('resetEmail').textContent = resetTargetEmail;
        document.getElementById('resetNewPwd').textContent = CFG.DEFAULT_RESET_PASSWORD;
        utils.openModal('#resetModal');
      });
    });
    document.querySelectorAll('.btn-delete').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const email = e.target.closest('tr').dataset.email;
        const i = USERS.findIndex(x=> (x.Email||"").toLowerCase()===email.toLowerCase());
        if(i>-1){ USERS.splice(i,1); applyFilter(); utils.notify(`Đã xoá ${email}`,'ok'); }
      });
    });
    document.querySelectorAll('.btn-edit').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const email = e.target.closest('tr').dataset.email;
        const u = USERS.find(x=> (x.Email||"").toLowerCase()===email.toLowerCase());
        if(!u) return;
        document.getElementById('userModalTitle').textContent = 'Sửa tài khoản';
        document.getElementById('uEmail').value = u.Email||'';
        document.getElementById('uName').value = u.Name||'';
        document.getElementById('uRole').value = (u.Role||'student').toLowerCase();
        document.getElementById('uPassword').value = u.Password||'';
        utils.openModal('#userModal');
      });
    });
  }

  function renderKPIs(users){
    const total = users.length;
    const admin = users.filter(u=>(u.Role||'').toLowerCase()==='admin').length;
    const ins = users.filter(u=>(u.Role||'').toLowerCase()==='instructor').length;
    const stu = users.filter(u=>(u.Role||'').toLowerCase()==='student').length;
    setText('kpiUsers', total);
    setText('kpiCourses', '—'); // sẽ cập nhật từ COURSES_SHEET_CSV
    setText('kpiFiles', '—');   // sẽ cập nhật từ FILES_SHEET_CSV
    setText('kpiWeeklyActive', admin+ins+stu); // placeholder
  }

  function setText(id,val){ const el=document.getElementById(id); if(el) el.textContent = val; }

  // demo data (khi chưa publish sheet)
  function sampleUsers(){
    return [
      {Email:'admin@lms.local', Name:'Quản trị viên', Role:'admin', Status:'active', Password:'admin123'},
      {Email:'alice@teacher.lequydon-q3.edu.vn', Name:'Cô Alice', Role:'instructor', Status:'active', Password:'teacher123'},
      {Email:'bob@student.lequydon-q3.edu.vn', Name:'Bạn Bob', Role:'student', Status:'active', Password:'student123'},
    ];
  }
})();
