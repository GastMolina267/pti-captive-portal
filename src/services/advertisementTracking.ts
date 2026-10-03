import { axiosInstance } from '../services';

const API_BASE_URL = '/indicators';

export interface BaseTrackingData {
  userId?: string;
  zoneId?: string;
  advertisementId: string;
  platform: string;
  lat?: number;
  lng?: number;
}

export interface RetentionTrackingData extends BaseTrackingData {
  startTime: Date;
  endTime: Date;
}

export class AdvertisementTrackingService {
  async trackView(data: BaseTrackingData): Promise<void> {
    try {
      const payload = {
        advertisementId: data.advertisementId,
        platform: 'portal',
        ...(data.userId && { userId: data.userId }),
        ...(data.zoneId && { zoneId: data.zoneId }),
        ...(data.lat && { lat: data.lat }),
        ...(data.lng && { lng: data.lng }),
      };
      await axiosInstance.post(`${API_BASE_URL}/view`, payload);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }

  async trackClick(data: BaseTrackingData): Promise<void> {
    try {
      const payload = {
        advertisementId: data.advertisementId,
        platform: 'portal',
        ...(data.userId && { userId: data.userId }),
        ...(data.zoneId && { zoneId: data.zoneId }),
        ...(data.lat && { lat: data.lat }),
        ...(data.lng && { lng: data.lng }),
      };
      await axiosInstance.post(`${API_BASE_URL}/click`, payload);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  async trackViewMore(data: BaseTrackingData): Promise<void> {
    try {
      const payload = {
        advertisementId: data.advertisementId,
        platform: 'portal',
        ...(data.userId && { userId: data.userId }),
        ...(data.zoneId && { zoneId: data.zoneId }),
        ...(data.lat && { lat: data.lat }),
        ...(data.lng && { lng: data.lng }),
      };
      await axiosInstance.post(`${API_BASE_URL}/view-more`, payload);
    } catch (error) {
      console.error('Error tracking view more:', error);
    }
  }

  async trackRetention(data: RetentionTrackingData): Promise<void> {
    try {
      const payload = {
        advertisementId: data.advertisementId,
        platform: 'portal',
        ...(data.userId && { userId: data.userId }),
        ...(data.zoneId && { zoneId: data.zoneId }),
        ...(data.lat && { lat: data.lat }),
        ...(data.lng && { lng: data.lng }),
        startTime: data.startTime,
        endTime: data.endTime,
        actionType: 'view',
      };
      await axiosInstance.post(`${API_BASE_URL}`, payload);
    } catch (error) {
      console.error('Error tracking retention:', error);
    }
  }
}

export const advertisementTracking = new AdvertisementTrackingService();
