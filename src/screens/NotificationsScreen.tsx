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
  ArrowLeft,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  FileText,
  Play,
  RotateCcw,
  TrendingUp,
  Truck,
  Wrench,
} from 'lucide-react-native';
import { colors } from '../theme/colors';

interface NotificationItem {
  id: string;
  category: 'perjalanan' | 'armada' | 'sistem';
  title: string;
  description: string;
  time: string;
  isUnread?: boolean;
  dateGroup: 'today' | 'yesterday';
  iconType: 'trip' | 'epod' | 'warning' | 'service' | 'rto';
}

interface NotificationsScreenProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'semua' | 'perjalanan' | 'armada' | 'sistem'>('semua');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      category: 'perjalanan',
      title: 'Perjalanan Dimulai',
      description: 'Trip #TRIP-2026-089 telah dimulai.',
      time: '5 menit lalu',
      isUnread: true,
      dateGroup: 'today',
      iconType: 'trip',
    },
    {
      id: '2',
      category: 'perjalanan',
      title: 'Bukti Pengantaran Diterima',
      description: 'e-POD untuk Stop 1/4 telah dikonfirmasi oleh penerima.',
      time: '24 menit lalu',
      isUnread: false,
      dateGroup: 'today',
      iconType: 'epod',
    },
    {
      id: '3',
      category: 'armada',
      title: 'Peringatan Armada',
      description: 'Tekanan ban kendaraan B 9821 KCE terdeteksi rendah.',
      time: '42 menit lalu',
      isUnread: false,
      dateGroup: 'today',
      iconType: 'warning',
    },
    {
      id: '4',
      category: 'armada',
      title: 'Servis Terjadwal',
      description: 'Jadwal servis kendaraan B 9821 KCE pada 28 Jun 2026.',
      time: 'Kemarin, 16.20',
      isUnread: false,
      dateGroup: 'yesterday',
      iconType: 'service',
    },
    {
      id: '5',
      category: 'sistem',
      title: 'Laporan RTO Tersedia',
      description: 'Laporan performa RTO bulan Mei sudah dapat diunduh.',
      time: 'Kemarin, 10.05',
      isUnread: false,
      dateGroup: 'yesterday',
      iconType: 'rto',
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isUnread: false }))
    );
    Alert.alert('Sukses', 'Semua notifikasi telah ditandai sebagai dibaca.');
  };

  const filteredItems = notifications.filter((item) => {
    if (activeFilter === 'semua') return true;
    return item.category === activeFilter;
  });

  const todayItems = filteredItems.filter((item) => item.dateGroup === 'today');
  const yesterdayItems = filteredItems.filter((item) => item.dateGroup === 'yesterday');

  const renderIcon = (type: NotificationItem['iconType']) => {
    switch (type) {
      case 'trip':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: colors.primaryMuted }]}>
            <Truck size={18} color={colors.primary} strokeWidth={2.2} />
          </View>
        );
      case 'epod':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: colors.successLight }]}>
            <CheckCircle2 size={18} color={colors.success} strokeWidth={2.2} />
          </View>
        );
      case 'warning':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#FEF3C7' }]}>
            <AlertTriangle size={18} color={colors.warning} strokeWidth={2.2} />
          </View>
        );
      case 'service':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: colors.cyanLight }]}>
            <Wrench size={18} color={colors.cyan} strokeWidth={2.2} />
          </View>
        );
      case 'rto':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#EDE9FE' }]}>
            <TrendingUp size={18} color="#7C3AED" strokeWidth={2.2} />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP HEADER / APP BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityLabel="Kembali"
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2.2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifikasi</Text>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. SUBHEADER BANNER */}
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderTitle}>Pembaruan Perjalanan</Text>
          <Text style={styles.subHeaderDesc}>
            Lihat semua aktivitas penting dari armada dan pengantaran.
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
                <CheckCheck size={14} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.markAllText}>Tandai semua dibaca</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.notificationCard}>
              {todayItems.map((item, index) => {
                const isLast = index === todayItems.length - 1;
                return (
                  <View key={item.id}>
                    <View style={styles.itemRow}>
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
                    </View>
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
                    <View style={styles.itemRow}>
                      {renderIcon(item.iconType)}
                      <View style={styles.itemContent}>
                        <View style={styles.itemHeaderRow}>
                          <Text style={styles.itemTitle}>{item.title}</Text>
                          <Text style={styles.itemTimeText}>{item.time}</Text>
                        </View>
                        <Text style={styles.itemDesc}>{item.description}</Text>
                      </View>
                    </View>
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
  scrollContent: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  headerRightPlaceholder: {
    width: 40,
  },

  /* SUBHEADER */
  subHeader: {
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 12,
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  subHeaderDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  /* FILTERS */
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },

  /* SECTIONS */
  sectionContainer: {
    marginHorizontal: 18,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
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
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 13,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginLeft: 5,
  },
  itemDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 48,
  },
});
