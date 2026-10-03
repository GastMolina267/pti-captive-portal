export interface Benefit {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  url: string;
  start: string;
  end: string;
  isExclusive?: boolean;
  file?: {
    fileUrl: string;
  } | null;
  shops?: unknown[];
}

