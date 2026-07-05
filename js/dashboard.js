/* ============================================================
   IMS — Dashboard application logic (bilingual EN/KU)
   ============================================================ */
(function () {
  "use strict";

  let me = null, isAdmin = false;
  let students = [], departments = [], accounts = [], internMap = {};
  let currentView = "overview", activeDept = "";
  const unsub = [];

  const $ = (id) => document.getElementById(id);

  // Stat-card icons: real SVG, but with explicit colour + size baked in
  // so they render regardless of CSS (currentColor was resolving invisibly).
  const ICONS = {
    students: "<img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyZDRhN2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTcgMjF2LTJhNCA0IDAgMCAwLTQtNEg1YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI3IiByPSI0Ii8+PHBhdGggZD0iTTIzIDIxdi0yYTQgNCAwIDAgMC0zLTMuODdNMTYgMy4xM2E0IDQgMCAwIDEgMCA3Ljc1Ii8+PC9zdmc+\" width=\"22\" height=\"22\" alt=\"\" style=\"display:block\">",
    departments: "<img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4YTY3MTIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMyAyMWgxOE01IDIxVjdsNy00IDcgNHYxNCIvPjxwYXRoIGQ9Ik05IDloLjAxTTkgMTNoLjAxTTkgMTdoLjAxTTE1IDloLjAxTTE1IDEzaC4wMU0xNSAxN2guMDEiLz48L3N2Zz4=\" width=\"22\" height=\"22\" alt=\"\" style=\"display:block\">",
    completed: "<img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjhhNTIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjIgMTEuMDhWMTJhMTAgMTAgMCAxIDEtNS45My05LjE0Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjIgNCAxMiAxNC4wMSA5IDExLjAxIi8+PC9zdmc+\" width=\"22\" height=\"22\" alt=\"\" style=\"display:block\">",
    slots: "<img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0YTVhNzYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWdvbiBwb2ludHM9IjEyIDIgMiA3IDEyIDEyIDIyIDcgMTIgMiIvPjxwb2x5bGluZSBwb2ludHM9IjIgMTcgMTIgMjIgMjIgMTciLz48cG9seWxpbmUgcG9pbnRzPSIyIDEyIDEyIDE3IDIyIDEyIi8+PC9zdmc+\" width=\"22\" height=\"22\" alt=\"\" style=\"display:block\">",
    notcompleted: "<img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjMzNhMmMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIxNSIgeTE9IjkiIHgyPSI5IiB5Mj0iMTUiLz48bGluZSB4MT0iOSIgeTE9IjkiIHgyPSIxNSIgeTI9IjE1Ii8+PC9zdmc+\" width=\"22\" height=\"22\" alt=\"\" style=\"display:block\">",
    pending: "<img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhOTc5MWMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwb2x5bGluZSBwb2ludHM9IjEyIDYgMTIgMTIgMTYgMTQiLz48L3N2Zz4=\" width=\"22\" height=\"22\" alt=\"\" style=\"display:block\">"
  };
  const STATUSES = ["Completed", "Not Completed", "Pending"];
  const T = (k, v) => (window.t ? window.t(k, v) : k);

  // ---------- AUTH GUARD ----------
  auth.onAuthStateChanged(async (user) => {
    if (!user) { window.location.replace("index.html"); return; }
    const profile = await getUserProfile(user.uid);
    if (!profile) { await auth.signOut(); window.location.replace("index.html"); return; }
    me = profile; isAdmin = profile.role === "admin";
    activeDept = isAdmin ? "" : profile.department;
    setupRoleUI();
    if (isAdmin) await ensureDepartmentsSeeded();
    attachListeners();
    navigate("overview");
    $("app").style.visibility = "visible";
  });

  // Re-render everything when the language switches
  window.onLangChange = function () {
    updateRoleText();
    populateDeptSelectors();
    navigate(currentView);
  };

  function setupRoleUI() {
    if (!isAdmin) {
      document.querySelectorAll("[data-admin]").forEach((el) => (el.style.display = "none"));
      const lbl = $("navInternLabel"); if (lbl) lbl.setAttribute("data-i18n", "nav_mydept");
      const eb = $("internEyebrow"); if (eb) eb.setAttribute("data-i18n", "mydept_eyebrow");
      // Department accounts are Kurdish-only: force Kurdish and remove the toggle.
      const tgl = $("langToggle"); if (tgl) tgl.style.display = "none";
      if (window.getLang && window.getLang() !== "ku" && window.setLang) window.setLang("ku");
    }
    $("sideAvatar").textContent = (me.username[0] || "?").toUpperCase();
    updateRoleText();
    if (window.applyI18n) window.applyI18n();
  }
  function updateRoleText() {
    $("sideName").textContent = me.username;
    $("sideRole").textContent = isAdmin ? T("administrator") : deptLabel(me.department);
    $("roleChip").textContent = isAdmin ? T("super_admin") : T("department_role", { d: deptLabel(me.department) });
  }

  // ---------- LISTENERS ----------
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
      populateDeptSelectors(); refresh();
    }));
    const internQuery = isAdmin
      ? db.collection("internships")
      : db.collection("internships").where("departmentId", "==", me.department);
    unsub.push(internQuery.onSnapshot((s) => {
      internMap = {}; s.docs.forEach((d) => { internMap[d.id] = { id: d.id, ...d.data() }; });
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
      DEFAULT_DEPARTMENTS.forEach((name) => batch.set(db.collection("departments").doc(slug(name)), { name }));
      await batch.commit();
    }
  }

  // ---------- HELPERS ----------
  function slug(s) {
    const out = String(s).trim().replace(/[\/\\\s]+/g, "-").replace(/^-+|-+$/g, "");
    if (out) return out;
    let h = 0; const str = String(s);
    for (let i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
    return "d-" + Math.abs(h).toString(36);
  }
  function key(id, dept) { return `${id}__${slug(dept)}`; }
  function statusOf(id, dept) { const r = internMap[key(id, dept)]; return r ? r.status : "Pending"; }
  function noteOf(id, dept) { const r = internMap[key(id, dept)]; return r ? (r.note || "") : ""; }
  function statusLabel(s) { return s === "Completed" ? T("s_completed") : s === "Not Completed" ? T("s_notcompleted") : T("s_pending"); }
  const STAGES = ["Stage 1", "Stage 2"];
  const STAGE_KEY = { "Stage 1": "stage_1", "Stage 2": "stage_2", "Stage 3": "stage_3", "Stage 4": "stage_4" };
  function stageLabel(s) { return STAGE_KEY[s] ? T(STAGE_KEY[s]) : (s || "—"); }
  function timeLabel(x) { return x === "Morning" ? T("morning") : x === "Evening" ? T("evening") : x === "Parallel" ? T("parallel") : (x || "—"); }

  const MAJORS = ["IT", "Business Administration", "Accounting", "Banking", "Public Relations"];
  const MAJOR_KEY = { "IT": "major_it", "Business Administration": "major_admin", "Accounting": "major_accounting", "Banking": "major_bank", "Public Relations": "major_pr" };
  function majorLabel(s) { return MAJOR_KEY[s] ? T(MAJOR_KEY[s]) : (s || "—"); }

  const DEPT_KEY = { "کتێبخانە": "dept_library", "دارایی": "dept_finance", "گەنجینە": "dept_warehouse", "تۆمارگا": "dept_records", "بەشە ناوخۆیی": "dept_internal", "بەشەناوخۆیی": "dept_internal" };
  function deptLabel(d) { return DEPT_KEY[d] ? T(DEPT_KEY[d]) : (d || "—"); }

  async function quickSet(studentDocId, dept, status) {
    const s = students.find((x) => x.id === studentDocId); if (!s) return;
    const rec = {
      studentId: studentDocId, studentNumber: s.studentId, studentName: s.name,
      departmentId: dept, status, note: status === "Completed" ? "" : noteOf(studentDocId, dept),
      date: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: me.username
    };
    try { await db.collection("internships").doc(key(studentDocId, dept)).set(rec, { merge: true }); toast(T("to_status_saved"), "ok"); }
    catch (e) { toast(T("err_save") + e.message, "err"); }
  }
  function statusTag(s) {
    const cls = s === "Completed" ? "ok" : s === "Not Completed" ? "no" : "pending";
    return `<span class="tag ${cls}">${escapeHtml(statusLabel(s))}</span>`;
  }
  function fmtDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const loc = window.getLang && window.getLang() === "ku" ? "ckb" : undefined;
    try { return d.toLocaleDateString(loc, { year: "numeric", month: "short", day: "numeric" }); }
    catch (e) { return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
  }
  function toast(msg, type) {
    const t = $("toast"); t.textContent = msg; t.className = "toast show " + (type || "");
    setTimeout(() => (t.className = "toast"), 2600);
  }
  function emptyState(title, sub) {
    return `<div class="empty"><div class="emblem">SCMS</div><h4>${escapeHtml(title)}</h4><p>${escapeHtml(sub)}</p></div>`;
  }

  // ---------- RENDER ROUTER ----------
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

  function stat(k, v, opts) {
    opts = opts || {};
    const tone = opts.tone || "brand";
    const icon = opts.icon || "";
    return `<div class="stat stat-${tone}"><div class="stat-row">
      <div class="stat-ic">${icon}</div>
      <div class="stat-txt"><div class="k">${escapeHtml(k)}</div><div class="v tnum">${escapeHtml(String(v))}</div></div>
    </div></div>`;
  }
  function renderStats() {
    const grid = $("statGrid");
    if (isAdmin) {
      let completed = 0, total = 0;
      students.forEach((s) => departments.forEach((d) => { total++; if (statusOf(s.id, d) === "Completed") completed++; }));
      grid.innerHTML = stat(T("st_students"), students.length, { tone: "brand", icon: ICONS.students }) +
        stat(T("st_departments"), departments.length, { tone: "gold", icon: ICONS.departments }) +
        stat(T("st_pl_completed"), completed, { tone: "ok", icon: ICONS.completed }) +
        stat(T("st_total_slots"), total, { tone: "slate", icon: ICONS.slots });
    } else {
      const dept = me.department; let done = 0, no = 0, pend = 0;
      students.forEach((s) => { const st = statusOf(s.id, dept); if (st === "Completed") done++; else if (st === "Not Completed") no++; else pend++; });
      grid.innerHTML = stat(T("st_students"), students.length, { tone: "brand", icon: ICONS.students }) +
        stat(T("st_completed"), done, { tone: "ok", icon: ICONS.completed }) +
        stat(T("st_notcompleted"), no, { tone: "no", icon: ICONS.notcompleted }) +
        stat(T("st_pending"), pend, { tone: "pending", icon: ICONS.pending });
    }
  }

  function statusBar(done, total) {
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `<div class="prog"><div class="prog-track"><div class="prog-fill" style="width:${pct}%;"></div></div><span class="prog-pct">${pct}%</span></div>
      <div class="muted prog-meta">${T("pct_of", { p: pct, t: total })}</div>`;
  }
  function renderOverview() {
    const host = $("ovTable");
    if (isAdmin) {
      $("ovTableTitle").textContent = T("ov_glance");
      if (!departments.length) { host.innerHTML = emptyState(T("e_nodepts_t"), T("e_nodepts_s")); return; }
      const rows = departments.map((d) => {
        let done = 0, no = 0, pend = 0;
        students.forEach((s) => { const st = statusOf(s.id, d); if (st === "Completed") done++; else if (st === "Not Completed") no++; else pend++; });
        return `<tr><td class="name" data-label="${T("c_department")}"><span class="dept-dot"></span>${escapeHtml(deptLabel(d))}</td><td class="cell-num ok" data-label="${T("c_completed")}">${done}</td><td class="cell-num no" data-label="${T("c_notcompleted")}">${no}</td><td class="cell-num pending" data-label="${T("c_pending")}">${pend}</td><td class="prog-cell" data-label="${T("c_progress")}">${statusBar(done, students.length)}</td></tr>`;
      }).join("");
      host.innerHTML = `<table class="list-table"><thead><tr><th>${T("c_department")}</th><th class="num-col">${T("c_completed")}</th><th class="num-col">${T("c_notcompleted")}</th><th class="num-col">${T("c_pending")}</th><th style="width:160px;">${T("c_progress")}</th></tr></thead><tbody>${rows}</tbody></table>`;
    } else {
      const dept = me.department;
      $("ovTableTitle").textContent = T("ov_recent", { d: deptLabel(dept) });
      const recent = students.map((s) => ({ s, r: internMap[key(s.id, dept)] }))
        .filter((x) => x.r)
        .sort((a, b) => (((b.r.date && b.r.date.seconds) || Infinity)) - (((a.r.date && a.r.date.seconds) || Infinity)))
        .slice(0, 8);
      if (!recent.length) { host.innerHTML = emptyState(T("e_noupd_t"), T("e_noupd_s")); return; }
      const rows = recent.map(({ s, r }) =>
        `<tr><td class="name" data-label="${T("c_student")}">${escapeHtml(s.name)}</td><td class="id" data-label="${T("c_id")}">${escapeHtml(s.studentId)}</td><td data-label="${T("c_major")}">${escapeHtml(majorLabel(s.major))}</td><td data-label="${T("c_stage")}">${escapeHtml(stageLabel(s.stage))}</td><td data-label="${T("c_status")}">${statusTag(r.status)}</td><td class="note-text" data-label="${T("c_note")}">${escapeHtml(r.note || "—")}</td><td class="muted" data-label="${T("c_updated")}">${fmtDate(r.date)}</td></tr>`).join("");
      host.innerHTML = `<table class="list-table"><thead><tr><th>${T("c_student")}</th><th>${T("c_id")}</th><th>${T("c_major")}</th><th>${T("c_stage")}</th><th>${T("c_status")}</th><th>${T("c_note")}</th><th>${T("c_updated")}</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
  }

  function renderStudents() {
    const q = ($("studentSearch").value || "").toLowerCase().trim();
    const tf = $("studentTimeFilter").value;
    const mf = ($("studentMajorFilter") || {}).value || "";
    const sf = ($("studentStageFilter") || {}).value || "";
    const list = students.filter((s) =>
      (!q || (s.name || "").toLowerCase().includes(q) || String(s.studentId || "").toLowerCase().includes(q)) &&
      (!tf || s.time === tf) && (!mf || s.major === mf) && (!sf || s.stage === sf));
    const sel = $("studentMajorFilter");
    if (sel) {
      const extra = Array.from(new Set(students.map((s) => s.major).filter((m) => m && !MAJORS.includes(m))));
      const cur = sel.value;
      sel.innerHTML = `<option value="">${T("all_majors")}</option>` +
        MAJORS.map((m) => `<option value="${escapeHtml(m)}">${escapeHtml(majorLabel(m))}</option>`).join("") +
        extra.map((m) => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("");
      if ([...sel.options].some((o) => o.value === cur)) sel.value = cur;
    }
    const ssel = $("studentStageFilter");
    if (ssel) {
      const allStages = STAGES.concat(Array.from(new Set(students.map((s) => s.stage).filter((v) => v && !STAGES.includes(v)))));
      const cur = ssel.value;
      ssel.innerHTML = `<option value="">${T("all_stages")}</option>` +
        allStages.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(stageLabel(v))}</option>`).join("");
      if ([...ssel.options].some((o) => o.value === cur)) ssel.value = cur;
    }
    const host = $("studentsTable");
    if (!students.length) { host.innerHTML = emptyState(T("e_nostudents_t"), T("e_nostudents_s")); return; }
    if (!list.length) { host.innerHTML = emptyState(T("e_nomatch_t"), T("e_nomatch_s")); return; }
    const rows = list.map((s) => `<tr>
      <td data-label="${T("c_fullname")}"><div class="name">${escapeHtml(s.name)}</div></td>
      <td class="id" data-label="${T("c_studentid")}">${escapeHtml(s.studentId)}</td>
      <td data-label="${T("c_major")}">${escapeHtml(majorLabel(s.major))}</td>
      <td data-label="${T("c_stage")}">${escapeHtml(stageLabel(s.stage))}</td>
      <td data-label="${T("c_studytime")}"><span class="chip">${escapeHtml(timeLabel(s.time))}</span></td>
      <td class="actions-cell"><div class="row-actions">
        <button class="btn ghost sm" data-edit-student="${s.id}">${T("edit")}</button>
        <button class="btn danger sm" data-del-student="${s.id}">${T("del")}</button>
      </div></td></tr>`).join("");
    host.innerHTML = `<table class="list-table"><thead><tr><th>${T("c_fullname")}</th><th>${T("c_studentid")}</th><th>${T("c_major")}</th><th>${T("c_stage")}</th><th>${T("c_studytime")}</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function renderInternships() {
    const dept = isAdmin ? activeDept : me.department;
    if (isAdmin) { $("internHeading").textContent = dept ? T("h_marking", { d: deptLabel(dept) }) : T("h_intern_records"); }
    else { $("internHeading").textContent = ""; }
    const host = $("internTable");
    if (isAdmin && !dept) { host.innerHTML = emptyState(T("e_choose_t"), T("e_choose_s")); return; }
    if (!students.length) { host.innerHTML = emptyState(isAdmin ? T("e_nostudents_t") : T("e_nostud_dept_s"), isAdmin ? T("e_nostud_admin_s") : ""); return; }
    const q = ($("internSearch").value || "").toLowerCase().trim();
    const sf = $("internStatusFilter").value;
    const list = students.filter((s) => {
      const st = statusOf(s.id, dept);
      return (!q || (s.name || "").toLowerCase().includes(q) || String(s.studentId || "").toLowerCase().includes(q)) && (!sf || st === sf);
    });
    if (!list.length) { host.innerHTML = emptyState(T("e_nomatch_t"), T("e_nomatch_s")); return; }
    const rows = list.map((s) => {
      const r = internMap[key(s.id, dept)];
      const cur = statusOf(s.id, dept);
      return `<tr>
        <td data-label="${T("c_student")}"><div class="name">${escapeHtml(s.name)}</div><div class="id">${s.major ? escapeHtml(majorLabel(s.major)) : ""}${s.stage ? " · " + escapeHtml(stageLabel(s.stage)) : ""}</div></td>
        <td class="id" data-label="${T("c_id")}">${escapeHtml(s.studentId)}</td>
        <td data-label="${T("c_status")}">${statusTag(cur)}</td>
        <td class="note-text" data-label="${T("c_note")}">${escapeHtml(noteOf(s.id, dept) || "—")}</td>
        <td class="muted" data-label="${T("c_updated")}">${r ? fmtDate(r.date) : "—"}</td>
        <td class="actions-cell"><div class="row-actions">
          <button class="btn sm ${cur === "Completed" ? "" : "ghost"}" data-quick="${s.id}" data-status="Completed">${T("s_completed")}</button>
          <button class="btn sm ${cur === "Not Completed" ? "danger" : "ghost"}" data-quick="${s.id}" data-status="Not Completed">${T("s_notcompleted")}</button>
          <button class="btn ghost sm" data-mark="${s.id}">${T("btn_note")}</button>
        </div></td>
      </tr>`;
    }).join("");
    host.innerHTML = `<table class="list-table"><thead><tr><th>${T("c_student")}</th><th>${T("c_id")}</th><th>${T("c_status")}</th><th>${T("c_note")}</th><th>${T("c_updated")}</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function renderDepartments() {
    const host = $("deptTable");
    if (!departments.length) { host.innerHTML = emptyState(T("e_nodept2_t"), T("e_nodept2_s")); return; }
    const rows = departments.map((d) => {
      const linked = accounts.filter((a) => a.role === "department" && a.department === d).length;
      return `<tr><td class="name">${escapeHtml(deptLabel(d))}</td>
        <td>${linked ? `<span class="chip">${T("n_accounts", { n: linked })}</span>` : `<span class="muted">${T("no_account")}</span>`}</td>
        <td><div class="row-actions"><button class="btn danger sm" data-del-dept="${escapeHtml(d)}">${T("remove")}</button></div></td></tr>`;
    }).join("");
    host.innerHTML = `<table><thead><tr><th>${T("c_department")}</th><th>${T("c_accounts")}</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function renderAccounts() {
    const host = $("accountsTable");
    if (!accounts.length) { host.innerHTML = emptyState(T("e_noacc_t"), T("e_noacc_s")); return; }
    const rows = accounts.slice().sort((a, b) => (a.role || "").localeCompare(b.role || "")).map((a) => `<tr>
      <td class="name">${escapeHtml(a.username)}</td>
      <td>${a.role === "admin" ? `<span class="tag gold">${T("role_admin")}</span>` : `<span class="chip">${a.department ? escapeHtml(deptLabel(a.department)) : "—"}</span>`}</td>
      <td><div class="row-actions">${a.uid === me.uid ? `<span class="muted" style="font-size:12px;">${T("you")}</span>` : `<button class="btn danger sm" data-del-account="${a.uid}">${T("remove")}</button>`}</div></td>
    </tr>`).join("");
    host.innerHTML = `<table><thead><tr><th>${T("c_username")}</th><th>${T("c_role")}</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function legendRow(color, label, val) {
    return `<div style="display:flex;align-items:center;gap:8px;font-size:13px;">
      <span style="width:12px;height:12px;border-radius:3px;background:${color};display:inline-block;"></span>
      <b style="color:var(--ink);">${val}</b> <span class="muted">${escapeHtml(label)}</span></div>`;
  }
  function donutSvg(parts) {
    const total = parts.reduce((a, p) => a + p.value, 0) || 1;
    const r = 52, c = 2 * Math.PI * r; let offset = 0;
    const segs = parts.map((p) => {
      const len = p.value / total * c;
      const seg = `<circle cx="70" cy="70" r="${r}" fill="none" style="stroke:${p.color}" stroke-width="20" stroke-dasharray="${len.toFixed(2)} ${(c - len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 70 70)"/>`;
      offset += len; return seg;
    }).join("");
    return `<svg viewBox="0 0 140 140" width="140" height="140" style="flex:none;">${segs}
      <text x="70" y="66" text-anchor="middle" style="font-family:var(--display);font-size:24px;font-weight:700;fill:var(--ink);">${total}</text>
      <text x="70" y="86" text-anchor="middle" style="font-size:10px;fill:var(--muted);">${escapeHtml(T("st_total_slots"))}</text></svg>`;
  }
  function renderAnalytics(filterDept) {
    const host = $("reportAnalytics");
    if (!host) return;
    if (!students.length) { host.innerHTML = ""; return; }

    if (isAdmin && !filterDept) {
      let cleared = 0;
      students.forEach((s) => { if (departments.length && departments.every((d) => statusOf(s.id, d) === "Completed")) cleared++; });
      const remaining = students.length - cleared;
      let c = 0, n = 0, p = 0;
      students.forEach((s) => departments.forEach((d) => { const st = statusOf(s.id, d); if (st === "Completed") c++; else if (st === "Not Completed") n++; else p++; }));

      const cards = `<div class="stat-grid" style="margin-bottom:16px;">
        ${stat(T("an_cleared"), cleared, { tone: "brand", icon: ICONS.students })}${stat(T("an_remaining"), remaining, { tone: "slate", icon: ICONS.slots })}${stat(T("st_completed"), c, { tone: "ok", icon: ICONS.completed })}${stat(T("st_pending"), p, { tone: "pending", icon: ICONS.pending })}</div>`;

      const donutCard = `<div class="card"><div class="card-head"><h3>${T("an_overall")}</h3></div>
        <div class="card-body" style="display:flex;gap:22px;align-items:center;flex-wrap:wrap;">
          ${donutSvg([{ value: c, color: "var(--ok)" }, { value: n, color: "var(--no)" }, { value: p, color: "var(--pending)" }])}
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${legendRow("var(--ok)", T("s_completed"), c)}
            ${legendRow("var(--no)", T("s_notcompleted"), n)}
            ${legendRow("var(--pending)", T("s_pending"), p)}
          </div></div></div>`;

      const bars = departments.map((d) => {
        let dc = 0; students.forEach((s) => { if (statusOf(s.id, d) === "Completed") dc++; });
        const pct = students.length ? Math.round(dc / students.length * 100) : 0;
        return `<div style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;">
            <span class="name">${escapeHtml(deptLabel(d))}</span><span class="muted">${dc}/${students.length}</span></div>
          <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:999px;height:10px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:var(--ok);"></div></div></div>`;
      }).join("");
      const barCard = `<div class="card"><div class="card-head"><h3>${T("an_by_dept")}</h3></div><div class="card-body">${bars}</div></div>`;

      host.innerHTML = cards + `<div class="grid-2" style="align-items:start;margin-bottom:22px;">${donutCard}${barCard}</div>`;
    } else {
      const dept = filterDept; let c = 0, n = 0, p = 0;
      students.forEach((s) => { const st = statusOf(s.id, dept); if (st === "Completed") c++; else if (st === "Not Completed") n++; else p++; });
      host.innerHTML = `<div class="stat-grid" style="margin-bottom:18px;">
        ${stat(T("st_completed"), c, { tone: "ok", icon: ICONS.completed })}${stat(T("st_notcompleted"), n, { tone: "no", icon: ICONS.notcompleted })}${stat(T("st_pending"), p, { tone: "pending", icon: ICONS.pending })}${stat(T("st_students"), students.length, { tone: "brand", icon: ICONS.students })}</div>`;
    }
  }

  function renderReport() {
    const host = $("reportTable");
    const filterDept = isAdmin ? $("reportDeptFilter").value : me.department;
    const sf = ($("reportStatusFilter") || {}).value || "";
    $("reportHeading").textContent = !isAdmin ? "" : (filterDept ? T("h_report_dept", { d: deptLabel(filterDept) }) : T("h_report_full"));
    renderAnalytics(filterDept);
    if (!students.length) { host.innerHTML = emptyState(T("e_norep_t"), isAdmin ? T("e_norep_s") : ""); return; }
    if (isAdmin && !filterDept) {
      const head = `<th>${T("c_student")}</th><th>${T("c_id")}</th><th>${T("c_major")}</th><th>${T("c_stage")}</th><th>${T("c_studytime")}</th>` +
        departments.map((d) => `<th class="matrix-cell">${escapeHtml(deptLabel(d))}</th>`).join("");
      const list = sf ? students.filter((s) => departments.some((d) => statusOf(s.id, d) === sf)) : students;
      if (!list.length) { host.innerHTML = emptyState(T("e_nomatch_t"), T("e_nomatch_s")); return; }
      const rows = list.map((s) => {
        const cells = departments.map((d) => `<td class="matrix-cell">${statusTag(statusOf(s.id, d))}</td>`).join("");
        return `<tr><td class="name">${escapeHtml(s.name)}</td><td class="id">${escapeHtml(s.studentId)}</td><td>${escapeHtml(majorLabel(s.major))}</td><td>${escapeHtml(stageLabel(s.stage))}</td><td>${escapeHtml(timeLabel(s.time))}</td>${cells}</tr>`;
      }).join("");
      host.innerHTML = `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
    } else {
      const dept = filterDept;
      const list = sf ? students.filter((s) => statusOf(s.id, dept) === sf) : students;
      if (!list.length) { host.innerHTML = emptyState(T("e_nomatch_t"), T("e_nomatch_s")); return; }
      const rows = list.map((s) => `<tr>
        <td class="name" data-label="${T("c_student")}">${escapeHtml(s.name)}</td><td class="id" data-label="${T("c_id")}">${escapeHtml(s.studentId)}</td>
        <td data-label="${T("c_major")}">${escapeHtml(majorLabel(s.major))}</td><td data-label="${T("c_stage")}">${escapeHtml(stageLabel(s.stage))}</td><td data-label="${T("c_studytime")}">${escapeHtml(timeLabel(s.time))}</td>
        <td data-label="${T("c_status")}">${statusTag(statusOf(s.id, dept))}</td><td class="note-text" data-label="${T("c_note")}">${escapeHtml(noteOf(s.id, dept) || "—")}</td></tr>`).join("");
      host.innerHTML = `<table class="list-table"><thead><tr><th>${T("c_student")}</th><th>${T("c_id")}</th><th>${T("c_major")}</th><th>${T("c_stage")}</th><th>${T("c_studytime")}</th><th>${T("c_status")}</th><th>${T("c_note")}</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
  }

  // ---------- CSV / PRINT ----------
  function exportCsv() {
    const filterDept = isAdmin ? $("reportDeptFilter").value : me.department;
    let header, rows;
    if (isAdmin && !filterDept) {
      header = [T("c_fullname"), T("c_studentid"), T("c_major"), T("c_stage"), T("c_studytime"), ...departments.map(deptLabel)];
      rows = students.map((s) => [s.name, s.studentId, majorLabel(s.major), stageLabel(s.stage), timeLabel(s.time), ...departments.map((d) => statusLabel(statusOf(s.id, d)))]);
    } else {
      const dept = filterDept;
      header = [T("c_fullname"), T("c_studentid"), T("c_major"), T("c_stage"), T("c_studytime"), T("c_department"), T("c_status"), T("c_note")];
      rows = students.map((s) => [s.name, s.studentId, majorLabel(s.major), stageLabel(s.stage), timeLabel(s.time), deptLabel(dept), statusLabel(statusOf(s.id, dept)), noteOf(s.id, dept)]);
    }
    const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `IMS_report_${filterDept ? slug(filterDept) : "all"}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(a.href); toast(T("to_csv_exported"), "ok");
  }
  function csvCell(v) { const s = String(v ?? ""); return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }
  function printReport() {
    const filterDept = isAdmin ? $("reportDeptFilter").value : me.department;
    const title = filterDept ? T("h_report_dept", { d: deptLabel(filterDept) }) : T("h_report_full");
    const tableHTML = $("reportTable").innerHTML;
    const rtl = !(window.getLang && window.getLang() === "en");
    const w = window.open("", "_blank");
    if (!w) { toast(T("err_popup") || "Please allow pop-ups to print", "err"); return; }
    w.document.write(`<!DOCTYPE html><html lang="${rtl ? "ckb" : "en"}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${escapeHtml(title)}</title>
      <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        *{box-sizing:border-box;}
        body{font-family:'Vazirmatn','Segoe UI',Tahoma,sans-serif;padding:22px;color:#15233f;margin:0;}
        h1{font-size:20px;margin:0 0 4px;}
        .meta{color:#666;font-size:12px;margin-bottom:14px;border-bottom:2px solid #c2962f;padding-bottom:8px;}
        table{border-collapse:collapse;width:100%;font-size:12px;}
        th,td{border:1px solid #d7dded;padding:6px 8px;text-align:${rtl ? "right" : "left"};}
        th{background:#243b6b;color:#fff;white-space:nowrap;}
        tr:nth-child(even) td{background:#f5f7fb;}
        .tag{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;}
        .tag.ok{background:#e7f4ed;color:#1f8a52;}
        .tag.no{background:#fbe9e7;color:#c33a2c;}
        .tag.pending{background:#fbf1dc;color:#a9791c;}
        .id{direction:ltr;}
        td::before{display:none !important;}
        .bar{display:flex;gap:10px;justify-content:flex-end;margin-bottom:16px;position:sticky;top:0;}
        .bar button{font-family:inherit;font-size:15px;font-weight:600;padding:11px 20px;border-radius:10px;border:1px solid #d7dded;cursor:pointer;}
        .bar .go{background:#243b6b;color:#fff;border-color:#243b6b;}
        .bar .cl{background:#fff;color:#15233f;}
        @media print{body{padding:0;} .bar{display:none !important;}}
      </style></head><body>
      <div class="bar">
        <button class="go" onclick="window.print()">🖨️ ${escapeHtml(T("print") || "Print")}</button>
        <button class="cl" onclick="window.close()">✕ ${escapeHtml(T("close") || "Close")}</button>
      </div>
      <h1>${escapeHtml(title)}</h1>
      <div class="meta">${escapeHtml(T("brand_sub"))} · ${new Date().toLocaleString()}</div>
      ${tableHTML}
      </body></html>`);
    w.document.close();
  }

  // ---------- BACKUP / RESET / IMPORT (admin) ----------
  function backupAll() {
    const data = {
      app: "IMS", exportedAt: new Date().toISOString(),
      departments: departments.slice(),
      students: students.map((s) => ({ id: s.id, name: s.name, studentId: s.studentId, major: s.major, stage: s.stage, time: s.time })),
      internships: Object.values(internMap).map((r) => ({ id: r.id, studentId: r.studentId, studentNumber: r.studentNumber, studentName: r.studentName, departmentId: r.departmentId, status: r.status, note: r.note || "", updatedBy: r.updatedBy || "" })),
      users: accounts.map((a) => ({ uid: a.uid, username: a.username, role: a.role, department: a.department || "" }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `IMS_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(a.href); toast(T("to_backup_done"), "ok");
  }

  async function deleteAllInChunks(docs) {
    for (let i = 0; i < docs.length; i += 400) {
      const batch = db.batch();
      docs.slice(i, i + 400).forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
  }
  async function resetAll() {
    const sSnap = await db.collection("students").get();
    const iSnap = await db.collection("internships").get();
    await deleteAllInChunks(iSnap.docs.map((d) => d.ref));
    await deleteAllInChunks(sSnap.docs.map((d) => d.ref));
    toast(T("to_reset_done"), "ok");
  }

  async function restoreFromFile(file) {
    const text = await file.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error(T("restore_bad")); }
    if (!data || !Array.isArray(data.students)) throw new Error(T("restore_bad"));

    // restore departments (merge)
    if (Array.isArray(data.departments) && data.departments.length) {
      const b = db.batch();
      data.departments.forEach((name) => { if (name) b.set(db.collection("departments").doc(slug(name)), { name }); });
      await b.commit();
    }
    // restore students, keeping a map from old id -> new id
    const idMap = {};
    for (let i = 0; i < data.students.length; i += 400) {
      const b = db.batch();
      data.students.slice(i, i + 400).forEach((s) => {
        const ref = db.collection("students").doc();
        idMap[s.id] = ref.id;
        b.set(ref, { name: s.name || "", studentId: s.studentId || "", major: s.major || "", stage: s.stage || "", time: s.time || "Morning" });
      });
      await b.commit();
    }
    // restore internship records, remapped to new student ids
    const recs = Array.isArray(data.internships) ? data.internships : [];
    for (let i = 0; i < recs.length; i += 400) {
      const b = db.batch();
      recs.slice(i, i + 400).forEach((r) => {
        const newSid = idMap[r.studentId];
        if (!newSid || !r.departmentId) return;
        b.set(db.collection("internships").doc(key(newSid, r.departmentId)), {
          studentId: newSid, studentNumber: r.studentNumber || "", studentName: r.studentName || "",
          departmentId: r.departmentId, status: r.status || "Pending", note: r.note || "",
          date: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: r.updatedBy || me.username
        }, { merge: true });
      });
      await b.commit();
    }
    toast(T("to_restore_done", { n: data.students.length }), "ok");
  }
  function restoreModal() {
    openModal(`
      <div class="modal-head"><h3>${T("m_restore_title")}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div id="mErr" class="alert err"></div>
        <p class="muted" style="margin-top:0;font-size:13.5px;">${escapeHtml(T("restore_msg"))}</p>
        <div class="field"><label>${T("restore_pick")}</label><input type="file" id="restFile" accept=".json,application/json" /></div>
      </div>
      <div class="modal-foot"><button class="btn ghost" data-close>${T("cancel")}</button>
        <button class="btn" id="restGo">${T("btn_restore")}</button></div>`);
    $("restGo").addEventListener("click", async () => {
      const f = $("restFile").files[0];
      if (!f) { showModalErr(T("restore_bad")); return; }
      const b = $("restGo"); b.disabled = true; b.innerHTML = '<span class="spin"></span> ' + T("creating");
      try { await restoreFromFile(f); closeModal(); }
      catch (e) { showModalErr(e.message); b.disabled = false; b.textContent = T("btn_restore"); }
    });
  }

  // value normalisers (accept Kurdish or English)
  function normMajor(v) {
    const x = String(v || "").trim().toLowerCase();
    if (/it|ئایتی|ايتي|تەکنەلۆژیا/.test(x)) return "IT";
    // Check the SPECIFIC majors before the generic "management/کارگێ" word,
    // otherwise "کارگێری بانک" (Banking) is wrongly caught by the کارگێ rule.
    if (/bank|بانک/.test(x)) return "Banking";
    if (/account|ژمێر|محاسب|حساب/.test(x)) return "Accounting";
    if (/public|relation|پەیوەند|گشتی|علاقات/.test(x)) return "Public Relations";
    if (/admin|کارگێ|كارگێ|بەڕێوەبردن|اداره/.test(x)) return "Business Administration";
    return String(v || "").trim();
  }
  function normStage(v) {
    const x = String(v || "").trim().toLowerCase();
    if (/(^|[^\d])2|دوو|ثاني|second/.test(x)) return "Stage 2";
    if (/(^|[^\d])1|یەک|یه‌ک|اول|first/.test(x)) return "Stage 1";
    return String(v || "").trim();
  }
  function normTime(v) {
    const x = String(v || "").trim().toLowerCase();
    if (/parallel|پارال|پارالێل|موازي/.test(x)) return "Parallel";
    if (/even|ئێوار|ايوار|مساء|عصر/.test(x)) return "Evening";
    if (/morn|بەیان|به‌یان|صباح/.test(x)) return "Morning";
    return "Morning";
  }
  function parseCsv(text) {
    const rows = []; let row = [], cur = "", q = false;
    text = text.replace(/^\uFEFF/, "");
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') q = false;
        else cur += ch;
      } else {
        if (ch === '"') q = true;
        else if (ch === ",") { row.push(cur); cur = ""; }
        else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
        else if (ch === "\r") { /* ignore */ }
        else cur += ch;
      }
    }
    if (cur.length || row.length) { row.push(cur); rows.push(row); }
    return rows.filter((r) => r.some((c) => String(c).trim() !== ""));
  }
  function downloadTemplate() {
    const header = [T("c_fullname"), T("c_studentid"), T("c_major"), T("c_stage"), T("c_studytime")];
    const sample = ["Sara Ahmed", "2026001", "IT", "Stage 1", "Morning"];
    const csv = [header, sample].map((r) => r.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "IMS_students_template.csv"; a.click(); URL.revokeObjectURL(a.href);
  }
  // Parse a CSV/XLSX file into validated rows (no writing yet).
  async function parseImportFile(file) {
    const name = (file.name || "").toLowerCase();
    let rows;
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      if (typeof XLSX === "undefined") throw new Error("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }).map((r) => r.map((c) => String(c)));
      rows = rows.filter((r) => r.some((c) => String(c).trim() !== ""));
    } else {
      const text = await file.text();
      rows = parseCsv(text);
    }
    if (!rows.length) return [];
    const first = rows[0].map((c) => String(c).toLowerCase());
    const looksHeader = first.some((c) => /name|ناو|id|ناسنامه|ناسنامە|major|بەش|stage|قۆناغ|time|کات/.test(c));
    if (looksHeader) rows = rows.slice(1);
    return rows.filter((r) => (r[0] || "").trim() && (r[1] || "").trim());
  }

  // Write the parsed rows to Firestore (upsert by student ID).
  async function commitImport(valid) {
    for (let i = 0; i < valid.length; i += 400) {
      const batch = db.batch();
      valid.slice(i, i + 400).forEach((r) => {
        const sid = String(r[1]).trim();
        const existing = students.find((s) => String(s.studentId || "").trim() === sid);
        const ref = existing ? db.collection("students").doc(existing.id) : db.collection("students").doc();
        batch.set(ref, {
          name: String(r[0]).trim(), studentId: sid,
          major: normMajor(r[2]), stage: normStage(r[3]), time: normTime(r[4])
        });
      });
      await batch.commit();
    }
    toast(T("to_import_done", { n: valid.length }), "ok");
  }

  // Show a preview of what will be imported before writing anything.
  function previewImport(valid) {
    let newCount = 0, updCount = 0, warn = 0;
    const rowsHtml = valid.map((r, i) => {
      const sid = String(r[1]).trim();
      const existing = students.find((s) => String(s.studentId || "").trim() === sid);
      if (existing) updCount++; else newCount++;
      const major = normMajor(r[2]), stage = normStage(r[3]), time = normTime(r[4]);
      const mOk = MAJORS.includes(major), tOk = ["Morning", "Evening", "Parallel"].includes(time);
      const flagged = !mOk || !tOk; if (flagged) warn++;
      return `<tr class="${flagged ? "warn-row" : ""}">
        <td>${i + 1}</td>
        <td>${escapeHtml(String(r[0]).trim())}</td>
        <td class="id">${escapeHtml(sid)}</td>
        <td>${escapeHtml(majorLabel(major))}</td>
        <td>${escapeHtml(stageLabel(stage))}</td>
        <td>${escapeHtml(timeLabel(time))}</td>
        <td>${existing ? T("imp_update") : T("imp_new")}</td></tr>`;
    }).join("");
    openModal(`
      <div class="modal-head"><h3>${T("imp_preview_title")}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div class="imp-summary">
          <span class="tag ok">${T("imp_new")}: ${newCount}</span>
          <span class="tag pending">${T("imp_update")}: ${updCount}</span>
          ${warn ? `<span class="tag no">${T("imp_warn")}: ${warn}</span>` : ""}
        </div>
        <div class="table-wrap" style="max-height:62vh;overflow:auto;margin-top:12px;">
          <table><thead><tr><th>#</th><th>${T("c_fullname")}</th><th>${T("c_studentid")}</th><th>${T("c_major")}</th><th>${T("c_stage")}</th><th>${T("c_studytime")}</th><th>${T("imp_action")}</th></tr></thead>
          <tbody>${rowsHtml}</tbody></table>
        </div>
        ${warn ? `<p class="muted" style="font-size:12.5px;margin-top:10px;">${escapeHtml(T("imp_warn_hint"))}</p>` : ""}
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-close>${T("cancel")}</button>
        <button class="btn" id="impConfirm">${T("imp_confirm")} (${valid.length})</button>
      </div>`, "xwide");
    $("impConfirm").addEventListener("click", async () => {
      const b = $("impConfirm"); b.disabled = true; b.innerHTML = '<span class="spin"></span> ' + T("creating");
      try { await commitImport(valid); closeModal(); }
      catch (e) { showModalErr(T("err_save") + e.message); b.disabled = false; b.textContent = T("imp_confirm"); }
    });
  }
  function importModal() {
    openModal(`
      <div class="modal-head"><h3>${T("m_import_title")}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div id="mErr" class="alert err"></div>
        <p class="muted" style="margin-top:0;font-size:13.5px;">${escapeHtml(T("import_help"))}</p>
        <button class="btn ghost" id="tplBtn" style="margin-bottom:14px;">${T("download_template")}</button>
        <div class="field"><label>${T("import_pick")}</label><input type="file" id="impFile" accept=".csv,.xlsx,.xls,text/csv" /></div>
      </div>
      <div class="modal-foot"><button class="btn ghost" data-close>${T("cancel")}</button>
        <button class="btn" id="impGo">${T("btn_preview")}</button></div>`);
    $("tplBtn").addEventListener("click", downloadTemplate);
    $("impGo").addEventListener("click", async () => {
      const f = $("impFile").files[0];
      if (!f) { showModalErr(T("import_none")); return; }
      const b = $("impGo"); b.disabled = true; b.innerHTML = '<span class="spin"></span> ' + T("creating");
      try {
        const valid = await parseImportFile(f);
        if (!valid.length) { showModalErr(T("import_none")); b.disabled = false; b.textContent = T("btn_preview"); return; }
        previewImport(valid);
      } catch (e) { showModalErr(T("err_save") + e.message); b.disabled = false; b.textContent = T("btn_preview"); }
    });
  }
  function resetModal() {
    openModal(`
      <div class="modal-head"><h3>${T("m_reset_title")}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div id="mErr" class="alert err"></div>
        <p style="margin-top:0;">${escapeHtml(T("reset_msg"))}</p>
        <div class="field"><label>${T("reset_type_hint")}</label><input id="resetWord" placeholder="DELETE" /></div>
      </div>
      <div class="modal-foot"><button class="btn ghost" data-close>${T("cancel")}</button>
        <button class="btn danger" id="resetGo">${T("reset_all")}</button></div>`);
    $("resetGo").addEventListener("click", async () => {
      if (($("resetWord").value || "").trim().toUpperCase() !== "DELETE") { showModalErr(T("reset_type_hint")); return; }
      const b = $("resetGo"); b.disabled = true; b.innerHTML = '<span class="spin"></span>';
      try { await resetAll(); closeModal(); }
      catch (e) { showModalErr(T("err_delete") + e.message); b.disabled = false; b.textContent = T("reset_all"); }
    });
  }

  // ---------- MODALS ----------
  function openModal(html, extra) { $("modal").className = "modal" + (extra ? (extra === true ? " wide" : " " + extra) : ""); $("modal").innerHTML = html; $("modalBg").classList.add("show"); }
  function closeModal() { $("modalBg").classList.remove("show"); $("modal").innerHTML = ""; }
  function showModalErr(msg) { const e = $("mErr"); if (e) { e.textContent = msg; e.classList.add("show"); } }
  $("modalBg").addEventListener("click", (e) => { if (e.target === $("modalBg")) closeModal(); });

  function studentModal(existing) {
    const s = existing || {};
    openModal(`
      <div class="modal-head"><h3>${existing ? T("m_edit_student") : T("m_add_student")}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div id="mErr" class="alert err"></div>
        <div class="field"><label>${T("f_fullname")}</label><input id="m_name" value="${escapeHtml(s.name || "")}" placeholder="${escapeHtml(T("ph_name"))}" /></div>
        <div class="grid-2">
          <div class="field"><label>${T("f_studentid")}</label><input id="m_sid" value="${escapeHtml(s.studentId || "")}" placeholder="${escapeHtml(T("ph_sid"))}" /></div>
          <div class="field"><label>${T("f_major")}</label>
            <select id="m_major">
              <option value="" ${!s.major ? "selected" : ""}>${escapeHtml(T("ph_major_select"))}</option>
              ${MAJORS.map((mj) => `<option value="${escapeHtml(mj)}" ${s.major === mj ? "selected" : ""}>${escapeHtml(majorLabel(mj))}</option>`).join("")}
              ${s.major && !MAJORS.includes(s.major) ? `<option value="${escapeHtml(s.major)}" selected>${escapeHtml(s.major)}</option>` : ""}
            </select></div>
        </div>
        <div class="grid-2">
          <div class="field"><label>${T("f_stage")}</label>
            <select id="m_stage">
              <option value="" ${!s.stage ? "selected" : ""}>${escapeHtml(T("ph_stage_select"))}</option>
              ${STAGES.map((st) => `<option value="${st}" ${s.stage === st ? "selected" : ""}>${escapeHtml(stageLabel(st))}</option>`).join("")}
              ${s.stage && !STAGES.includes(s.stage) ? `<option value="${escapeHtml(s.stage)}" selected>${escapeHtml(s.stage)}</option>` : ""}
            </select></div>
          <div class="field"><label>${T("f_studytime")}</label>
            <div class="pills">
              <label><input type="radio" name="m_time" value="Morning" ${s.time === "Morning" || !s.time ? "checked" : ""}/> ${T("morning")}</label>
              <label><input type="radio" name="m_time" value="Evening" ${s.time === "Evening" ? "checked" : ""}/> ${T("evening")}</label>
              <label><input type="radio" name="m_time" value="Parallel" ${s.time === "Parallel" ? "checked" : ""}/> ${T("parallel")}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-foot"><button class="btn ghost" data-close>${T("cancel")}</button>
        <button class="btn" id="m_save">${existing ? T("save_changes") : T("btn_add_student")}</button></div>`);
    $("m_save").addEventListener("click", async () => {
      const data = {
        name: $("m_name").value.trim(), studentId: $("m_sid").value.trim(),
        major: $("m_major").value.trim(), stage: $("m_stage").value.trim(),
        time: (document.querySelector('input[name="m_time"]:checked') || {}).value || "Morning"
      };
      if (!data.name || !data.studentId) { showModalErr(T("err_name_required")); return; }
      try {
        if (existing) await db.collection("students").doc(existing.id).update(data);
        else await db.collection("students").add(data);
        closeModal(); toast(existing ? T("to_student_updated") : T("to_student_added"), "ok");
      } catch (e) { showModalErr(T("err_save") + e.message); }
    });
  }

  function markModal(student) {
    const dept = isAdmin ? activeDept : me.department;
    const cur = statusOf(student.id, dept), note = noteOf(student.id, dept);
    openModal(`
      <div class="modal-head"><h3>${T("m_intern_status")}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body">
        <div id="mErr" class="alert err"></div>
        <p class="muted" style="margin-top:0;"><b style="color:var(--ink);">${escapeHtml(student.name)}</b> · ${escapeHtml(student.studentId)}<br/>
          ${T("l_department")}: <span class="chip">${escapeHtml(deptLabel(dept))}</span></p>
        <div class="field"><label>${T("f_status")}</label><div class="pills">
          ${STATUSES.map((st) => `<label><input type="radio" name="m_status" value="${st}" ${cur === st ? "checked" : ""}/> ${statusLabel(st)}</label>`).join("")}
        </div></div>
        <div class="field"><label>${T("f_note")}</label><textarea id="m_note" placeholder="${escapeHtml(T("ph_note"))}">${escapeHtml(note)}</textarea></div>
      </div>
      <div class="modal-foot"><button class="btn ghost" data-close>${T("cancel")}</button>
        <button class="btn" id="m_savestatus">${T("save_status")}</button></div>`);
    $("m_savestatus").addEventListener("click", async () => {
      const status = (document.querySelector('input[name="m_status"]:checked') || {}).value;
      if (!status) { showModalErr(T("pick_status")); return; }
      const rec = {
        studentId: student.id, studentNumber: student.studentId, studentName: student.name,
        departmentId: dept, status, note: status === "Completed" ? "" : $("m_note").value.trim(),
        date: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: me.username
      };
      try { await db.collection("internships").doc(key(student.id, dept)).set(rec, { merge: true }); closeModal(); toast(T("to_status_saved"), "ok"); }
      catch (e) { showModalErr(T("err_save") + e.message); }
    });
  }

  function deptModal() {
    openModal(`
      <div class="modal-head"><h3>${T("m_add_dept")}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body"><div id="mErr" class="alert err"></div>
        <div class="field"><label>${T("f_deptname")}</label><input id="m_dept" placeholder="${escapeHtml(T("ph_deptname"))}" /></div></div>
      <div class="modal-foot"><button class="btn ghost" data-close>${T("cancel")}</button><button class="btn" id="m_adddept">${T("btn_add_dept")}</button></div>`);
    $("m_adddept").addEventListener("click", async () => {
      const name = $("m_dept").value.trim();
      if (!name) { showModalErr(T("err_deptname")); return; }
      if (departments.includes(name)) { showModalErr(T("err_dept_exists")); return; }
      try { await db.collection("departments").doc(slug(name)).set({ name }); closeModal(); toast(T("to_dept_added"), "ok"); }
      catch (e) { showModalErr(T("err_add") + e.message); }
    });
  }

  function accountModal() {
    openModal(`
      <div class="modal-head"><h3>${T("m_create_account")}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body"><div id="mErr" class="alert err"></div>
        <div class="field"><label>${T("f_role")}</label><div class="pills">
          <label><input type="radio" name="m_role" value="department" checked/> ${T("role_dept")}</label>
          <label><input type="radio" name="m_role" value="admin"/> ${T("role_admin")}</label>
        </div></div>
        <div class="field" id="deptWrap"><label>${T("f_dept")}</label>
          <select id="m_acc_dept">${departments.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(deptLabel(d))}</option>`).join("")}</select></div>
        <div class="field"><label>${T("c_username")}</label><input id="m_user" placeholder="finance" />
          <div class="hint">${T("signin_becomes", { e: `<span id="emailPreview">finance@${LOGIN_DOMAIN}</span>` })}</div></div>
        <div class="field"><label>${T("f_password")}</label><input id="m_pass" type="text" placeholder="${escapeHtml(T("ph_pass6"))}" /></div>
      </div>
      <div class="modal-foot"><button class="btn ghost" data-close>${T("cancel")}</button><button class="btn" id="m_addacc">${T("btn_create_account")}</button></div>`);
    document.querySelectorAll('input[name="m_role"]').forEach((r) => r.addEventListener("change", () => {
      $("deptWrap").style.display = document.querySelector('input[name="m_role"]:checked').value === "department" ? "" : "none";
    }));
    $("m_user").addEventListener("input", () => {
      const p = $("emailPreview"); if (p) p.textContent = `${($("m_user").value.trim().toLowerCase() || "username")}@${LOGIN_DOMAIN}`;
    });
    $("m_addacc").addEventListener("click", async () => {
      const role = document.querySelector('input[name="m_role"]:checked').value;
      const username = $("m_user").value.trim().toLowerCase();
      const password = $("m_pass").value;
      const department = role === "department" ? $("m_acc_dept").value : "";
      if (!username || !password) { showModalErr(T("err_user_pass")); return; }
      if (password.length < 6) { showModalErr(T("err_pass6")); return; }
      const btn = $("m_addacc"); btn.disabled = true; btn.innerHTML = '<span class="spin"></span> ' + T("creating");
      let secondary;
      try {
        secondary = firebase.initializeApp(firebaseConfig, "secondary-" + Date.now());
        const cred = await secondary.auth().createUserWithEmailAndPassword(usernameToEmail(username), password);
        await db.collection("users").doc(cred.user.uid).set({ username, role, department });
        await secondary.auth().signOut();
        closeModal(); toast(T("to_acc_created"), "ok");
      } catch (e) {
        const msg = e.code === "auth/email-already-in-use" ? T("err_user_taken") : e.code === "auth/weak-password" ? T("err_pass_weak") : (T("err_create") + e.message);
        showModalErr(msg);
      } finally { if (secondary) { try { await secondary.delete(); } catch (_) {} } btn.disabled = false; btn.textContent = T("btn_create_account"); }
    });
  }

  function confirmModal(title, body, onYes, danger) {
    openModal(`
      <div class="modal-head"><h3>${escapeHtml(title)}</h3><button class="x" data-close>&times;</button></div>
      <div class="modal-body"><p style="margin:0;">${body}</p></div>
      <div class="modal-foot"><button class="btn ghost" data-close>${T("cancel")}</button>
      <button class="btn ${danger ? "danger" : ""}" id="m_yes">${danger ? T("del") : T("save_changes")}</button></div>`);
    $("m_yes").addEventListener("click", onYes);
  }

  // ---------- EVENTS ----------
  $("nav").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-view]"); if (!a) return;
    e.preventDefault(); navigate(a.dataset.view); closeSidebar();
  });
  function navigate(view) {
    currentView = view;
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    const map = {
      overview: ["t_overview", isAdmin ? "s_overview" : "s_overview_dept"], students: ["t_students", "s_students"],
      internships: [isAdmin ? "t_internships" : "mydept_title", isAdmin ? "s_intern_admin" : "s_intern_dept"],
      accounts: ["t_accounts", "s_accounts"], reports: ["t_reports", isAdmin ? "s_reports" : ""]
    };
    const m = map[view] || ["", ""];
    $("pageTitle").textContent = T(m[0]); $("pageSub").textContent = T(m[1]);
    refresh();
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("[data-close]")) { closeModal(); return; }
    const editS = t.closest("[data-edit-student]");
    if (editS) { studentModal(students.find((s) => s.id === editS.dataset.editStudent)); return; }
    const delS = t.closest("[data-del-student]");
    if (delS) {
      const s = students.find((x) => x.id === delS.dataset.delStudent);
      confirmModal(T("m_delete_student"), T("msg_delete_student", { n: escapeHtml(s.name) }), async () => {
        try {
          const batch = db.batch();
          batch.delete(db.collection("students").doc(s.id));
          departments.forEach((d) => batch.delete(db.collection("internships").doc(key(s.id, d))));
          await batch.commit(); closeModal(); toast(T("to_student_deleted"), "ok");
        } catch (err) { showModalErr(T("err_delete") + err.message); }
      }, true);
      return;
    }
    const mark = t.closest("[data-mark]");
    if (mark) { markModal(students.find((s) => s.id === mark.dataset.mark)); return; }
    const quick = t.closest("[data-quick]");
    if (quick) {
      const dept = isAdmin ? activeDept : me.department;
      quickSet(quick.dataset.quick, dept, quick.dataset.status);
      return;
    }
    const delD = t.closest("[data-del-dept]");
    if (delD) {
      const name = delD.dataset.delDept;
      confirmModal(T("m_remove_dept"), T("msg_remove_dept", { d: escapeHtml(name) }), async () => {
        try { await db.collection("departments").doc(slug(name)).delete(); closeModal(); toast(T("to_dept_removed"), "ok"); }
        catch (err) { showModalErr(T("err_remove") + err.message); }
      }, true);
      return;
    }
    const delA = t.closest("[data-del-account]");
    if (delA) {
      confirmModal(T("m_remove_account"), T("msg_remove_account"), async () => {
        try { await db.collection("users").doc(delA.dataset.delAccount).delete(); closeModal(); toast(T("to_acc_removed"), "ok"); }
        catch (err) { showModalErr(T("err_remove") + err.message); }
      }, true);
      return;
    }
  });

  $("addStudentBtn").addEventListener("click", () => studentModal(null));
  { const b = $("importStudentsBtn"); if (b) b.addEventListener("click", importModal); }
  { const b = $("backupBtn"); if (b) b.addEventListener("click", backupAll); }
  { const b = $("restoreBtn"); if (b) b.addEventListener("click", restoreModal); }
  { const b = $("resetBtn"); if (b) b.addEventListener("click", resetModal); }
  $("addDeptBtn").addEventListener("click", deptModal);
  $("addAccountBtn").addEventListener("click", accountModal);
  $("printBtn").addEventListener("click", printReport);
  $("csvBtn").addEventListener("click", exportCsv);
  $("logoutBtn").addEventListener("click", async () => { unsub.forEach((u) => u && u()); await auth.signOut(); window.location.replace("index.html"); });

  $("studentSearch").addEventListener("input", renderStudents);
  { const mf = $("studentMajorFilter"); if (mf) mf.addEventListener("change", renderStudents); }
  { const sf = $("studentStageFilter"); if (sf) sf.addEventListener("change", renderStudents); }
  $("studentTimeFilter").addEventListener("change", renderStudents);
  $("internSearch").addEventListener("input", renderInternships);
  $("internStatusFilter").addEventListener("change", renderInternships);
  $("internDeptFilter").addEventListener("change", (e) => { activeDept = e.target.value; renderInternships(); });
  $("reportDeptFilter").addEventListener("change", renderReport);
  { const rsf = $("reportStatusFilter"); if (rsf) rsf.addEventListener("change", renderReport); }

  function populateDeptSelectors() {
    if (!isAdmin) return;
    const idf = $("internDeptFilter"), rdf = $("reportDeptFilter");
    if (idf) {
      const cur = idf.value || activeDept;
      idf.innerHTML = departments.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(deptLabel(d))}</option>`).join("");
      if (!activeDept && departments.length) activeDept = departments[0];
      idf.value = [...idf.options].some((o) => o.value === activeDept) ? activeDept : (departments[0] || "");
    }
    if (rdf) {
      const cur = rdf.value;
      rdf.innerHTML = `<option value="">${T("all_departments")}</option>` + departments.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(deptLabel(d))}</option>`).join("");
      if ([...rdf.options].some((o) => o.value === cur)) rdf.value = cur;
    }
  }

  function closeSidebar() { $("sidebar").classList.remove("open"); $("scrim").classList.remove("show"); }
  $("menuBtn").addEventListener("click", () => { $("sidebar").classList.add("open"); $("scrim").classList.add("show"); });
  $("scrim").addEventListener("click", closeSidebar);
})();
