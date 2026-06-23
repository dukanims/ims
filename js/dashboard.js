/* ============================================================
   IMS — Dashboard application logic
   ============================================================ */
(function () {
  "use strict";

  // ---------- State ----------
  let me = null;                 // { uid, username, role, department }
  let isAdmin = false;
  let students = [];             // [{ id, name, studentId, major, stage, time }]
  let departments = [];          // ["Finance", ...]
  let accounts = [];             // users with roles
  let internMap = {};            // key `${studentDocId}__${dept}` -> record
  let currentView = "overview";
  let activeDept = "";           // department being marked in the Internships view
  const unsub = [];              // snapshot unsubscribers

  // ---------- Element shortcuts ----------
  const $ = (id) => document.getElementById(id);
  const STATUSES = ["Completed", "Not Completed", "Pending"];

  // ===========================================================
  //  AUTH GUARD
  // ===========================================================
  auth.onAuthStateChanged(async (user) => {
    if (!user) { window.location.replace("index.html"); return; }
    const profile = await getUserProfile(user.uid);
    if (!profile) { await auth.signOut(); window.location.replace("index.html"); return; }

    me = profile;
    isAdmin = profile.role === "admin";
    activeDept = isAdmin ? "" : profile.department;
    setupRoleUI();
    if (isAdmin) await ensureDepartmentsSeeded();
    attachListeners();
    $("app").style.visibility = "visible";
  });

  function setupRoleUI() {
    // Hide admin-only controls for department users
    if (!isAdmin) {
      document.querySelectorAll("[data-admin]").forEach((el) => (el.style.display = "none"));
      $("navInternLabel").textContent = "My Department";
    }
    const display = isAdmin ? "Administrator" : me.department;
    $("sideName").textContent = me.username;
    $("sideRole").textContent = display;
    $("sideAvatar").textContent = (me.username[0] || "?").toUpperCase();
    $("roleChip").textContent = isAdmin ? "Super Admin" : `${me.department} dept.`;
  }

  // ===========================================================
  //  DATA LISTENERS
  // ===========================================================
  function attachListeners() {
    unsub.push(db.collection("students").onSnapshot((s) => {
      students = s.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      refresh();
    }));

    unsub.push(db.collection("departments").onSnapshot((s) => {
      departments = s.docs.map((d) => d.data().name).sort();
      if (!isAdmin) departments = [me.department];
      if (isAdmin && !activeDept && departments.length) activeDept = departments[0];
      populateDeptSelectors();
      refresh();
    }));

    unsub.push(db.collection("internships").onSnapshot((s) => {
      internMap = {};
      s.docs.forEach((d) => { internMap[d.id] = { id: d.id, ...d.data() }; });
      refresh();
    }));

    if (isAdmin) {
      unsub.push(db.collection("users").onSnapshot((s) => {
        accounts = s.docs.map((d) => ({ uid: d.id, ...d.data() }));
        if (currentView === "accounts") renderAccounts();
      }));
    }
  }

  async function ensureDepartmentsSeeded() {
    const snap = await db.collection("departments").limit(1).get();
    if (snap.empty) {
      const batch = db.batch();
      DEFAULT_DEPARTMENTS.forEach((name) => {
        batch.set(db.collection("departments").doc(slug(name)), { name });
      });
      await batch.commit();
    }
  }

  // ===========================================================
  //  HELPERS
  // ===========================================================
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function key(studentDocId, dept) { return `${studentDocId}__${slug(dept)}`; }
  function statusOf(studentDocId, dept) {
    const r = internMap[key(studentDocId, dept)];
    return r ? r.status : "Pending";
  }
  function noteOf(studentDocId, dept) {
    const r = internMap[key(studentDocId, dept)];
    return r ? (r.note || "") : "";
  }
  function statusTag(status) {
    const cls = status === "Completed" ? "ok" : status === "Not Completed" ? "no" : "pending";
    return `<span class="tag ${cls}">${escapeHtml(status)}</span>`;
  }
  function fmtDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  function toast(msg, type) {
    const t = $("toast");
    t.textContent = msg;
    t.className = "toast show " + (type || "");
    setTimeout(() => (t.className = "toast"), 2600);
  }
  function emptyState(title, sub) {
    return `<div class="empty"><div class="emblem">IM</div><h4>${escapeHtml(title)}</h4><p>${escapeHtml(sub)}</p></div>`;
  }

  // ===========================================================
  //  RENDER ROUTER
  // ===========================================================
  function refresh() {
    renderStats();
    switch (currentView) {
      case "overview": renderOverview(); break;
      case "students": renderStudents(); break;
      case "internships": renderInternships(); break;
      case "accounts": renderDepartments(); renderAccounts(); break;
      case "reports": renderReport(); break;
    }
  }

  // ---------- STATS ----------
  function renderStats() {
    const grid = $("statGrid");
    if (isAdmin) {
      let completed = 0, total = 0;
      students.forEach((s) => departments.forEach((d) => {
        total++; if (statusOf(s.id, d) === "Completed") completed++;
      }));
      grid.innerHTML = stat("Students", students.length) +
        stat("Departments", departments.length) +
        stat("Placements completed", `${completed}`) +
        stat("Total placement slots", `${total}`);
    } else {
      const dept = me.department;
      let done = 0, no = 0, pending = 0;
      students.forEach((s) => {
        const st = statusOf(s.id, dept);
        if (st === "Completed") done++; else if (st === "Not Completed") no++; else pending++;
      });
      grid.innerHTML = stat("Students", students.length) +
        stat("Completed", done) +
        stat("Not completed", no) +
        stat("Pending review", pending);
    }
  }
  function stat(k, v) {
    return `<div class="stat"><div class="k">${escapeHtml(k)}</div><div class="v tnum">${escapeHtml(String(v))}</div></div>`;
  }

  // ---------- OVERVIEW ----------
  function renderOverview() {
    $("ovTableTitle").textContent = isAdmin ? "Departments at a glance" : `Recent updates — ${me.department}`;
    const host = $("ovTable");

    if (isAdmin) {
      if (!departments.length) { host.innerHTML = emptyState("No departments yet", "Add one under Departments & Accounts."); return; }
      let rows = departments.map((d) => {
        let done = 0, no = 0, pend = 0;
        students.forEach((s) => {
          const st = statusOf(s.id, d);
          if (st === "Completed") done++; else if (st === "Not Completed") no++; else pend++;
        });
        return `<tr><td class="name">${escapeHtml(d)}</td>
          <td class="cell-num">${done}</td><td class="cell-num">${no}</td><td class="cell-num">${pend}</td>
          <td>${statusBar(done, students.length)}</td></tr>`;
      }).join("");
      host.innerHTML = `<table><thead><tr><th>Department</th><th>Completed</th><th>Not completed</th><th>Pending</th><th style="width:160px;">Progress</th></tr></thead><tbody>${rows}</tbody></table>`;
    } else {
      const dept = me.department;
      const recent = students
        .map((s) => ({ s, r: internMap[key(s.id, dept)] }))
        .filter((x) => x.r && x.r.date)
        .sort((a, b) => (b.r.date.seconds || 0) - (a.r.date.seconds || 0))
        .slice(0, 8);
      if (!recent.length) { host.innerHTML = emptyState("No updates yet", "Mark internship statuses from the My Department tab."); return; }
      const rows = recent.map(({ s, r }) =>
        `<tr><td class="name">${escapeHtml(s.name)}</td><td class="id">${escapeHtml(s.studentId)}</td>
         <td>${statusTag(r.status)}</td><td class="note-text">${escapeHtml(r.note || "—")}</td><td class="muted">${fmtDate(r.date)}</td></tr>`).join("");
      host.innerHTML = `<table><thead><tr><th>Student</th><th>ID</th><th>Status</th><th>Note</th><th>Updated</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
  }
  function statusBar(done, total) {
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:999px;height:9px;overflow:hidden;">
      <div style="width:${pct}%;height:100%;background:var(--gold);"></div></div>
      <div class="muted" style="font-size:11.5px;margin-top:3px;">${pct}% of ${total}</div>`;
  }

  // ---------- STUDENTS (admin) ----------
  function renderStudents() {
    const q = ($("studentSearch").value || "").toLowerCase().trim();
    const tf = $("studentTimeFilter").value;
    const list = students.filter((s) =>
      (!q || (s.name || "").toLowerCase().includes(q) || String(s.studentId || "").toLowerCase().includes(q)) &&
      (!tf || s.time === tf));

    const host = $("studentsTable");
    if (!students.length) { host.innerHTML = emptyState("No students yet", "Click “Add student” to register your first student."); return; }
    if (!list.length) { host.innerHTML = emptyState("No matches", "Try a different search or filter."); return; }

    const rows = list.map((s) => `<tr>
      <td><div class="name">${escapeHtml(s.name)}</div></td>
      <td class="id">${escapeHtml(s.studentId)}</td>
      <td>${escapeHtml(s.major || "—")}</td>
      <td>${escapeHtml(s.stage || "—")}</td>
      <td><span class="chip">${escapeHtml(s.time || "—")}</span></td>
      <td><div class="row-actions">
        <button class="btn ghost sm" data-edit-student="${s.id}">Edit</button>
        <button class="btn danger sm" data-del-student="${s.id}">Delete</button>
      </div></td></tr>`).join("");
    host.innerHTML = `<table><thead><tr><th>Full name</th><th>Student ID</th><th>Department / Major</th><th>Stage</th><th>Study time</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  // ---------- INTERNSHIPS (marking) ----------
  function renderInternships() {
    if (isAdmin) {
      $("internHeading").textContent = activeDept ? `Marking: ${activeDept}` : "Internship records";
      $("internEyebrow").textContent = "Internship Status";
    } else {
      $("internHeading").textContent = `${me.department} — internship status`;
    }
    const dept = isAdmin ? activeDept : me.department;
    const host = $("internTable");

    if (isAdmin && !dept) { host.innerHTML = emptyState("Choose a department", "Pick a department above to mark internship status."); return; }
    if (!students.length) { host.innerHTML = emptyState("No students yet", isAdmin ? "Add students first under the Students tab." : "No students have been registered by the administrator yet."); return; }

    const q = ($("internSearch").value || "").toLowerCase().trim();
    const sf = $("internStatusFilter").value;
    const list = students.filter((s) => {
      const st = statusOf(s.id, dept);
      return (!q || (s.name || "").toLowerCase().includes(q) || String(s.studentId || "").toLowerCase().includes(q)) &&
             (!sf || st === sf);
    });
    if (!list.length) { host.innerHTML = emptyState("No matches", "Try a different search or filter."); return; }

    const rows = list.map((s) => {
      const r = internMap[key(s.id, dept)];
      return `<tr>
        <td><div class="name">${escapeHtml(s.name)}</div><div class="id">${escapeHtml(s.major || "")}</div></td>
        <td class="id">${escapeHtml(s.studentId)}</td>
        <td>${statusTag(statusOf(s.id, dept))}</td>
        <td class="note-text">${escapeHtml(noteOf(s.id, dept) || "—")}</td>
        <td class="muted">${r ? fmtDate(r.date) : "—"}</td>
        <td><div class="row-actions"><button class="btn sm" data-mark="${s.id}">Update</button></div></td>
      </tr>`;
    }).join("");
    host.innerHTML = `<table><thead><tr><th>Student</th><th>ID</th><th>Status</th><th>Note</th><th>Updated</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  // ---------- DEPARTMENTS + ACCOUNTS (admin) ----------
  function renderDepartments() {
    const host = $("deptTable");
    if (!departments.length) { host.innerHTML = emptyState("No departments", "Add your first department."); return; }
    const rows = departments.map((d) => {
      const linked = accounts.filter((a) => a.role === "department" && a.department === d).length;
      return `<tr><td class="name">${escapeHtml(d)}</td>
        <td>${linked ? `<span class="chip">${linked} account${linked > 1 ? "s" : ""}</span>` : '<span class="muted">no account</span>'}</td>
        <td><div class="row-actions"><button class="btn danger sm" data-del-dept="${escapeHtml(d)}">Remove</button></div></td></tr>`;
    }).join("");
    host.innerHTML = `<table><thead><tr><th>Department</th><th>Accounts</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function renderAccounts() {
    const host = $("accountsTable");
    if (!accounts.length) { host.innerHTML = emptyState("No accounts", "Create department login accounts."); return; }
    const rows = accounts.slice().sort((a, b) => (a.role || "").localeCompare(b.role || "")).map((a) => `<tr>
      <td class="name">${escapeHtml(a.username)}</td>
      <td>${a.role === "admin" ? '<span class="tag gold">Administrator</span>' : `<span class="chip">${escapeHtml(a.department || "—")}</span>`}</td>
      <td><div class="row-actions">${a.uid === me.uid ? '<span class="muted" style="font-size:12px;">you</span>' : `<button class="btn danger sm" data-del-account="${a.uid}">Remove</button>`}</div></td>
    </tr>`).join("");
    host.innerHTML = `<table><thead><tr><th>Username</th><th>Role</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  // ---------- REPORT ----------
  function renderReport() {
    const host = $("reportTable");
    const filterDept = isAdmin ? $("reportDeptFilter").value : me.department;
    $("reportHeading").textContent = filterDept ? `${filterDept} internship report` : "Full internship report";

    if (!students.length) { host.innerHTML = emptyState("Nothing to report", "Add students to generate a report."); return; }

    if (isAdmin && !filterDept) {
      // Cross-department matrix
      const head = `<th>Student</th><th>ID</th><th>Major</th><th>Stage</th><th>Time</th>` +
        departments.map((d) => `<th class="matrix-cell">${escapeHtml(d)}</th>`).join("");
      const rows = students.map((s) => {
        const cells = departments.map((d) => `<td class="matrix-cell">${statusTag(statusOf(s.id, d))}</td>`).join("");
        return `<tr><td class="name">${escapeHtml(s.name)}</td><td class="id">${escapeHtml(s.studentId)}</td>
          <td>${escapeHtml(s.major || "—")}</td><td>${escapeHtml(s.stage || "—")}</td><td>${escapeHtml(s.time || "—")}</td>${cells}</tr>`;
      }).join("");
      host.innerHTML = `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
    } else {
      const dept = filterDept;
      const rows = students.map((s) => `<tr>
        <td class="name">${escapeHtml(s.name)}</td><td class="id">${escapeHtml(s.studentId)}</td>
        <td>${escapeHtml(s.major || "—")}</td><td>${escapeHtml(s.stage || "—")}</td><td>${escapeHtml(s.time || "—")}</td>
        <td>${statusTag(statusOf(s.id, dept))}</td><td class="note-text">${escapeHtml(noteOf(s.id, dept) || "—")}</td></tr>`).join("");
      host.innerHTML = `<table><thead><tr><th>Student</th><th>ID</th><th>Major</th><th>Stage</th><th>Time</th><th>Status</th><th>Note</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
  }

  // ===========================================================
  //  CSV EXPORT
  // ===========================================================
  function exportCsv() {
    const filterDept = isAdmin ? $("reportDeptFilter").value : me.department;
    let header, rows;
    if (isAdmin && !filterDept) {
      header = ["Full Name", "Student ID", "Major", "Stage", "Study Time", ...departments];
      rows = students.map((s) => [s.name, s.studentId, s.major, s.stage, s.time, ...departments.map((d) => statusOf(s.id, d))]);
    } else {
      const dept = filterDept;
      header = ["Full Name", "Student ID", "Major", "Stage", "Study Time", "Department", "Status", "Note"];
      rows = students.map((s) => [s.name, s.studentId, s.major, s.stage, s.time, dept, statusOf(s.id, dept), noteOf(s.id, dept)]);
    }
    const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `IMS_report_${filterDept ? slug(filterDept) : "all"}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("CSV exported", "ok");
  }
  function csvCell(v) {
    const s = String(v ?? "");
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function printReport() {
    const filterDept = isAdmin ? $("reportDeptFilter").value : me.department;
    $("printHead").innerHTML =
      `<h1>${escapeHtml(filterDept ? filterDept + " — Internship Report" : "Internship Report (All Departments)")}</h1>
       <div class="meta">Internship Management System · Generated ${new Date().toLocaleString()}</div>`;
    window.print();
  }

  // ===========================================================
  //  MODALS
  // ===========================================================
  function openModal(html, wide) {
    $("modal").className = "modal" + (wide ? " wide" : "");
    $("modal").innerHTML = html;
    $("modalBg").classList.add("show");
  }
  function closeModal() { $("modalBg").classList.remove("show"); $("modal").innerHTML = ""; }
  $("modalBg").addEventListener("click", (e) => { if (e.target === $("modalBg")) closeModal(); });

  function studentModal(existing) {
    const s = existing || {};
    openModal(`
      <div class="modal-head"><h3>${existing ? "Edit student" : "Add student"}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div id="mErr" class="alert err"></div>
        <div class="field"><label>Full name</label><input id="m_name" value="${escapeHtml(s.name || "")}" placeholder="e.g. Sara Ahmed" /></div>
        <div class="grid-2">
          <div class="field"><label>Student ID</label><input id="m_sid" value="${escapeHtml(s.studentId || "")}" placeholder="e.g. 2023-1045" /></div>
          <div class="field"><label>Department / Major</label><input id="m_major" value="${escapeHtml(s.major || "")}" placeholder="e.g. Accounting" /></div>
        </div>
        <div class="grid-2">
          <div class="field"><label>Stage</label><input id="m_stage" value="${escapeHtml(s.stage || "")}" placeholder="e.g. Stage 3" /></div>
          <div class="field"><label>Study time</label>
            <div class="pills">
              <label><input type="radio" name="m_time" value="Morning" ${s.time === "Morning" || !s.time ? "checked" : ""}/> Morning</label>
              <label><input type="radio" name="m_time" value="Evening" ${s.time === "Evening" ? "checked" : ""}/> Evening</label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn" id="m_save">${existing ? "Save changes" : "Add student"}</button>
      </div>`);

    $("m_save").addEventListener("click", async () => {
      const data = {
        name: $("m_name").value.trim(),
        studentId: $("m_sid").value.trim(),
        major: $("m_major").value.trim(),
        stage: $("m_stage").value.trim(),
        time: (document.querySelector('input[name="m_time"]:checked') || {}).value || "Morning"
      };
      if (!data.name || !data.studentId) { showModalErr("Full name and Student ID are required."); return; }
      try {
        if (existing) await db.collection("students").doc(existing.id).update(data);
        else await db.collection("students").add(data);
        closeModal(); toast(existing ? "Student updated" : "Student added", "ok");
      } catch (e) { showModalErr("Could not save: " + e.message); }
    });
  }

  function markModal(student) {
    const dept = isAdmin ? activeDept : me.department;
    const cur = statusOf(student.id, dept);
    const note = noteOf(student.id, dept);
    openModal(`
      <div class="modal-head"><h3>Internship status</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div id="mErr" class="alert err"></div>
        <p class="muted" style="margin-top:0;">
          <b style="color:var(--ink);">${escapeHtml(student.name)}</b> · ${escapeHtml(student.studentId)}<br/>
          Department: <span class="chip">${escapeHtml(dept)}</span>
        </p>
        <div class="field"><label>Status</label>
          <div class="pills">
            ${STATUSES.map((st) => `<label><input type="radio" name="m_status" value="${st}" ${cur === st ? "checked" : ""}/> ${st}</label>`).join("")}
          </div>
        </div>
        <div class="field"><label>Note (optional)</label><textarea id="m_note" placeholder="Add a remark for this placement…">${escapeHtml(note)}</textarea></div>
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn" id="m_savestatus">Save status</button>
      </div>`);

    $("m_savestatus").addEventListener("click", async () => {
      const status = (document.querySelector('input[name="m_status"]:checked') || {}).value;
      if (!status) { showModalErr("Pick a status."); return; }
      const rec = {
        studentId: student.id,
        studentNumber: student.studentId,
        studentName: student.name,
        departmentId: dept,
        status,
        note: $("m_note").value.trim(),
        date: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: me.username
      };
      try {
        await db.collection("internships").doc(key(student.id, dept)).set(rec, { merge: true });
        closeModal(); toast("Status saved", "ok");
      } catch (e) { showModalErr("Could not save: " + e.message); }
    });
  }

  function deptModal() {
    openModal(`
      <div class="modal-head"><h3>Add department</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div id="mErr" class="alert err"></div>
        <div class="field"><label>Department name</label><input id="m_dept" placeholder="e.g. Human Resources" /></div>
      </div>
      <div class="modal-foot"><button class="btn ghost" data-close>Cancel</button><button class="btn" id="m_adddept">Add department</button></div>`);
    $("m_adddept").addEventListener("click", async () => {
      const name = $("m_dept").value.trim();
      if (!name) { showModalErr("Enter a department name."); return; }
      if (departments.includes(name)) { showModalErr("That department already exists."); return; }
      try { await db.collection("departments").doc(slug(name)).set({ name }); closeModal(); toast("Department added", "ok"); }
      catch (e) { showModalErr("Could not add: " + e.message); }
    });
  }

  function accountModal() {
    openModal(`
      <div class="modal-head"><h3>Create login account</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div id="mErr" class="alert err"></div>
        <div class="field"><label>Role</label>
          <div class="pills">
            <label><input type="radio" name="m_role" value="department" checked/> Department</label>
            <label><input type="radio" name="m_role" value="admin"/> Administrator</label>
          </div>
        </div>
        <div class="field" id="deptWrap"><label>Department</label>
          <select id="m_acc_dept">${departments.map((d) => `<option>${escapeHtml(d)}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Username</label><input id="m_user" placeholder="e.g. finance" />
          <div class="hint">They sign in with this name. It becomes <span id="emailPreview">finance@${LOGIN_DOMAIN}</span>.</div>
        </div>
        <div class="field"><label>Password</label><input id="m_pass" type="text" placeholder="At least 6 characters" /></div>
      </div>
      <div class="modal-foot"><button class="btn ghost" data-close>Cancel</button><button class="btn" id="m_addacc">Create account</button></div>`);

    const roleRadios = document.querySelectorAll('input[name="m_role"]');
    roleRadios.forEach((r) => r.addEventListener("change", () => {
      $("deptWrap").style.display = document.querySelector('input[name="m_role"]:checked').value === "department" ? "" : "none";
    }));
    $("m_user").addEventListener("input", () => {
      $("emailPreview").textContent = `${($("m_user").value.trim().toLowerCase() || "username")}@${LOGIN_DOMAIN}`;
    });

    $("m_addacc").addEventListener("click", async () => {
      const role = document.querySelector('input[name="m_role"]:checked').value;
      const username = $("m_user").value.trim().toLowerCase();
      const password = $("m_pass").value;
      const department = role === "department" ? $("m_acc_dept").value : "";
      if (!username || !password) { showModalErr("Username and password are required."); return; }
      if (password.length < 6) { showModalErr("Password must be at least 6 characters."); return; }

      const btn = $("m_addacc"); btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Creating…';
      let secondary;
      try {
        // Create the auth user on a SECONDARY app so the admin stays signed in.
        secondary = firebase.initializeApp(firebaseConfig, "secondary-" + Date.now());
        const cred = await secondary.auth().createUserWithEmailAndPassword(usernameToEmail(username), password);
        await db.collection("users").doc(cred.user.uid).set({ username, role, department });
        await secondary.auth().signOut();
        closeModal(); toast("Account created", "ok");
      } catch (e) {
        const msg = e.code === "auth/email-already-in-use" ? "That username is already taken." :
                    e.code === "auth/weak-password" ? "Password is too weak." : ("Could not create: " + e.message);
        showModalErr(msg);
      } finally {
        if (secondary) { try { await secondary.delete(); } catch (_) {} }
        btn.disabled = false; btn.textContent = "Create account";
      }
    });
  }

  function confirmModal(title, body, onYes, danger) {
    openModal(`
      <div class="modal-head"><h3>${escapeHtml(title)}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body"><p style="margin:0;">${body}</p></div>
      <div class="modal-foot"><button class="btn ghost" data-close>Cancel</button>
      <button class="btn ${danger ? "danger" : ""}" id="m_yes">Confirm</button></div>`);
    $("m_yes").addEventListener("click", onYes);
  }
  function showModalErr(msg) { const e = $("mErr"); if (e) { e.textContent = msg; e.classList.add("show"); } }

  // ===========================================================
  //  EVENTS
  // ===========================================================
  // Navigation
  $("nav").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-view]");
    if (!a) return;
    e.preventDefault();
    navigate(a.dataset.view);
    closeSidebar();
  });

  function navigate(view) {
    currentView = view;
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    const titles = {
      overview: ["Overview", "Snapshot of internship progress"],
      students: ["Students", "Register and manage student records"],
      internships: ["Internships", isAdmin ? "Mark internship completion by department" : "Mark internship completion for your department"],
      accounts: ["Departments & Accounts", "Manage departments and login access"],
      reports: ["Reports", "Review, print and export internship records"]
    };
    const t = titles[view] || ["", ""];
    $("pageTitle").textContent = t[0]; $("pageSub").textContent = t[1];
    refresh();
  }

  // Delegated clicks for table actions
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("[data-close]")) { closeModal(); return; }

    const editS = t.closest("[data-edit-student]");
    if (editS) { studentModal(students.find((s) => s.id === editS.dataset.editStudent)); return; }

    const delS = t.closest("[data-del-student]");
    if (delS) {
      const s = students.find((x) => x.id === delS.dataset.delStudent);
      confirmModal("Delete student", `Remove <b>${escapeHtml(s.name)}</b> and all related internship records? This cannot be undone.`, async () => {
        try {
          const batch = db.batch();
          batch.delete(db.collection("students").doc(s.id));
          departments.forEach((d) => batch.delete(db.collection("internships").doc(key(s.id, d))));
          await batch.commit();
          closeModal(); toast("Student deleted", "ok");
        } catch (err) { showModalErr("Could not delete: " + err.message); }
      }, true);
      return;
    }

    const mark = t.closest("[data-mark]");
    if (mark) { markModal(students.find((s) => s.id === mark.dataset.mark)); return; }

    const delD = t.closest("[data-del-dept]");
    if (delD) {
      const name = delD.dataset.delDept;
      confirmModal("Remove department", `Remove the <b>${escapeHtml(name)}</b> department? Existing records stay in the database but it will no longer be listed.`, async () => {
        try { await db.collection("departments").doc(slug(name)).delete(); closeModal(); toast("Department removed", "ok"); }
        catch (err) { showModalErr("Could not remove: " + err.message); }
      }, true);
      return;
    }

    const delA = t.closest("[data-del-account]");
    if (delA) {
      confirmModal("Remove account", `This removes the account's access and role. The sign-in credential must also be deleted from Firebase Authentication in the console.`, async () => {
        try { await db.collection("users").doc(delA.dataset.delAccount).delete(); closeModal(); toast("Account removed", "ok"); }
        catch (err) { showModalErr("Could not remove: " + err.message); }
      }, true);
      return;
    }
  });

  // Buttons
  $("addStudentBtn").addEventListener("click", () => studentModal(null));
  $("addDeptBtn").addEventListener("click", deptModal);
  $("addAccountBtn").addEventListener("click", accountModal);
  $("printBtn").addEventListener("click", printReport);
  $("csvBtn").addEventListener("click", exportCsv);
  $("logoutBtn").addEventListener("click", async () => { unsub.forEach((u) => u && u()); await auth.signOut(); window.location.replace("index.html"); });

  // Filters
  $("studentSearch").addEventListener("input", renderStudents);
  $("studentTimeFilter").addEventListener("change", renderStudents);
  $("internSearch").addEventListener("input", renderInternships);
  $("internStatusFilter").addEventListener("change", renderInternships);
  $("internDeptFilter").addEventListener("change", (e) => { activeDept = e.target.value; renderInternships(); });
  $("reportDeptFilter").addEventListener("change", renderReport);

  function populateDeptSelectors() {
    if (!isAdmin) return;
    const fill = (sel, withAll, allLabel) => {
      const cur = sel.value;
      sel.innerHTML = (withAll ? `<option value="">${allLabel}</option>` : "") +
        departments.map((d) => `<option>${escapeHtml(d)}</option>`).join("");
      if ([...sel.options].some((o) => o.value === cur)) sel.value = cur;
    };
    fill($("internDeptFilter"), false);          // marking: must pick a real department
    if (!activeDept && departments.length) activeDept = departments[0];
    $("internDeptFilter").value = activeDept;
    fill($("reportDeptFilter"), true, "All departments");
  }

  // Mobile sidebar
  function closeSidebar() { $("sidebar").classList.remove("open"); $("scrim").classList.remove("show"); }
  $("menuBtn").addEventListener("click", () => { $("sidebar").classList.add("open"); $("scrim").classList.add("show"); });
  $("scrim").addEventListener("click", closeSidebar);
})();
