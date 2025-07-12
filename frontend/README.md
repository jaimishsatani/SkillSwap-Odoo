# Skill Swap Platform - Frontend

A modern, responsive React frontend for the Skill Swap Platform that enables users to exchange skills and knowledge in a collaborative community.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/registration with JWT
- **Profile Management**: Complete user profiles with skills, availability, and visibility settings
- **Skill Exploration**: Browse and search users by skills and availability
- **Swap Requests**: Send, accept, reject, and manage skill swap requests
- **Rating System**: Rate and review completed swaps
- **Admin Dashboard**: Comprehensive admin panel for platform management

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Interface**: Clean, intuitive design with smooth animations
- **Real-time Feedback**: Toast notifications for user actions
- **Loading States**: Proper loading indicators throughout the app
- **Form Validation**: Client-side validation with error handling

## 🛠 Tech Stack

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **Axios**: HTTP client for API communication
- **React Hot Toast**: Toast notifications
- **React Hook Form**: Form handling and validation

## 📦 Installation

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── LoadingSpinner.js
│   │   ├── StarRating.js
│   │   └── SkillTag.js
│   └── layout/           # Layout components
│       ├── Navbar.js
│       └── Footer.js
├── contexts/
│   └── AuthContext.js    # Authentication context
├── pages/
│   ├── auth/            # Authentication pages
│   │   ├── Login.js
│   │   └── Register.js
│   ├── admin/           # Admin pages
│   │   └── AdminDashboard.js
│   ├── Home.js          # Landing page
│   ├── Explore.js       # User exploration
│   ├── Profile.js       # User profile
│   └── SwapRequests.js  # Swap management
├── App.js               # Main app component
├── index.js             # App entry point
└── index.css            # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#3b82f6` to `#8b5cf6`)
- **Secondary**: Gray scale for text and backgrounds
- **Success**: Green for positive actions
- **Warning**: Yellow for pending states
- **Error**: Red for errors and destructive actions

### Components
- **Buttons**: Primary, secondary, and danger variants
- **Cards**: Consistent card layouts with shadows
- **Forms**: Styled form inputs with validation states
- **Tags**: Skill tags with different color schemes

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🌐 API Integration

The frontend communicates with the backend API through the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/explore` - Get public users
- `GET /api/users/profile` - Get own profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-photo` - Upload profile photo

### Swaps
- `GET /api/swaps/requests` - Get swap requests
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id/accept` - Accept swap
- `PUT /api/swaps/:id/reject` - Reject swap
- `DELETE /api/swaps/:id` - Cancel swap

### Admin (Admin only)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/swaps` - All swaps
- `PUT /api/admin/users/:id/ban` - Ban user
- `PUT /api/admin/users/:id/unban` - Unban user
- `GET /api/admin/reports/:type` - Download reports

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route protection for authenticated users
- **Admin Authorization**: Role-based access control for admin features
- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: Sanitized user inputs

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎯 Key Features Implementation

### 1. User Authentication
- Secure login/registration forms
- Password visibility toggle
- Form validation with error messages
- Automatic token management

### 2. Profile Management
- Editable user profiles
- Skill management (add/remove skills)
- Availability settings
- Profile photo upload
- Public/private profile toggle

### 3. Skill Exploration
- Search functionality
- Filter by skills and availability
- User cards with key information
- Quick action buttons

### 4. Swap Request System
- Send swap requests
- Accept/reject incoming requests
- Cancel pending requests
- Status tracking

### 5. Admin Dashboard
- Platform statistics
- User management (ban/unban)
- Swap monitoring
- Report generation

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Environment Variables
```env
REACT_APP_API_URL=https://your-backend-url.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

**Skill Swap Platform** - Connect, Learn, and Exchange Skills 