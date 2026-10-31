import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Home, MapPin, User } from 'lucide-react-native';
import { colors } from '../theme/colors';

export type TabType = 'beranda' | 'perjalanan' | 'profil';

interface FloatingBottomBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const FloatingBottomBar: React.FC<FloatingBottomBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {/* Tab 1: Beranda */}
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'beranda' && styles.activePill]}
          onPress={() => onTabChange('beranda')}
          activeOpacity={0.8}
        >
          <Home
            size={18}
            color={activeTab === 'beranda' ? colors.primary : colors.textMuted}
            strokeWidth={activeTab === 'beranda' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'beranda' ? styles.activeText : styles.inactiveText,
            ]}
          >
            Beranda
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Perjalanan */}
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'perjalanan' && styles.activePill]}
          onPress={() => onTabChange('perjalanan')}
          activeOpacity={0.8}
        >
          <MapPin
            size={18}
            color={activeTab === 'perjalanan' ? colors.primary : colors.textMuted}
            strokeWidth={activeTab === 'perjalanan' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'perjalanan' ? styles.activeText : styles.inactiveText,
            ]}
          >
            Perjalanan
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Profil */}
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'profil' && styles.activePill]}
          onPress={() => onTabChange('profil')}
          activeOpacity={0.8}
        >
          <User
            size={18}
            color={activeTab === 'profil' ? colors.primary : colors.textMuted}
            strokeWidth={activeTab === 'profil' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'profil' ? styles.activeText : styles.inactiveText,
            ]}
          >
            Profil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 90,
  },
  bar: {
    width: '100%',
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    paddingHorizontal: 12,
  },
  activePill: {
    backgroundColor: colors.primaryLight,
  },
  tabText: {
    fontSize: 12,
    marginLeft: 6,
  },
  activeText: {
    color: colors.primary,
    fontWeight: '700',
  },
  inactiveText: {
    color: colors.textMuted,
    fontWeight: '500',
  },
});

