import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AlertTriangle,
  CheckCheck,
  CheckCircle2,
  TrendingUp,
  Truck,
  Wrench,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';
import { useApp, NotificationItem } from '../context/AppContext';

interface NotificationsScreenProps {
  onBack?: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = (props) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
    setActiveTripTab,
    goBack,
  } = useApp();

  const handleBack = props.onBack || goBack;
  const [activeFilter, setActiveFilter] = useState<'semua' | 'perjalanan' | 'armada' | 'sistem'>('semua');

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    Alert.alert('Sukses', 'Semua notifikasi telah ditandai sebagai dibaca. State in-memory diperbarui.');
  };

  const handleNotificationPress = (item: NotificationItem) => {
    markNotificationAsRead(item.id);

    if (item.iconType === 'trip' || item.category === 'perjalanan') {
      Alert.alert(
        item.title,
        `${item.description}\n\nWaktu: ${item.time}`,
        [
          { text: 'Tutup', style: 'cancel' },
          {
            text: 'Lihat Riwayat Perjalanan',
            onPress: () => {
              setActiveTripTab('riwayat');
              navigateTo('perjalanan');
            },
          },
        ]
      );
      return;
    }

    if (item.iconType === 'rto') {
      Alert.alert(
        item.title,
        `${item.description}\n\nWaktu: ${item.time}`,
        [
          { text: 'Tutup', style: 'cancel' },
          {
            text: 'Buka Riwayat Setoran',
            onPress: () => {
              navigateTo('riwayat-setoran');
            },
          },
        ]
      );
      return;
    }

    Alert.alert(
      item.title,
      `${item.description}\n\nWaktu: ${item.time} (${item.category.toUpperCase()})`,
      [{ text: 'Tutup' }]
    );
  };

  const filteredItems = notifications.filter((item) => {
    if (activeFilter === 'semua') return true;
    return item.category === activeFilter;
  });

  const todayItems = filteredItems.filter((item) => !item.time.includes('Kemarin'));
  const yesterdayItems = filteredItems.filter((item) => item.time.includes('Kemarin'));

  const renderIcon = (type: NotificationItem['iconType']) => {
    switch (type) {
      case 'trip':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: colors.primaryMuted }]}>
            <Truck size={17} color={colors.primary} strokeWidth={2.2} />
          </View>
        );
      case 'epod':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: colors.surface2 }]}>
            <CheckCircle2 size={17} color={colors.primary} strokeWidth={2.2} />
          </View>
        );
      case 'warning':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#FFFBEB' }]}>
            <AlertTriangle size={17} color={colors.warning} strokeWidth={2.2} />
          </View>
        );
      case 'service':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: colors.surface2 }]}>
            <Wrench size={17} color={colors.textSecondary} strokeWidth={2.2} />
          </View>
        );
      case 'rto':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: colors.primaryMuted }]}>
            <TrendingUp size={17} color={colors.primary} strokeWidth={2.2} />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. MODULAR TOP BAR (FIXED, SPACIOUS) */}
      <TopBar
        variant="back"
        title="Notifikasi"
        subtitle="Pusat Pembaruan Operasional"
        onBack={handleBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. SUBHEADER */}
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderTitle}>Pembaruan Perjalanan</Text>
          <Text style={styles.subHeaderDesc}>
            Log aktivitas operasional armada, ritase kargo, dan sistem kemitraan.
          </Text>
        </View>

        {/* 3. FILTER CHIPS */}
        <View style={styles.filterRow}>
          {(['semua', 'perjalanan', 'armada', 'sistem'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            const label = filter.charAt(0).toUpperCase() + filter.slice(1);
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4. GROUP: HARI INI */}
        {todayItems.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Hari Ini</Text>
              <TouchableOpacity
                style={styles.markAllBtn}
                onPress={handleMarkAllAsRead}
                activeOpacity={0.7}
              >
                <CheckCheck size={13} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.markAllText}>Tandai semua dibaca</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.notificationCard}>
              {todayItems.map((item, index) => {
                const isLast = index === todayItems.length - 1;
                return (
                  <View key={item.id}>
                    <TouchableOpacity
                      style={styles.itemRow}
                      onPress={() => handleNotificationPress(item)}
                      activeOpacity={0.7}
                    >
                      {renderIcon(item.iconType)}
                      <View style={styles.itemContent}>
                        <View style={styles.itemHeaderRow}>
                          <Text style={styles.itemTitle}>{item.title}</Text>
                          <View style={styles.itemTimeRow}>
                            <Text style={styles.itemTimeText}>{item.time}</Text>
                            {item.isUnread && <View style={styles.unreadDot} />}
                          </View>
                        </View>
                        <Text style={styles.itemDesc}>{item.description}</Text>
                      </View>
                    </TouchableOpacity>
                    {!isLast && <View style={styles.itemDivider} />}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* 5. GROUP: KEMARIN */}
        {yesterdayItems.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Kemarin</Text>
            </View>

            <View style={styles.notificationCard}>
              {yesterdayItems.map((item, index) => {
                const isLast = index === yesterdayItems.length - 1;
                return (
                  <View key={item.id}>
                    <TouchableOpacity
                      style={styles.itemRow}
                      onPress={() => handleNotificationPress(item)}
                      activeOpacity={0.7}
                    >
                      {renderIcon(item.iconType)}
                      <View style={styles.itemContent}>
                        <View style={styles.itemHeaderRow}>
                          <Text style={styles.itemTitle}>{item.title}</Text>
                          <Text style={styles.itemTimeText}>{item.time}</Text>
                        </View>
                        <Text style={styles.itemDesc}>{item.description}</Text>
                      </View>
                    </TouchableOpacity>
                    {!isLast && <View style={styles.itemDivider} />}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* SUBHEADER */
  subHeader: {
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 12,
  },
  subHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  subHeaderDesc: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },

  /* FILTERS */
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },

  /* SECTIONS */
  sectionContainer: {
    marginHorizontal: 18,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },

  /* CARD & ITEMS */
  notificationCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemContent: {
    flex: 1,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  itemTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTimeText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  unreadDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
    marginLeft: 5,
  },
  itemDesc: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 46,
  },
});
