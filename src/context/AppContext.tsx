import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { safeStorage as AsyncStorage } from '../services/storage';
import {
  mobileApi,
  type BackendContract,
  type BackendDriver,
  type BackendLedgerItem,
  type BackendNotice,
  type BackendStop,
  type BackendTrip,
  type BackendVehicle,
  type MobileDashboardData,
} from '../services/api';

const SESSION_STORAGE_KEY = '@fleetra_driver_session_v1';

export type ScreenState =
  | 'onboarding'
  | 'login'
  | 'register'
  | 'beranda'
  | 'perjalanan'
  | 'detail-stop'
  | 'epod'
  | 'profil'
  | 'notifikasi'
  | 'sos'
  | 'edit-profil'
  | 'riwayat-setoran'
  | 'pengaturan-akun';

export type TabType = 'beranda' | 'perjalanan' | 'profil';

export interface DriverProfile {
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  simNumber: string;
  simExpiry: string;
  vehiclePlate: string;
  vehicleModel: string;
  driverId?: string;
  trips?: number;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export interface AppSettings {
  pushNotifications: boolean;
  navSound: boolean;
  hapticFeedback: boolean;
  batterySaver: boolean;
  customApiUrl?: string;
}

export interface EpodRecord {
  stopId: number | string;
  recipientName: string;
  hasPhoto: boolean;
  hasSignature: boolean;
  submittedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: 'perjalanan' | 'armada' | 'sistem';
  isUnread: boolean;
  iconType: 'trip' | 'epod' | 'warning' | 'service' | 'rto';
}

export interface AppContextType {
  // Navigation & Session
  currentScreen: ScreenState;
  prevScreen: ScreenState;
  navigateTo: (screen: ScreenState) => void;
  goBack: () => void;
  isAuthenticated: boolean;
  login: (identifier: string, password?: string) => Promise<boolean>;
  register: (data: {
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    simNumber?: string;
    vehicleModel?: string;
    vehiclePlate?: string;
  }) => Promise<boolean>;
  logout: () => void;

