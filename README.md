# Internship Management System (IMS)

A college / institute internship management system. A Super Admin registers every
student once; each department (Finance, Library, Warehouse, Internal Affairs)
independently records whether a student completed their internship there. Built with
plain **HTML + CSS + JavaScript** and **Firebase** (Authentication + Firestore), and
deployable on **GitHub Pages** with no build step.

---

## Features

**Super Admin**
- Secure sign-in with full control.
- Add, edit, and delete students.
- Add departments and create department / admin login accounts.
- View all students and every internship record.
- Full cross-department report with print and CSV export.

**Department accounts** (Finance, Library, Warehouse, Internal Affairs)
- Each has its own username and password and signs in separately.
- See the complete student list.
- Mark each student **Completed** / **Not Completed** (plus a default **Pending**) and add notes.
- Can only edit their own department's records — never another department's data.

**Students** have no login. Each student can hold an independent internship record in
multiple departments.

---

## Project structure

```
ims/
├── index.html            Sign-in page
├── dashboard.html        Role-aware dashboard (admin + departments)
├── setup.html            One-time page to create the first admin
├── firestore.rules       Role-based Firestore security rules
├── css/
│   └── styles.css
└── js/
    ├── firebase-config.js   ← paste your Firebase keys here
    ├── login.js
    └── dashboard.js
```

---

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and create a project.
2. **Build → Authentication → Sign-in method →** enable **Email/Password**.
3. **Build → Firestore Database → Create database** (start in production mode).
4. **Project settings → General → Your apps →** add a **Web app** and copy the config object.

## 2. Add your config

Open `js/firebase-config.js` and replace the placeholder `firebaseConfig` with the
object you copied. Leave `LOGIN_DOMAIN` as-is (it does not need to be a real domain —
it only turns a username like `finance` into `finance@ims.local` for Firebase Auth).

## 3. Publish the security rules

In **Firestore Database → Rules**, paste the contents of `firestore.rules` and **Publish**.

## 4. Create the Super Admin (one time)

1. Open `setup.html` (locally or on your deployed site).
2. Enter an admin username (e.g. `admin`) and a password, then **Create administrator**.
3. The page shows the new user's UID. In **Firestore Database**, create a collection
   named **`users`** with a document whose **ID is that UID**, and fields:
   - `username` = `admin`
   - `role` = `admin`
   - `department` = *(leave empty)*
4. Go to `index.html` and sign in. **Delete `setup.html` from your repo afterwards.**

> The console step exists on purpose: the rules only let an existing admin grant roles,
> so the very first admin is assigned manually. Everything else is done in-app.

## 5. Create departments and department accounts

Sign in as admin → **Departments & Accounts**. The four default departments are seeded
automatically on first login. Use **Create account** to make a login for each department
(pick the department, set a username such as `finance`, and a password). Department users
then sign in at `index.html` with just their username.

---

## Deploy to GitHub Pages

1. Create a GitHub repository and push the contents of the `ims/` folder to it
   (so `index.html` sits at the repository root).

   ```bash
   git init
   git add .
   git commit -m "Internship Management System"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. In the repo: **Settings → Pages → Build and deployment**. Set **Source** to
   *Deploy from a branch*, branch **main**, folder **/ (root)**, then **Save**.
3. Your site goes live at `https://<you>.github.io/<repo>/`.
4. In **Firebase Console → Authentication → Settings → Authorized domains**, add your
   `*.github.io` domain so sign-in works on the live site.

---

## Data model (Firestore)

| Collection      | Document fields |
|-----------------|-----------------|
| `users`         | `username`, `role` (`admin` \| `department`), `department` |
| `students`      | `name`, `studentId`, `major`, `stage`, `time` (`Morning` \| `Evening`) |
| `departments`   | `name` |
| `internships`   | `studentId` (student doc ref), `studentNumber`, `studentName`, `departmentId`, `status`, `note`, `date`, `updatedBy` |

Internship documents use the ID `&lt;studentDocId&gt;__&lt;department-slug&gt;`, guaranteeing one
record per student per department and making each department's data fully separate.

---

## Security notes

- All rules are enforced server-side by Firestore — not just hidden in the UI.
- Department users can only create/update internship records whose `departmentId`
  matches their own department.
- Only admins can edit students, departments, and accounts.
- Removing an account in-app deletes its role/profile; delete the matching credential in
  **Firebase Authentication** in the console to fully revoke sign-in.
- Treat the web Firebase config as public (it is meant to be) — your data is protected by
  the security rules, so keep them published.

---

## Local preview

Because the app calls Firebase over the network, open it through a local web server
(not the `file://` protocol):

```bash
cd ims
python3 -m http.server 8080
# then visit http://localhost:8080
```
