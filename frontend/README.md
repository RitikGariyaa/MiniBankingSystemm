# Mini Banking Frontend

Angular 18 single-page application for the Mini Banking System backend.

## Features
- JWT authentication (login / logout preserved in localStorage)
- Registration (reactive form with validation + password confirmation)
- Auth guard (blocks protected routes; guest guard blocks login/register when logged in)
- Prevents using browser back button to re-enter protected pages after logout (history pushState strategy on auth pages)
- User dashboard with account listing and quick creation form
- Account detail view: info, deposit, withdraw, transfer, transaction history tabs
- Ownership enforced server side for transactions (only your transactions visible)
- Responsive layout (CSS grid + flex with fluid breakpoints)
- Kantar-inspired dark theme (accent color #FFC400 on deep gray background)
- Reactive Forms throughout
- Angular @for syntax used (dashboard + transactions lists)
- Token interceptor automatically attaches Authorization header
- Separate guest vs authenticated route handling

## Folder Structure
```
frontend/
  src/app/
    core/            # auth service, guards, interceptor
    components/      # feature components
    app-routing.module.ts
    app.module.ts
  src/environments/  # environment configs
  src/styles.css     # global theme + utility styles
```

## Prerequisites
- Node.js 20+ (recommended LTS)
- npm 10+

## Install
```bash
cd frontend
npm install
```

## Development Server
```bash
npm start
```
Serves at http://localhost:4300 (adjust backend CORS if hosting API elsewhere).

## Production Build
```bash
npm run build
```
Artifacts in `dist/mini-banking-frontend/`.

## Preview Production Build
```bash
npm run build
npm run preview
```

## Environment Configuration
Edit `src/environments/environment.ts` for local backend URL (default http://localhost:8080). For production, set `environment.prod.ts`.

## Theming
Palette centralised in `src/styles.css` (CSS variables). Accent color: `--accent: #FFC400;`.

## Extending
- Add stricter ownership checks for account create / deposit / withdraw / transfer server-side.
- Add pagination for transactions.
- Introduce refresh token flow.
- Add i18n (Angular built-in i18n or ngx-translate).

## Known Notes
- Opening balance / interest / overdraft are optional; UI displays relevant fields contextually.
- Back button suppression is implemented only on auth pages; a more robust solution could use a navigation guard service.

## Swagger / API Docs
Backend exposes Swagger UI at `/swagger-ui/index.html`.

## License
Internal demo – add a license if distributing.

