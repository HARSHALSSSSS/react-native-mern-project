import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { bookingService } from '../services';
import { useAuth } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Book Tickets Screen
 */
const BookTicketsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { user } = useAuth();
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    setError('');
  };

  const handleBooking = async () => {
    if (!quantity || parseInt(quantity) < 1) {
      setError('Please enter a valid ticket quantity');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await bookingService.create({
        eventId,
        quantity: parseInt(quantity),
      });

      alert('Booking successful! Check "My Tickets" tab.');
      // Go back to home and let user switch to MyBookings tab
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Tickets</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {error ? (
          <View style={styles.errorBox}>
            <FontAwesome name="exclamation-circle" size={20} color="#d32f2f" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.bookingForm}>
          <Text style={styles.label}>Number of Tickets</Text>

          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(Math.max(1, parseInt(quantity) - 1).toString())}
              disabled={loading}
            >
              <FontAwesome name="minus" size={20} color="#667eea" />
            </TouchableOpacity>

            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={handleQuantityChange}
              keyboardType="number-pad"
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange((parseInt(quantity) + 1).toString())}
              disabled={loading}
            >
              <FontAwesome name="plus" size={20} color="#667eea" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>User Information</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>
                <Text style={styles.infoKey}>Name: </Text>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoKey}>Email: </Text>
                {user?.email}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.bookButton, loading && styles.buttonDisabled]}
            onPress={handleBooking}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <FontAwesome name="check" size={20} color="#fff" />
                <Text style={styles.bookButtonText}>Confirm Booking</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    numberOfLines: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorBox: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    marginLeft: 8,
    flex: 1,
  },
  bookingForm: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
  },
  quantityButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 8,
  },
  infoContent: {
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    numberOfLines: 1,
    flexWrap: 'wrap',
  },
  infoKey: {
    fontWeight: '600',
    color: '#667eea',
  },
  bookButton: {
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
  bookButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
    numberOfLines: 1,
  },
});

export default BookTicketsScreen;
