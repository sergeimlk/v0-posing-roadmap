import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import FormScreen from './components/FormScreen';
import LoadingScreen from './components/LoadingScreen';
import RoadmapScreen from './components/RoadmapScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('form');
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = useCallback((data) => {
    setFormData(data);
    setCurrentScreen('loading');
  }, []);

  const handleLoadingComplete = useCallback((data) => {
    setFormData(data);
    setCurrentScreen('roadmap');
  }, []);

  const handleRestart = useCallback(() => {
    setFormData(null);
    setCurrentScreen('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        {currentScreen === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormScreen onSubmit={handleFormSubmit} />
          </motion.div>
        )}

        {currentScreen === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingScreen
              onComplete={handleLoadingComplete}
              formData={formData}
            />
          </motion.div>
        )}

        {currentScreen === 'roadmap' && formData && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RoadmapScreen
              data={formData}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
