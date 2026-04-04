# Voting UI

Frontend application for the Voting Platform project. This React app provides separate flows for voters and admins and connects to the ASP.NET Core backend API.

## Purpose

The frontend handles:

- voter OTP login
- ballot submission
- results viewing
- admin login
- admin dashboard for election, candidate, and voter management

## Tech Stack

- React 18
- TypeScript
- Vite
- Axios
- Tailwind CSS
- React Router

## Main Pages

- `EmailPage` - voter enters email to request OTP
- `OtpPage` - voter verifies OTP
- `BallotPage` - voter submits ballot
- `SuccessPage` - confirmation after successful vote
- `ResultsPage` - results page for voter and admin after election close
- `AdminLoginPage` - admin login
- `AdminDashboardPage` - election management dashboard

## Routing and Access Control

The app uses protected routes and role-based access control.

### Voter routes

- `/`
- `/otp`
- `/ballot`
- `/success`
- `/results/:electionId`

### Admin routes

- `/admin/login`
- `/admin/dashboard`
- `/results/:electionId`

## Features

### Voter

- Request OTP using email
- Verify OTP and receive JWT
- Open ballot for the election
- Submit one vote per office
- View results after election close

### Admin

- Log in to the dashboard
- Create elections
- Add candidates and voters
- Upload candidates and voters via CSV
- View and manage candidate and voter lists
- Open and close elections
- View turnout
- View results after election close

## Local Development

From the frontend folder:

```bash
cd frontend/voting-ui
npm install
npm run dev
```
