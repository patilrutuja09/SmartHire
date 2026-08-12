# SmartHire — Recruitment & HR Management Platform

A full-stack MERN app connecting **recruiters** and **candidates** in one pipeline: post jobs, apply, and track status from Applied → Shortlisted → Hired/Rejected.

**Stack:** React (Vite) · Node.js/Express · MongoDB (Mongoose) · JWT auth · bcrypt password hashing

```
smarthire/
├── backend/     Express REST API + MongoDB models
└── frontend/    React (Vite) client
```

## 1. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - **Local**: install MongoDB Community Server and run `mongod`, or
  - **Free cloud DB**: create a free cluster at https://www.mongodb.com/cloud/atlas and copy its connection string

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smarthire      # or your Atlas connection string
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run it:

```bash
npm run dev     # requires nodemon (already in devDependencies)
# or
npm start
```

The API starts on `http://localhost:5000`. Check `http://localhost:5000/api/health` for a `{"status":"ok"}` response.

## 3. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` and `/uploads` requests to `http://localhost:5000`, so no CORS setup is needed in development.

## 4. Using the app

1. **Sign up** as either a Recruiter or a Candidate (toggle on the register page).
2. **Recruiter**: post a job → view it on your dashboard → open "Applicants" on a job to shortlist, hire, or reject candidates → view stats on the dashboard → search the candidate pool directly.
3. **Candidate**: fill in your profile and upload a resume → browse/search jobs → apply with an optional cover note → track every application's status on "My Applications".

## 5. API overview

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Register recruiter or candidate |
| POST | `/api/auth/login` | public | Log in, returns JWT |
| GET | `/api/auth/me` | authenticated | Current user profile |
| GET | `/api/jobs` | public | List/search/filter open jobs |
| GET | `/api/jobs/:id` | public | Job details |
| POST | `/api/jobs` | recruiter | Create a job |
| PUT | `/api/jobs/:id` | recruiter (owner) | Update/close a job |
| DELETE | `/api/jobs/:id` | recruiter (owner) | Delete a job |
| GET | `/api/jobs/my-jobs` | recruiter | Jobs posted by the logged-in recruiter |
| POST | `/api/applications/:jobId` | candidate | Apply to a job |
| GET | `/api/applications/my-applications` | candidate | Own applications |
| GET | `/api/applications/job/:jobId` | recruiter (owner) | Applicants for a job |
| GET | `/api/applications/all` | recruiter | All applicants across recruiter's jobs |
| PUT | `/api/applications/:id/status` | recruiter (owner) | Shortlist / reject / hire |
| PUT | `/api/candidates/profile` | candidate | Update profile |
| POST | `/api/candidates/resume` | candidate | Upload resume (PDF/DOC/DOCX, max 5MB) |
| GET | `/api/candidates` | recruiter | Search candidate pool |
| GET | `/api/candidates/dashboard-stats` | recruiter | Dashboard summary numbers |

All protected routes require an `Authorization: Bearer <token>` header, set automatically by the frontend after login.

## 6. Notes

- Passwords are hashed with **bcrypt**; sessions are stateless **JWTs** (7-day expiry by default).
- A candidate can apply to a given job only once (enforced by a unique index on `{job, candidate}`).
- Uploaded resumes are stored under `backend/uploads/resumes` and served statically at `/uploads/resumes/<file>`.
- The app was built and verified with `npm install` + `npm run build` on both the backend and frontend to confirm everything compiles cleanly. Since no MongoDB instance is available in this environment, live database calls haven't been exercised end-to-end — connect a real MongoDB instance as above before running.
- For production: set a strong `JWT_SECRET`, restrict `CLIENT_URL`/CORS, and put uploaded resumes behind proper storage (e.g. S3) rather than local disk.
