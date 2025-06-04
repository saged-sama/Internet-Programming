# Developer Team Guide
This is a **must read document** for all my fellow **team members**

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

## 🤖 Development Standards

There are really nice tips on the internet, here are some:

  1. https://www.frontendjoy.com/p/don-t-do-this-unless-you-want-sh-t-frontend-code (must read)
  2. https://leapcell.io/blog/16-bad-typescript-habits-you-need-to-break (must read)
  3. https://advancedweb.hu/shorts/javascript-best-practice-use-return-await/
  4. https://fireup.pro/news/goodbye-useeffect-exploring-use-in-react-19

If you don't get the energy to read them, even though they're extremely light-read, **I've written below what you must follow**:

### Styling Guidelines
- **No custom font sizes**: Use predefined classes from `App.css` instead of `text-3xl`, `text-sm`, etc. `h1`, `h2`, `h3` has predefined css, so no need to define custom typography
- **No hardcoded colors**: Use shadcn theme colors defined in `App.css`, don't ever use hardcoded color values
- **Consistent spacing**: Follow the established design system

### Code Organization
- **Keep files focused**: Avoid 200+ line files and god functions
- **Write modular code**: Create reusable components, utilities, and libraries
- **Single responsibility**: Each function should have one clear purpose
- **Proper file structure**: Place code in appropriate directories based on functionality

## ⚠️ Critical Requirements

### Code Quality for Production Build
1. **Remove debug code**: Don't leave any `console.log` statements after debugging
2. **Clean unused variables**: Configure VS Code with ESLint to catch and remove unused variables automatically:

      **VS Code Settings (settings.json):**
      ```json
      {
        "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.removeUnusedImports": true
        },
        "editor.formatOnSave": true,
        "eslint.validate": ["javascript", "typescript", "typescriptreact"]
      }
      ```

      **ESLint Configuration (eslint.config.js):**
      ```javascript
      export default [
        {
        rules: {
          "@typescript-eslint/no-unused-vars": ["error", { 
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_" 
          }],
          "no-console": "warn"
        }
        }
      ];
      ```

      This will automatically remove unused imports and highlight unused variables on save.

3. **Strict typing**: Never use `any` type - define proper types in `src/types/`. If you're not sure what the type should be, use `unknown`

### TypeScript Best Practices
- Create interfaces and types for all data structures
- Use union types for limited value sets
- Export types from `src/types/index.ts` for easy imports

### Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries

## 📑 Documentation
If you have the time, please document the feature(s), component(s), page(s) you build in the `Documentation.md` file so that other teammates find it convenient