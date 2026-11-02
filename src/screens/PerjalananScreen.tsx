import React, { useMemo, useState } from 'react';
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
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  MapPin,
  Milestone,
  Play,
  RefreshCw,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

interface StopItem {
  id: number;
  name: string;
  address: string;
  status: 'selesai' | 'tujuan_saat_ini' | 'berikutnya' | 'menunggu';
  time?: string;
  distance?: string;
}

interface PerjalananScreenProps {
  onBackToHome?: () => void;
  onOpenDetailStop?: (stopId: number) => void;
  completedStops?: number[];
}

const PAST_TRIPS = [
  {
    id: 'TRIP-2026-088',
    date: 'Kemarin, 31 Okt 2026',
    route: 'Gudang Cimahi → Padalarang',
    distance: '32,4 km',
    duration: '1j 45m',
    status: 'Selesai',
    rtoContribution: 'Rp 45.000',
    stops: 5,
  },
  {
    id: 'TRIP-2026-087',
    date: '28 Okt 2026',
    route: 'Gudang Cimahi → Buah Batu',
    distance: '24,8 km',
    duration: '1j 20m',
    status: 'Selesai',
    rtoContribution: 'Rp 60.000',
    stops: 6,
  },
  {
    id: 'TRIP-2026-086',
    date: '26 Okt 2026',
    route: 'Gudang Cimahi → Cibiru & Ujungberung',
    distance: '41,2 km',
    duration: '2j 10m',
    status: 'Selesai',
    rtoContribution: 'Rp 75.000',
    stops: 7,
  },
];

