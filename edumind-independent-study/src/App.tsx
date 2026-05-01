import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForms } from './components/AuthForms';
import { CourseViewer } from './components/CourseViewer';
import { Course } from './types';

const AppContent = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/courses')
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data)) {
            setCourses(data);
          } else {
            setCourses([]);
          }
        })
        .catch(() => setCourses([]));
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-indigo-600"
        >
          <GraduationCap size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div
          key="viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen w-screen"
        >
          <CourseViewer courses={courses} onLogout={handleLogout} />
        </motion.div>
      ) : (
        <motion.div
          key="auth"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="min-h-screen flex items-center justify-center p-6 bg-[#F3F4F6]"
        >
          <AuthForms />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

