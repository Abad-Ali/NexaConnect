# 🌐 NexaConnect

**NexaConnect** is a full-stack **social media web application** where users can **sign up, log in, create posts, interact with others, and chat in real-time**.  
It provides a **modern, responsive UI**, secure authentication, and media handling.

---

## 🌟 Features

✨ User Signup & Login  
🔐 Secure authentication with **JWT & Bcrypt**  
📝 Users can:
- Create posts with captions  
- Like & comment on posts  
- Delete their own posts  
- Follow other users  
- View followers and following  

💬 Real-time chat using **Socket.io**  
🔗 Share posts to external platforms (WhatsApp, Instagram, etc.)  
📱 Fully responsive UI 
☁️ Upload images via **Cloudinary**  
⚡ Smooth UI interactions with **Radix UI, Swiper, and React Icons**

---

## 🌐 Live Preview

🚀 **Live Demo:**  
👉 [NexaConnect Live Preview](https://nexaconnect.vercel.app/)  
🔗 _Backend deployed separately and connected via REST API._

---

## 🛠️ Tech Stack

### 🚀 Frontend
- **Next.js**
- **Tailwind CSS**
- **Redux Toolkit & React Redux**
- **React Icons**
- **Axios**
- **Swiper**
- **Socket.io Client**
- **Radix UI**

### ⚙️ Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT**
- **Bcrypt.js**
- **Cloudinary & Multer**
- **Sharp**
- **Cookie Parser**
- **CORS**
- **Dotenv**

---

## 📂 Folder Structure

```bash
backend/
├── controllers/
│   ├── message.controller.js
│   ├── post.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── isAuthenticated.js
│   └── multer.js
├── models/
│   ├── comment.model.js
│   ├── conversation.model.js
│   ├── message.model.js
│   ├── post.model.js
│   └── user.model.js
├── routers/
│   ├── messages.router.js
│   ├── post.router.js
│   └── user.route.js
├── socket/
│   └── socket.js
├── utils/
│   └── index.js
├── package.json
└── package-lock.json

frontend/
├── app/
│   ├── account/edit/page.js
│   ├── chat/[userId]/page.js
│   ├── chat/page.js
│   ├── followersorfollowing/[id]/page.js
│   ├── login/page.js
│   ├── post/[id]/page.js
│   ├── profile/[id]/page.js
│   ├── search/page.js
│   ├── signup/page.js
│   ├── SocketIOProvider.js
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   └── provider.js
├── components/
│   ├── ui/
│   │   ├── AuthGuard.js
│   │   ├── CarouselSuggetedUser.jsx
│   │   ├── Comment.jsx
│   │   ├── CommentDialog.jsx
│   │   ├── CreatePost.jsx
│   │   ├── Feed.jsx
│   │   ├── Header.jsx
│   │   ├── LeftSideBar.jsx
│   │   ├── Messages.jsx
│   │   ├── Post.jsx
│   │   ├── Posts.jsx
│   │   ├── RightSideBar.jsx
│   │   ├── SinglePost.jsx
│   │   └── SuggestedUsers.jsx
├── hooks/
│   ├── useGetAllMessage.jsx
│   ├── useGetAllPosts.jsx
│   ├── useGetRTM.jsx
│   ├── useGetSuggestedUsers.jsx
│   └── useGetUserProfile.jsx
├── lib/
│   ├── follow.js
│   └── utils.js
├── public/
│   ├── NexaConnect.png
│   ├── bg.png
│   ├── default_pic.jpg
│   ├── file.svg
│   ├── globe.svg
│   ├── logo_icon.png
│   ├── next.svg
│   ├── textLogo.png
│   ├── vercel.svg
│   └── window.svg
├── redux/
│   ├── authSlice.js
│   ├── chatSlice.js
│   ├── postSlice.js
│   ├── rtnSlice.js
│   ├── socketSlice.js
│   └── store.js
├── .gitignore
├── components.json
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
└── README.md
````

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Abad-Ali/NexaConnect.git
cd NecaConnect
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend server:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Authentication

* Users can **sign up** and **log in**
* JWT used for secure authorization
* Passwords hashed with **Bcrypt.js**
* Protected routes via middleware

---

## 💬 Real-Time Features

* Chat powered by **Socket.io**
* Live notifications for likes/comments
* Smooth UI interactions using **Swiper** & **Radix UI**

---

## 📱 Responsive UI

* 📱 Mobile-first design
* 💻 Desktop & tablet optimized
* 🌙 Dark/Light mode support with **Next Themes**

---

## 📸 Screenshots

<details>
  <summary>Click to expand</summary>

![Signup Page](https://github.com/Abad-Ali/NexaConnect/blob/3490ae67ac842f61b7531db6607b4f4669029460/nexaconnect_signup.png)
![Login Page](https://github.com/Abad-Ali/NexaConnect/blob/3490ae67ac842f61b7531db6607b4f4669029460/nexaconnect_login.png)
![Feed Page](https://github.com/Abad-Ali/NexaConnect/blob/3490ae67ac842f61b7531db6607b4f4669029460/nexaconnect_home.png)
![Chat Page](https://github.com/Abad-Ali/NexaConnect/blob/3490ae67ac842f61b7531db6607b4f4669029460/nexaconnect_chat.png)
![Search Page](https://github.com/Abad-Ali/NexaConnect/blob/3490ae67ac842f61b7531db6607b4f4669029460/nexaconnect_search.png)
![Mobile View](https://github.com/Abad-Ali/NexaConnect/blob/3490ae67ac842f61b7531db6607b4f4669029460/nexaconnect_mobileView.png)

</details>

---

## 🤝 Contributing

Contributions are welcome!
Fork the repository, create a branch, and submit a pull request 🚀

---

## 👤 Author

**Abad Ali**  

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Abad-Ali)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abadali-dev)
---

*Thanks for checking out NecaConnect! Feel free to star ⭐ this repo.*
