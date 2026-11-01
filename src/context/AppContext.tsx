import React, { createContext, useContext, useMemo, useState } from 'react';

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
  phone: string;
  emergencyContact: string;
  simNumber: string;
  simExpiry: string;
  vehiclePlate: string;
  vehicleModel: string;
}

export interface AppSettings {
  pushNotifications: boolean;
  navSound: boolean;
  hapticFeedback: boolean;
  batterySaver: boolean;
}

export interface EpodRecord {
  stopId: number;
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

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Penugasan Rute Baru Diterima',
    description: 'Trip #TRIP-2026-089 (4 titik pengantaran Bandung Kota) telah dijadwalkan.',
    time: '08:00',
    category: 'perjalanan',
    isUnread: true,
    iconType: 'trip',
  },
  {
    id: '2',
    title: 'Stop 1 Selesai & e-POD Terverifikasi',
    description: 'Serah terima kargo di Gudang Cimahi berhasil diunggah ke konsol pusat.',
    time: '08:15',
    category: 'perjalanan',
    isUnread: true,
    iconType: 'epod',
  },
  {
    id: '3',
    title: 'Peringatan Kemacetan OSRM',
    description: 'Kepadatan lalu lintas di Jl. Sukajadi (+8 menit). Rekomendasi rute alternatif via Pasirkaliki.',
    time: '08:35',
    category: 'armada',
    isUnread: false,
    iconType: 'warning',
  },
  {
    id: '4',
    title: 'Jadwal Pemeliharaan Prediktif',
    description: 'Armada Gran Max B 9821 KCE terjadwal rotasi ban dan servis oli dalam 1.570 km.',
    time: 'Kemarin',
    category: 'armada',
    isUnread: false,
    iconType: 'service',
  },
  {
    id: '5',
    title: 'Setoran RTO Berhasil Diakumulasi',
    description: 'Setoran pay-per-trip sebesar Rp 45.000 telah dialokasikan ke ekuitas kepemilikan armada.',
    time: 'Kemarin',
    category: 'sistem',
    isUnread: false,
    iconType: 'rto',
  },
];

interface AppContextType {
  // Navigation & Auth
  currentScreen: ScreenState;
  prevScreen: ScreenState;
  navigateTo: (screen: ScreenState) => void;
  goBack: () => void;
  isAuthenticated: boolean;
  login: (emailOrPhone?: string, name?: string) => void;
  register: (data: Partial<DriverProfile>) => void;
  logout: () => void;

  // Trips & Stops State
  completedStops: number[];
  selectedStopId: number;
  setSelectedStopId: (id: number) => void;
  activeTripTab: 'aktif' | 'riwayat';
  setActiveTripTab: (tab: 'aktif' | 'riwayat') => void;
  epodRecords: Record<number, EpodRecord>;
  saveEpodRecord: (record: EpodRecord) => void;
  isTripCompleted: boolean;
  completeEntireTrip: () => void;
  resetTripDemo: () => void;

  // SOS Emergency State
  isSosActive: boolean;
  sosCategory: string | null;
  sosTimestamp: string | null;
  activateSos: (category?: string) => void;
  deactivateSos: () => void;

  // Notifications State
  notifications: NotificationItem[];
  hasUnreadNotifications: boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Driver & Vehicle State
  driverStatus: 'Aktif' | 'Istirahat';
  toggleDriverStatus: () => void;
  driverProfile: DriverProfile;
  updateDriverProfile: (updated: Partial<DriverProfile>) => void;
  settings: AppSettings;
  toggleSetting: (key: keyof AppSettings) => void;
  fuelPercent: number;
  odometerKm: number;
  safetyScore: number;
  rtoPercent: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Session state (Defaults to onboarding for welcoming first-time experience)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [history, setHistory] = useState<ScreenState[]>(['onboarding']);
  const currentScreen = history[history.length - 1] || 'onboarding';
  const prevScreen = history.length > 1 ? history[history.length - 2] : 'onboarding';

  // Trip & e-POD state
  const [completedStops, setCompletedStops] = useState<number[]>([1]);
  const [selectedStopId, setSelectedStopId] = useState<number>(2);
  const [activeTripTab, setActiveTripTab] = useState<'aktif' | 'riwayat'>('aktif');
  const [isTripCompleted, setIsTripCompleted] = useState<boolean>(false);
  const [epodRecords, setEpodRecords] = useState<Record<number, EpodRecord>>({
    1: {
      stopId: 1,
      recipientName: 'Gudang Pusat Cimahi',
      hasPhoto: true,
      hasSignature: true,
      submittedAt: '08:15 WIB',
    },
  });

