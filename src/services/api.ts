import { Platform } from 'react-native';

declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_API_TOKEN?: string;
    [key: string]: string | undefined;
  };
};

export interface BackendDriver {
  id: string;
  name: string;
  email?: string;
  phone: string;
  simNumber?: string;
  score: number;
  trips: number;
  braking: number;
  speeding: number;
  version?: number;
}

export interface BackendStop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'dropoff';
  status: 'pending' | 'arrived' | 'delivered' | 'failed_attempt';
  failureReason?: string;
  epod?: {
    recipient: string;
    photo?: string;
    signature?: string;
    at: string;
  };
}

export interface BackendTrip {
  id: string;
  code: string;
  vehicleId: string;
  driverId: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  distance: number;
  duration: number;
  key?: string;
  stops: BackendStop[];
}

export interface BackendVehicle {
  id: string;
  plate: string;
  model: string;
  type: string;
  status: 'moving' | 'idle' | 'service';
  driverId: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  fuel: number;
  brake: number;
  odometer: number;
  health: number;
  location: string;
  version?: number;
}

export interface BackendContract {
  id: string;
  driverId: string;
  vehicleId: string;
  total: number;
  openingBalance: number;
  months: number;
  elapsed: number;
  tenureMonths?: number;
  monthsPaid?: number;
  vehicleName?: string;
  vehiclePlate?: string;
}

export interface BackendLedgerItem {
  id: string;
  contractId: string;
  tripId: string;
  amount: number;
  at: string;
  note?: string;
}

export interface BackendNotice {
  id: string;
  title: string;
  description: string;
  kind: 'trip' | 'sos' | 'health' | 'system';
  href?: string;
  at: string;
  status: 'unread' | 'read' | 'dismissed';
}

export interface MobileDashboardData {
  source: string;
  driver: BackendDriver;
  trips: BackendTrip[];
  vehicles: BackendVehicle[];
  contracts: BackendContract[];
  ledger: BackendLedgerItem[];
  notices: BackendNotice[];
  availableDrivers: Array<{ id: string; name: string; phone: string; score: number }>;
}

let customApiUrl: string | null = null;
let customApiToken: string | null = null;

export function setCustomApiUrl(url: string | null) {
  customApiUrl = url;
}

export function setCustomApiToken(token: string | null) {
  customApiToken = token;
}

export function getApiBaseUrl(): string {
  if (customApiUrl && customApiUrl.trim()) {
    return customApiUrl.trim().replace(/\/+$/, '');
  }
  // Expo public env variable if set
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  // Android emulator maps 10.0.2.2 to host loopback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
}

export function getApiToken(): string {
  if (customApiToken && customApiToken.trim()) {
    return customApiToken.trim();
  }
  return process.env.EXPO_PUBLIC_API_TOKEN || 'fleetra-qa-local-token';
}

async function request<T>(
  path: string,
  options: RequestInit & { driverId?: string; userEmail?: string } = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const token = getApiToken();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (options.driverId) {
    headers['x-driver-id'] = options.driverId;
  }
  if (options.userEmail) {
    headers['x-user-email'] = options.userEmail;
  }

  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Server error ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {
      // Fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const mobileApi = {
  /**
   * Fetch all operational data for current driver from backend MariaDB:
   * driver profile, active trip, all stops, vehicle telemetry, RTO contract & ledger, notices.
   */
  async getDashboardData(driverId?: string, userEmail?: string): Promise<MobileDashboardData> {
    return request<MobileDashboardData>('/api/mobile', {
      method: 'GET',
      driverId,
      userEmail,
    });
  },

  /**
   * Start a trip (sets status to in_progress and vehicle status to moving)
   */
  async startTrip(tripId: string, driverId?: string): Promise<{ id: string }> {
    return request<{ id: string }>('/api/mobile', {
      method: 'POST',
      driverId,
      body: JSON.stringify({
        type: 'trip.started',
        tripId,
      }),
    });
  },

  /**
   * Mark arrival at a stop (sets stop status to arrived)
   */
  async arriveAtStop(tripId: string, stopId: string, driverId?: string): Promise<{ id: string }> {
    return request<{ id: string }>('/api/mobile', {
      method: 'POST',
      driverId,
      body: JSON.stringify({
        type: 'stop.arrived',
        tripId,
        stopId,
      }),
    });
  },

  /**
   * Confirm pickup at origin warehouse
   */
  async confirmPickup(tripId: string, stopId: string, driverId?: string): Promise<{ id: string }> {
    return request<{ id: string }>('/api/mobile', {
      method: 'POST',
      driverId,
      body: JSON.stringify({
        type: 'stop.pickup_confirmed',
        tripId,
        stopId,
      }),
    });
  },

  /**
   * Submit e-POD (recipient name, photo, signature) for a drop-off stop.
   * If this was the last stop, the backend automatically completes the trip
   * and creates an RTO equity ledger contribution.
   */
  async submitEpod(
    tripId: string,
    stopId: string,
    recipient: string,
    photo: string,
    signature: string,
    driverId?: string
  ): Promise<{ id: string }> {
    return request<{ id: string }>('/api/mobile', {
      method: 'POST',
      driverId,
      body: JSON.stringify({
        type: 'epod.submitted',
        tripId,
        stopId,
        recipient,
        photo,
        signature,
      }),
    });
  },

  /**
   * Report a failed delivery attempt at a stop
   */
  async reportFailedStop(
    tripId: string,
    stopId: string,
    reason: string,
    driverId?: string
  ): Promise<{ id: string }> {
    return request<{ id: string }>('/api/mobile', {
      method: 'POST',
      driverId,
      body: JSON.stringify({
        type: 'stop.failed',
        tripId,
        stopId,
        reason,
      }),
    });
  },

  /**
   * Send panic SOS alert to Dispatcher Web Dashboard with idempotency key
   */
  async sendSos(
    tripId: string,
    reason: string,
    driverId?: string
  ): Promise<{ id: string }> {
    const key = `sos-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    return request<{ id: string }>('/api/mobile', {
      method: 'POST',
      driverId,
      body: JSON.stringify({
        type: 'sos.sent',
        tripId,
        key,
        reason,
      }),
    });
  },

  /**
   * Update driver profile contact info & vehicle assignment
   */
  async updateProfile(
    phone?: string,
    name?: string,
    driverId?: string,
    vehicleModel?: string,
    vehiclePlate?: string
  ): Promise<{ id: string }> {
    return request<{ id: string }>('/api/mobile', {
      method: 'POST',
      driverId,
      body: JSON.stringify({
        type: 'profile.updated',
        phone,
        name,
        vehicleModel,
        vehiclePlate,
      }),
    });
  },

  /**
   * Login with email or phone and password using backend auth
   */
  async login(
    identifier: string,
    password: string
  ): Promise<{
    ok: boolean;
    driverId: string;
    token: string;
    driver: { id: string; name: string; email: string; phone?: string; score: number };
  }> {
    return request('/api/mobile/auth', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  /**
   * Register driver account directly into backend MariaDB
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    simNumber?: string;
    vehicleModel?: string;
    vehiclePlate?: string;
    vehicleType?: string;
  }): Promise<{
    ok: boolean;
    driverId: string;
    token: string;
    user: { id: string; name: string; email: string; phone?: string };
    message: string;
  }> {
    return request('/api/mobile/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
