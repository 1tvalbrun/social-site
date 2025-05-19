# Social Media Application

A React-based social media web application with modern UI components.

## Features

- Light/dark mode support
- Responsive design for mobile and desktop
- Feed with posts and engagement features
- Sidebar with various content sections
- Right panel with online users, groups, and suggested connections

## Technologies Used

- React 19
- TypeScript
- Tailwind CSS
- Vite
- Lucide React for icons
- Next-themes for theming

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd social-site
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

### Running the Application

Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The application will be available at http://localhost:5173

### Building for Production

To create a production build:

```bash
pnpm build
# or
npm run build
```

To preview the production build:

```bash
pnpm preview
# or
npm run preview
```

## Project Structure

- `src/components/common/`: Reusable UI components
- `src/components/features/`: Feature-specific components
- `src/components/layout/`: Layout components including the main entry point
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utility functions and helpers

## License

MIT
