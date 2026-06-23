/* Login page logic (bilingual) */
(function () {
  const form = document.getElementById("loginForm");
  const alertBox = document.getElementById("alert");
  const btn = document.getElementById("submitBtn");

  function showError(msg) { alertBox.textContent = msg; alertBox.classList.add("show"); }

  auth.onAuthStateChanged((user) => { if (user) window.location.replace("dashboard.html"); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertBox.classList.remove("show");
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (!username || !password) return;

    const email = usernameToEmail(username);
    btn.disabled = true;
    btn.innerHTML = '<span class="spin"></span> ' + t("signing_in");

    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const profile = await getUserProfile(cred.user.uid);
      if (!profile) { await auth.signOut(); showError(t("err_norole")); return; }
      window.location.replace("dashboard.html");
    } catch (err) {
      const map = {
        "auth/invalid-credential": t("err_invalid"),
        "auth/wrong-password": t("err_invalid"),
        "auth/user-not-found": t("err_notfound"),
        "auth/too-many-requests": t("err_toomany"),
        "auth/invalid-email": t("err_invalid")
      };
      showError(map[err.code] || t("err_generic"));
    } finally {
      btn.disabled = false;
      btn.textContent = t("sign_in");
    }
  });
})();
