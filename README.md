# Voting Platform

A full-stack election platform with separate admin and voter flows, OTP-based voter login, CSV import for election data, turnout tracking, and results publishing after an election is closed.

Built with ASP.NET Core Web API on the backend and React + TypeScript on the frontend.

---

## Features

### Admin

- Create and manage elections
- Add candidates and voters manually or through CSV upload
- View candidate and voter lists
- Track turnout during an active election
- Open and close elections
- Publish results after election close

### Voter

- Sign in with email OTP
- Access the ballot for the active election
- Vote once per office
- View results only after the election has been closed

---

## Core Rules

- Each voter can submit only one ballot for an election
- A voter can vote once per office
- Results stay hidden until the election is closed
- Server-side checks prevent duplicate voting

---

## Tech Stack

### Backend

- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- PostgreSQL in deployment
- JWT authentication
- SMTP email delivery for OTP

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

### DevOps

- Docker Compose
- GitHub Actions

---

## Project Structure

```text
voting-platform/
├── .github/workflows/        # CI workflows
├── backend/
│   ├── Voting.Api/
│   │   ├── Common/           # Shared helpers and constants
│   │   ├── Contracts/        # Request/response models
│   │   ├── Controllers/      # API endpoints
│   │   ├── Domain/           # Core entities and enums
│   │   ├── Extensions/       # Service registration/config helpers
│   │   ├── Infrastructure/   # DbContext, services, persistence concerns
│   │   ├── Migrations/
│   │   ├── Program.cs
│   │   └── Voting.Api.csproj
│   └── VotingPlatform.slnx
├── frontend/
│   └── voting-ui/
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── layouts/
│       │   ├── pages/
│       │   ├── routes/
│       │   └── utils/
│       └── package.json
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## How It Works

### Admin flow

1. Admin signs in
2. Admin creates an election
3. Admin adds candidates and voters
4. Admin opens the election
5. Admin monitors turnout
6. Admin closes the election
7. Results become visible

### Voter flow

1. Voter enters email
2. System sends OTP
3. Voter verifies OTP
4. Voter accesses ballot
5. Voter submits votes
6. Voter can view results after the election closes

---

## Local Development

### Prerequisites

- .NET 10 SDK
- Node.js 20+
- PostgreSQL if you want to run with the current deployment-style database setup

### 1. Clone the repository

```bash
git clone https://github.com/ibs13/voting-platform.git
cd voting-platform
```

### 2. Backend setup

```bash
cd backend/Voting.Api
```

Set your local secrets or environment variables for backend configuration.

Minimum required values:

- `ConnectionStrings__Default`
- `Jwt__Key`
- `Cors__AllowedOrigins__0`

Example local run:

```bash
dotnet restore
dotnet ef database update
dotnet run
```

The API runs on the backend port configured by ASP.NET Core. In development, OpenAPI is available at:

```text
/openapi
```

### 3. Frontend setup

```bash
cd frontend/voting-ui
npm install
npm run dev
```

---

## Environment Variables

The project includes a root `.env.example` file for production-style configuration.

### Backend

- `ASPNETCORE_ENVIRONMENT`
- `ASPNETCORE_URLS`
- `ConnectionStrings__Default`
- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__VoterTokenMinutes`
- `Jwt__AdminTokenHours`
- `Cors__AllowedOrigins__0`
- `Otp__ExpiryMinutes`
- `Otp__MaxAttempts`
- `Election__TimeZone`
- `Seed__RunOnStartup`
- `Email__Provider`
- `Email__SmtpHost`
- `Email__SmtpPort`
- `Email__SmtpUsername`
- `Email__SmtpPassword`
- `Email__SenderEmail`
- `Email__SenderName`
- `Email__SmtpUseStartTls`

Do not commit real secrets.

---

## Docker Compose

A `docker-compose.yml` file is included for local infrastructure and API startup.

It currently defines:

- PostgreSQL
- ASP.NET Core API service

Typical use:

```bash
docker compose up --build
```

---

## CSV Import

The platform supports CSV upload for candidates and voters from the admin side.

Because import columns can change as the data model evolves, treat the backend validation and current API contract as the source of truth.

Suggested practice:

- keep sample CSV files in the repo later if you want easier onboarding
- document the exact headers beside the upload UI or in a dedicated `docs/` folder

---

## API Reference

This project exposes OpenAPI documentation in development. Instead of maintaining a long manual route table in the README, use the generated API spec as the source of truth:

```text
/openapi
```

That keeps the documentation aligned with the code when endpoints change.

---

## Deployment Notes

This project is structured for containerized deployment.

Before deploying, verify these items:

- production database connection string is set
- JWT secret is set
- CORS is set to the real frontend domain
- SMTP settings are configured for OTP delivery
- seed behavior is disabled unless you explicitly want it

---

## Current Focus of the Codebase

This repository is organized around:

- clearer backend layering
- cleaner request and response contracts
- role-based separation between admin and voter flows
- environment-based configuration for production deployment

---

## Recommended Next README Improvements

Later, you can make this README even stronger by adding:

- screenshots or GIFs of admin and voter flows
- sample CSV files in a `docs/` or `samples/` folder
- a short architecture diagram
- deployment steps for Railway
- Postman collection link or export

---

---

## License

MIT
