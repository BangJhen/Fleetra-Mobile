import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const OnboardingScreen: React.FC = () => {
  const { navigateTo } = useApp();

  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const lineProgress = useRef(new Animated.Value(0)).current;
  const subtextFade = useRef(new Animated.Value(0)).current;

  const timerRef = useRef<any>(null);

  const handleFinish = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    navigateTo('login');
  };

  useEffect(() => {
    // 1. Logo entrance animation: smooth fade & gentle scale
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Subtle progress line & version subtext fade
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(lineProgress, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(subtextFade, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Auto-redirect smoothly into login after 2.0s
    timerRef.current = setTimeout(() => {
      handleFinish();
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const lineWidth = lineProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Pressable style={styles.container} onPress={handleFinish}>
      <View style={styles.centerContent}>
        {/* Animated FLEETRA Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/Fleetra Blue Ribbon Logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Minimal Hairline Progress Track */}
        <View style={styles.lineTrack}>
          <Animated.View style={[styles.lineFill, { width: lineWidth }]} />
        </View>

        {/* Minimal Subtext (No icons, no emoji, pure typography) */}
        <Animated.View style={{ opacity: subtextFade }}>
          <Text style={styles.subtext}>Intelligent Fleet Management</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface, // Clean pure light surface #FFFFFF
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 210,
    height: 54,
  },
  lineTrack: {
    width: 100,
    height: 2.5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  lineFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  subtext: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
