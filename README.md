# 🎮 Gamer Support

A modern, full-stack ticket support system designed for gaming communities. Built with TypeScript, Next.js, Express, and PostgreSQL.

## 🚀 Features

- **🎯 Ticket Management**: Create, track, and manage support tickets
- **👥 User Authentication**: Secure JWT-based authentication with session management
- **🎮 Gaming-Focused**: Tailored for gaming community support needs
- **📱 Responsive Design**: Modern UI with dark mode support
- **🔒 Role-Based Access**: User and admin roles with appropriate permissions
- **💬 Comment System**: Add comments and updates to tickets
- **📊 Dashboard**: Real-time statistics and ticket overview
- **🐳 Docker Ready**: Containerized deployment with Docker Compose

## 🛠️ Tech Stack

### Backend

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: Helmet, CORS, cookie-parser
- **Development**: ESLint, Prettier, nodemon

### Frontend

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Development**: TypeScript, ESLint

## 📋 Prerequisites

- Node.js 22 or higher
- PostgreSQL database
- Docker and Docker Compose (optional)

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gamer-support
   ```

2. **Start the database**

   ```bash
   docker-compose up db -d
   ```

3. **Set up environment variables**

   ```bash
   # Backend (.env in backend directory)
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gamer_support_db"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   NODE_ENV="development"
   PORT=5000
   CORS_ORIGIN="http://localhost:3000"
   ```

4. **Install dependencies and run migrations**

   ```bash
   # Backend
   cd backend
   npm install
   npx prisma migrate dev
   cd ..

   # Frontend
   cd frontend
   npm install
   cd ..
   ```

5. **Start the development servers**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

### Manual Setup

1. **Database Setup**

   - Install PostgreSQL
   - Create a database named `gamer_support_db`
   - Update the `DATABASE_URL` in your environment variables

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/signup` - Create new user account
- `POST /api/v1/auth/signin` - Sign in user
- `GET /api/v1/auth/me` - Get current user info

### Ticket Endpoints

- `GET /api/v1/tickets` - List all tickets
- `POST /api/v1/tickets` - Create new ticket
- `GET /api/v1/tickets/:id` - Get ticket by ID
- `POST /api/v1/tickets/:id/comments` - Add comment to ticket
- `DELETE /api/v1/tickets/:id` - Delete ticket

### Health Check

- `GET /api/health` - System health and status

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts with authentication
- **Sessions**: JWT session management
- **Tickets**: Support tickets with status tracking
- **Comments**: Ticket comments and updates

### Ticket Status

- `ABERTO` (Open) - New ticket
- `EM_PROGRESSO` (In Progress) - Being worked on
- `RESOLVIDO` (Resolved) - Completed
- `IGNORADO` (Ignored) - Dismissed

### Urgency Levels

- `SUAVE` (Low) - Minor issues
- `MODERADO` (Medium) - Standard priority
- `AGORA` (High) - High priority
- `APAGA_O_SERVIDOR` (Urgent) - Critical/server-breaking issues

## 🚢 Deployment

### Docker Production Build

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up --build

# Or build the main Dockerfile
docker build -t gamer-support .
docker run -p 3000:3000 gamer-support
```

### Environment Variables for Production

```bash
# Backend
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
JWT_REFRESH_SECRET="your-production-refresh-secret"
NODE_ENV="production"
PORT=5000
CORS_ORIGIN="https://your-domain.com"

# Frontend
NEXT_PUBLIC_API_BASE_URL="https://your-api-domain.com"
```

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

### Database Management

```bash
# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# View database
npx prisma studio
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🎮 About

Gamer Support is a tongue-in-cheek support ticket system designed for gaming communities. It features humorous copy and gaming-themed UI elements while maintaining professional functionality for real support operations.

Perfect for:

- Gaming server communities
- Discord server support
- Game developer support
- Any tech-savvy community needing ticket management

---

Made with 💜 and a lot of gaming lag by the community, for the community.

_No admins were awakened during the creation of this system_ 😴
