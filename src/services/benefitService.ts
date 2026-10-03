import { axiosInstance } from './index';
import { Benefit } from '../interfaces/benefitInterfaces';

export const benefitService = {
  getBenefits: async (): Promise<Benefit[]> => {
    try {
      const response = await axiosInstance.get<Benefit[]>('/benefits');
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits:', error);
      throw error;
    }
  },
};
export default benefitService;
