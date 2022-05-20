// TODO: make folder structure smarter  X
// TODO: create a separate service for handling HTTP requests, use axios instead of fetch => done
// TODO: don't forget about error handling => done
// TODO: try to avoid using id attribute on elements and direct accesses to DOM elements, check useRef hook => Done
// TODO: add pre-commit hook for validating eslint rules (check husky library) X
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import StartPage from './Components/StartPage/StartPage.js';
import MainPage from './Components/MainPage/MainPage.js';
import SignIn from './Components/StartPage/SignIn';
import SignUp from './Components/StartPage/SignUp';
import Dashboard from './Components/MainPage/Dashboard/Dashboard.js';
import Board from './Components/MainPage/Board/Board.js';
import AuthProvider from './AuthProvider';
import Profile from './Components/MainPage/Profile/Profile.js';
import TaskWindow from './Components/MainPage/Board/TaskWindow';

import { useAuth } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="signin" />}></Route>
        <Route path="/" element={<StartPage />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="boards/:boardId" element={<Board />}>
            <Route path="task/create/:stateId" element={<TaskWindow />} />
            <Route path="task/:taskId" element={<TaskWindow />} />
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default App;
