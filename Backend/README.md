# Bhorosha API

Express and MongoDB API for the Bhorosha frontend. It protects anonymous
authors, censors configured disrespectful words before review storage, and can
generate AI summaries of approved reviews.

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Start MongoDB locally, or use a MongoDB Atlas connection string.
3. Run `npm install`, `npm run seed:admin`, and `npm run dev`.

For local development, `npm run seed:demo` also creates the demo student,
teacher, and course used by the UI. Do not run it in production.

The API is served at `http://localhost:5000/api`. Protected endpoints expect
`Authorization: Bearer <token>`.

## Main endpoints

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/courses`, `POST /api/courses` (admin), `PATCH /api/courses/:courseId` (admin)
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
