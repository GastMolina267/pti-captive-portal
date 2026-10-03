import { advertisementTracking } from './advertisementTracking';
import { axiosInstance } from '../services'; 

jest.mock('../services', () => ({
  axiosInstance: {
    post: jest.fn(),
  },
}));

describe('AdvertisementTrackingService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const baseData = {
    advertisementId: 'ad-123',
    platform: 'portal', 
    userId: 'user-1',
    zoneId: 'zone-1',
    lat: 12.34,
    lng: 56.78,
  };

  describe('trackView', () => {
    it('debe enviar los datos de view correctamente', async () => {
      (axiosInstance.post as jest.Mock).mockResolvedValue({});
      await advertisementTracking.trackView(baseData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/indicators/view', {
        advertisementId: baseData.advertisementId,
        platform: 'portal',
        userId: baseData.userId,
        zoneId: baseData.zoneId,
        lat: baseData.lat,
        lng: baseData.lng,
      });
    });

    it('debe manejar errores sin lanzar excepción', async () => {
      (axiosInstance.post as jest.Mock).mockRejectedValue(new Error('Error'));
      await advertisementTracking.trackView(baseData);
    });
  });

  describe('trackClick', () => {
    it('debe enviar los datos de click correctamente', async () => {
      (axiosInstance.post as jest.Mock).mockResolvedValue({});
      await advertisementTracking.trackClick(baseData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/indicators/click', {
        advertisementId: baseData.advertisementId,
        platform: 'portal',
        userId: baseData.userId,
        zoneId: baseData.zoneId,
        lat: baseData.lat,
        lng: baseData.lng,
      });
    });
  });

  describe('trackViewMore', () => {
    it('debe enviar los datos de view-more correctamente', async () => {
      (axiosInstance.post as jest.Mock).mockResolvedValue({});
      await advertisementTracking.trackViewMore(baseData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/indicators/view-more', {
        advertisementId: baseData.advertisementId,
        platform: 'portal',
        userId: baseData.userId,
        zoneId: baseData.zoneId,
        lat: baseData.lat,
        lng: baseData.lng,
      });
    });
  });

  describe('trackRetention', () => {
    it('debe enviar los datos de retention correctamente', async () => {
      (axiosInstance.post as jest.Mock).mockResolvedValue({});
      const retentionData = {
        ...baseData,
        startTime: new Date('2023-01-01T00:00:00Z'),
        endTime: new Date('2023-01-01T01:00:00Z'),
      };
      await advertisementTracking.trackRetention(retentionData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/indicators', {
        advertisementId: baseData.advertisementId,
        platform: 'portal',
        userId: baseData.userId,
        zoneId: baseData.zoneId,
        lat: baseData.lat,
        lng: baseData.lng,
        startTime: retentionData.startTime,
        endTime: retentionData.endTime,
        actionType: 'view',
      });
    });
  });
});
