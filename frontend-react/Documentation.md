# Frontend Documentation

## ⚙️ Language and Library

This project is built with `React v19` with `vite` and `typescript`, and for styling `tailwindcss` with `shadcn` as the primary UI component library.

## 📁 Project Structure
```
frontend/
├── public/
├── src/
│   ├── assets/          # Static assets (images, icons, etc.)
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries and configurations
│   ├── pages/           # Page components and routing
│   ├── types/           # TypeScript type definitions
│   ├── App.css          # Global styles and theme variables
│   ├── App.tsx          # Main application component
│   ├── index.css        # Base CSS imports
│   ├── main.tsx         # Application entry point
│   └── vite-env.d.ts    # Vite environment types
├── .env                 # Environment variables
├── .gitignore
├── components.json      # Shadcn/UI configuration
├── Documentation.md     # Coding Documentation for frontend
├── eslint.config.js     # ESLint configuration
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json    # TypeScript config for app
├── tsconfig.json        # Main TypeScript config
├── tsconfig.node.json   # TypeScript config for Node.js
└── vite.config.ts       # Vite build configuration
```

## 🚀 Installation and Deployment

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
cd frontend

# Install dependencies
npm install
```

### Development
```bash
# Start development server
npm run dev

# Run with specific port
npm run dev -- --port 3000
```

### Build and Production
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deployment to Vercel
1. **Via Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

2. **Via GitHub Integration:**
    - Connect repository to Vercel
    - Configure build settings:
      - Build Command: `npm run build`
      - Output Directory: `dist`
    - Deploy automatically on push

### Docker Deployment
Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
# Build Docker image
docker build -t frontend-app .

# Run container
docker run -p 80:80 frontend-app
```

## 📲 Coding Documentation
