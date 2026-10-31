import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { colors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { PerjalananScreen } from './src/screens/PerjalananScreen';
import { DetailStopScreen } from './src/screens/DetailStopScreen';
import { EpodScreen } from './src/screens/EpodScreen';
import { ProfilScreen } from './src/screens/ProfilScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { SosScreen } from './src/screens/SosScreen';
import { FloatingBottomBar, TabType } from './src/components/FloatingBottomBar';
import { FloatingSosButton } from './src/components/FloatingSosButton';

export type ScreenState =
  | 'beranda'
  | 'perjalanan'
  | 'detail-stop'
  | 'epod'
  | 'profil'
  | 'notifikasi'
  | 'sos';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('beranda');
  const [prevScreen, setPrevScreen] = useState<ScreenState>('beranda');
  const [completedStops, setCompletedStops] = useState<number[]>([1]);

  const navigateTo = (screen: ScreenState) => {
    setPrevScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleTabChange = (tab: TabType) => {
    navigateTo(tab);
  };

  const handleEpodSuccess = () => {
    if (!completedStops.includes(2)) {
      setCompletedStops((prev) => [...prev, 2]);
    }
    setCurrentScreen('perjalanan');
  };

  const isMainTab =
    currentScreen === 'beranda' ||
    currentScreen === 'perjalanan' ||
    currentScreen === 'profil';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />

        <View style={styles.content}>
          {/* 1. BERANDA (HOME) SCREEN */}
          {currentScreen === 'beranda' && (
            <HomeScreen
              onNavigatePerjalanan={() => navigateTo('perjalanan')}
              onNavigateProfil={() => navigateTo('profil')}
              onNavigateNotifications={() => navigateTo('notifikasi')}
            />
          )}

          {/* 2. PERJALANAN (TRIP) SCREEN */}
          {currentScreen === 'perjalanan' && (
            <PerjalananScreen
              onBackToHome={() => navigateTo('beranda')}
              onOpenDetailStop={() => navigateTo('detail-stop')}
              completedStops={completedStops}
            />
          )}

          {/* 3. DETAIL STOP SCREEN */}
          {currentScreen === 'detail-stop' && (
            <DetailStopScreen
              onBack={() => navigateTo('perjalanan')}
              onArriveAtLocation={() => navigateTo('epod')}
              isCompleted={completedStops.includes(2)}
            />
          )}

          {/* 4. e-POD SCREEN */}
          {currentScreen === 'epod' && (
            <EpodScreen
              onBack={() => navigateTo('detail-stop')}
              onSubmitSuccess={handleEpodSuccess}
            />
          )}

          {/* 5. PROFIL SCREEN */}
          {currentScreen === 'profil' && (
            <ProfilScreen
              onBackToHome={() => navigateTo('beranda')}
              onNavigatePerjalanan={() => navigateTo('perjalanan')}
            />
          )}

          {/* 6. NOTIFIKASI SCREEN */}
          {currentScreen === 'notifikasi' && (
            <NotificationsScreen onBack={() => navigateTo(prevScreen || 'beranda')} />
          )}

          {/* 7. SOS SCREEN */}
          {currentScreen === 'sos' && (
            <SosScreen onBack={() => navigateTo(prevScreen || 'beranda')} />
          )}

          {/* FLOATING ACTION BUTTONS (Visible on main tabs) */}
          {isMainTab && (
            <>
              <FloatingSosButton onPress={() => navigateTo('sos')} />
              <FloatingBottomBar
                activeTab={
                  currentScreen === 'beranda'
                    ? 'beranda'
                    : currentScreen === 'perjalanan'
                    ? 'perjalanan'
                    : 'profil'
                }
                onTabChange={handleTabChange}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.bg,
  },
});
