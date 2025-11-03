import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { bookingService } from '../services';
import { useAuth } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

/**
 * My Bookings Screen - Tickets
 */
const MyBookingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      setBookings(response.data.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  const renderBookingCard = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate('BookingDetail', { bookingId: item._id })}
    >
      <View style={styles.bookingHeader}>
        <View>
          <Text style={styles.eventTitle}>{item.event.title}</Text>
          <Text style={styles.bookingRef}>Ref: {item.bookingReference}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.bookingStatus === 'confirmed' ? '#4caf50' : '#ff9800' },
          ]}
        >
          <Text style={styles.statusText}>{item.bookingStatus}</Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={14} color="#666" />
          <Text style={styles.detailText}>{new Date(item.event.startDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome name="map-marker" size={14} color="#666" />
          <Text style={styles.detailText}>{item.event.venue?.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome name="ticket" size={14} color="#666" />
          <Text style={styles.detailText}>{item.quantity} tickets</Text>
        </View>
      </View>

      <View style={styles.bookingFooter}>
        <Text style={styles.totalPrice}>${item.totalPrice}</Text>
        {item.qrCode && (
          <View style={styles.qrBadge}>
            <FontAwesome name="qrcode" size={16} color="#667eea" />
            <Text style={styles.qrText}>QR Code</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎟️ My Tickets</Text>
      </View>

      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.bookingsList}
          onRefresh={handleRefresh}
          refreshing={loading}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="inbox" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Events</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    numberOfLines: 1,
  },
  bookingsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    numberOfLines: 2,
    flex: 1,
  },
  bookingRef: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    numberOfLines: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  bookingDetails: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    numberOfLines: 1,
    flexWrap: 'wrap',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667eea',
  },
  qrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qrText: {
    color: '#667eea',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MyBookingsScreen;
