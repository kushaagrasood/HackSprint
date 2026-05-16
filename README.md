# HackSprint

A comprehensive solo hackathon execution platform built with React, Tailwind CSS, and Supabase. HackSprint helps you manage tasks, track progress, prepare pitches, analyze performance, and export your hackathon journey.

## Features

### Core Features
- **📊 Dashboard**: Real-time progress tracking with analytics widgets
- **✅ Task Management**: Create, organize, and track tasks with priorities and timers
- **📝 Checklist**: Pre-built and custom checklists with progress tracking
- **🎤 Pitch Preparation**: Rich text editor, templates, practice timer, and notes

### Advanced Features
- **Analytics**: Time tracking, productivity charts, and insights
- **Templates**: Reusable hackathon templates library
- **Export**: Export data and reports in PDF, CSV, and JSON formats
- **Real-time Sync**: Supabase real-time subscriptions
- **Theming**: Light/dark mode support
- **Responsive**: Mobile-first design

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Routing**: React Router v6
- **State Management**: React Context API + Custom Hooks
- **Charts**: Recharts
- **Icons**: Lucide React
- **Rich Text**: TipTap
- **Export**: jsPDF, ExcelJS CDN, CSV/JSON/Markdown

## Project Structure

```
HackSprint/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, templates
│   ├── components/        # React components
│   │   ├── layout/       # Layout components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── tasks/        # Task management
│   │   ├── checklist/    # Checklist components
│   │   ├── pitch-prep/   # Pitch preparation
│   │   ├── analytics/    # Analytics components
│   │   ├── templates/    # Template library
│   │   ├── export/       # Export functionality
│   │   ├── auth/         # Authentication
│   │   └── ui/           # Reusable UI components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and service layer
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   ├── routes/           # Route configuration
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
└── Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HackSprint
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `src/services/database/schema.sql`
   - Enable Row Level Security (RLS) policies

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to SQL Editor
3. Run the schema file: `src/services/database/schema.sql`
4. Enable authentication providers (Email, Google, GitHub, etc.)
5. Configure storage buckets for file uploads

### Database Schema

The application uses the following main tables:
- `users` - User profiles
- `hackathons` - Hackathon projects
- `tasks` - Task management
- `checklists` - Checklist items
- `pitches` - Pitch content
- `templates` - Reusable templates
- `analytics` - Analytics data

## Customization

### Theme Configuration

Edit `tailwind.config.js` to customize colors, fonts, and spacing:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
    },
  },
}
```

### Path Aliases

The project uses path aliases for cleaner imports:

```javascript
import Button from '@components/ui/Button'
import { useTasks } from '@hooks/useTasks'
import { supabase } from '@services/supabase'
```

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Security

- Environment variables for sensitive data
- Row Level Security (RLS) in Supabase
- Input validation and sanitization
- XSS protection
- CSRF protection

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- React team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

## Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for hackathon enthusiasts**
