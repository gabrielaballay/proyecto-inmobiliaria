import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { Toaster } from 'sonner';
import AppToaster from './components/AppToaster';

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

            <div className="min-h-screen bg-background-light dark:bg-background-dark selection:bg-primary selection:text-white transition-colors duration-300">
                <div className="max-w-3xl mx-auto">
                    <AppToaster/>
                </div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/list" element={<PropertyList />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/settings/help" element={<HelpFAQ />} />
                    <Route path="/settings/terms" element={<TermsPrivacy />} />
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
                    <Route path="/dashboard"
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
                            <ProtectedRoute>
                                <PropertyForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/edit/:id"
                        element={
                            <ProtectedRoute>
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