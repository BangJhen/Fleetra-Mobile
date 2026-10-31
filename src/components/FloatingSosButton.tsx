import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PhoneCall } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface FloatingSosButtonProps {
  onPress: () => void;
}

export const FloatingSosButton: React.FC<FloatingSosButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel="Tombol Darurat SOS"
      accessibilityRole="button"
    >
      <View style={styles.inner}>
        <PhoneCall size={20} color={colors.white} strokeWidth={2.5} />
        <Text style={styles.text}>SOS</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.dangerDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 1,
  },
});

