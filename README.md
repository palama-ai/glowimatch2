# 🌟 GlowMatch - AI Skincare Analysis & Recommendations

An AI-powered skincare analysis platform with personalized beauty recommendations, interactive quizzes, and comprehensive user dashboards.

## ✨ Core Features

- 🎯 **Smart Skincare Quiz** - Interactive questionnaire for skin type and condition analysis
- 📸 **Image Analysis** - AI-powered image analysis for skincare recommendations
- 📊 **Results Dashboard** - Comprehensive view of analysis results and recommendations
- 📜 **Quiz History** - Track all previous quiz attempts and results
- 🔔 **Notifications System** - Real-time notifications and broadcast messages
- 🎁 **Referral Program** - Track and manage user referrals with incentives
- 📝 **Blog Management** - Admin blog posts with image uploads
- 👥 **Admin Dashboard** - Comprehensive admin analytics and user management
- 💬 **Contact System** - User contact form with admin management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Context API** - State management

### Backend
- **Node.js + Express** - REST API server
- **SQLite (better-sqlite3)** - Lightweight database
- **JWT Authentication** - Secure user authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Git

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/glowmatch-skincare.git
cd glowmatch-skincare

# Install dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Configuration

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:4000/api
```

Create a `.env` file in the `backend` directory:

```env
GLOWMATCH_DB_PATH=./data.db
GLOWMATCH_JWT_SECRET=your_secret_key_here
GLOWMATCH_ADMIN_EMAIL=admin@glowmatch.com
GLOWMATCH_ADMIN_PASSWORD=Adm1n!Glow2025#
```

### Running the Application

**Development Mode:**

```bash
# Terminal 1 - Frontend (runs on http://localhost:5173)
npm run dev

# Terminal 2 - Backend (runs on http://localhost:4000)
cd backend
npm run dev
```

**Production Build:**

```bash
npm run build
cd backend
npm start
```

## 📁 Project Structure

```
glowmatch-skincare/
├── src/                           # React Frontend
│   ├── components/                # Reusable UI components
│   ├── pages/                     # Page components
│   ├── contexts/                  # Context API providers
│   ├── lib/                       # Utility libraries
│   ├── stores/                    # State management
│   ├── utils/                     # Helper functions
│   ├── styles/                    # Global styles
│   ├── App.jsx                    # Main app component
│   ├── Routes.jsx                 # Route definitions
│   └── index.jsx                  # Entry point
├── backend/                       # Express Backend
│   ├── routes/                    # API routes
│   ├── lib/                       # Backend utilities
│   ├── db.js                      # Database initialization
│   ├── index.js                   # Server entry point
│   └── package.json               # Backend dependencies
├── public/                        # Static assets
├── .env                          # Frontend environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Frontend dependencies
├── vite.config.mjs               # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
└── README.md                     # This file
```

## 🔑 Key Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Landing page and main hub |
| Quiz | `/quiz` | Interactive skincare quiz |
| Upload Analysis | `/upload-analysis` | Image-based skin analysis |
| Results | `/results/:id` | Quiz results and recommendations |
| Quiz History | `/quiz-history` | View all previous attempts |
| Notifications | `/notifications` | User notifications |
| Blog | `/blog` | Public blog posts |
| Blog Post | `/blog/:slug` | Individual blog post |
| Admin Dashboard | `/admin` | Admin analytics and controls |
| Manage Blogs | `/admin/blogs` | Create/edit/delete blog posts |
| Manage Users | `/admin/users` | View and manage users |
| Admin Messages | `/admin/messages` | Contact form messages |

## 🔐 Authentication

- JWT-based authentication with 30-day token expiry
- Default admin account created on first setup:
  - Email: `admin@glowmatch.com`
  - Password: (set via `GLOWMATCH_ADMIN_PASSWORD`)
- Secure password hashing with Bcrypt

## 📊 Database Schema

**Core Tables:**
- `users` - User accounts and profiles
- `user_profiles` - Extended user information
- `user_subscriptions` - Subscription management
- `quiz_attempts` - Quiz history and results
- `quiz_autosave` - Auto-saved quiz data
- `blogs` - Blog posts with image support
- `notifications` - System notifications
- `contact_messages` - Contact form submissions
- `referrals` - Referral tracking

## 🎨 UI Features

- Dark/Light theme support
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications
- Modal dialogs

## 📸 Recent Additions

### Blog Image Upload (v1.1)
- Upload images for blog posts
- Image preview in admin
- Featured images on blog pages
- Base64 storage (ready for cloud integration)

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the `dist` folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables in deployment platform
# Push to deployment service
```

## 📝 API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Blogs
- `GET /blogs` - Get published blogs (public)
- `GET /admin/blogs` - Get all blogs (admin)
- `POST /admin/blogs` - Create blog (admin)
- `PUT /admin/blogs/:id` - Update blog (admin)
- `DELETE /admin/blogs/:id` - Delete blog (admin)
- `POST /admin/blogs/upload` - Upload blog image (admin)

### Admin
- `GET /admin/users` - List users
- `GET /admin/stats` - Get statistics
- `GET /admin/messages` - Get contact messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- Icons from Lucide React
- Database powered by SQLite

## 📞 Support

For issues, questions, or suggestions:
- Open an Issue on GitHub
- Contact: support@glowmatch.com

---

Built with ❤️ for beautiful, healthy skin

Last Updated: November 27, 2025 ✨

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new
#   g l o w i m a t c h 2  
 