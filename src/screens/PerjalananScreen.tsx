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
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  MapPin,
  Milestone,
  Play,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TopBar } from '../components/TopBar';

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
    <View style={styles.container}>
      {/* 1. MODULAR TOP BAR (FIXED, CONSISTENT HEIGHT) */}
      <TopBar variant="logo" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. PAGE TITLE & SUBTITLE */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Perjalanan</Text>
          <Text style={styles.pageSubtitle}>
            Kelola dan jalankan penugasan harian Anda
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

            <View style={styles.statusPillNeutral}>
              <View style={styles.statusDotBlue} />
              <Text style={styles.statusPillNeutralText}>Dalam Perjalanan</Text>
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
            <Play size={14} color={colors.white} fill={colors.white} style={{ marginRight: 8 }} />
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
            <ChevronRight size={13} color={colors.primary} strokeWidth={2.2} />
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
                      <CheckCircle2 size={18} color={colors.primary} strokeWidth={2.5} />
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

                    {isDone && (
                      <Text style={styles.statusDoneText}>
                        Selesai{stop.time ? ` • ${stop.time}` : ''}
                      </Text>
                    )}

                    {isCurrent && (
                      <Text style={styles.statusCurrentText}>Tujuan Saat Ini</Text>
                    )}

                    {isNext && (
                      <Text style={styles.statusNextText}>Berikutnya</Text>
                    )}

                    {stop.status === 'menunggu' && (
                      <Text style={styles.statusWaitingText}>Menunggu</Text>
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
    paddingBottom: 110,
  },

  /* PAGE HEADER */
  pageHeader: {
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 3,
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
    marginBottom: 14,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  segmentButtonActive: {
    backgroundColor: colors.surface,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12.5,
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
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  tripHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tripCode: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  statusPillNeutral: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDotBlue: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 5,
  },
  statusPillNeutralText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tripRoute: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },

  /* METRICS BOX */
  metricsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
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
    marginBottom: 2,
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
    height: 22,
    backgroundColor: colors.border,
  },

  /* PROGRESS BAR */
  progressContainer: {
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressPctText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  /* ACTION BUTTON */
  actionButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
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
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  sectionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLinkText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 2,
  },

  /* TIMELINE STOP LIST */
  timelineCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
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
    width: 1.5,
    height: 36,
    marginTop: 4,
  },
  timelineLineDone: {
    backgroundColor: colors.primary,
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
    marginBottom: 2,
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

  /* STOP STATUS (Clean typography without background containers) */
  statusDoneText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  statusCurrentText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  statusNextText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  statusWaitingText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textDisabled,
  },
});
