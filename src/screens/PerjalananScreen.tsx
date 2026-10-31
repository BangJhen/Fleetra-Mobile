import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  MapPin,
  Milestone,
  Play,
  Truck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';

interface StopItem {
  id: number;
  name: string;
  address: string;
  status: 'selesai' | 'tujuan_saat_ini' | 'berikutnya' | 'menunggu';
  time?: string;
  distance?: string;
}

interface PerjalananScreenProps {
  onBackToHome: () => void;
  onOpenDetailStop: (stopId: number) => void;
  completedStops: number[];
}

export const PerjalananScreen: React.FC<PerjalananScreenProps> = ({
  onBackToHome,
  onOpenDetailStop,
  completedStops,
}) => {
  const [activeSegmentTab, setActiveSegmentTab] = useState<'aktif' | 'riwayat'>('aktif');

  // Stop list based on mockup
  const stops: StopItem[] = [
    {
      id: 1,
      name: 'Gudang Logistik Cimahi',
      address: 'Jl. Industri No. 12, Cimahi',
      status: completedStops.includes(1) ? 'selesai' : 'tujuan_saat_ini',
      time: '08.10',
    },
    {
      id: 2,
      name: 'Toko Sumber Rejeki',
      address: 'Jl. Sudirman No. 45, Bandung',
      status: completedStops.includes(2)
        ? 'selesai'
        : completedStops.includes(1)
        ? 'tujuan_saat_ini'
        : 'berikutnya',
      time: completedStops.includes(2) ? '09.15' : undefined,
    },
    {
      id: 3,
      name: 'Minimarket Sejahtera',
      address: 'Jl. Flyover Pasirkoja, Bandung',
      status: completedStops.includes(3)
        ? 'selesai'
        : completedStops.includes(2)
        ? 'tujuan_saat_ini'
        : 'berikutnya',
    },
    {
      id: 4,
      name: 'Toko Makmur Jaya',
      address: 'Jl. Peta No. 88, Bandung',
      status: completedStops.includes(4) ? 'selesai' : 'menunggu',
    },
  ];

  const completedCount = completedStops.length;
  const progressPercent = (completedCount / 4) * 100;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 1. TOP HEADER / APP BAR */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/Fleetra Blue Ribbon Logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* 2. PAGE TITLE & SUBTITLE */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Perjalanan</Text>
        <Text style={styles.pageSubtitle}>
          Kelola dan jalankan penugasan{'\n'}harian Anda
        </Text>
      </View>

      {/* 3. SEGMENTED TABS (TUGAS AKTIF / RIWAYAT) */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeSegmentTab === 'aktif' && styles.segmentButtonActive,
          ]}
          onPress={() => setActiveSegmentTab('aktif')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              activeSegmentTab === 'aktif' && styles.segmentTextActive,
            ]}
          >
            Tugas Aktif
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeSegmentTab === 'riwayat' && styles.segmentButtonActive,
          ]}
          onPress={() => {
            setActiveSegmentTab('riwayat');
            Alert.alert(
              'Riwayat Perjalanan',
              'Menampilkan 48 penugasan selesai bulan ini dengan total 1.840 km.'
            );
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              activeSegmentTab === 'riwayat' && styles.segmentTextActive,
            ]}
          >
            Riwayat
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. ACTIVE TRIP CARD */}
      <View style={styles.tripCard}>
        {/* Card Header */}
        <View style={styles.tripHeaderRow}>
          <Text style={styles.tripCode}>#TRIP-2026-089</Text>
          <View style={styles.statusPillBlue}>
            <Truck size={12} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.statusPillBlueText}>Dalam Perjalanan</Text>
          </View>
        </View>

        <Text style={styles.tripRoute}>Gudang Cimahi → 4 Titik Bandung Kota</Text>

        {/* 3-Column Metrics */}
        <View style={styles.metricsBox}>
          <View style={styles.metricCol}>
            <View style={styles.metricIconRow}>
              <Clock size={13} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.metricValue}>08.00 WIB</Text>
            </View>
            <Text style={styles.metricLabel}>Waktu Mulai</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricCol}>
            <View style={styles.metricIconRow}>
              <MapPin size={13} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.metricValue}>4 Stop</Text>
            </View>
            <Text style={styles.metricLabel}>Tujuan</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricCol}>
            <View style={styles.metricIconRow}>
              <Milestone size={13} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.metricValue}>28,4 km</Text>
            </View>
            <Text style={styles.metricLabel}>Total Jarak</Text>
          </View>
        </View>

        {/* Horizontal Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressLabel}>
              {completedCount} / 4 stop selesai
            </Text>
            <Text style={styles.progressPctText}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(progressPercent, 12)}%` },
              ]}
            />
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onOpenDetailStop(2)}
          activeOpacity={0.85}
        >
          <Play size={15} color={colors.white} fill={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Lanjutkan Perjalanan</Text>
        </TouchableOpacity>
      </View>

      {/* 5. SECTION: DETAIL RUTE */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Detail Rute</Text>
        <TouchableOpacity
          style={styles.sectionLinkRow}
          onPress={() =>
            Alert.alert(
              'Peta Navigasi',
              'Memuat koridor rute OSRM dari Cimahi menuju 4 titik pengantaran Bandung Kota.'
            )
          }
          activeOpacity={0.7}
        >
          <Text style={styles.sectionLinkText}>Lihat Rute di Peta</Text>
          <ChevronRight size={14} color={colors.primary} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      {/* 6. TIMELINE STOP LIST */}
      <View style={styles.timelineCard}>
        {stops.map((stop, index) => {
          const isLast = index === stops.length - 1;
          const isDone = stop.status === 'selesai';
          const isCurrent = stop.status === 'tujuan_saat_ini';
          const isNext = stop.status === 'berikutnya';

          return (
            <TouchableOpacity
              key={stop.id}
              style={[
                styles.stopRow,
                isLast && styles.stopRowLast,
                isCurrent && styles.stopRowCurrent,
              ]}
              onPress={() => onOpenDetailStop(stop.id)}
              activeOpacity={0.8}
            >
              {/* Left Timeline Indicator */}
              <View style={styles.timelineIndicatorCol}>
                {isDone ? (
                  <View style={styles.timelineIconDone}>
                    <CheckCircle2 size={18} color={colors.success} strokeWidth={2.5} />
                  </View>
                ) : isCurrent ? (
                  <View style={styles.timelineIconCurrent}>
                    <View style={styles.timelineDotBlue} />
                  </View>
                ) : (
                  <View style={styles.timelineIconPending}>
                    <Circle size={10} color={colors.textDisabled} strokeWidth={2} />
                  </View>
                )}

                {!isLast && (
                  <View
                    style={[
                      styles.timelineLine,
                      isDone ? styles.timelineLineDone : styles.timelineLinePending,
                    ]}
                  />
                )}
              </View>

              {/* Stop Info */}
              <View style={styles.stopInfoCol}>
                <View style={styles.stopInfoHeaderRow}>
                  <Text
                    style={[
                      styles.stopName,
                      isCurrent && styles.stopNameCurrent,
                    ]}
                    numberOfLines={1}
                  >
                    {stop.name}
                  </Text>

                  {/* Status Badge */}
                  {isDone && (
                    <View style={styles.badgeDone}>
                      <Text style={styles.badgeDoneText}>Selesai</Text>
                      {stop.time && (
                        <Text style={styles.badgeDoneSub}>{stop.time}</Text>
                      )}
                    </View>
                  )}

                  {isCurrent && (
                    <View style={styles.badgeCurrent}>
                      <Text style={styles.badgeCurrentText}>Tujuan Saat Ini</Text>
                    </View>
                  )}

                  {isNext && (
                    <View style={styles.badgeNext}>
                      <Text style={styles.badgeNextText}>Berikutnya</Text>
                    </View>
                  )}

                  {stop.status === 'menunggu' && (
                    <View style={styles.badgeWaiting}>
                      <Text style={styles.badgeWaitingText}>Menunggu</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.stopAddress} numberOfLines={1}>
                  {stop.address}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 110,
  },

  /* TOP BAR */
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 30,
  },

  /* PAGE HEADER */
  pageHeader: {
    paddingHorizontal: 18,
    marginTop: 6,
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },

  /* SEGMENTED TABS */
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    marginHorizontal: 18,
    padding: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  segmentButtonActive: {
    backgroundColor: colors.surface,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },

  /* ACTIVE TRIP CARD */
  tripCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  tripHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tripCode: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  statusPillBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  statusPillBlueText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 5,
  },
  tripRoute: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 14,
  },

  /* METRICS BOX */
  metricsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginBottom: 14,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },

  /* PROGRESS BAR */
  progressContainer: {
    marginBottom: 16,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressPctText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarBg: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },

  /* ACTION BUTTON */
  actionButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },

  /* SECTION HEADER */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  sectionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 2,
  },

  /* TIMELINE STOP LIST */
  timelineCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  stopRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  stopRowLast: {
    borderBottomWidth: 0,
  },
  stopRowCurrent: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: -8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  /* TIMELINE INDICATOR */
  timelineIndicatorCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  timelineIconDone: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconCurrent: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  timelineIconPending: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    height: 38,
    marginTop: 4,
  },
  timelineLineDone: {
    backgroundColor: colors.success,
  },
  timelineLinePending: {
    backgroundColor: '#E2E8F0',
  },

  /* STOP INFO */
  stopInfoCol: {
    flex: 1,
  },
  stopInfoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  stopName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  stopNameCurrent: {
    color: colors.primary,
    fontWeight: '700',
  },
  stopAddress: {
    fontSize: 11,
    color: colors.textMuted,
  },

  /* BADGES */
  badgeDone: {
    alignItems: 'flex-end',
  },
  badgeDoneText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  badgeDoneSub: {
    fontSize: 9,
    color: colors.textMuted,
  },
  badgeCurrent: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeCurrentText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
  },
  badgeNext: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgeNextText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.warningDark,
  },
  badgeWaiting: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  badgeWaitingText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textDisabled,
  },
});
