# AI-Assisted Journal System - Backend

A Node.js + Express backend for the ArvyaX journal system that stores journal entries, analyzes emotions using LLM, and provides insights about users mental states over time.

## Features

- **Journal Entry Management**: Create and retrieve journal entries with forest/ocean/mountain ambience
- **LLM-Powered Analysis**: Emotion analysis using Google Gemini AI
- **User Insights**: Aggregated insights showing emotions, ambience preferences, and keywords
- **RESTful API**: Clean, well-documented API endpoints
- **TypeScript**: Full type safety and better development experience
- **PostgreSQL**: Scalable database with Prisma ORM

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **LLM**: Google Gemini (gemini-3-flash-preview)

## Prerequisites

- Node.js (v18+)
- pnpm
- PostgreSQL (or use Docker)
- Google Gemini API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd arvyax-assignment-main/backend
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="your-postgres-database-url"

# Google Gemini API
GOOGLE_GENAI_API_KEY="your-gemini-api-key-here"

# Server
PORT=3000

# Frontend (for CORS)
FRONTEND_URL="fronted-url"
```

### 3. Database Migration

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Start the Server

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check

```
GET /health
```

Returns server status.

### Journal Entries

#### Create Journal Entry

```
POST /api/journal
```

**Request Body:**
```json
{
  "userId": "123",
  "ambience": "forest",
  "text": "I felt calm today after listening to the rain."
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "123",
  "ambience": "forest",
  "text": "I felt calm today after listening to the rain.",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get User Journal Entries

```
GET /api/journal/:userId
```

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "123",
    "ambience": "forest",
    "text": "I felt calm today after listening to the rain.",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Emotion Analysis

#### Analyze Journal Entry

```
POST /api/journal/analyze/:journalId
```

**Request Body:**
```json
{
  "text": "I felt calm today after listening to the rain"
}
```

**Response:**
```json
{
  "emotion": "calm",
  "keywords": ["rain", "nature", "peace"],
  "summary": "User experienced relaxation during the forest session"
}
```

### User Insights

#### Get User Insights

```
GET /api/journal/insights/:userId
```

**Response:**
```json
{
  "totalEntries": 8,
  "topEmotion": "calm",
  "mostUsedAmbience": "forest",
  "recentKeywords": ["focus", "nature", "rain"]
}
```

## Database Schema

### Journal Model
- `id`: UUID (Primary Key)
- `userId`: String
- `ambience`: Enum (forest, ocean, mountain)
- `text`: String
- `createdAt`: DateTime
- `analyses`: Relation to Analysis model

### Analysis Model
- `id`: UUID (Primary Key)
- `journalId`: String (Foreign Key, Unique)
- `emotion`: String
- `keywords`: String[]
- `summary`: String
- `createdAt`: DateTime

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `400`: Bad Request (missing parameters)
- `401`: Unauthorized (missing fields)
- `500`: Internal Server Error

## Development

### Project Structure

```
src/
├── controllers/
│   └── controller.journal.ts    # Business logic
├── lib/
│   ├── agent.ts                 # LLM integration
│   └── db.ts                    # Database connection
├── routes/
│   └── route.journal.ts         # API routes
├── constant.ts                  # System prompts
└── server.ts                    # Express server setup
```

### Available Scripts

```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Compile TypeScript to JavaScript
pnpm start        # Start production server
pnpm prisma:gen   # Generate Prisma client
pnpm prisma:push  # Push schema changes to database
```

## License

ISC
