# Skill Swap Platform

A web-based platform enabling individuals to offer their skills and request others' skills in return, encouraging a barter-based learning and service-sharing community.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication
- **Skill Management**: Offer and request skills with detailed profiles
- **Swap Requests**: Create, accept, reject, and manage skill swaps
- **Rating System**: Rate and provide feedback after successful swaps
- **Admin Panel**: Moderation tools, user management, and analytics
- **Responsive Design**: Mobile-first design with TailwindCSS and ShadCN/UI
- **Search & Filtering**: Find users by skills with pagination
- **File Uploads**: Profile photo management

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS, ShadCN/UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Uploads**: Multer
- **State Management**: React Context
- **Deployment**: Vercel (Frontend) + Render/Heroku (Backend)

## 📁 Project Structure

```
skill-swap-platform/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   └── uploads/            # File upload directory
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skill-swap-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**

   Create `.env` files in both frontend and backend directories:

   **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skill-swap
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Skill Swap Platform
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📋 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build both applications for production
- `npm run test` - Run tests for both frontend and backend
- `npm run install:all` - Install dependencies for all packages

## 🔐 Authentication

The platform uses JWT tokens for authentication. Users can:
- Register with email and password
- Login to access protected features
- Maintain session across browser sessions

## 👥 User Roles

1. **Public Users**: Can browse public profiles and view available skills
2. **Registered Users**: Can create profiles, offer skills, and request swaps
3. **Admin Users**: Can moderate content, manage users, and view analytics

## 📱 Screens & Features

1. **Home Page** - Browse users and skills (public)
2. **Login/Register** - User authentication
3. **User Profile** - Manage personal profile and skills
4. **Other User Profile** - View other users' public profiles
5. **Request Modal** - Create skill swap requests
6. **Swap Dashboard** - Manage sent and received requests
7. **Admin Panel** - Moderation and analytics (admin only)

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  profilePhotoUrl: String,
  location: String,
  skillsOffered: [String],
  skillsWanted: [String],
  availability: String,
  profileStatus: "public" | "private",
  isBanned: Boolean,
  averageRating: Number,
  feedbacks: [{ userId, rating, message }]
}
```

### SwapRequests Collection
```javascript
{
  _id: ObjectId,
  fromUser: ObjectId,
  toUser: ObjectId,
  offeredSkill: String,
  requestedSkill: String,
  message: String,
  status: "pending" | "accepted" | "rejected",
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Render/Heroku)
1. Connect your repository
2. Set environment variables
3. Deploy with automatic scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team. 