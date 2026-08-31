# Bhorosha API

Express and MongoDB API for the Bhorosha frontend. It protects anonymous
authors, censors configured disrespectful words before review storage, and can
generate AI summaries of approved reviews.

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Start MongoDB locally, or use a MongoDB Atlas connection string.
3. Run `npm install`, `npm run seed:admin`, and `npm run dev`.

Do not run `npm run seed:demo` for a clean installation: it deliberately adds
sample records. Create real teachers and courses through the admin interface.

The API is served at `http://localhost:5000/api`. Protected endpoints expect
`Authorization: Bearer <token>`.

Students can only retrieve courses, professor records, reviews, and Q&A that
belong to their derived department. The department is calculated on signup from
the two-digit department segment after the admission year in the student ID;
for example, `u2204061` maps to `04` → `CSE`.

Only students may self-register with an official CUET email. Teacher and admin
accounts are created by an administrator.

## MongoDB setup

### Local MongoDB Community

1. Install MongoDB Community Server and start the MongoDB service.
2. Copy `.env.example` to `.env`.
3. Use `MONGODB_URI=mongodb://127.0.0.1:27017/bhorosha` in `.env`.
4. Set a long, unique `JWT_SECRET`, then run `npm install`,
   `npm run seed:admin`, and `npm run dev`.

### MongoDB Atlas

1. Create a free cluster and a database user with a strong password.
2. Add your development IP address under **Network Access**.
3. Copy the Atlas Node.js connection string into `.env`, for example:
   `MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/bhorosha?retryWrites=true&w=majority`
4. URL-encode special characters in the username or password, set
   `JWT_SECRET`, then run the same install, admin-seed, and dev commands.

Mongoose creates the `users`, `courses`, `reviews`, `questions`, and `reports`
collections automatically. The models in `src/models/` are the database code;
do not insert review records by hand because the API applies authorization and
profanity filtering before storage.

## Main endpoints

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/courses`, `POST /api/courses` (admin), `PATCH /api/courses/:courseId` (admin)
- `GET /api/admin/professors` (department-scoped for students), `POST /api/admin/professors` (admin)
- `GET|POST /api/courses/:courseId/reviews`
- `POST /api/courses/:courseId/reviews/summary` (teacher/admin; requires `OPENAI_API_KEY`)
- `GET|POST /api/courses/:courseId/questions`, `POST /api/questions/:questionId/answer`
- `GET /api/reviews/mine`, `GET /api/reviews/teacher`, `POST /api/reviews/:reviewId/reports`
- `GET|PATCH /api/reports` (admin)

## Profanity list

Edit `src/data/profanity.json` to maintain the words your project should
censor. Matching review words are stored and returned as `***`; the raw review
text is never persisted. A list cannot reliably cover every slang term or
context, so moderation reports remain available for content that needs review.

## AI summaries

Set `OPENAI_API_KEY` in `.env`; never put this secret in the frontend. The
summary endpoint uses the official OpenAI JavaScript SDK and Responses API with
`store: false`. It only sends approved, already-censored review text.
