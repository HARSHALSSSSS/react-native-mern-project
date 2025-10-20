import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { eventService } from '../services';

/**
 * Home Screen - List of Events
 */
const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll({
        status: 'upcoming',
        limit: 50,
      });
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchEvents();
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
    >
      {item.poster && <Image source={{ uri: item.poster }} style={styles.posterImage} />}

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>

        <View style={styles.eventMeta}>
          <FontAwesome name="calendar" size={14} color="#666" />
          <Text style={styles.eventDate}>{new Date(item.startDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.eventMeta}>
          <FontAwesome name="map-marker" size={14} color="#666" />
          <Text style={styles.eventVenue}>{item.venue.name}</Text>
        </View>

        <Text style={styles.eventPrice}>${item.ticketPrice}</Text>
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
        <Text style={styles.headerTitle}>📅 Events</Text>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.eventsList}
          onRefresh={handleRefresh}
          refreshing={loading}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="inbox" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No events found</Text>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  posterImage: {
    width: '100%',
    height: 200,
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDate: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
  eventVenue: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
    marginTop: 8,
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
  },
});

export default HomeScreen;
