# 🔄 Skill Swap Platform

## 🧩 Problem Statement  
Build a collaborative, AI-integrated **Skill Swap Platform** where users can offer and request skills (e.g., graphic design for web development), send swap requests, chat, and maintain verified profiles. Only authenticated users can interact. The system includes profile visibility settings and real-time notifications.

---

## 🧑‍🤝‍🧑 Team Name  
**Team 1799**

---

## 👥 Team Members & Team Lead Details

### 👨‍💼 Team Leader  
- **Name**: Jaimish Satani  
- **Email**: jaimishsatani@gmail.com  
- **Phone**: 9712422126  

### 👨‍💻 Reviewer  
- **Name**: Jitendra Kumar Prajapat (jipr)  
- **Email**: jipr@odoo.com  

### 👤 Team Member 1  
- **Name**: Jasmin Radadiya  
- **Email**: jasminradadiya29@gmail.com  
- **Phone**: 8320711810  

### 👤 Team Member 2  
- **Name**: Nakulkumar Rathod  
- **Email**: nakulrathod8586@gmail.com  
- **Phone**: 9081007646  

### 👤 Team Member 3  
- **Name**: Hiren Savaliya  
- **Email**: hirenn158@gmail.com  
- **Phone**: 9016954158  

---

## 📧 Collaborator Access  

**📧 Email**: jipr@odoo.com

---

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
