import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { colors } from '../theme/colors';

export interface TopBarProps {
  /**
   * 'logo': Standard brand header with FLEETRA logo on the left.
   * 'back': Sub-screen header with back navigation button and centered title.
   */
  variant?: 'logo' | 'back';
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showNotificationBell?: boolean;
  hasUnreadNotifications?: boolean;
  onPressNotifications?: () => void;
  rightAction?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  variant = 'back',
  title,
  subtitle,
  onBack,
  showNotificationBell = false,
  hasUnreadNotifications = false,
  onPressNotifications,
  rightAction,
}) => {
  return (
    <View style={styles.topBarContainer}>
      {variant === 'logo' ? (
        /* VARIANT: LOGO BRAND HEADER (Primary Tabs) */
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/Fleetra Blue Ribbon Logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />

          <View style={styles.rightSlot}>
            {showNotificationBell ? (
              <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.75}
                onPress={onPressNotifications}
                accessibilityLabel="Buka Notifikasi"
                accessibilityRole="button"
              >
                <Bell size={20} color={colors.text} strokeWidth={2} />
                {hasUnreadNotifications && <View style={styles.badgeDot} />}
              </TouchableOpacity>
            ) : rightAction ? (
              rightAction
            ) : (
              <View style={styles.placeholderBox} />
            )}
          </View>
        </View>
      ) : (
        /* VARIANT: BACK NAVIGATION HEADER (Sub-screens) */
        <View style={styles.navRow}>
          {/* Left Slot: Back Button */}
          <View style={styles.leftSlot}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBack}
              activeOpacity={0.75}
              accessibilityLabel="Kembali ke layar sebelumnya"
              accessibilityRole="button"
            >
              <ArrowLeft size={18} color={colors.text} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Center Slot: Title & Subtitle */}
          <View style={styles.centerSlot}>
            {title && (
              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={styles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Right Slot: Custom Action or Balanced Spacer */}
          <View style={styles.rightSlot}>
            {rightAction ? rightAction : <View style={styles.placeholderBox} />}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    minHeight: 64,
    justifyContent: 'center',
    zIndex: 50,
  },

  /* LOGO VARIANT ROW */
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoImage: {
    width: 126,
    height: 32,
  },

  /* NAVIGATION VARIANT ROW */
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSlot: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightSlot: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  placeholderBox: {
    width: 44,
    height: 44,
  },

  /* INTERACTIVE BUTTONS */
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.dangerDark,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },

  /* TYPOGRAPHY */
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1.5,
    textAlign: 'center',
  },
});

