/* Login page logic */
(function () {
  const form = document.getElementById("loginForm");
  const alertBox = document.getElementById("alert");
  const btn = document.getElementById("submitBtn");

  function showError(msg) {
    alertBox.textContent = msg;
    alertBox.classList.add("show");
  }

  // If already signed in, go straight to the dashboard.
  auth.onAuthStateChanged((user) => {
    if (user) window.location.replace("dashboard.html");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertBox.classList.remove("show");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (!username || !password) return;

    const email = usernameToEmail(username);
    btn.disabled = true;
    btn.innerHTML = '<span class="spin"></span> Signing in…';

    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      // Confirm the user has a profile/role before entering.
      const profile = await getUserProfile(cred.user.uid);
      if (!profile) {
        await auth.signOut();
        showError("This account has no role assigned yet. Contact your administrator.");
        return;
      }
      window.location.replace("dashboard.html");
    } catch (err) {
      const map = {
        "auth/invalid-credential": "Incorrect username or password.",
        "auth/wrong-password": "Incorrect username or password.",
        "auth/user-not-found": "No account found with that username.",
        "auth/too-many-requests": "Too many attempts. Try again in a moment.",
        "auth/invalid-email": "That username isn't valid."
      };
      showError(map[err.code] || "Could not sign in. Please try again.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Sign in";
    }
  });
})();
