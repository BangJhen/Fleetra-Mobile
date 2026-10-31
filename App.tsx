import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle } from 'lucide-react-native';

import { colors } from './src/theme/colors';
import { AppProvider, useApp } from './src/context/AppContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { PerjalananScreen } from './src/screens/PerjalananScreen';
import { DetailStopScreen } from './src/screens/DetailStopScreen';
import { EpodScreen } from './src/screens/EpodScreen';
import { ProfilScreen } from './src/screens/ProfilScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { SosScreen } from './src/screens/SosScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { RiwayatSetoranScreen } from './src/screens/RiwayatSetoranScreen';
import { PengaturanAkunScreen } from './src/screens/PengaturanAkunScreen';
import { FloatingBottomBar } from './src/components/FloatingBottomBar';
import { FloatingSosButton } from './src/components/FloatingSosButton';

function MainAppContent() {
  const {
    currentScreen,
    navigateTo,
    isSosActive,
    sosCategory,
    sosTimestamp,
  } = useApp();

  const isMainTab =
    currentScreen === 'beranda' ||
    currentScreen === 'perjalanan' ||
    currentScreen === 'profil';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* GLOBAL PERSISTENT SOS ACTIVE BANNER (In-memory persistent status) */}
      {isSosActive && (
        <TouchableOpacity
          style={styles.sosGlobalBanner}
          onPress={() => navigateTo('sos')}
          activeOpacity={0.85}
        >
          <AlertCircle size={15} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.sosGlobalBannerText} numberOfLines={1}>
            DARURAT AKTIF ({sosTimestamp}): {sosCategory || 'Sinyal Prioritas'}
          </Text>
          <Text style={styles.sosGlobalBannerAction}>Lihat</Text>
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        {/* 1. BERANDA (HOME) SCREEN */}
        {currentScreen === 'beranda' && <HomeScreen />}

        {/* 2. PERJALANAN (TRIP) SCREEN */}
        {currentScreen === 'perjalanan' && <PerjalananScreen />}

        {/* 3. DETAIL STOP SCREEN */}
        {currentScreen === 'detail-stop' && (
          <DetailStopScreen
            onBack={() => navigateTo('perjalanan')}
            onArriveAtLocation={() => navigateTo('epod')}
          />
        )}

        {/* 4. e-POD SCREEN */}
        {currentScreen === 'epod' && (
          <EpodScreen
            onBack={() => navigateTo('detail-stop')}
            onSubmitSuccess={() => navigateTo('perjalanan')}
          />
        )}

        {/* 5. PROFIL SCREEN */}
        {currentScreen === 'profil' && <ProfilScreen />}

        {/* 6. NOTIFIKASI SCREEN */}
        {currentScreen === 'notifikasi' && <NotificationsScreen />}

        {/* 7. SOS SCREEN */}
        {currentScreen === 'sos' && <SosScreen />}

        {/* 8. EDIT PROFIL SCREEN */}
        {currentScreen === 'edit-profil' && <EditProfileScreen />}

        {/* 9. RIWAYAT SETORAN RTO SCREEN */}
        {currentScreen === 'riwayat-setoran' && <RiwayatSetoranScreen />}

        {/* 10. PENGATURAN AKUN SCREEN */}
        {currentScreen === 'pengaturan-akun' && <PengaturanAkunScreen />}

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
              onTabChange={(tab) => navigateTo(tab)}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  sosGlobalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    zIndex: 999,
  },
  sosGlobalBannerText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  sosGlobalBannerAction: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.bg,
  },
});
