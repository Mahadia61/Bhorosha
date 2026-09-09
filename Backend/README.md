# Bhorosha API

Express and MongoDB API for the Bhorosha frontend. It protects anonymous
authors, censors configured disrespectful words before review storage, and can
generate AI summaries of approved reviews.

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Start MongoDB locally, or use a MongoDB Atlas connection string.
3. Run `npm install`, `npm run seed:admin`, and `npm run dev`.

There is no demo-data seeder. `npm run seed:admin` is only the one-time,
idempotent creation of the first admin account from the values you place in
`.env`. All teachers, courses, reviews, questions, and reports are created
through the API and stored in MongoDB.

The API is served at `http://localhost:5000/api`. Protected endpoints expect
`Authorization: Bearer <token>`.

Students can only retrieve courses, professor records, reviews, and Q&A that
belong to their derived department. The department is calculated on signup from
the two-digit department segment after the admission year in the student ID;
for example, `u2204061` maps to `04` → `CSE`.

Students and teachers may register with their official CUET email addresses.
Admin accounts never have a sign-up route: use the one-time admin seed, then
manage courses and professor accounts from the admin interface.

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
3. Copy the Atlas Node.js connection string into `.env`, including the
   database name, for example:
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


## Teacher directory and profile claiming

Admins use User Management > Add teacher profile to create a name, CUET email and department without a password. Students can review these profiles and admins can assign courses before the teacher joins. Department is required for the existing student access rules.

Profiles retain their existing User ID when claimed, preserving all course, review, question and notification references. Existing accounts default to claimed; no data migration is needed. Admin-created profiles use accountStatus=unclaimed and cannot authenticate. Registration sends an expiring verification code; only verification sets a password and issues a session. Admin-entered name and department are preserved on claim. Email addresses are trimmed, lowercased and unique. Both @cuet.ac.bd and @teacher.cuet.ac.bd are supported.

Configure these variables in Backend/.env before teacher registration can deliver email:

- SMTP_HOST: mail server hostname
- SMTP_PORT: 587 (STARTTLS) or 465 (TLS)
- SMTP_USER and SMTP_PASS: mail server credentials
- MAIL_FROM: verified sender address

SMTP transport uses Nodemailer (https://nodemailer.com/smtp). Missing settings or delivery failures block registration safely; codes are never returned by the API or printed. Codes expire after 15 minutes and resends have a one-minute cooldown. MongoDB must build the TeacherClaim unique email and expiry indexes before accepting traffic (the standard Mongoose index setup handles these).

Run claim regression checks with: node --test test/teacher-claims.test.js. These tests mock database operations and do not send email. Full deployment verification should create an admin profile, attach a course and student feedback, register with its email, verify the delivered code, and confirm the original feedback and questions remain accessible.
