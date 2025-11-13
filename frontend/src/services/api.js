import axios from 'axios';
import { toast } from 'react-toastify';


const api = axios.create({
  baseURL: 'https://cv.nextstepsusmle.com/api',
  withCredentials: true,
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401 && !isRedirecting) {
      isRedirecting = true;
      
      // localStorage.removeItem('user');
      localStorage.removeItem('activeSection');
      localStorage.removeItem('currentCVStep');
      localStorage.removeItem('completedSteps');
      localStorage.setItem('sessionExpired', 'true');
      
      toast.error('Your session has expired. Please login again.', {
        position: 'top-center',
        autoClose: 3000,
      });
      
      window.dispatchEvent(new Event('session-expired'));
      
      setTimeout(() => {
        isRedirecting = false;
      }, 1000);
    }
    
    return Promise.reject(error);
  }
);

export default api;