import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import Courses from "./pages/courses/Courses";
import { CourseContextProvider } from "./context/CourseContext"; // ✅ Import CourseContextProvider
import CourseDescription from "./pages/coursedescription/CourseDescription";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashboard from "./pages/dashboard/Dashboard";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";

const App = () => {
  const { isAuth, user } = UserData();
  console.log("isAuth:", isAuth, "User:", user);

  return (
    <CourseContextProvider> {/* ✅ Wrap entire app with provider */}
      <BrowserRouter>
        <Header isAuth={isAuth} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/account" element={isAuth ? <Account user={user}/> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={isAuth ? <Home /> : <Register />} />
          {/* <Route path="/course/:id" element={isAuth ? <CourseDescription user={user}/>:<Login />} */}
          <Route path="/course/:id" element={isAuth ? <CourseDescription user={user}/> : <Login />} />

          <Route path="/payment-success/:id" element={isAuth ? <PaymentSuccess user={user}/> : <Login />}/>
          <Route path="/:id/dashboard" element={isAuth ? <Dashboard user={user}/> : <Login />}/>
          <Route path="/course/study/:id" element={isAuth ? <CourseStudy user={user}/> : <Login />}/>
          <Route path="/lectures/:id" element={isAuth ? <Lecture user={user}/> : <Login />}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </CourseContextProvider>
  );
};

export default App;


