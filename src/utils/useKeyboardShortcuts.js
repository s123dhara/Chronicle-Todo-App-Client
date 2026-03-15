import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook for handling keyboard shortcuts
 * Currently supports: Ctrl+Shift+S to toggle secret status dashboard
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+Shift+S to toggle secret dashboard
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        if (location.pathname === '/secret-status') {
          navigate(-1); // Go back to previous page
        } else {
          navigate('/secret-status');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, location]);
}