  // Backend Sync State
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  driverId: string;
  setDriverId: (id: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  availableDrivers: Array<{ id: string; name: string; phone: string; score: number }>;

  // Live Backend Trip & Stops
  activeTrip: BackendTrip | null;
  completedTrips: BackendTrip[];
  stops: BackendStop[];
  selectedStop: BackendStop | null;
  selectedStopId: number | string;
  setSelectedStopId: (id: number | string) => void;
  completedStops: number[];
  completedStopIds: string[];
  activeTripTab: 'aktif' | 'riwayat';
  setActiveTripTab: (tab: 'aktif' | 'riwayat') => void;
  isTripCompleted: boolean;
  epodRecords: Record<string | number, EpodRecord>;

  // Actions wired to Backend API
  startActiveTrip: () => Promise<void>;
  arriveAtCurrentStop: (targetStopId?: string | number) => Promise<void>;
  confirmStopPickup: (targetStopId?: string | number) => Promise<void>;
  submitStopEpod: (recipient: string, photo: string, signature: string, targetStopId?: string | number) => Promise<void>;
  saveEpodRecord: (record: EpodRecord) => void;
  completeEntireTrip: () => void;
  resetTripDemo: () => void;

  // SOS Emergency State
  isSosActive: boolean;
  sosCategory: string | null;
  sosTimestamp: string | null;
  activateSos: (category?: string) => Promise<void>;
  deactivateSos: () => void;

  // Notifications State (synced from backend)
  notifications: NotificationItem[];
  hasUnreadNotifications: boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Driver & Vehicle State (synced from backend)
  driverStatus: 'Aktif' | 'Istirahat';
  toggleDriverStatus: () => void;
  driverProfile: DriverProfile;
  updateDriverProfile: (updated: Partial<DriverProfile>) => Promise<void>;
  settings: AppSettings;
  toggleSetting: (key: keyof AppSettings) => void;
  fuelPercent: number;
  odometerKm: number;
  safetyScore: number;
  rtoPercent: number;
  rtoContract: BackendContract | null;
  rtoLedger: BackendLedgerItem[];
  rtoPaid: number;
  rtoTotal: number;
  rtoRemaining: number;
  vehicle: BackendVehicle | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session & Navigation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [history, setHistory] = useState<ScreenState[]>(['login']);
  const currentScreen = history[history.length - 1] || 'login';
  const prevScreen = history.length > 1 ? history[history.length - 2] : 'login';

  // Backend Driver ID & Authenticated User Email
  const [driverId, setDriverId] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  // Backend Sync State
  const [backendData, setBackendData] = useState<MobileDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Local selection & UI states
  const [selectedStopId, setSelectedStopId] = useState<number | string>(1);
  const [activeTripTab, setActiveTripTab] = useState<'aktif' | 'riwayat'>('aktif');
  const [driverStatus, setDriverStatus] = useState<'Aktif' | 'Istirahat'>('Aktif');

  // SOS state
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [sosCategory, setSosCategory] = useState<string | null>(null);
  const [sosTimestamp, setSosTimestamp] = useState<string | null>(null);

  // App Settings
  const [settings, setSettings] = useState<AppSettings>({
    pushNotifications: true,
    navSound: true,
    hapticFeedback: true,
    batterySaver: false,
  });

  // Local override for profile fields not stored in DB (e.g. SIM details, emergency contact)
  const [profileOverrides, setProfileOverrides] = useState<Partial<DriverProfile>>({});

  // Read notifications
  const [readNotifIds, setReadNotifIds] = useState<string[]>([]);

  // Function to refresh all data directly from backend MariaDB
  const refreshData = useCallback(async () => {
    if (!driverId && !userEmail) {
      setIsLoading(false);
      setIsSyncing(false);
      return;
    }
    setIsSyncing(true);
    setError(null);
    try {
      const data = await mobileApi.getDashboardData(driverId, userEmail);
      setBackendData(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data dari server';
      setError(msg);
      // eslint-disable-next-line no-console
      console.warn('[Fleetra Mobile] Sync error:', msg);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [driverId, userEmail]);

  // Restore persisted session from AsyncStorage on app launch / reload
  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const session = JSON.parse(raw);
          if (session?.userEmail && session?.driverId) {
            if (!isMounted) return;
            setUserEmail(session.userEmail);
            setDriverId(session.driverId);
            setIsAuthenticated(true);
            setHistory(['beranda']);
            if (session.name || session.phone) {
              setProfileOverrides({
                name: session.name,
                phone: session.phone,
              });
            }
            try {
              const data = await mobileApi.getDashboardData(session.driverId, session.userEmail);
              if (isMounted) setBackendData(data);
            } catch {}
            return;
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[Fleetra Mobile] Failed to restore session:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initial load on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Periodic poll to keep mobile in sync with Web Dispatcher console (every 5 seconds)
  useEffect(() => {
    if (!driverId && !userEmail) return;
    const interval = setInterval(() => {
      mobileApi.getDashboardData(driverId, userEmail)
        .then((data) => setBackendData(data))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [driverId, userEmail]);

  // Computed: Active Trip & Completed Trips
  const activeTrip = useMemo(() => {
    if (!backendData || !backendData.trips) return null;
    return (
      backendData.trips.find((t) => t.status === 'in_progress' || t.status === 'assigned') ||
      null
    );
  }, [backendData]);

  const completedTrips = useMemo(() => {
    if (!backendData || !backendData.trips) return [];
    return backendData.trips.filter((t) => t.status === 'completed');
  }, [backendData]);

  // Computed: Vehicle
  const vehicle = useMemo(() => {
    if (!backendData || !backendData.vehicles || backendData.vehicles.length === 0) return null;
    if (activeTrip) {
      const match = backendData.vehicles.find((v) => v.id === activeTrip.vehicleId);
      if (match) return match;
    }
    if (driverId) {
      const driverVehicle = backendData.vehicles.find((v) => v.driverId === driverId);
      if (driverVehicle) return driverVehicle;
    }
    return null;
  }, [backendData, activeTrip, driverId]);

  // Computed: Driver Profile from backend + local overrides
  const driverProfile = useMemo<DriverProfile>(() => {
    const d = backendData?.driver;
    const v = vehicle;
    const resolvedEmail = profileOverrides.email || d?.email || userEmail || '';
    const rawVerification = (d as any)?.verificationStatus || ((d as any)?.status === 'pending_verification' ? 'pending' : (d as any)?.status === 'rejected' ? 'rejected' : 'verified');
    return {
      name: profileOverrides.name || d?.name || 'Mitra Pengemudi',
      email: resolvedEmail,
      phone: profileOverrides.phone || d?.phone || '',
      emergencyContact: profileOverrides.emergencyContact || '',
      simNumber: profileOverrides.simNumber || (d as any)?.simNumber || '',
      simExpiry: profileOverrides.simExpiry || '',
      vehiclePlate: profileOverrides.vehiclePlate || v?.plate || '',
      vehicleModel: profileOverrides.vehicleModel || (v ? `${v.model} (${v.type.toUpperCase()})` : ''),
      driverId: d?.id || driverId || '',
      trips: d?.trips ?? 0,
      verificationStatus: rawVerification,
      ...profileOverrides,
    };
  }, [backendData, vehicle, profileOverrides, userEmail, driverId]);

  // Computed: Stops list
  const stops = useMemo(() => {
    return activeTrip?.stops || [];
  }, [activeTrip]);

  // Computed: Completed Stops (IDs and 1-based index numbers for backwards compatibility)
  const completedStopIds = useMemo(() => {
    return stops.filter((s) => s.status === 'delivered').map((s) => s.id);
  }, [stops]);

  const completedStops = useMemo(() => {
    return stops
      .map((s, idx) => (s.status === 'delivered' ? idx + 1 : null))
      .filter((n): n is number => n !== null);
  }, [stops]);

  // Selected stop object
  const selectedStop = useMemo(() => {
    if (!stops || stops.length === 0) return null;
    if (typeof selectedStopId === 'number') {
      return stops[selectedStopId - 1] || stops[0];
    }
    return stops.find((s) => s.id === selectedStopId) || stops[0];
  }, [stops, selectedStopId]);

  // Computed: isTripCompleted
  const isTripCompleted = useMemo(() => {
    if (!activeTrip) return false;
    if (activeTrip.status === 'completed') return true;
    return stops.length > 0 && stops.every((s) => s.status === 'delivered');
  }, [activeTrip, stops]);

  // Computed: Epod records map from backend stops data
  const epodRecords = useMemo(() => {
    const map: Record<string | number, EpodRecord> = {};
    stops.forEach((s, idx) => {
      if (s.epod) {
        const record: EpodRecord = {
          stopId: s.id,
          recipientName: s.epod.recipient,
          hasPhoto: !!s.epod.photo,
          hasSignature: !!s.epod.signature,
          submittedAt: new Date(s.epod.at).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }) + ' WIB',
        };
        map[s.id] = record;
        map[idx + 1] = record;
      }
    });
    return map;
  }, [stops]);

  // Computed: Telemetry numbers from real vehicle & driver
  const fuelPercent = vehicle?.fuel ?? 0;
  const odometerKm = vehicle?.odometer ?? 0;
  const safetyScore = backendData?.driver?.score ?? 100;

  // Computed: RTO Contract & Ledger live math
  const rtoContract = useMemo<BackendContract | null>(() => {
    if (!backendData?.contracts || backendData.contracts.length === 0) return null;
    const c = backendData.contracts[0];
    return {
      ...c,
      tenureMonths: c.months || 36,
      monthsPaid: c.elapsed || 0,
      vehicleName: vehicle?.model || 'Armada RTO',
      vehiclePlate: vehicle?.plate || 'Belum Ada Armada',
    };
  }, [backendData, vehicle]);

  const rtoLedger = useMemo(() => {
    return backendData?.ledger || [];
  }, [backendData]);

  const rtoPaid = useMemo(() => {
    if (!rtoContract) return 0;
    const ledgerSum = rtoLedger.reduce((sum, item) => sum + (item.amount || 0), 0);
    return rtoContract.openingBalance + ledgerSum;
  }, [rtoContract, rtoLedger]);

  const rtoTotal = rtoContract?.total || 0;
  const rtoRemaining = Math.max(0, rtoTotal - rtoPaid);
  const rtoPercent = useMemo(() => {
    if (!rtoContract || rtoContract.total <= 0) return 0;
    return Number(((rtoPaid / rtoContract.total) * 100).toFixed(1));
  }, [rtoContract, rtoPaid]);

  // Computed: Notifications from backend notices
  const notifications = useMemo<NotificationItem[]>(() => {
    if (!backendData?.notices || backendData.notices.length === 0) {
      // If notices empty, generate dynamic items based on real active trip status
      const items: NotificationItem[] = [];
      if (activeTrip) {
        items.push({
          id: `trip-${activeTrip.id}`,
          title: `Penugasan Rute #${activeTrip.code}`,
          description: `Perjalanan ${activeTrip.stops.length} titik pengantaran berstatus ${activeTrip.status}. Jarak ${activeTrip.distance} km.`,
          time: new Date(activeTrip.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          category: 'perjalanan',
          isUnread: !readNotifIds.includes(`trip-${activeTrip.id}`),
          iconType: 'trip',
        });
      }
      if (rtoContract) {
        items.push({
          id: `rto-${rtoContract.id}`,
          title: 'Akumulasi Ekuitas Sewa-Beli (RTO)',
          description: `Ekuitas kepemilikan Anda mencapai ${rtoPercent}% (${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(rtoPaid)}).`,
          time: 'Hari ini',
          category: 'sistem',
          isUnread: !readNotifIds.includes(`rto-${rtoContract.id}`),
          iconType: 'rto',
        });
      }
      return items;
    }

    return backendData.notices.map((n) => {
      let iconType: 'trip' | 'epod' | 'warning' | 'service' | 'rto' = 'trip';
      if (n.kind === 'sos') iconType = 'warning';
      else if (n.kind === 'health') iconType = 'service';
      else if (n.title.toLowerCase().includes('epod')) iconType = 'epod';

      let category: 'perjalanan' | 'armada' | 'sistem' = 'perjalanan';
      if (n.kind === 'health') category = 'armada';
      else if (n.kind === 'system') category = 'sistem';

      const d = new Date(n.at);
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

      return {
        id: n.id,
        title: n.title,
        description: n.description,
        time: timeStr,
        category,
        isUnread: !readNotifIds.includes(n.id) && n.status === 'unread',
        iconType,
      };
    });
  }, [backendData, activeTrip, rtoContract, rtoPercent, rtoPaid, readNotifIds]);

  const hasUnreadNotifications = useMemo(() => {
    return notifications.some((n) => n.isUnread);
  }, [notifications]);

  // Navigation helpers
  const navigateTo = (screen: ScreenState) => {
    setHistory((prev) => {
      if (
        screen === 'onboarding' ||
        screen === 'login' ||
        screen === 'register' ||
        screen === 'beranda' ||
        screen === 'perjalanan' ||
        screen === 'profil'
      ) {
        return [screen];
      }
      if (prev[prev.length - 1] === screen) {
        return prev;
      }
      return [...prev, screen];
    });
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length <= 1) {
        return isAuthenticated ? ['beranda'] : ['login'];
      }
      const next = [...prev];
      next.pop();
      return next.length > 0 ? next : (isAuthenticated ? ['beranda'] : ['login']);
    });
  };

  // Auth methods wired directly to backend MariaDB
  const login = async (identifier: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const pass = password || 'Fleetra2026!';
      const res = await mobileApi.login(identifier, pass);
      const email = res.driver?.email || (identifier.includes('@') ? identifier : `${identifier}@fleetra.id`);
      setUserEmail(email);
      if (res.driverId) {
        setDriverId(res.driverId);
      }
      setProfileOverrides({
        name: res.driver?.name,
        email,
        phone: res.driver?.phone || '',
      });
      const data = await mobileApi.getDashboardData(res.driverId || driverId, email);
      setBackendData(data);
      setIsAuthenticated(true);

      // Persist session to AsyncStorage
      AsyncStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          driverId: res.driverId,
          userEmail: email,
          name: res.driver?.name,
          phone: res.driver?.phone || '',
        })
      ).catch(() => {});

      navigateTo('beranda');
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Email atau kata sandi tidak sesuai';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    simNumber?: string;
    vehicleModel?: string;
    vehiclePlate?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const registeredEmail =
        data.email && data.email.includes('@')
          ? data.email.trim().toLowerCase()
          : `${data.name.toLowerCase().replace(/\s+/g, '.')}@fleetra.id`;
      const userPass = data.password || 'Fleetra2026!';

      const regRes = await mobileApi.register({
        name: data.name,
        email: registeredEmail,
        password: userPass,
        phone: data.phone,
        simNumber: data.simNumber,
        vehicleModel: data.vehicleModel,
        vehiclePlate: data.vehiclePlate,
      });

      setUserEmail(registeredEmail);
      if (regRes.driverId) {
        setDriverId(regRes.driverId);
      }
      setProfileOverrides({
        name: data.name,
        email: registeredEmail,
        phone: data.phone || '',
        emergencyContact: '',
        simNumber: data.simNumber || '',
        simExpiry: '',
        vehicleModel: data.vehicleModel || '',
        vehiclePlate: data.vehiclePlate || '',
      });

      const dbData = await mobileApi.getDashboardData(regRes.driverId || driverId, registeredEmail);
      setBackendData(dbData);
      setIsAuthenticated(true);

      // Persist session to AsyncStorage
      AsyncStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          driverId: regRes.driverId,
          userEmail: registeredEmail,
          name: data.name,
          phone: data.phone || '',
        })
      ).catch(() => {});

