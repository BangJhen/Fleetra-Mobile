import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  Navigation,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export const OnboardingScreen: React.FC = () => {
  const { navigateTo } = useApp();

  // Animation values
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(24)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressBar = useRef(new Animated.Value(0)).current;

  const timerRef = useRef<any>(null);

  const handleProceed = (target: 'login' | 'register' = 'login') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    navigateTo(target);
  };

  useEffect(() => {
    // 1. Entrance animation sequence
    Animated.sequence([
      // Logo scale & fade in
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Content slide & fade
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
      ]),
    ]).start();

    // 2. Subtle ambient pulse for the glow ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Progress bar animation (completes in 2.6s)
    Animated.timing(progressBar, {
      toValue: 1,
      duration: 2600,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    // 4. Auto redirect to login after smooth entrance animation
    timerRef.current = setTimeout(() => {
      handleProceed('login');
    }, 2800);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const progressWidth = progressBar.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* TOP SKIP ACTION */}
      <View style={styles.topBar}>
        <View style={styles.topPill}>
          <ShieldCheck size={14} color={colors.primary} strokeWidth={2.2} />
          <Text style={styles.topPillText}>ADIKARA 2026 Softdev</Text>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => handleProceed('login')}
          activeOpacity={0.7}
          accessibilityLabel="Lewati ke Halaman Masuk"
        >
          <Text style={styles.skipText}>Lewati</Text>
          <ChevronRight size={14} color={colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* CENTER ANIMATED BRAND & SPLASH HERO */}
      <View style={styles.centerContainer}>
        {/* Ambient Glowing Background Circle */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Brand Logo (Official Asset contains Wordmark - No hardcoded text) */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/Fleetra Blue Ribbon Logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Animated Tagline & System Info */}
        <Animated.View
          style={[
            styles.taglineSection,
            {
              opacity: contentFade,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>INTELLIGENT FLEET & RTO</Text>
          </View>

          <Text style={styles.heroHeadline}>
            Ekosistem Telematika Cerdas & Kepemilikan Armada
          </Text>

          <Text style={styles.heroSubheadline}>
            Optimasi rute logistik OSRM, verifikasi digital serah terima e-POD, dan akumulasi ekuitas sewa-beli (Rent-to-Own) dalam satu genggaman kabin.
          </Text>

          {/* Value Proposition Micro Cards */}
          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <View style={[styles.featureIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Navigation size={16} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.featureLabel}>Rute Dinamis</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIconBox, { backgroundColor: '#F0FDF4' }]}>
                <FileCheck2 size={16} color={colors.success} strokeWidth={2.2} />
              </View>
              <Text style={styles.featureLabel}>e-POD Paperless</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIconBox, { backgroundColor: '#F8FAFC' }]}>
                <TrendingUp size={16} color="#0284C7" strokeWidth={2.2} />
              </View>
              <Text style={styles.featureLabel}>Sewa-Beli RTO</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* BOTTOM CONTROLS & INITIALIZATION PROGRESS */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            opacity: contentFade,
          },
        ]}
      >
        {/* Loading Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[styles.progressBarFill, { width: progressWidth }]}
            />
          </View>
          <View style={styles.progressMetaRow}>
            <Text style={styles.progressText}>
              Menginisialisasi telematika kabin...
            </Text>
            <View style={styles.onlineBadge}>
              <CheckCircle2 size={11} color={colors.success} strokeWidth={2.5} />
              <Text style={styles.onlineBadgeText}>Sistem Siap</Text>
            </View>
          </View>
        </View>

        {/* Primary Action: Go to Login */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => handleProceed('login')}
          activeOpacity={0.85}
          accessibilityLabel="Masuk ke Akun Driver"
        >
          <Text style={styles.primaryButtonText}>Masuk ke Akun Mitra</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
        </TouchableOpacity>

        {/* Secondary Register Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerTextMuted}>Belum terdaftar sebagai mitra?</Text>
          <TouchableOpacity
            onPress={() => handleProceed('register')}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.footerLinkBold}> Daftar Pengemudi</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg, // Light mode #F8FAFC
    justifyContent: 'space-between',
    paddingBottom: 24,
  },

  /* TOP BAR */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  topPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* CENTER HERO SECTION */
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: width * 0.78,
    height: width * 0.78,
    borderRadius: (width * 0.78) / 2,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    opacity: 0.65,
  },
  logoWrapper: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  brandLogo: {
    width: 190,
    height: 48,
  },

  /* TAGLINE & HEADLINES */
  taglineSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  badgePill: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  heroHeadline: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  heroSubheadline: {
    fontSize: 12.5,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  /* FEATURE VALUE PROPOSITION GRID */
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  /* BOTTOM PROGRESS & ACTION CONTROLS */
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.success,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.2,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTextMuted: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerLinkBold: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
