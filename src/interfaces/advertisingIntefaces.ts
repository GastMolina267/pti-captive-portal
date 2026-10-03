export interface Advertisement {
  id: string;
  name: string;
  file?: {
    fileUrl: string;
  };
  description: string;
  showPortal: boolean;
  url?: string;
  zones?: {
    pointsList: string;
  }[];
  start: string;
  end: string;
  schedules?: {
    day: number;
    startTime: string;
    endTime: string;
  }[];
}

export interface FilteredAdvertisement {
  id: string;
  name: string;
  url: string;
  duration: number | null;
  file: {
    id: string;
    name: string;
    fileUrl: string;
  };
}
