import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { checkinService } from '../services';

/**
 * QR Check-in Screen
 * For admin/staff to check-in users at events using QR code
 */
const CheckinScreen = ({ navigation }) => {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const inputRef = useRef(null);

  const handleCheckin = async () => {
    if (!qrCode.trim()) {
      Alert.alert('Error', 'Please enter or scan a QR code');
      return;
    }

    try {
      setLoading(true);
      const response = await checkinService.checkIn({
        qrCode: qrCode.trim(),
      });

      setLastScannedItem(response.data.data);
      setQrCode('');

      Alert.alert('Success', `${response.data.data.userName} checked in successfully!`, [
        {
          text: 'OK',
          onPress: () => {
            inputRef.current?.focus();
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Check-in Failed',
        error.response?.data?.message || 'Invalid QR code or booking not found'
      );
      setQrCode('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setLastScannedItem(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Check-in</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {/* Instructions */}
          <View style={styles.instructionBox}>
            <FontAwesome name="info-circle" size={20} color="#2196f3" />
            <Text style={styles.instructionText}>
              Scan or paste the booking QR code to check-in attendees
            </Text>
          </View>

          {/* QR Code Input */}
          <View style={styles.scanSection}>
            <Text style={styles.label}>Booking QR Code</Text>
            <TextInput
              ref={inputRef}
              style={styles.qrInput}
              placeholder="Paste QR code or scan here..."
              value={qrCode}
              onChangeText={setQrCode}
              editable={!loading}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.checkinButton, loading && styles.buttonDisabled]}
              onPress={handleCheckin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <FontAwesome name="check-circle" size={20} color="#fff" />
                  <Text style={styles.checkinButtonText}>Check-in</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Last Scanned Item */}
          {lastScannedItem && (
            <View style={styles.successBox}>
              <View style={styles.successHeader}>
                <FontAwesome name="check" size={24} color="#4caf50" />
                <Text style={styles.successTitle}>Checked In</Text>
                <TouchableOpacity onPress={handleClearHistory}>
                  <FontAwesome name="times" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.successContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{lastScannedItem.userName}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Event:</Text>
                  <Text style={styles.value} numberOfLines={1}>
                    {lastScannedItem.eventTitle}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Tickets:</Text>
                  <Text style={styles.value}>{lastScannedItem.quantity}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Check-in Time:</Text>
                  <Text style={styles.value}>
                    {new Date(lastScannedItem.checkinTime).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Camera Instructions */}
          <View style={styles.cameraBox}>
            <FontAwesome name="camera" size={48} color="#ccc" style={styles.cameraIcon} />
            <Text style={styles.cameraTitle}>Enable Camera for QR Scanning</Text>
            <Text style={styles.cameraSubtitle}>
              To use automatic QR code scanning, enable camera access in settings
            </Text>
            <TouchableOpacity style={styles.settingsButton}>
              <FontAwesome name="cog" size={16} color="#667eea" />
              <Text style={styles.settingsButtonText}>Open Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Tips */}
          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>Tips:</Text>
            <View style={styles.tipItem}>
              <FontAwesome name="check" size={12} color="#667eea" style={styles.tipIcon} />
              <Text style={styles.tipText}>Position QR code in the frame to auto-scan</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check" size={12} color="#667eea" style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Each ticket can only be checked-in once
              </Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check" size={12} color="#667eea" style={styles.tipIcon} />
              <Text style={styles.tipText}>System automatically detects QR code format</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  instructionBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  instructionText: {
    marginLeft: 12,
    fontSize: 13,
    color: '#1976d2',
    flex: 1,
    fontWeight: '500',
  },
  scanSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  qrInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  checkinButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  checkinButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
    flex: 1,
    marginLeft: 8,
  },
  successContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  cameraBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  cameraIcon: {
    marginBottom: 12,
    opacity: 0.3,
  },
  cameraTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  cameraSubtitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  settingsButtonText: {
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 13,
  },
  tipsBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
});

export default CheckinScreen;
