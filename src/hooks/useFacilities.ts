// src/hooks/useFacilities.ts
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.ts';

export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const { data } = await api.get('/facilities'); // your endpoint
      return data;
    },
    // Optional: only enable when logged in
    // enabled: !!localStorage.getItem('access_token'),
  });
};