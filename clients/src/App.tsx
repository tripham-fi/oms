import './App.css'

import { Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import LoginPage from './pages/Login/LoginPage';

const Home = () => (
  <div className="p-5 text-center">
    <h1 className="text-3xl font-bold">Welcome to OMS</h1>
    <p>Go to <a href="/login">Login</a></p>
  </div>
);

function App() {

  return (
    <Container fluid className="p-0 min-h-screen">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Default / root route */}
        <Route path="/" element={<Home />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<div className="p-10 text-center text-2xl">404 - Page Not Found</div>} />
      </Routes>
    </Container>
  )
}

export default App
