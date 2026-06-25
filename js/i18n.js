/* ============================================================
   IMS — Bilingual (English / Kurdish) i18n + RTL handling
   Loaded before login.js / dashboard.js on every page.
   ============================================================ */
(function () {
  "use strict";

  const STR = {
    en: {
      app_name: "Student Clearance Management System",
      org_top: "Sulaimani Polytechnic University", org_sub: "Dukan Technical Institute", sys_name: "Student Clearance Management System",
      hero_tag: "A single, unified record for student clearance across every department.", hero_kicker: "Clearance Platform", show_password: "Show password", hide_password: "Hide password",
      super_admin: "Super Admin", administrator: "Administrator", department_role: "{d} unit",
      sign_out: "Sign out", cancel: "Cancel", you: "you",
      lang_label: "کوردی",

      // groups + nav
      g_workspace: "Workspace", g_admin: "Administration", g_insight: "Insight",
      nav_overview: "Overview", nav_students: "Students", nav_internships: "Internships",
      nav_mydept: "Student List", nav_accounts: "Departments & Accounts", nav_reports: "Reports",
      mydept_title: "Students", mydept_eyebrow: "Student status",

      // page titles / subs
      t_overview: "Overview", s_overview: "Snapshot of internship progress", s_overview_dept: "Information summary",
      t_students: "Students", s_students: "Register and manage student records",
      t_internships: "Internships", s_intern_admin: "Mark internship completion by department",
      s_intern_dept: "",
      t_accounts: "Departments & Accounts", s_accounts: "Manage departments and login access",
      t_reports: "Reports", s_reports: "Review, print and export internship records",

      // login
      login_title: "Sign in to your account", login_lead: "Administrators and department accounts both sign in here.",
      f_username: "Username", f_password: "Password",
      username_hint: "Use your account name only — no email needed.",
      ph_username: "admin", ph_password: "Your password", sign_in: "Sign in",
      hero_eyebrow: "College & Institute Edition",
      hero_title: "سیستەمی بەڕێوەبردنی ئەستۆپاکی خوێندکاران",
      hero_text: "One central record for student placements. Each department confirms its own completion status, while administrators see the full picture.",
      hero_foot: "Secure access · Role-based permissions",
      brand_sub: "Student Clearance Management System",
      err_invalid: "Incorrect username or password.", err_notfound: "No account found with that username.",
      err_toomany: "Too many attempts. Try again in a moment.", err_norole: "This account has no role assigned yet. Contact your administrator.",
      err_generic: "Could not sign in. Please try again.", signing_in: "Signing in…",

      // stats
      st_students: "Students", st_departments: "Departments", st_pl_completed: "Placements completed",
      st_total_slots: "Total placement slots", st_completed: "Completed", st_notcompleted: "Not completed", st_pending: "Pending review",

      // overview
      ov_glance: "Departments at a glance", ov_recent: "Recent updates — {d}",
      c_department: "Department", c_completed: "Completed", c_notcompleted: "Not completed",
      c_pending: "Pending", c_progress: "Progress", c_student: "Student", c_id: "ID",
      c_status: "Status", c_note: "Note", c_updated: "Updated",
      pct_of: "{p}% of {t}",
      e_nodepts_t: "No departments yet", e_nodepts_s: "Add one under Departments & Accounts.",
      e_noupd_t: "No updates", e_noupd_s: "",

      // students
      eb_registry: "Student Registry", h_all_students: "All students", add_student: "+ Add student",
      ph_search_student: "Search name or ID…", all_times: "All study times", morning: "Morning", evening: "Evening", parallel: "Parallel",
      c_fullname: "Full name", c_studentid: "Student ID", c_major: "Department / Major", c_stage: "Stage", c_studytime: "Study time",
      e_nostudents_t: "No students registered", e_nostudents_s: "",
      e_nomatch_t: "No matches", e_nomatch_s: "Try a different search or filter.", edit: "Edit", del: "Delete",

      // internships
      eb_status: "Internship Status", h_intern_records: "Internship records",
      h_marking: "Marking: {d}", h_mydept_status: "{d} — internship status",
      ph_search_only: "Search student…", all_statuses: "All statuses",
      s_completed: "Completed", s_notcompleted: "Not Completed", s_pending: "Pending",
      e_choose_t: "Choose a department", e_choose_s: "Pick a department above to mark internship status.",
      e_nostud_admin_s: "Add students first under the Students tab.",
      e_nostud_dept_s: "No students registered.",
      update: "Update",

      // accounts
      eb_admin: "Administration", h_accounts: "Departments & accounts",
      add_department: "+ Add department", create_account: "+ Create account",
      h_departments: "Departments", h_login_accounts: "Login accounts",
      c_accounts: "Accounts", no_account: "no account", n_accounts: "{n} account(s)",
      e_nodept2_t: "No departments", e_nodept2_s: "Add your first department.",
      e_noacc_t: "No accounts", e_noacc_s: "Create department login accounts.",
      c_username: "Username", c_role: "Role", remove: "Remove",

      // reports
      eb_reporting: "Reporting", h_report: "Internship report",
      h_report_dept: "{d} internship report", h_report_full: "Full internship report",
      all_departments: "All departments", print: "Print", export_csv: "Export CSV",
      e_norep_t: "No report available", e_norep_s: "Add students to generate a report.",

      // modals - student
      m_add_student: "Add student", m_edit_student: "Edit student",
      f_fullname: "Full name", f_studentid: "Student ID", f_major: "Department / Major",
      f_stage: "Stage", f_studytime: "Study time",
      stage_1: "Stage 1", stage_2: "Stage 2", stage_3: "Stage 3", stage_4: "Stage 4",
      ph_stage_select: "Select stage", btn_note: "Note", quick_hint: "Click to set status",
      ph_major_select: "Select department", all_majors: "All departments",
      major_it: "IT Department", major_admin: "Business Administration", major_accounting: "Accounting",
      major_bank: "Banking", major_pr: "Public Relations",
      dept_library: "Library", dept_finance: "Finance", dept_warehouse: "Treasury", dept_records: "Records Department", dept_internal: "Internal Affairs Department",
      an_overall: "Overall status", an_by_dept: "Completed by department",
      an_cleared: "Fully cleared students", an_remaining: "Students remaining",
      data_tools: "Data & backup", data_tools_hint: "Download a full backup of all data, or clear all students and records to start fresh.",
      backup_all: "Backup all data", restore_all: "Restore from backup", reset_all: "Reset all data",
      m_restore_title: "Restore from backup", restore_pick: "Choose a backup file (.json)", btn_restore: "Restore",
      restore_msg: "This adds the students and records from the backup file into the system. Existing data is kept. For a clean restore, reset first.",
      restore_bad: "This file is not a valid SCMS backup.", to_restore_done: "Restored {n} students from backup",
      import_students: "+ Import (CSV)", m_import_title: "Import students",
      import_help: "Upload an Excel (.xlsx) or CSV file with columns: Full name, Student ID, Department, Stage, Study time. Kurdish or English values are both accepted.",
      download_template: "Download template", import_pick: "Choose CSV file", btn_import: "Import",
      import_none: "No valid rows were found in the file.",
      to_import_done: "{n} students imported", to_backup_done: "Backup downloaded", to_reset_done: "All students and records cleared",
      m_reset_title: "Reset all data",
      reset_msg: "This permanently deletes ALL students and internship records. Departments and login accounts are kept. This cannot be undone — make a backup first.",
      reset_type_hint: "Type DELETE to confirm",
      ph_name: "e.g. Sara Ahmed", ph_sid: "e.g. 2023-1045", ph_major: "e.g. Accounting", ph_stage: "e.g. Stage 3",
      save_changes: "Save changes", btn_add_student: "Add student", err_name_required: "Full name and Student ID are required.",

      // modals - intern
      m_intern_status: "Internship status", l_department: "Department",
      f_status: "Status", f_note: "Note (optional)", ph_note: "Add a remark for this placement…",
      save_status: "Save status", pick_status: "Pick a status.",

      // modals - dept
      m_add_dept: "Add department", f_deptname: "Department name", ph_deptname: "e.g. Human Resources",
      btn_add_dept: "Add department", err_deptname: "Enter a department name.", err_dept_exists: "That department already exists.",

      // modals - account
      m_create_account: "Create login account", f_role: "Role", role_dept: "Department", role_admin: "Administrator",
      f_dept: "Department", signin_becomes: "They sign in with this name. It becomes {e}.",
      ph_pass6: "At least 6 characters", btn_create_account: "Create account", creating: "Creating…",
      err_user_pass: "Username and password are required.", err_pass6: "Password must be at least 6 characters.",
      err_user_taken: "That username is already taken.", err_pass_weak: "Password is too weak.",

      // confirms
      m_delete_student: "Delete student", msg_delete_student: "Remove <b>{n}</b> and all related internship records? This cannot be undone.",
      m_remove_dept: "Remove department", msg_remove_dept: "Remove the <b>{d}</b> department? Existing records stay in the database but it will no longer be listed.",
      m_remove_account: "Remove account", msg_remove_account: "This removes the account's access and role. The sign-in credential must also be deleted from Firebase Authentication in the console.",

      // toasts / errors
      to_student_updated: "Student updated", to_student_added: "Student added", to_status_saved: "Status saved",
      to_dept_added: "Department added", to_dept_removed: "Department removed", to_acc_created: "Account created",
      to_acc_removed: "Account removed", to_student_deleted: "Student deleted", to_csv_exported: "CSV exported",
      err_save: "Could not save: ", err_delete: "Could not delete: ", err_add: "Could not add: ",
      err_remove: "Could not remove: ", err_create: "Could not create: ",

      // setup
      setup_eyebrow: "One-time setup", setup_hero_t: "Create the first administrator.",
      setup_hero_text: "Run this once to create the Super Admin sign-in. After creating it, finish the short console step shown on the right, then delete this page from your repository.",
      setup_foot: "Use only during initial setup",
      setup_title: "Create Super Admin",
      setup_lead: "This creates the authentication account only. You'll assign the admin role in the Firebase console (one step).",
      f_admin_username: "Admin username", admin_signin_hint: "Signs in as {e}",
      btn_create_admin: "Create administrator",
      setup_done: "Admin account created. Complete the step below, then sign in.",
      final_step_t: "Final step — assign the admin role",
      fs1: "Open Firebase Console → Firestore Database.",
      fs2: "Create collection users → document ID = {uid}",
      fs3: "Add fields: username = {u}, role = admin, department = (empty).",
      fs4: "Return to the sign-in page and log in.",
      setup_err_exists: "This admin username already exists. Go to the sign-in page."
    },

    ku: {
      app_name: "سیستەمی بەڕێوەبردنی ئەستۆپاکی خوێندکاران",
      org_top: "سەرۆکایەتی زانکۆی پۆلیتەکنیکی سلێمانی", org_sub: "پەیمانگای تەکنیکی دوکان", sys_name: "سیستەمی بەڕێوەبردنی ئەستۆپاکی خوێندکاران",
      hero_tag: "تۆمارێکی یەکگرتوو بۆ ئەستۆپاکی خوێندکاران لە هەموو هۆبەکاندا.", hero_kicker: "سیستەمی ئەستۆپاکی", show_password: "پیشاندانی وشەی نهێنی", hide_password: "شاردنەوەی وشەی نهێنی",
      super_admin: "بەڕێوەبەری سەرەکی", administrator: "بەڕێوەبەر", department_role: "هۆبەی {d}",
      sign_out: "چوونەدەرەوە", cancel: "هەڵوەشاندنەوە", you: "تۆ",
      lang_label: "English",

      g_workspace: "شوێنی کار", g_admin: "بەڕێوەبردن", g_insight: "تێڕوانین",
      nav_overview: "گشتی", nav_students: "خوێندکاران", nav_internships: "ڕاهێنانەکان",
      nav_mydept: "لیستی خوێندکاران", nav_accounts: "بەشەکان و هەژمارەکان", nav_reports: "ڕاپۆرتەکان",
      mydept_title: "خوێندکاران", mydept_eyebrow: "دۆخی خوێندکاران",

      t_overview: "گشتی", s_overview: "پوختەی پێشکەوتنی ڕاهێنان", s_overview_dept: "پوختەی زانیارییەکان",
      t_students: "خوێندکاران", s_students: "تۆمارکردن و بەڕێوەبردنی خوێندکاران",
      t_internships: "ڕاهێنانەکان", s_intern_admin: "دیاریکردنی تەواوبوونی ڕاهێنان بەپێی بەش",
      s_intern_dept: "",
      t_accounts: "بەشەکان و هەژمارەکان", s_accounts: "بەڕێوەبردنی بەشەکان و دەستگەیشتنی چوونەژوورەوە",
      t_reports: "ڕاپۆرتەکان", s_reports: "پێداچوونەوە، چاپکردن و دەرهێنانی تۆمارەکان",

      login_title: "چوونەژوورەوە بۆ هەژمارەکەت", login_lead: "بەڕێوەبەر و هەژمارەکانی بەشەکان لێرە دەچنە ژوورەوە.",
      f_username: "ناوی بەکارهێنەر", f_password: "وشەی نهێنی",
      username_hint: "تەنها ناوی هەژمارەکەت بنووسە — پێویست بە ئیمەیڵ نییە.",
      ph_username: "admin", ph_password: "وشەی نهێنییەکەت", sign_in: "چوونەژوورەوە",
      hero_eyebrow: "وەشانی کۆلێژ و پەیمانگا",
      hero_title: "سیستەمی بەڕێوەبردنی ئەستۆپاکی خوێندکاران",
      hero_text: "یەک تۆماری ناوەندی بۆ ڕاهێنانی خوێندکاران. هەر بەشێک دۆخی تەواوبوونی خۆی پشتڕاست دەکاتەوە، لەکاتێکدا بەڕێوەبەران هەموو وێنەکە دەبینن.",
      hero_foot: "دەستگەیشتنی پارێزراو · مۆڵەت بەپێی ڕۆڵ",
      brand_sub: "سیستەمی بەڕێوەبردنی ئەستۆپاکی خوێندکاران",
      err_invalid: "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە.", err_notfound: "هیچ هەژمارێک بەو ناوە نەدۆزرایەوە.",
      err_toomany: "هەوڵی زۆر. تکایە دوای ساتێک دووبارە هەوڵبدەرەوە.", err_norole: "ئەم هەژمارە هێشتا ڕۆڵی پێنەدراوە. پەیوەندی بە بەڕێوەبەرەکەت بکە.",
      err_generic: "نەتوانرا بچیتە ژوورەوە. تکایە دووبارە هەوڵبدەرەوە.", signing_in: "چوونەژوورەوە…",

      st_students: "خوێندکاران", st_departments: "بەشەکان", st_pl_completed: "ڕاهێنانی تەواوبوو",
      st_total_slots: "کۆی شوێنەکانی ڕاهێنان", st_completed: "تەواوبوو", st_notcompleted: "تەواونەبوو", st_pending: "چاوەڕوانی پێداچوونەوە",

      ov_glance: "بەشەکان بە کورتی", ov_recent: "نوێترین نوێکردنەوەکان — {d}",
      c_department: "بەش", c_completed: "تەواوبوو", c_notcompleted: "تەواونەبوو",
      c_pending: "چاوەڕوان", c_progress: "پێشکەوتن", c_student: "خوێندکار", c_id: "ناسنامە",
      c_status: "دۆخ", c_note: "تێبینی", c_updated: "نوێکراوەتەوە",
      pct_of: "{p}٪ لە {t}",
      e_nodepts_t: "هێشتا هیچ بەشێک نییە", e_nodepts_s: "لە بەشی «بەشەکان و هەژمارەکان» یەکێک زیاد بکە.",
      e_noupd_t: "هیچ نوێکردنەوەیەک نییە", e_noupd_s: "",

      eb_registry: "تۆماری خوێندکاران", h_all_students: "هەموو خوێندکاران", add_student: "+ زیادکردنی خوێندکار",
      ph_search_student: "گەڕان بە ناو یان ناسنامە…", all_times: "هەموو کاتەکانی خوێندن", morning: "بەیانیان", evening: "ئێواران", parallel: "پارالێڵ",
      c_fullname: "ناوی تەواو", c_studentid: "ناسنامەی خوێندکار", c_major: "بەش / پسپۆڕی", c_stage: "قۆناغ", c_studytime: "کاتی خوێندن",
      e_nostudents_t: "هیچ خوێندکارێک تۆمار نەکراوە", e_nostudents_s: "",
      e_nomatch_t: "هیچ ئەنجامێک نییە", e_nomatch_s: "گەڕان یان پاڵاوتنێکی تر تاقی بکەرەوە.", edit: "دەستکاری", del: "سڕینەوە",

      eb_status: "دۆخی ڕاهێنان", h_intern_records: "تۆمارەکانی ڕاهێنان",
      h_marking: "دیاریکردن: {d}", h_mydept_status: "{d} — دۆخی ڕاهێنان",
      ph_search_only: "گەڕان بەدوای خوێندکار…", all_statuses: "هەموو دۆخەکان",
      s_completed: "تەواوبوو", s_notcompleted: "تەواونەبوو", s_pending: "چاوەڕوان",
      e_choose_t: "بەشێک هەڵبژێرە", e_choose_s: "بەشێک لە سەرەوە هەڵبژێرە بۆ دیاریکردنی دۆخی ڕاهێنان.",
      e_nostud_admin_s: "سەرەتا لە تابی «خوێندکاران» خوێندکار زیاد بکە.",
      e_nostud_dept_s: "هیچ خوێندکارێک تۆمار نەکراوە",
      update: "نوێکردنەوە",

      eb_admin: "بەڕێوەبردن", h_accounts: "بەشەکان و هەژمارەکان",
      add_department: "+ زیادکردنی بەش", create_account: "+ دروستکردنی هەژمار",
      h_departments: "بەشەکان", h_login_accounts: "هەژمارەکانی چوونەژوورەوە",
      c_accounts: "هەژمارەکان", no_account: "هیچ هەژمارێک", n_accounts: "{n} هەژمار",
      e_nodept2_t: "هیچ بەشێک نییە", e_nodept2_s: "یەکەم بەشت زیاد بکە.",
      e_noacc_t: "هیچ هەژمارێک نییە", e_noacc_s: "هەژماری چوونەژوورەوەی بەشەکان دروست بکە.",
      c_username: "ناوی بەکارهێنەر", c_role: "ڕۆڵ", remove: "لابردن",

      eb_reporting: "ڕاپۆرتکردن", h_report: "ڕاپۆرتی ڕاهێنان",
      h_report_dept: "ڕاپۆرتی ڕاهێنانی {d}", h_report_full: "ڕاپۆرتی تەواوی ڕاهێنان",
      all_departments: "هەموو بەشەکان", print: "چاپکردن", export_csv: "دەرهێنانی CSV",
      e_norep_t: "هیچ ڕاپۆرتێک نییە", e_norep_s: "خوێندکار زیاد بکە بۆ دروستکردنی ڕاپۆرت.",

      m_add_student: "زیادکردنی خوێندکار", m_edit_student: "دەستکاری خوێندکار",
      f_fullname: "ناوی تەواو", f_studentid: "ناسنامەی خوێندکار", f_major: "بەش / پسپۆڕی",
      f_stage: "قۆناغ", f_studytime: "کاتی خوێندن",
      stage_1: "قۆناغی یەکەم", stage_2: "قۆناغی دووەم", stage_3: "قۆناغی سێیەم", stage_4: "قۆناغی چوارەم",
      ph_stage_select: "قۆناغ هەڵبژێرە", btn_note: "تێبینی", quick_hint: "کلیک بکە بۆ دیاریکردنی دۆخ",
      ph_major_select: "بەش هەڵبژێرە", all_majors: "هەموو بەشەکان",
      major_it: "بەشی ئایتی", major_admin: "بەشی کارگێڕی کار", major_accounting: "بەشی ژمێریاری",
      major_bank: "بەشی بانک", major_pr: "بەشی پەیوەندییە گشتییەکان",
      dept_library: "کتێبخانە", dept_finance: "دارایی", dept_warehouse: "گەنجینە", dept_records: "تۆمارگا", dept_internal: "بەشە ناوخۆیی",
      an_overall: "دۆخی گشتی", an_by_dept: "تەواوبوو بەپێی هۆبە",
      an_cleared: "خوێندکاری تەواو ئەستۆپاک", an_remaining: "خوێندکاری ماوە",
      data_tools: "داتا و باکئەپ", data_tools_hint: "باکئەپێکی تەواوی هەموو داتا دابەزێنە، یان هەموو خوێندکاران و تۆمارەکان بسڕەوە بۆ دەستپێکردنەوە.",
      backup_all: "باکئەپی هەموو داتا", restore_all: "گەڕاندنەوە لە باکئەپ", reset_all: "سفرکردنەوەی هەموو داتا",
      m_restore_title: "گەڕاندنەوە لە باکئەپ", restore_pick: "فایلی باکئەپ هەڵبژێرە (.json)", btn_restore: "گەڕاندنەوە",
      restore_msg: "ئەمە خوێندکاران و تۆمارەکانی ناو فایلی باکئەپ زیاد دەکات بۆ سیستەمەکە. داتای ئێستا دەمێنێتەوە. بۆ گەڕاندنەوەیەکی پاک، یەکەم سفری بکەرەوە.",
      restore_bad: "ئەم فایلە باکئەپێکی دروستی SCMS نییە.", to_restore_done: "{n} خوێندکار لە باکئەپ گەڕێندرانەوە",
      import_students: "+ زیادکردن (CSV)", m_import_title: "زیادکردنی خوێندکاران بەکۆمەڵ",
      import_help: "فایلێکی Excel (.xlsx) یان CSV بەرز بکەرەوە بەم ستوونانە: ناوی تەواو، ناسنامە، بەش، قۆناغ، کاتی خوێندن. هەم کوردی هەم ئینگلیزی قبوڵ دەکرێت.",
      download_template: "داگرتنی نموونە", import_pick: "فایلی CSV هەڵبژێرە", btn_import: "زیادکردن",
      import_none: "هیچ ڕیزێکی دروست لە فایلەکەدا نەدۆزرایەوە.",
      to_import_done: "{n} خوێندکار زیادکرا", to_backup_done: "باکئەپ دابەزی", to_reset_done: "هەموو خوێندکاران و تۆمارەکان سڕانەوە",
      m_reset_title: "سفرکردنەوەی هەموو داتا",
      reset_msg: "ئەمە هەموو خوێندکاران و تۆمارەکانی ڕاهێنان بۆ هەمیشە دەسڕێتەوە. هۆبەکان و هەژمارەکان دەمێننەوە. ئەمە ناگەڕێتەوە — یەکەم باکئەپ بکە.",
      reset_type_hint: "بۆ دڵنیاکردنەوە بنووسە DELETE",
      ph_name: "وەک سارا ئەحمەد", ph_sid: "وەک ٢٠٢٣-١٠٤٥", ph_major: "وەک ژمێریاری", ph_stage: "وەک قۆناغی ٣",
      save_changes: "پاشەکەوتی گۆڕانکارییەکان", btn_add_student: "زیادکردنی خوێندکار", err_name_required: "ناوی تەواو و ناسنامەی خوێندکار پێویستن.",

      m_intern_status: "دۆخی ڕاهێنان", l_department: "بەش",
      f_status: "دۆخ", f_note: "تێبینی (ئارەزوومەندانە)", ph_note: "تێبینییەک بۆ ئەم ڕاهێنانە زیاد بکە…",
      save_status: "پاشەکەوتی دۆخ", pick_status: "دۆخێک هەڵبژێرە.",

      m_add_dept: "زیادکردنی بەش", f_deptname: "ناوی بەش", ph_deptname: "وەک سەرچاوەی مرۆیی",
      btn_add_dept: "زیادکردنی بەش", err_deptname: "ناوی بەش بنووسە.", err_dept_exists: "ئەم بەشە پێشتر هەیە.",

      m_create_account: "دروستکردنی هەژماری چوونەژوورەوە", f_role: "ڕۆڵ", role_dept: "بەش", role_admin: "بەڕێوەبەر",
      f_dept: "بەش", signin_becomes: "بەم ناوە دەچنە ژوورەوە. دەبێت بە {e}.",
      ph_pass6: "لانیکەم ٦ پیت", btn_create_account: "دروستکردنی هەژمار", creating: "دروستکردن…",
      err_user_pass: "ناوی بەکارهێنەر و وشەی نهێنی پێویستن.", err_pass6: "وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت.",
      err_user_taken: "ئەم ناوی بەکارهێنەرە پێشتر بەکارهاتووە.", err_pass_weak: "وشەی نهێنی زۆر لاوازە.",

      m_delete_student: "سڕینەوەی خوێندکار", msg_delete_student: "<b>{n}</b> و هەموو تۆمارە پەیوەندیدارەکانی ڕاهێنان بسڕیتەوە؟ ئەمە ناگەڕێتەوە.",
      m_remove_dept: "لابردنی بەش", msg_remove_dept: "بەشی <b>{d}</b> لاببردرێت؟ تۆمارە بەردەستەکان لە داتابەیس دەمێننەوە بەڵام ئیتر لیست ناکرێن.",
      m_remove_account: "لابردنی هەژمار", msg_remove_account: "ئەمە دەستگەیشتن و ڕۆڵی هەژمارەکە لادەبات. ناسنامەی چوونەژوورەوەش دەبێت لە Firebase Authentication لە کۆنسۆڵ بسڕدرێتەوە.",

      to_student_updated: "خوێندکار نوێکرایەوە", to_student_added: "خوێندکار زیادکرا", to_status_saved: "دۆخ پاشەکەوتکرا",
      to_dept_added: "بەش زیادکرا", to_dept_removed: "بەش لابردرا", to_acc_created: "هەژمار دروستکرا",
      to_acc_removed: "هەژمار لابردرا", to_student_deleted: "خوێندکار سڕایەوە", to_csv_exported: "CSV دەرهێنرا",
      err_save: "نەتوانرا پاشەکەوت بکرێت: ", err_delete: "نەتوانرا بسڕدرێتەوە: ", err_add: "نەتوانرا زیاد بکرێت: ",
      err_remove: "نەتوانرا لاببردرێت: ", err_create: "نەتوانرا دروست بکرێت: ",

      setup_eyebrow: "ڕێکخستنی یەکجاری", setup_hero_t: "یەکەم بەڕێوەبەر دروست بکە.",
      setup_hero_text: "ئەمە یەک جار بکە بۆ دروستکردنی چوونەژوورەوەی بەڕێوەبەری سەرەکی. دوای دروستکردنی، هەنگاوە کورتەکەی کۆنسۆڵ تەواو بکە، دواتر ئەم پەڕەیە بسڕەوە.",
      setup_foot: "تەنها لە کاتی ڕێکخستنی سەرەتایی بەکاری بهێنە",
      setup_title: "دروستکردنی بەڕێوەبەری سەرەکی",
      setup_lead: "ئەمە تەنها هەژماری چوونەژوورەوە دروست دەکات. ڕۆڵی بەڕێوەبەر لە کۆنسۆڵی Firebase دیاری دەکەیت (یەک هەنگاو).",
      f_admin_username: "ناوی بەڕێوەبەر", admin_signin_hint: "بەم ناوە دەچێتە ژوورەوە: {e}",
      btn_create_admin: "دروستکردنی بەڕێوەبەر",
      setup_done: "هەژماری بەڕێوەبەر دروستکرا. هەنگاوی خوارەوە تەواو بکە، دواتر بچۆ ژوورەوە.",
      final_step_t: "هەنگاوی کۆتایی — دیاریکردنی ڕۆڵی بەڕێوەبەر",
      fs1: "کۆنسۆڵی Firebase بکەرەوە ← Firestore Database.",
      fs2: "collection ـی users دروست بکە ← Document ID = {uid}",
      fs3: "فیلدەکان زیاد بکە: username = {u}، role = admin، department = (بەتاڵ).",
      fs4: "بگەڕێوە بۆ پەڕەی چوونەژوورەوە و بچۆ ژوورەوە.",
      setup_err_exists: "ئەم ناوی بەڕێوەبەرە پێشتر هەیە. بڕۆ بۆ پەڕەی چوونەژوورەوە."
    }
  };

  let lang = "en";
  try { lang = localStorage.getItem("ims_lang") || "en"; } catch (e) {}
  if (lang !== "en" && lang !== "ku") lang = "en";

  function t(key, vars) {
    let s = (STR[lang] && STR[lang][key] != null) ? STR[lang][key] : (STR.en[key] != null ? STR.en[key] : key);
    if (vars) Object.keys(vars).forEach((k) => { s = s.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]); });
    return s;
  }

  function applyDir() {
    const rtl = lang === "ku";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
  }

  // Translate any element carrying data-i18n / data-i18n-ph / data-i18n-html
  function applyStatic(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
    (root || document).querySelectorAll("[data-i18n-ph]").forEach((el) => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    (root || document).querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    const btn = document.getElementById("langToggle");
    if (btn) btn.textContent = t("lang_label");
  }

  function setLang(next) {
    lang = (next === "ku") ? "ku" : "en";
    try { localStorage.setItem("ims_lang", lang); } catch (e) {}
    applyDir();
    applyStatic();
    if (typeof window.onLangChange === "function") window.onLangChange();
  }

  // Expose globally
  window.t = t;
  window.getLang = () => lang;
  window.setLang = setLang;
  window.applyI18n = applyStatic;
  window.toggleLang = () => setLang(lang === "en" ? "ku" : "en");

  applyDir();
  document.addEventListener("DOMContentLoaded", () => {
    applyStatic();
    const btn = document.getElementById("langToggle");
    if (btn) btn.addEventListener("click", () => window.toggleLang());
  });

  // Prevent accidental browser zoom (Ctrl+wheel / pinch / Ctrl +,-,0)
  // while keeping normal scrolling intact.
  window.addEventListener("wheel", (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].indexOf(e.key) !== -1) e.preventDefault();
  });
  ["gesturestart", "gesturechange", "gestureend"].forEach((t) =>
    window.addEventListener(t, (e) => e.preventDefault()));
})();