      navigateTo('beranda');
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Pendaftaran akun gagal';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AsyncStorage.removeItem(SESSION_STORAGE_KEY).catch(() => {});
    setIsAuthenticated(false);
    setDriverId('');
    setUserEmail('');
    setBackendData(null);
    setProfileOverrides({});
    setHistory(['login']);
  };

  // Trip action handlers wired to backend
  const startActiveTrip = async () => {
    if (!activeTrip) return;
    try {
      await mobileApi.startTrip(activeTrip.id, driverId);
      await refreshData();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to start trip:', e);
      throw e;
    }
  };

  const arriveAtCurrentStop = async (targetStopId?: string | number) => {
    if (!activeTrip) return;
    const stopToArrive = targetStopId
      ? stops.find((s, idx) => s.id === targetStopId || idx + 1 === targetStopId)
      : selectedStop;

    if (!stopToArrive) return;
    try {
      await mobileApi.arriveAtStop(activeTrip.id, stopToArrive.id, driverId);
      await refreshData();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to record arrival:', e);
      throw e;
    }
  };

  const confirmStopPickup = async (targetStopId?: string | number) => {
    if (!activeTrip) return;
    const stop = targetStopId
      ? stops.find((s, idx) => s.id === targetStopId || idx + 1 === targetStopId)
      : selectedStop;

    if (!stop) return;
    try {
      await mobileApi.confirmPickup(activeTrip.id, stop.id, driverId);
      await refreshData();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to confirm pickup:', e);
      throw e;
    }
  };

  const submitStopEpod = async (
    recipient: string,
    photo: string,
    signature: string,
    targetStopId?: string | number
  ) => {
    if (!activeTrip) return;
    const stop = targetStopId
      ? stops.find((s, idx) => s.id === targetStopId || idx + 1 === targetStopId)
      : selectedStop;

    if (!stop) return;
    try {
      // Ensure image data URL prefix is valid for backend
      const validPhoto = photo.startsWith('data:image')
        ? photo
        : `data:image/png;base64,${photo}`;
      const validSig = signature.startsWith('data:image')
        ? signature
        : `data:image/png;base64,${signature}`;

      await mobileApi.submitEpod(activeTrip.id, stop.id, recipient, validPhoto, validSig, driverId);
      await refreshData();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to submit epod:', e);
      throw e;
    }
  };

  const saveEpodRecord = (record: EpodRecord) => {
    // For legacy callers: fire background submit if stop exists
    const stop = stops.find((s, idx) => s.id === record.stopId || idx + 1 === record.stopId);
    if (stop && activeTrip) {
      const dummySampleImg =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1kAAAAASUVORK5CYII=';
      mobileApi
        .submitEpod(activeTrip.id, stop.id, record.recipientName, dummySampleImg, dummySampleImg, driverId)
        .then(() => refreshData())
        .catch(() => {});
    }
  };

  const completeEntireTrip = () => {
    // Trigger finish on backend if active trip
    if (activeTrip) {
      // Mark any remaining stops delivered
      stops.forEach((s) => {
        if (s.status !== 'delivered') {
          const sample = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1kAAAAASUVORK5CYII=';
          mobileApi.submitEpod(activeTrip.id, s.id, 'Penerima Otomatis', sample, sample, driverId).catch(() => {});
        }
      });
      setTimeout(() => refreshData(), 500);
    }
    setActiveTripTab('riwayat');
  };

  const resetTripDemo = () => {
    refreshData();
    setActiveTripTab('aktif');
  };

  // SOS methods wired to backend
  const activateSos = async (category?: string) => {
    setIsSosActive(true);
    setSosCategory(category || 'Kendala Operasional Darurat');
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    setSosTimestamp(timeStr);

    if (activeTrip) {
      try {
        await mobileApi.sendSos(
          activeTrip.id,
          category || 'Pengemudi mengaktifkan sinyal bantuan darurat dari kabin kendaraan.',
          driverId
        );
        await refreshData();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to send SOS alert to dispatcher:', e);
      }
    }
  };

  const deactivateSos = () => {
    setIsSosActive(false);
    setSosCategory(null);
    setSosTimestamp(null);
  };

  // Notification read actions
  const markNotificationAsRead = (id: string) => {
    setReadNotifIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markAllNotificationsAsRead = () => {
    setReadNotifIds(notifications.map((n) => n.id));
  };

  // Driver duty status
  const toggleDriverStatus = () => {
    setDriverStatus((prev) => (prev === 'Aktif' ? 'Istirahat' : 'Aktif'));
  };

  // Update profile handler wired to backend
  const updateDriverProfile = async (updated: Partial<DriverProfile>) => {
    setProfileOverrides((prev) => ({ ...prev, ...updated }));
    if (
      updated.phone ||
      updated.name ||
      updated.vehicleModel ||
      updated.vehiclePlate
    ) {
      try {
        await mobileApi.updateProfile(
          updated.phone,
          updated.name,
          driverId,
          updated.vehicleModel,
          updated.vehiclePlate
        );
        await refreshData();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to update profile on backend:', e);
      }
    }
  };

  const toggleSetting = (key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const value: AppContextType = {
    currentScreen,
    prevScreen,
    navigateTo,
    goBack,
    isAuthenticated,
    login,
    register,
    logout,

    isLoading,
    isSyncing,
    error,
    refreshData,
    driverId,
    setDriverId,
    userEmail,
    setUserEmail,
    availableDrivers: backendData?.availableDrivers || [],

    activeTrip,
    completedTrips,
    stops,
    selectedStop,
    selectedStopId,
    setSelectedStopId,
    completedStops,
    completedStopIds,
    activeTripTab,
    setActiveTripTab,
    isTripCompleted,
    epodRecords,

    startActiveTrip,
    arriveAtCurrentStop,
    confirmStopPickup,
    submitStopEpod,
    saveEpodRecord,
    completeEntireTrip,
    resetTripDemo,

    isSosActive,
    sosCategory,
    sosTimestamp,
    activateSos,
    deactivateSos,

    notifications,
    hasUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,

    driverStatus,
    toggleDriverStatus,
    driverProfile,
    updateDriverProfile,
    settings,
    toggleSetting,
    fuelPercent,
    odometerKm,
    safetyScore,
    rtoPercent,
    rtoContract,
    rtoLedger,
    rtoPaid,
    rtoTotal,
    rtoRemaining,
    vehicle,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
