# Apollo247 Clone - General Physician Page

This project is a functional clone of Apollo247's General Physician page, featuring working filters, SEO optimization, and a complete backend with REST APIs and PostgreSQL database integration.

## Features

- **Responsive Design**: Fully responsive interface that works on mobile, tablet, and desktop devices
- **Working Filters**: Filter doctors by consultation mode, experience, fees, language, and facility
- **Sorting Options**: Sort doctors by relevance, experience, price (low to high/high to low), or rating
- **Pagination**: Browse through multiple pages of doctor listings
- **SEO Optimized**: Built with proper meta tags and SEO best practices
- **REST API**: Backend with fully functional APIs for doctor data
- **PostgreSQL Database**: Persistent storage using PostgreSQL and Drizzle ORM

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with REST APIs
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query for server state management
- **Styling**: Tailwind CSS with custom theme
- **Building**: Vite for fast development and building

## Setup Instructions for VSCode

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Git
- Visual Studio Code

### Step 1: Clone the Repository

```bash
git clone [repository-url]
cd apollo247-clone
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up PostgreSQL Database

1. Make sure PostgreSQL is installed and running on your machine
2. Create a new database:
   ```bash
   createdb apollo247_clone
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/apollo247_clone
   ```
   (Replace 'username' and 'password' with your PostgreSQL credentials)

### Step 4: Set Up VS Code

1. Install recommended VS Code extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin (Volar)

2. Configure settings.json for the project:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "tailwindCSS.includeLanguages": {
       "typescriptreact": "html"
     }
   }
   ```

### Step 5: Push Schema to Database

```bash
npm run db:push
```

### Step 6: Start the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:5000

## Project Structure

- `/client` - Frontend React application
  - `/src/components` - UI components
  - `/src/hooks` - Custom React hooks
  - `/src/pages` - Page components
  - `/src/types` - TypeScript type definitions
  - `/src/lib` - Utility functions and configurations
- `/server` - Backend Express server
  - `/routes.ts` - API routes
  - `/storage.ts` - Data access interfaces
  - `/storage-db.ts` - Database implementation of storage interfaces
  - `/db.ts` - Database connection and configuration
- `/shared` - Shared code between frontend and backend
  - `/schema.ts` - Database schema and type definitions

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

### `POST /api/add-doctor`

Add a new doctor to the database.

Request Body:
- Doctor object according to schema

## Credits

This project is a clone of Apollo247's General Physician page, created for educational purposes only. All designs, concepts, and original content belong to Apollo247.