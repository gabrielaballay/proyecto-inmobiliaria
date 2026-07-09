import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import AccountSettings from './pages/AccountSettings';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import SecuritySettings from './pages/SecuritySettings';
import LanguageSettings from './pages/LanguageSettings';
import HelpFAQ from './pages/HelpFAQ';
import TermsPrivacy from './pages/TermsPrivacy';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import PropertyForm from './pages/PropertyForm';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast'; //comentario para ver si funciona el git


const GaleriaPropiedades: React.FC = () => {
  
  const fotos = Array.from({ length: 49 }, (_, i) => `image (${i + 1}).jpeg`);
  fotos.unshift("image.jpeg"); 

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="text-primary font-bold mb-6 inline-block hover:underline">
          ← Volver al Panel
        </Link>
        
        <h1 className="text-3xl font-black text-navy dark:text-white mb-2">
          Galería de Imágenes
        </h1>
        <p className="text-gray-500 mb-8">Visualización de archivos en la carpeta /images</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fotos.map((foto, index) => (
            <div key={index} className="group relative bg-white dark:bg-navy rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <img 
                src={`./images/${foto}`} 
                alt={`Propiedad ${index}`}
                className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+encontrada';
                }}
              />
              <div className="p-3">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  {foto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      {}
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#171717',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #e5e5e5',
            letterSpacing: '0.05em'
          }
        }} 
      />

      <div className="min-h-screen bg-background-light dark:bg-background-dark selection:bg-primary selection:text-white transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
                    
          <Route path="/ver-fotos" element={<GaleriaPropiedades />} /> 
          <Route path="/list" element={<PropertyList />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/profile"
              element={
                  <ProtectedRoute>
                      <Profile />
                  </ProtectedRoute>
              }
          />
          <Route path="/profile/edit"
              element={
                  <ProtectedRoute>
                      <EditProfile />
                  </ProtectedRoute>
              }
          />
          <Route path="/settings"
              element={
                  <ProtectedRoute>
                      <AccountSettings
                          darkMode={darkMode}
                          onToggleDarkMode={toggleDarkMode}
                      />
                  </ProtectedRoute>
              }
          />
          <Route path="/settings/security"
              element={
                  <ProtectedRoute>
                      <SecuritySettings />
                  </ProtectedRoute>
              }
          />
          <Route path="/settings/language"
              element={
                  <ProtectedRoute>
                      <LanguageSettings />
                  </ProtectedRoute>
              }
          />
          <Route path="/settings/help"
              element={
                  <ProtectedRoute>
                      <HelpFAQ />
                  </ProtectedRoute>
              }
          />
          <Route path="/settings/terms"
              element={
                  <ProtectedRoute>
                      <TermsPrivacy />
                  </ProtectedRoute>
              }
          />
          <Route path="/admin"
              element={
                  <ProtectedRoute>
                      <AdminDashboard />
                  </ProtectedRoute>
              }
          />
          <Route path="/admin/users"
              element={
                  <ProtectedRoute roles={["ADMIN"]}>
                      <AdminUsers />
                  </ProtectedRoute>
              }
          />
          <Route path="/admin/new"
              element={
                  <ProtectedRoute roles={["ADMIN"]}>
                      <PropertyForm />
                  </ProtectedRoute>
              }
          />
          <Route path="/admin/edit/:id"
              element={
                  <ProtectedRoute roles={["ADMIN"]}>
                      <PropertyForm />
                  </ProtectedRoute>
              }
          />
          <Route path="*"
              element={
                  <Navigate
                      to="/"
                      replace
                  />
              }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;