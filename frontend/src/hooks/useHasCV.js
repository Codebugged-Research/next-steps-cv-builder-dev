import { useState, useEffect } from 'react';
import api from '../services/api';

const useHasCV = () => {
  const [hasCV, setHasCV] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfCVExists = async () => {
      try {
        const userResponse = await api.get('/users/current-user');
        const userId = userResponse.data.data._id;

        const cvResponse = await api.get(`/cv/${userId}`);
        if (cvResponse.data.success && cvResponse.data.data) {
          setHasCV(true);
        } else {
          setHasCV(false);
        }
      } catch (error) {
        console.error('Error checking CV existence:', error);
        setHasCV(false);
      } finally {
        setLoading(false);
      }
    };

    checkIfCVExists();
  }, []);

  return { hasCV, loading };
};

export default useHasCV;
