# Medical Experts - Doctor Consultation Platform

This project is a functional medical experts consultation platform featuring working filters, SEO optimization, and a complete backend with REST APIs and PostgreSQL database integration.

## Features

- **Responsive Design**: Fully responsive interface that works on mobile, tablet, and desktop devices
- **Working Filters**: Filter doctors by consultation mode, experience, fees, language, and facility
- **Sorting Options**: Sort doctors by relevance, experience, price (low to high/high to low), or rating
- **Pagination**: Browse through multiple pages of doctor listings
- **SEO Optimized**: Built with proper meta tags and SEO best practices
- **REST API**: Backend with fully functional APIs for doctor data
- **PostgreSQL Database**: Persistent storage using Neon PostgreSQL and Drizzle ORM
- **Deployed on Vercel**: Live production application with serverless functions

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with REST APIs and Vercel Serverless Functions
- **Database**: Neon PostgreSQL with Drizzle ORM for type-safe database operations
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query for server state management
- **Styling**: Tailwind CSS with custom theme
- **Building**: Vite for fast development and building
- **Deployment**: Vercel for hosting and serverless functions

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Git

### Step 1: Clone the Repository

```bash
git clone [repository-url]
cd medical-experts
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```
DATABASE_URL=your-neon-database-connection-string
```

### Step 4: Push Schema to Database

```bash
npm run db:push
```

### Step 5: Start the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:5000

## Deployment on Vercel

The application is configured for seamless deployment on Vercel:

1. Create a Vercel account and link your GitHub repository
2. Set the DATABASE_URL environment variable in Vercel project settings
3. Deploy the project

For manual deployment from your local machine:

```bash
npm install -g vercel
vercel
```

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/api` - Vercel serverless API functions
- `/shared` - Shared code between frontend and backend
- `/dist` - Built application (generated)

## API Endpoints

### `GET /api/doctors`

Fetch a list of doctors with filters:

Query Parameters:

- `modes`: Consultation modes (array of: "online", "hospital")
- `experienceRange`: Experience ranges (array of: [min, max])
- `priceRange`: Price ranges (array of: [min, max])
- `languages`: Languages spoken by doctors (array of strings)
- `facilities`: Facilities (array of strings)
- `search`: Search term (string)
- `page`: Page number for pagination (number)
- `limit`: Number of doctors per page (number)
- `sort`: Sort criteria (one of: "relevance", "experience", "price_low_to_high", "price_high_to_low", "rating")

### `GET /api/server`

Check server and database status:

Response:

- Server status information
- Database connection status
- Available API endpoints
