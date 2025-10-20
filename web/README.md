# Event Management System - Admin Web Panel

## Description
React-based admin dashboard for managing events, categories, venues, and bookings.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create .env file:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. **Update environment variables if needed:**
   - `REACT_APP_API_BASE_URL`: API base URL (default: http://localhost:5000/api)

### Running the App

**Development Mode:**
```bash
npm start
```

The app will open at `http://localhost:3000`

**Build for Production:**
```bash
npm run build
```

## Features

### Admin Authentication
- Secure login/logout functionality
- JWT token management
- Protected routes
- Session persistence

### Dashboard
- Overview statistics
- Upcoming events list
- Recent bookings
- Revenue tracking

### Event Management
- Create new events with category and venue
- Edit existing events
- Delete events
- View event details
- Upload event posters

### Category Management
- Create, read, update, delete categories
- List all categories
- Organize events by category

### Venue Management
- Manage event venues
- Store venue details (capacity, address, contact)
- Link venues to events
- Track venue information

### Booking Management
- View event bookings
- Export bookings as CSV
- Track ticket sales
- Manage user registrations

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── ProtectedRoute.js
│   │   └── NotificationAlert.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Events.js
│   │   ├── Categories.js
│   │   └── Venues.js
│   ├── services/
│   │   ├── api.js
│   │   └── index.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── public/
│   └── index.html
├── package.json
└── .env.example
```

## Demo Credentials

Email: `admin@eventmanagement.com`
Password: `Admin@123`

## Technologies Used

- **React** - UI library
- **React Router** - Client-side routing
- **Bootstrap 5** - CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Context API** - State management

## API Integration

The admin panel integrates with the backend API for:
- User authentication
- Event management
- Category management
- Venue management
- Booking management
- Dashboard statistics

## Features in Detail

### Authentication
- Login page with form validation
- JWT token storage in localStorage
- Automatic redirect on unauthorized access
- Logout functionality

### Events Management
- Create events with categories and venues
- Edit event details
- Delete events
- Upload event posters
- View organized events
- Track ticket sales

### Statistics Dashboard
- Total events count
- Tickets sold count
- Total event capacity
- Total revenue
- Upcoming events preview
- Recent bookings list

## Error Handling

- Global error notifications
- API error messages display
- Form validation
- Network error handling
- Loading states

## Security

- Protected routes with authentication
- JWT token verification
- Secure token storage
- Automatic logout on token expiry
- CORS-enabled API communication

## Responsive Design

- Mobile-friendly interface
- Tablet optimization
- Desktop-optimized layout
- Bootstrap breakpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

1. Ensure backend is running before starting the app
2. Check browser console for debug information
3. Use React Developer Tools browser extension
4. Keep .env.local file secure
5. Never commit .env.local to version control

## Troubleshooting

**API Connection Error:**
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API_BASE_URL in environment

**Login Issue:**
- Verify admin credentials
- Check backend authentication
- Clear browser cache and localStorage

**Data Not Loading:**
- Check network tab in browser dev tools
- Verify JWT token validity
- Check API responses

## Deployment

For production deployment:
1. Create `.env.production` with production API URL
2. Run `npm run build`
3. Deploy `build` folder to hosting service
4. Configure backend API URL
5. Set up HTTPS

## Support

For issues or questions, review the code comments or check the backend documentation.
