import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { colors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { PerjalananScreen } from './src/screens/PerjalananScreen';
import { ProfilScreen } from './src/screens/ProfilScreen';
import { FloatingBottomBar, TabType } from './src/components/FloatingBottomBar';
import { FloatingSosButton } from './src/components/FloatingSosButton';
import { SosModal } from './src/components/SosModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('beranda');
  const [sosModalVisible, setSosModalVisible] = useState<boolean>(false);

  const handleSosConfirm = () => {
    setSosModalVisible(false);
    Alert.alert(
      'Sinyal Darurat Terkirim!',
      'Pusat Kendali Dispatcher FLEETRA telah menerima koordinat live armada B 9821 KCE (Budi Santoso). Bantuan sedang dikoordinasikan.'
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />

        <View style={styles.content}>
          {/* Active Screen Tab View */}
          {activeTab === 'beranda' && (
            <HomeScreen
              onNavigatePerjalanan={() => setActiveTab('perjalanan')}
              onNavigateProfil={() => setActiveTab('profil')}
            />
          )}

          {activeTab === 'perjalanan' && (
            <PerjalananScreen onBackToHome={() => setActiveTab('beranda')} />
          )}

          {activeTab === 'profil' && (
            <ProfilScreen onBackToHome={() => setActiveTab('beranda')} />
          )}

          {/* Floating Emergency SOS Button */}
          <FloatingSosButton onPress={() => setSosModalVisible(true)} />

          {/* Floating Bottom Navigation Bar */}
          <FloatingBottomBar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Emergency SOS Confirmation Modal */}
          <SosModal
            visible={sosModalVisible}
            onClose={() => setSosModalVisible(false)}
            onConfirm={handleSosConfirm}
          />
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
