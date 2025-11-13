import { useState, useEffect } from "react";
import api from '../services/api.js';

export default function useCVData(userId) {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setCv(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    api.get(`/cv/${userId}`, { withCredentials: true })
      .then(res => {
        setCv(res.data);
      })
      .catch(() => {
        setCv(null);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { cv, loading };
}
