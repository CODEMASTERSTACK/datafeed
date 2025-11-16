export interface DataResponse {
  id?: string;
  name: string;
  strength: string | string[];
  weakness: string | string[];
  habits: string;
  speechTone: string;
  nature: string;
  createdAt?: string;
  isSubmitted?: boolean;
}

export interface UserSession {
  name: string;
  createdAt: string;
}