  // SOS state
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [sosCategory, setSosCategory] = useState<string | null>(null);
  const [sosTimestamp, setSosTimestamp] = useState<string | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Driver / Telemetry state
  const [driverStatus, setDriverStatus] = useState<'Aktif' | 'Istirahat'>('Aktif');
  const [driverProfile, setDriverProfile] = useState<DriverProfile>({
    name: 'Budi Santoso',
    phone: '+62 812-3456-7890',
    emergencyContact: '+62 813-2233-4455 (Istri)',
    simNumber: '9204-1284-9012 (SIM B1 Umum)',
    simExpiry: '14 Nov 2028',
    vehiclePlate: 'B 9821 KCE',
    vehicleModel: 'Daihatsu Gran Max Blind Van 1.3L',
  });
  const [settings, setSettings] = useState<AppSettings>({
    pushNotifications: true,
    navSound: true,
    hapticFeedback: true,
    batterySaver: false,
  });
  const [fuelPercent] = useState<number>(74);
  const [odometerKm] = useState<number>(128);
  const [safetyScore] = useState<number>(94);
  const [rtoPercent] = useState<number>(64.8);

  const updateDriverProfile = (updated: Partial<DriverProfile>) => {
    setDriverProfile((prev) => ({ ...prev, ...updated }));
  };

  const toggleSetting = (key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navigateTo = (screen: ScreenState) => {
    setHistory((prev) => {
      // If navigating to standalone flows or primary tabs, reset history stack
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
      // If target screen is already top of stack, don't duplicate
      if (prev[prev.length - 1] === screen) {
        return prev;
      }
      return [...prev, screen];
    });
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length <= 1) {
        return isAuthenticated ? ['beranda'] : ['onboarding'];
      }
      const next = [...prev];
      next.pop(); // Pop current screen
      return next.length > 0 ? next : (isAuthenticated ? ['beranda'] : ['onboarding']);
    });
  };

  const login = (emailOrPhone?: string, name?: string) => {
    setIsAuthenticated(true);
    if (name) {
      setDriverProfile((prev) => ({ ...prev, name }));
    }
    navigateTo('beranda');
  };

  const register = (data: Partial<DriverProfile>) => {
    setIsAuthenticated(true);
    setDriverProfile((prev) => ({ ...prev, ...data }));
    navigateTo('beranda');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHistory(['login']);
  };

  const saveEpodRecord = (record: EpodRecord) => {
    setEpodRecords((prev) => ({ ...prev, [record.stopId]: record }));
    setCompletedStops((prev) => {
      const nextCompleted = prev.includes(record.stopId) ? prev : [...prev, record.stopId];
      if (nextCompleted.length >= 4) {
        setIsTripCompleted(true);
      }
      return nextCompleted;
    });

    const stopNames: Record<number, string> = {
      1: 'Gudang Pusat Cimahi',
      2: 'Toko Sumber Rejeki',
      3: 'Minimarket Sejahtera',
      4: 'Toko Makmur Jaya',
    };

    const newNotif: NotificationItem = {
      id: `epod-${record.stopId}-${Date.now()}`,
      title: `e-POD Terverifikasi • Stop ${record.stopId}/4`,
      description: `Kargo di ${stopNames[record.stopId] || 'titik singgah'} telah diterima oleh ${record.recipientName}. Bukti foto & tanda tangan telah terverifikasi.`,
      time: 'Baru saja',
      category: 'perjalanan',
      isUnread: true,
      iconType: 'trip',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const completeEntireTrip = () => {
    setIsTripCompleted(true);
    setCompletedStops([1, 2, 3, 4]);
    setActiveTripTab('riwayat');
    const newNotif: NotificationItem = {
      id: `trip-done-${Date.now()}`,
      title: '🎉 Ritase #TRIP-2026-089 Selesai!',
      description: 'Seluruh 4 titik pengantaran telah tuntas. Setoran RTO Rp 50.000 dialokasikan ke ekuitas kepemilikan armada.',
      time: 'Baru saja',
      category: 'sistem',
      isUnread: true,
      iconType: 'rto',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const resetTripDemo = () => {
    setIsTripCompleted(false);
    setCompletedStops([1]);
    setSelectedStopId(2);
    setActiveTripTab('aktif');
  };

  const activateSos = (category?: string) => {
    setIsSosActive(true);
    setSosCategory(category || 'Kendala Operasional Darurat');
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    setSosTimestamp(timeStr);
  };

  const deactivateSos = () => {
    setIsSosActive(false);
    setSosCategory(null);
    setSosTimestamp(null);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isUnread: false } : item))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isUnread: false })));
  };

  const toggleDriverStatus = () => {
    setDriverStatus((prev) => (prev === 'Aktif' ? 'Istirahat' : 'Aktif'));
  };

  const hasUnreadNotifications = useMemo(() => {
    return notifications.some((n) => n.isUnread);
  }, [notifications]);

  const value = {
    currentScreen,
    prevScreen,
    navigateTo,
    goBack,
    isAuthenticated,
    login,
    register,
    logout,

    completedStops,
    selectedStopId,
    setSelectedStopId,
    activeTripTab,
    setActiveTripTab,
    epodRecords,
    saveEpodRecord,
    isTripCompleted,
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