export const PerjalananScreen: React.FC<PerjalananScreenProps> = (props) => {
  const {
    activeTripTab,
    setActiveTripTab,
    setSelectedStopId,
    isTripCompleted,
    completeEntireTrip,
    navigateTo,
    activeTrip,
    completedTrips,
    refreshData,
    driverProfile,
    stops: backendStops,
    completedStops: contextCompletedStops,
  } = useApp();

  const completedStops = props.completedStops || contextCompletedStops;

  const onOpenDetailStop = (stopId: number) => {
    setSelectedStopId(stopId);
    if (props.onOpenDetailStop) {
      props.onOpenDetailStop(stopId);
    } else {
      navigateTo('detail-stop');
    }
  };

  const activeSegmentTab = activeTripTab;
  const [historyPage, setHistoryPage] = useState<number>(1);
  const historyPageSize = 5;

  // Stops list computed from real backend stops
  const stops: StopItem[] = useMemo(() => {
    if (!backendStops || backendStops.length === 0) return [];
    const firstPendingIndex = backendStops.findIndex((s) => s.status !== 'delivered');

    return backendStops.map((s, idx) => {
      let itemStatus: 'selesai' | 'tujuan_saat_ini' | 'berikutnya' | 'menunggu' = 'menunggu';
      if (s.status === 'delivered') {
        itemStatus = 'selesai';
      } else if (idx === firstPendingIndex) {
        itemStatus = 'tujuan_saat_ini';
      } else if (idx === firstPendingIndex + 1) {
        itemStatus = 'berikutnya';
      } else {
        itemStatus = 'menunggu';
      }

      return {
        id: idx + 1,
        name: s.name,
        address: s.address,
        status: itemStatus,
        time: s.epod?.at
          ? new Date(s.epod.at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          : undefined,
        distance: `${(idx * 3.5 + 1.2).toFixed(1)} km`,
      };
    });
  }, [backendStops]);

  const totalStopsCount = stops.length || 1;
  const completedCount = completedStops.length;
  const progressPercent = Math.min(Math.round((completedCount / totalStopsCount) * 100), 100);
  const isAllCompleted = completedCount >= totalStopsCount || isTripCompleted;
  const nextActiveStopId = stops.find((s) => s.status === 'tujuan_saat_ini')?.id || (completedCount < totalStopsCount ? completedCount + 1 : totalStopsCount);

  const handleStopPress = (stop: StopItem) => {
    if (stop.status === 'tujuan_saat_ini' || stop.status === 'selesai') {
      onOpenDetailStop(stop.id);
    } else {
      Alert.alert(
        stop.name,
        `Status: ${stop.status === 'berikutnya' ? 'Stop Berikutnya' : 'Menunggu Antrean'}\nAlamat: ${stop.address}\n\nSelesaikan stop sebelumnya terlebih dahulu sebelum membuka titik ini.`,
        [{ text: 'Mengerti' }]
      );
    }
  };

  // Past trips computed from real database completed trips
  const pastTripsList = useMemo(() => {
    if (completedTrips && completedTrips.length > 0) {
      return completedTrips.map((t) => ({
        id: t.code,
        date: new Date(t.completedAt || t.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        route: t.stops.length > 0 ? `${t.stops[0].name} → ${t.stops[t.stops.length - 1].name}` : 'Rute Penugasan',
        distance: `${t.distance} km`,
        duration: `${t.duration} menit`,
        status: 'Selesai',
        rtoContribution: 'Rp 45.000',
        stops: t.stops.length,
      }));
    }
    return [];
  }, [completedTrips]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PAGE TITLE & SUBTITLE */}
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
            onPress={() => setActiveTripTab('aktif')}
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
            onPress={() => setActiveTripTab('riwayat')}
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

        {activeSegmentTab === 'aktif' ? (
          activeTrip ? (
            <>
              {/* 4. ACTIVE TRIP CARD */}
              <View style={styles.tripCard}>
                {/* Card Header */}
                <View style={styles.tripHeaderRow}>
                  <Text style={styles.tripCode}>#{activeTrip.code}</Text>

                <View style={styles.statusPillNeutral}>
                  <Text style={styles.statusPillNeutralText}>
                    {isAllCompleted ? 'Ritase Selesai' : activeTrip?.status === 'assigned' ? 'Menunggu Dimulai' : 'Dalam Perjalanan'}
                  </Text>
                </View>
              </View>

              <Text style={styles.tripRoute}>
                {stops.length > 0 ? `${stops[0].name} → ${stops.length - 1} Titik Pengantaran` : 'Rute Penugasan Belum Tersedia'}
              </Text>

              {/* 3-Column Metrics */}
              <View style={styles.metricsBox}>
                <View style={styles.metricCol}>
                  <View style={styles.metricIconRow}>
                    <Clock size={13} color={colors.primary} strokeWidth={2.2} />
                    <Text style={styles.metricValue}>
                      {activeTrip?.startedAt
                        ? new Date(activeTrip.startedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                        : '08.00 WIB'}
                    </Text>
                  </View>
                  <Text style={styles.metricLabel}>Waktu Mulai</Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricCol}>
                  <View style={styles.metricIconRow}>
                    <MapPin size={13} color={colors.primary} strokeWidth={2.2} />
                    <Text style={styles.metricValue}>{totalStopsCount} Stop</Text>
                  </View>
                  <Text style={styles.metricLabel}>Tujuan</Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricCol}>
                  <View style={styles.metricIconRow}>
                    <Milestone size={13} color={colors.primary} strokeWidth={2.2} />
                    <Text style={styles.metricValue}>{activeTrip?.distance || 28.4} km</Text>
                  </View>
                  <Text style={styles.metricLabel}>Total Jarak</Text>
                </View>
              </View>

              {/* Horizontal Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.progressLabel}>
                    {completedCount} / {totalStopsCount} stop selesai
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
              {isAllCompleted ? (
                <TouchableOpacity
                  style={styles.actionButtonDone}
                  onPress={() => {
                    completeEntireTrip();
                    setActiveTripTab('riwayat');
                  }}
                  activeOpacity={0.85}
                >
                  <CheckCircle2 size={15} color={colors.white} strokeWidth={2.4} style={{ marginRight: 8 }} />
                  <Text style={styles.actionButtonText}>Ritase Selesai - Selesaikan Pesanan</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onOpenDetailStop(nextActiveStopId)}
                  activeOpacity={0.85}
                >
                  <Play size={14} color={colors.white} fill={colors.white} style={{ marginRight: 8 }} />
                  <Text style={styles.actionButtonText}>
                    Lanjutkan ke Stop {nextActiveStopId}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 5. SECTION: DETAIL RUTE */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Detail Rute</Text>
              <TouchableOpacity
                style={styles.sectionLinkRow}
                onPress={() => onOpenDetailStop(nextActiveStopId)}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionLinkText}>Lihat Rute di Peta</Text>
                <ChevronRight size={13} color={colors.primary} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>

            {/* 6. TIMELINE STOP LIST */}
            <View style={styles.timelineCard}>
              {stops.map((stop, index) => {
                const isFirst = index === 0;
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
                    onPress={() => handleStopPress(stop)}
                    activeOpacity={0.8}
                  >
                    {/* Left Timeline Indicator */}
                    <View style={styles.timelineCol}>
                      {/* Node Icon Box */}
                      <View style={styles.nodeIconBox}>
                        {isDone ? (
                          <View style={styles.iconCircleDone}>
                            <CheckCircle2 size={18} color={colors.primary} strokeWidth={2.4} />
                          </View>
                        ) : isCurrent ? (
                          <View style={styles.iconCircleCurrent}>
                            <View style={styles.dotCurrent} />
                          </View>
                        ) : (
                          <View style={styles.iconCirclePending}>
                            <Circle size={10} color="#94A3B8" strokeWidth={2.2} />
                          </View>
                        )}
                      </View>

                      {/* Continuous Connecting Track with Integrated Direction Arrow */}
                      {!isLast && (
                        <View style={styles.trackContainer} pointerEvents="none">
                          <View
                            style={[
                              styles.trackLineSegment,
                              isDone ? styles.trackLineDone : styles.trackLinePending,
                            ]}
                          />
                          <View style={styles.arrowIndicator}>
                            <ChevronDown
                              size={11}
                              color={isDone ? colors.primary : '#94A3B8'}
                              strokeWidth={2.6}
                            />
                          </View>
                          <View
                            style={[
                              styles.trackLineSegment,
                              isDone ? styles.trackLineDone : styles.trackLinePending,
                            ]}
                          />
                        </View>
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
                            Selesai{stop.time ? ` (${stop.time})` : ''}
                          </Text>
                        )}

                        {isCurrent && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>Stop Aktif</Text>
                          </View>
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
          </>
        ) : (
          <View style={styles.emptyTripCard}>
            {/* Top Status Pill */}
            <View style={styles.emptyStatusPill}>
              <View style={styles.emptyStatusDot} />
              <Text style={styles.emptyStatusPillText}>Status Armada: Siaga</Text>
            </View>

            {/* Centered Graphic Icon */}
            <View style={styles.emptyIconCircle}>
              <Milestone size={26} color={colors.primary} strokeWidth={2.2} />
            </View>

            {/* Typography */}
            <Text style={styles.emptyTitle}>Belum Ada Penugasan Aktif</Text>
            <Text style={styles.emptyDescription}>
              Saat dispatcher FLEETRA menetapkan jadwal rute pengantaran baru untuk akun Anda, rute perjalanan, titik singgah, dan formulir e-POD akan otomatis muncul di sini.
            </Text>

            {/* System Info Box */}
            <View style={styles.emptyInfoBox}>
              <View style={styles.emptyInfoRow}>
                <Text style={styles.emptyInfoLabel}>Koneksi Pusat Kendali</Text>
                <Text style={styles.emptyInfoValue}>Tersinkron Real-time</Text>
              </View>
              <View style={styles.emptyInfoDivider} />
              <View style={styles.emptyInfoRow}>
                <Text style={styles.emptyInfoLabel}>Mitra Pengemudi</Text>
                <Text style={styles.emptyInfoValue}>{driverProfile.name || 'Mitra Aktif'}</Text>
              </View>
            </View>

            {/* Refresh Action Button */}
            <TouchableOpacity
              style={styles.emptyRefreshButton}
              onPress={refreshData}
              activeOpacity={0.8}
            >
              <RefreshCw size={14} color={colors.primary} strokeWidth={2.2} style={{ marginRight: 8 }} />
              <Text style={styles.emptyRefreshButtonText}>
                Muat Ulang Status Penugasan
              </Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
          /* RIWAYAT PENUGASAN SECTION */
          <View style={styles.historyListSection}>
            <View style={styles.historyHeaderRow}>
              <Text style={styles.sectionTitle}>Riwayat Penugasan Selesai</Text>
              <Text style={styles.historyCountText}>{pastTripsList.length} Ritase</Text>
            </View>

            {pastTripsList.length === 0 ? (
              <View style={[styles.historyCard, { alignItems: 'center', paddingVertical: 24 }]}>
                <Clock size={28} color={colors.textDisabled} strokeWidth={1.8} style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                  Belum Ada Riwayat Penugasan
                </Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 }}>
                  Perjalanan yang diselesaikan hari ini akan otomatis tersinkronisasi dan tercatat di sini.
                </Text>
              </View>
            ) : (
              <>
                {pastTripsList
                  .slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize)
                  .map((trip) => (
                    <TouchableOpacity
                      key={trip.id}
                      style={styles.historyCard}
                      onPress={() =>
                        Alert.alert(
                          `Detail Ritase #${trip.id}`,
                          `Tanggal: ${trip.date}\nRute: ${trip.route}\nTotal Jarak: ${trip.distance}\nDurasi: ${trip.duration}\nJumlah Stop: ${trip.stops} Titik (Selesai 100%)\nAlokasi Setoran RTO: ${trip.rtoContribution}\n\nSeluruh data e-POD dan dokumen logistik telah terarsip di cloud konsol dispatcher.`,
                          [{ text: 'Tutup' }]
                        )
                      }
                      activeOpacity={0.8}
                    >
                      <View style={styles.historyCardHeader}>
                        <Text style={styles.historyTripCode}>#{trip.id}</Text>
                        <Text style={styles.historyDateText}>{trip.date}</Text>
                      </View>

                      <Text style={styles.historyRouteText}>{trip.route}</Text>

                      <View style={styles.historyDivider} />

                      <View style={styles.historyMetaRow}>
                        <View style={styles.historyMetaItem}>
                          <Milestone size={12} color={colors.primary} strokeWidth={2} />
                          <Text style={styles.historyMetaVal}>{trip.distance}</Text>
                        </View>
                        <View style={styles.historyMetaItem}>
                          <Clock size={12} color={colors.primary} strokeWidth={2} />
                          <Text style={styles.historyMetaVal}>{trip.duration}</Text>
                        </View>
                        <View style={styles.historyMetaItem}>
                          <CheckCircle2 size={12} color={colors.primary} strokeWidth={2} />
                          <Text style={styles.historyMetaVal}>{trip.stops} Stop e-POD</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}

                {/* Pagination Controls */}
                {Math.ceil(pastTripsList.length / historyPageSize) > 1 && (
                  <View style={styles.paginationRow}>
                    <TouchableOpacity
                      style={[
                        styles.paginationBtn,
                        historyPage === 1 && styles.paginationBtnDisabled,
                      ]}
                      disabled={historyPage === 1}
                      onPress={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.paginationBtnText,
                          historyPage === 1 && styles.paginationBtnTextDisabled,
                        ]}
                      >
                        Sebelumnya
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.paginationInfoText}>
                      Hal. {historyPage} dari {Math.ceil(pastTripsList.length / historyPageSize)}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.paginationBtn,
                        historyPage >= Math.ceil(pastTripsList.length / historyPageSize) &&
                          styles.paginationBtnDisabled,
                      ]}
                      disabled={historyPage >= Math.ceil(pastTripsList.length / historyPageSize)}
                      onPress={() =>
                        setHistoryPage((p) =>
                          Math.min(Math.ceil(pastTripsList.length / historyPageSize), p + 1)
                        )
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.paginationBtnText,
                          historyPage >= Math.ceil(pastTripsList.length / historyPageSize) &&
                            styles.paginationBtnTextDisabled,
                        ]}
                      >
                        Berikutnya
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
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
    paddingBottom: 110,
  },

  /* PAGE HEADER */
  pageHeader: {
    paddingHorizontal: 18,
    marginTop: 20,
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
    backgroundColor: colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
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
  actionButtonDone: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },

  /* EMPTY STATE STYLES */
  emptyTripCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
    gap: 6,
  },
  emptyStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  emptyStatusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  emptyInfoBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  emptyInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  emptyInfoDivider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginVertical: 3,
  },
  emptyInfoLabel: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
  emptyInfoValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.text,
  },
  emptyRefreshButton: {
    width: '100%',
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  emptyRefreshButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
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
    paddingHorizontal: 8,
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
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    position: 'relative',
    borderRadius: 12,
  },
  stopRowLast: {
    borderBottomWidth: 0,
  },
  stopRowCurrent: {
    backgroundColor: 'rgba(36, 99, 216, 0.04)',
  },

  /* TIMELINE INDICATOR */
  timelineCol: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  nodeIconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    backgroundColor: 'transparent',
  },
  iconCircleDone: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 11,
  },
  iconCircleCurrent: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  iconCirclePending: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 11,
  },

  /* CONTINUOUS CONNECTING TRACK */
  trackContainer: {
    position: 'absolute',
    top: 24,
    bottom: -12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  trackLineSegment: {
    flex: 1,
    width: 2,
    borderRadius: 1,
  },
  trackLineDone: {
    backgroundColor: colors.primary,
  },
  trackLinePending: {
    backgroundColor: '#CBD5E1',
  },
  arrowIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -2,
    zIndex: 2,
  },

  /* STOP INFO */
  stopInfoCol: {
    flex: 1,
    justifyContent: 'center',
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

  /* STOP STATUS */
  statusDoneText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  currentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
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

  /* RIWAYAT PENUGASAN STYLES */
  historyListSection: {
    paddingHorizontal: 18,
    marginTop: 14,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTripCode: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  historyDateText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  historyRouteText: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  historyDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 10,
  },
  historyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  historyMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  historyMetaVal: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  paginationBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paginationBtnDisabled: {
    opacity: 0.45,
  },
  paginationBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  paginationBtnTextDisabled: {
    color: colors.textDisabled,
  },
  paginationInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
