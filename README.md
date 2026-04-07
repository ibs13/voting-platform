# Voting Platform

A full-stack, role-based election voting platform with OTP-based voter authentication, turnout tracking, and results visibility after election close. Built with ASP.NET Core and React.

---

## Features

**Admin**

- Create and manage elections with configurable start and end times
- Add office-specific candidates and voters individually or via CSV bulk upload
- View and manage candidate and voter lists
- View voter turnout while an election is open
- Close elections and publish results

**Voter**

- Authenticate via email OTP, no password required
- Cast a ballot with one vote per office from office-specific candidate lists
- View results only after the election is officially closed
- Double-vote prevention enforced at the server level via `VoteLock`

---

## Voting Rules

- Each candidate can participate in only one office
- A President candidate cannot run for Secretary or Treasurer
- A Secretary candidate cannot run for President or Treasurer
- A Treasurer candidate cannot run for President or Secretary
- Voters select one candidate per office
- Results remain hidden until the election is closed

---

## Tech Stack

| Layer          | Technology                             |
| -------------- | -------------------------------------- |
| Backend API    | ASP.NET Core Web API (.NET 10), C#     |
| Authentication | JWT Bearer tokens + OTP challenge flow |
| Database       | SQLite via Entity Framework Core       |
| Frontend       | React 18, TypeScript, Vite             |
| HTTP Client    | Axios                                  |
| Styling        | Tailwind CSS                           |

---

## Architecture

```text
voting-platform/
├── backend/
│   └── Voting.Api/
│       ├── Controllers/        # AdminAuth, AdminElections, Auth, Election,
│       │                       # Me, Results, Voter, Dev
│       ├── Domain/             # Entities: Election, Candidate, Voter,
│       │                       # Vote, VoteLock, OtpChallenge, BallotSubmission
│       ├── Dtos/               # Request and response models
│       ├── Data/               # AppDbContext, DbSeeder
│       ├── Services/           # JwtTokenService, CsvImportService, IDevOtpSender
│       ├── Migrations/
│       └── Program.cs
└── frontend/
    └── voting-ui/
        └── src/
            ├── api/            # Axios instance
            ├── components/     # ProtectedRoute, RoleRoute, LogoutButton
            ├── context/        # AuthContext
            ├── layouts/        # ProtectedLayout
            └── pages/          # AdminDashboard, AdminLogin, Ballot,
                                # Email, Otp, Results, Success
```

### Key Design Decisions

- **VoteLock**: A separate entity that prevents double voting independently of the ballot submission record, making the rule explicit and auditable.
- **OtpChallenge**: Stored as its own entity with expiry support, allowing stateless API servers without session state.
- **Role separation at routing level**: Admin and voter flows are separated clearly instead of mixing role checks in a single controller or route.
- **Office-specific candidacy**: Each candidate belongs to exactly one office, and both ballot rendering and vote submission validation enforce this rule.
- **Fail-fast JWT validation**: `Program.cs` throws an `InvalidOperationException` on startup if `Jwt:Key` is missing, preventing silent misconfiguration.

---

## Local Setup

### Prerequisites

- .NET 10 SDK
- Node.js 20+

### Backend

```bash
cd backend/Voting.Api

# Set the JWT signing key via user secrets
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "your-local-development-secret-min-32-chars"

# Apply migrations
dotnet ef database update

# Run the API
dotnet run
```

In development, OpenAPI docs are available at `/openapi`.

### Frontend

```bash
cd frontend/voting-ui
npm install
npm run dev
```

The frontend runs on the Vite development server.

### Default Admin Credentials

The database seeder creates a default admin account for local development:

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `admin123` |

Change or remove these credentials before using the project in any shared or deployed environment.

---

## Configuration

`appsettings.json` contains non-secret configuration only:

```json
{
  "ConnectionStrings": {
    "Default": "Data Source=voting.db"
  },
  "Jwt": {
    "Key": ""
  }
}
```

The `Jwt:Key` value must be supplied through .NET user secrets for local development or through environment variables or secret management in other environments. The application will not start if the key is missing or empty.

---

## API Overview

> Update this section if your route attributes change. The routes below should match your current controller setup.

| Method   | Route                                     | Role        | Description                       |
| -------- | ----------------------------------------- | ----------- | --------------------------------- |
| `POST`   | `/admin/auth/login`                       | Public      | Admin login, returns JWT          |
| `GET`    | `/admin/elections`                        | Admin       | List all elections                |
| `POST`   | `/admin/elections`                        | Admin       | Create election                   |
| `POST`   | `/admin/elections/{id}/candidates`        | Admin       | Add candidate                     |
| `GET`    | `/admin/elections/{id}/candidates`        | Admin       | List candidates                   |
| `DELETE` | `/admin/elections/candidates/{id}`        | Admin       | Delete candidate                  |
| `POST`   | `/admin/elections/{id}/candidates/upload` | Admin       | Bulk import candidates            |
| `POST`   | `/admin/elections/{id}/voters`            | Admin       | Add voter                         |
| `GET`    | `/admin/elections/{id}/voters`            | Admin       | List voters                       |
| `DELETE` | `/admin/elections/voters/{id}`            | Admin       | Delete voter                      |
| `POST`   | `/admin/elections/{id}/voters/upload`     | Admin       | Bulk import voters                |
| `POST`   | `/admin/elections/{id}/open`              | Admin       | Open election                     |
| `POST`   | `/admin/elections/{id}/close`             | Admin       | Close election                    |
| `GET`    | `/admin/elections/{id}/turnout`           | Admin       | View turnout stats                |
| `POST`   | `/auth/request-otp`                       | Public      | Request OTP for voter email       |
| `POST`   | `/auth/verify-otp`                        | Public      | Verify OTP and return voter JWT   |
| `GET`    | `/election/{id}/ballot`                   | Voter       | Get ballot for an open election   |
| `POST`   | `/voter/vote`                             | Voter       | Submit ballot                     |
| `GET`    | `/results/{id}`                           | Voter/Admin | View results after election close |

---

## Candidate CSV Format

Candidate CSV upload requires the following columns:

```csv
fullName,batch,office
John Doe,15,President
Jane Smith,16,Secretary
Rahim Uddin,14,Treasurer
```

Valid office values must match the backend office enum used by the application.

---

## OTP Voter Flow

```text
Voter enters email
       │
       ▼
POST /auth/request-otp
→ OtpChallenge created in DB
→ OTP printed to console in development
       │
       ▼
POST /auth/verify-otp
→ Challenge validated
→ Voter JWT returned
       │
       ▼
GET /election/{id}/ballot
→ Returns only office-eligible candidates for President, Secretary, and Treasurer
       │
       ▼
POST /voter/vote
→ VoteLock checked
→ Candidate office eligibility validated
→ BallotSubmission + Vote records created
→ VoteLock created
```

---

## Current Status

This project is currently a working MVP and supports the full election lifecycle:

- admin election creation
- office-based candidate and voter management
- OTP-based voter login
- ballot submission
- double-vote prevention
- turnout tracking
- close-and-publish results flow

### Current Known Improvements

- Some forms still use browser-native validation and need custom inline validation messages
- Loading and disabled states for async actions are only partially implemented
- Results page redirect behavior for missing election IDs can be improved
- OTP delivery is still console-based in development
- Docker setup is not added yet

---

## Roadmap

- Replace console OTP sender with real email delivery
- Add Docker / docker-compose for easier local setup
- Add CI pipeline for build and test
- Improve inline form validation and error handling
- Add voter status page
- Add soft delete and audit logs
- Prepare deployment setup

---

## License

MIT
