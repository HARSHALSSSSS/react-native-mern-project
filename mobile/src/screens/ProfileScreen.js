import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Profile Screen
 */
const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <FontAwesome name="user" size={48} color="#667eea" />
          </View>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoItem}>
            <FontAwesome name="phone" size={16} color="#667eea" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <FontAwesome name="map-marker" size={16} color="#667eea" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>
                {user?.address ? `${user.address}, ${user.city}` : 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <FontAwesome name="calendar" size={16} color="#667eea" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>
                {user?.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : 'Not provided'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="cog" size={18} color="#333" />
            <Text style={styles.menuText}>Settings</Text>
            <FontAwesome name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="question-circle" size={18} color="#333" />
            <Text style={styles.menuText}>Help & Support</Text>
            <FontAwesome name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="info-circle" size={18} color="#333" />
            <Text style={styles.menuText}>About</Text>
            <FontAwesome name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={18} color="#d32f2f" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    numberOfLines: 2,
  },
  email: {
    fontSize: 13,
    color: '#999',
    numberOfLines: 1,
  },
  section: {
    marginTop: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    numberOfLines: 2,
    flexWrap: 'wrap',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    numberOfLines: 1,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffebee',
    backgroundColor: '#fff',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#d32f2f',
    numberOfLines: 1,
  },
});

export default ProfileScreen;
