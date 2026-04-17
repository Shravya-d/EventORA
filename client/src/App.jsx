import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import EventDetails from './pages/EventDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentFailed from './pages/PaymentFailed.jsx';

function App() {


  return (
    <div>



      <Navbar />

      <Routes>
        {/* 🏠 Home Page */}
        <Route path="/" element={<Home />} />

        {/* 📝 Register Page */}
        <Route path="/register" element={<Register />} />

        //Login page
        <Route path="/login" element={<Login />} />

        //Event details page
        <Route path="/event/:id" element={<EventDetails />} />

        {/* 👤 User */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* 👨‍💼 Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 💳 Payment */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />

      </Routes>



    </div>

  )
}

export default App
