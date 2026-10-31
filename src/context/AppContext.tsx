import React, { createContext, useContext, useMemo, useState } from 'react';

export type ScreenState =
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
  // Navigation
  currentScreen: ScreenState;
  prevScreen: ScreenState;
  navigateTo: (screen: ScreenState) => void;
  goBack: () => void;

  // Trips & Stops State
  completedStops: number[];
  selectedStopId: number;
  setSelectedStopId: (id: number) => void;
  activeTripTab: 'aktif' | 'riwayat';
  setActiveTripTab: (tab: 'aktif' | 'riwayat') => void;
  epodRecords: Record<number, EpodRecord>;
  saveEpodRecord: (record: EpodRecord) => void;

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
  // Navigation state (Stack-based navigation history)
  const [history, setHistory] = useState<ScreenState[]>(['beranda']);
  const currentScreen = history[history.length - 1] || 'beranda';
  const prevScreen = history.length > 1 ? history[history.length - 2] : 'beranda';

  // Trip & e-POD state
  const [completedStops, setCompletedStops] = useState<number[]>([1]);
  const [selectedStopId, setSelectedStopId] = useState<number>(2);
  const [activeTripTab, setActiveTripTab] = useState<'aktif' | 'riwayat'>('aktif');
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
      // If navigating to a primary tab ('beranda', 'perjalanan', 'profil'), reset sub-screen history
      if (screen === 'beranda' || screen === 'perjalanan' || screen === 'profil') {
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
        return ['beranda'];
      }
      const next = [...prev];
      next.pop(); // Pop current screen
      return next.length > 0 ? next : ['beranda'];
    });
  };

  const saveEpodRecord = (record: EpodRecord) => {
    setEpodRecords((prev) => ({ ...prev, [record.stopId]: record }));
    setCompletedStops((prev) => (prev.includes(record.stopId) ? prev : [...prev, record.stopId]));
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

    completedStops,
    selectedStopId,
    setSelectedStopId,
    activeTripTab,
    setActiveTripTab,
    epodRecords,
    saveEpodRecord,

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

