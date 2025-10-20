import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { useAuth } from './src/context/AuthContext';
import { AuthProvider } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import BookTicketsScreen from './src/screens/BookTicketsScreen';
import MyBookingsScreen from './src/screens/MyBookingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Auth Stack Navigator
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

/**
 * App Stack Navigator
 */
const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeStack') {
            iconName = 'home';
          } else if (route.name === 'MyBookings') {
            iconName = 'ticket';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 0,
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        options={{
          title: 'Events',
        }}
      >
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="EventDetails"
              component={EventDetailsScreen}
              options={{
                headerShown: true,
                headerTitle: 'Event Details',
                headerStyle: {
                  backgroundColor: '#fff',
                },
                headerTintColor: '#333',
              }}
            />
            <Stack.Screen
              name="BookTickets"
              component={BookTicketsScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          title: 'My Tickets',
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Navigator Component
 */
const RootNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

/**
 * Main App Component
 */
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
