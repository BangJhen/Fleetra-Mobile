import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileCheck2,
  Fuel,
  KeyRound,
  Navigation,
  ShieldCheck,
  TrendingUp,
  Truck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

interface SlideItem {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  iconType: 'telematics' | 'epod' | 'rto';
  pills: string[];
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    badge: 'TELEMATIKA & IoT ARMADA',
    title: 'Navigasi Presisi & Telematika IoT',
    subtitle:
      'Optimasi rute cerdas OSRM belokan demi belokan, monitoring bahan bakar armada, dan status lalu lintas real-time di seluruh koridor logistik.',
    iconType: 'telematics',
    pills: ['Rute Dinamis OSRM', 'Sensor Bahan Bakar Real-time', 'Telemetri IoT'],
  },
  {
    id: 2,
    badge: 'VERIFIKASI DIGITAL KABIN',
    title: 'Serah Terima e-POD Bebas Kertas',
    subtitle:
      'Konfirmasi pengantaran kargo instan dengan dokumentasi foto ber-watermark GPS dan kanvas tanda tangan digital penerima tanpa manifes manual.',
    iconType: 'epod',
    pills: ['Foto Berstempel Waktu', 'Kanvas TTD Digital', '100% Paperless'],
  },
  {
    id: 3,
    badge: 'SEWA-BELI (RENT-TO-OWN)',
    title: 'Miliki Armada dari Setiap Ritase',
    subtitle:
      'Skema kepemilikan berkeadilan. Setiap ritase logistik yang Anda selesaikan otomatis dialokasikan menjadi ekuitas kepemilikan kendaraan blind van.',
    iconType: 'rto',
    pills: ['Pay-per-Trip', 'Akumulasi Ekuitas', 'Rekonsiliasi ETLE'],
  },
];

export const OnboardingScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeSlide = SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigateTo('login');
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    navigateTo('login');
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP BAR: LOGO & SKIP BUTTON */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/Fleetra Blue Ribbon Logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.logoTextCol}>
            <Text style={styles.brandTitle}>FLEETRA</Text>
            <Text style={styles.brandSubtitle}>Intelligent Driver App</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Lewati</Text>
          <ChevronRight size={13} color={colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* 2. MAIN SLIDE CONTENT */}
      <View style={styles.slideContainer}>
        {/* Dynamic Graphic Hero Box */}
        <View style={styles.heroGraphicBox}>
          {activeSlide.iconType === 'telematics' && (
            <View style={styles.iconCircleCluster}>
              <View style={styles.heroOuterRing}>
                <View style={styles.heroCenterIcon}>
                  <Navigation size={42} color={colors.primary} strokeWidth={2.2} />
                </View>
              </View>
              <View style={[styles.floatingMiniBadge, { top: 12, right: 18 }]}>
                <Fuel size={14} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.floatingMiniBadgeText}>BBM 74%</Text>
              </View>
              <View style={[styles.floatingMiniBadge, { bottom: 16, left: 14 }]}>
                <Truck size={14} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.floatingMiniBadgeText}>B 9821 KCE</Text>
              </View>
            </View>
          )}

          {activeSlide.iconType === 'epod' && (
            <View style={styles.iconCircleCluster}>
              <View style={styles.heroOuterRing}>
                <View style={styles.heroCenterIcon}>
                  <FileCheck2 size={42} color={colors.primary} strokeWidth={2.2} />
                </View>
              </View>
              <View style={[styles.floatingMiniBadge, { top: 12, right: 18 }]}>
                <Camera size={14} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.floatingMiniBadgeText}>GPS Foto</Text>
              </View>
              <View style={[styles.floatingMiniBadge, { bottom: 16, left: 14 }]}>
                <CheckCircle2 size={14} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.floatingMiniBadgeText}>TTD Digital</Text>
              </View>
            </View>
          )}

          {activeSlide.iconType === 'rto' && (
            <View style={styles.iconCircleCluster}>
              <View style={styles.heroOuterRing}>
                <View style={styles.heroCenterIcon}>
                  <KeyRound size={42} color={colors.primary} strokeWidth={2.2} />
                </View>
              </View>
              <View style={[styles.floatingMiniBadge, { top: 12, right: 18 }]}>
                <TrendingUp size={14} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.floatingMiniBadgeText}>Ekuitas 64,8%</Text>
              </View>
              <View style={[styles.floatingMiniBadge, { bottom: 16, left: 14 }]}>
                <ShieldCheck size={14} color={colors.primary} strokeWidth={2.2} />
                <Text style={styles.floatingMiniBadgeText}>Pay-per-Trip</Text>
              </View>
            </View>
          )}
        </View>

        {/* Badge Pill */}
        <View style={styles.slideBadgePill}>
          <Text style={styles.slideBadgeText}>{activeSlide.badge}</Text>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.slideTitle}>{activeSlide.title}</Text>
        <Text style={styles.slideSubtitle}>{activeSlide.subtitle}</Text>

        {/* Feature Check Pills */}
        <View style={styles.pillsRow}>
          {activeSlide.pills.map((pill, idx) => (
            <View key={idx} style={styles.featurePill}>
              <CheckCircle2 size={11} color={colors.primary} strokeWidth={2.4} />
              <Text style={styles.featurePillText}>{pill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 3. BOTTOM CONTROLS & PAGINATION */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setCurrentSlideIndex(idx)}
              style={[
                styles.dot,
                idx === currentSlideIndex && styles.dotActive,
              ]}
              activeOpacity={0.8}
            />
          ))}
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {isLastSlide ? 'Mulai Sekarang' : 'Lanjutkan'}
          </Text>
          <ArrowRight size={16} color={colors.white} strokeWidth={2.4} />
        </TouchableOpacity>

        {/* Secondary Login / Register Switcher */}
        <View style={styles.footerLinkRow}>
          <Text style={styles.footerLinkMuted}>Sudah memiliki akun mitra? </Text>
          <TouchableOpacity onPress={() => navigateTo('login')} activeOpacity={0.7}>
            <Text style={styles.footerLinkBold}>Masuk ke Akun</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 38,
    height: 38,
  },
  logoTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 3,
  },
  skipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* SLIDE MAIN CONTENT */
  slideContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  heroGraphicBox: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  iconCircleCluster: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroOuterRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCenterIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  floatingMiniBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingMiniBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.text,
  },

  slideBadgePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 10,
  },
  slideBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  slideTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  slideSubtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
    gap: 5,
  },
  featurePillText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* BOTTOM CONTROLS */
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 10,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#CBD5E1',
  },
  dotActive: {
    width: 22,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 14,
  },
  primaryBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.white,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLinkMuted: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
  footerLinkBold: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
  },
});
