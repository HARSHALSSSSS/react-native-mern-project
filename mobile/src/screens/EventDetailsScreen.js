import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { eventService } from '../services';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Event Details Screen
 */
const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventService.getById(eventId);
      setEvent(response.data.data.event);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTickets = () => {
    navigation.navigate('BookTickets', { eventId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {event.poster && (
          <Image source={{ uri: event.poster }} style={styles.posterImage} />
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <FontAwesome name="calendar" size={16} color="#667eea" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>
                  {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <FontAwesome name="map-marker" size={16} color="#667eea" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>{event.venue?.name}</Text>
                <Text style={styles.infoSubValue}>{event.venue?.address}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <FontAwesome name="users" size={16} color="#667eea" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Capacity</Text>
                <Text style={styles.infoValue}>
                  {event.remainingCapacity} / {event.totalCapacity} available
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <FontAwesome name="tag" size={16} color="#667eea" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Price per Ticket</Text>
                <Text style={styles.infoValue}>${event.ticketPrice}</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {event.remainingCapacity > 0 ? (
            <TouchableOpacity style={styles.bookButton} onPress={handleBookTickets}>
              <FontAwesome name="check" size={20} color="#fff" />
              <Text style={styles.bookButtonText}>Book Tickets</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.soldOutButton}>
              <Text style={styles.soldOutText}>Sold Out</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 20,
  },
  posterImage: {
    width: '100%',
    height: 220,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    numberOfLines: 3,
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    paddingRight: 8,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    numberOfLines: 2,
  },
  infoSubValue: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    numberOfLines: 2,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  soldOutButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  soldOutText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailsScreen;
