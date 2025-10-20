# Event Management System - Mobile App

## Description
React Native mobile app for event management users to browse, book tickets, and manage bookings.

**Updated to Expo SDK 54** with React Native 0.76.0

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (iOS/Android)
- Xcode (for iOS) or Android Studio (for Android)

### Installation

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Update environment variables:**
   - `REACT_APP_API_BASE_URL`: Backend API URL (e.g., http://localhost:5000/api)

### Running the App

**Start Expo development server:**
```bash
npm start
```

**On Android:**
```bash
npm run android
```

Or scan the QR code with Expo Go app.

**On iOS (Mac only):**
```bash
npm run ios
```

**On Web:**
```bash
npm run web
```

## Features

### User Authentication
- Sign up / Login
- Secure token management
- Session persistence
- Push notification setup

### Event Discovery
- Browse all upcoming events
- Search events by title
- Filter by category
- View event details
- See venue information

### Ticket Booking
- Select ticket quantity
- Book tickets for events
- Confirmation with booking reference
- QR code generation

### My Tickets
- View all booked tickets
- Ticket details with event info
- QR code display
- Cancel bookings

### User Profile
- View profile information
- Update profile details
- View account settings
- Logout functionality

## Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── EventDetailsScreen.js
│   │   ├── BookTicketsScreen.js
│   │   ├── MyBookingsScreen.js
│   │   └── ProfileScreen.js
│   ├── services/
│   │   ├── api.js
│   │   └── index.js
│   ├── context/
│   │   └── AuthContext.js
│   └── utils/
├── App.js
├── index.js
├── app.json
├── package.json
└── .env.example
```

## Demo Credentials

Email: `john@example.com`
Password: `password123`

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - React Native framework
- **React Navigation** - Navigation library
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **React Native Vector Icons** - Icon library

## API Integration

The mobile app connects to the backend for:
- User authentication
- Event listing and details
- Ticket booking
- Booking management
- User profile management

## Features in Detail

### Authentication
- Email/password login
- User registration
- Secure token storage
- Automatic session restoration
- Logout functionality

### Event Browsing
- Scrollable event list
- Search functionality
- Event details page
- Venue information
- Ticket price and availability

### Booking System
- Quantity selector
- Booking confirmation
- QR code generation
- Booking reference
- Success notifications

### User Management
- Profile information display
- Profile updates
- Push token registration
- Account settings

## Error Handling

- Network error messages
- Validation error feedback
- Loading states
- Offline support with AsyncStorage

## Security

- Secure token storage in AsyncStorage
- JWT authentication
- Protected API requests
- Automatic logout on token expiry

## Responsive Design

- Mobile-first approach
- Tablet support
- Various screen sizes
- Safe area handling

## Camera Integration (Future)

QR code scanning for check-in:
- Use Expo Camera API
- Scan booking QR codes
- Real-time check-in

## Push Notifications (Future)

- Booking confirmations
- Event reminders
- Event updates
- Admin notifications

## Performance Optimization

- Lazy loading of events
- Image caching
- Memoization of components
- Efficient list rendering

## Testing

```bash
# Run tests (if configured)
npm test
```

## Building for Production

**iOS:**
```bash
eas build --platform ios
```

**Android:**
```bash
eas build --platform android
```

## Troubleshooting

**API Connection Error:**
- Verify backend is running
- Check REACT_APP_API_BASE_URL
- Ensure device can reach the server

**Login Issues:**
- Verify credentials
- Check network connection
- Clear AsyncStorage cache

**Blank Screen:**
- Check console logs
- Ensure all dependencies installed
- Restart Expo

## Development Tips

1. Use Expo Go for rapid development
2. Check console logs with `expo logs`
3. Use React DevTools for debugging
4. Enable debugging in Expo settings
5. Test on both iOS and Android

## Deployment

For app store release:
1. Build with EAS
2. Configure signing certificates
3. Submit to app stores
4. Update API URL for production

## Support

For issues or questions, check the code comments or backend documentation.
