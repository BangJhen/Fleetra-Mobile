import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertTriangle, Phone, X } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface SosModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <AlertTriangle size={36} color={colors.danger} strokeWidth={2.5} />
          </View>

          <Text style={styles.title}>Peringatan Darurat SOS</Text>
          <Text style={styles.description}>
            Sinyal panik darurat akan segera dikirimkan ke pusat kendali Dispatcher FLEETRA beserta koordinat GPS live dan identitas armada Anda.
          </Text>

          <TouchableOpacity style={styles.callButton} onPress={onConfirm} activeOpacity={0.85}>
            <Phone size={18} color={colors.white} strokeWidth={2.5} style={{ marginRight: 8 }} />
            <Text style={styles.callButtonText}>Pancarkan Sinyal Darurat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>Batalkan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  callButton: {
    width: '100%',
    height: 48,
    backgroundColor: colors.danger,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  callButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    width: '100%',
    height: 44,
    backgroundColor: colors.surface2,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
