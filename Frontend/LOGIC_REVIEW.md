# Frontend logic review

The frontend is a demo, not a connected production client. No frontend code
calls the backend. Removing the unused nested `Bhorosha` gitlink does not change
either application's dependencies, imports, configuration, or build commands.
The empty submodule directory had no `.gitmodules` entry or local submodule
configuration. Git history retains its old commit reference.

## Fixed

- Login accepted any correctly formatted student/teacher email with the shared
  demo password. It now matches the exact demo email, normalizing case and space.
- Refresh lost the selected signup role and navigation parameters. These now
  survive the tab's session; invalid stored roles/views fall back safely, and
  navigation rejects pages belonging to a different role. This is UI consistency,
  not server authorization: session storage remains user-editable.
- Course-card "Write review" swallowed the click. It now opens the review modal.
- Moderation tabs used changing count labels as selection identities. The selected
  category now remains highlighted when its count changes.
- Course creation/editing accepted whitespace names/codes, invalid credit values,
  and duplicate codes. The save handler now validates and normalizes these inputs.
- Teacher Q&A displayed "All questions answered" alongside unanswered questions,
  and "No answered questions" alongside answers. Empty states are now conditional.

## Remaining integration and logic gaps

1. **High: authentication is simulated** (`src/pages/Auth.tsx`, `src/context.tsx`).
   Signup discards the form data, OTP accepts any six digits, resend does nothing,
   and password reset claims success without changing credentials. Client-side
   role storage can be edited to display admin pages. Connect login/registration
   and session verification to the backend; OTP/reset also need server support.
   Do not use this frontend's role checks as an authorization boundary.
2. **High: mutations do not persist** (`src/pages/student/CourseDetail.tsx`, all
   profile pages). Review/question submission only closes the modal; profile and
   password saves show success without saving. Admin course/user/moderation changes
   and teacher answers exist only in component state and disappear on navigation.
   These need API calls, server validation, shared data, and failure handling.
3. **Medium: browsing does not filter data** (`src/pages/student/Dashboard.tsx`,
   `src/pages/teacher/CourseFeedback.tsx`). Student search increases the number of
   identical placeholder cards; semester/rating filters do nothing. Teacher search
   and course selection leave the same reviews visible. Add actual course/review
   collections and filter those; pass selected course IDs into detail views.
4. **Medium: moderation escalation resolves the report instead of escalating it**
   (`src/pages/admin/Moderation.tsx`). Demo items become rejected; shared reports
   are removed. Rejection reasons are discarded. Define an escalation destination
   and status with the backend before enabling this as a real moderation action.
5. **Medium: course detail controls and statistics are placeholders**
   (`src/pages/student/CourseDetail.tsx`). Helpful/report have no handlers, the Q&A
   inline draft is not passed to the modal, and the header/breakdown do not reflect
   the displayed four-star sample reviews. Render these from the same data source.
6. **Medium: anonymity preference is disconnected**
   (`src/pages/student/Profile.tsx`, `src/pages/student/CourseDetail.tsx`). The
   profile toggle resets on navigation and does not control new review/question
   defaults. Persist the preference and initialize submission forms from it.

These gaps are documented rather than replaced with another temporary data layer.
The targeted fixes retain the existing demo architecture; they do not complete
backend integration or make the application production-ready.

## Validation

- `npm run build`: passed.
- `node node_modules/typescript/bin/tsc --noEmit`: passed.
- `node --test tests/logic.test.cjs`: 10 regression tests passed for demo login,
  invalid/restored session state, signup role preservation, navigation guards,
  and logout cleanup. Tests use deterministic hook stubs, not a browser.
- Browser interactions and live backend flows were not tested.
