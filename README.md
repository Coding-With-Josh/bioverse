# NASA BioVerse Knowledge Engine

A Next.js application that provides role-based access to NASA's space biology research data through an AI-powered interface.

## Features

- **Authentication**: Google OAuth and demo account support
- **Role-Based Access Control**: 
  - **Learner**: Educational AI chat interface for students and enthusiasts
  - **Researcher**: Structured query interface for scientific research
- **Real NASA Data**: Integrates with NASA's Open Science Data Repository (OSDR) API
- **AI-Powered**: Uses Vercel AI SDK for intelligent responses

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Add your environment variables to `.env.local`:
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NASA_API_KEY`: Your NASA API key (default provided)
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Optional for Google OAuth

### Running Locally

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Account

You can test the app without Google OAuth using the demo account:
- **Email**: demo@nasa.gov
- **Password**: demo123

## NASA API Integration

This app uses the NASA Open Science Data Repository (OSDR) API to fetch real space biology research data:

- **Search API**: Queries 600+ space biology studies
- **Study Metadata**: Detailed information about experiments
- **Experiments API**: Access to mission and experiment data

API Documentation: https://api.nasa.gov

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js
- **AI**: Vercel AI SDK
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **API**: NASA OSDR REST API

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth configuration
│   │   ├── chat/          # Learner AI chat endpoint
│   │   ├── query/         # Researcher query endpoint
│   │   └── role/          # Role selection endpoint
│   ├── dashboard/         # Main dashboard
│   ├── role-select/       # Role selection page
│   └── sign-in/           # Authentication page
├── components/
│   ├── chat/              # Learner chat interface
│   ├── dashboard/         # Dashboard components
│   └── query/             # Researcher query interface
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   └── nasa-api.ts        # NASA API service
└── types/
    └── next-auth.d.ts     # TypeScript definitions
\`\`\`

## License

MIT

## Acknowledgments

- NASA Open Science Data Repository
- Vercel AI SDK
- Next.js team
# bioverse
