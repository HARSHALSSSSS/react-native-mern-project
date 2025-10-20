# Event Management System - Backend

## Description
Backend API for the Event Management System built with Express.js and MongoDB.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create .env file:**
   Copy `.env.example` to `.env` and update with your configuration:
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT token generation
   - `PORT`: Server port (default: 5000)
   - Other optional settings

### Running the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### Seeding Sample Data

To populate the database with sample data for testing:
```bash
npm run seed
```

This creates:
- 1 Admin user (super_admin)
- 3 Sample users
- 4 Event categories
- 3 Venues
- 3 Sample events

### API Endpoints

#### Admin Authentication
- `POST /api/admin/auth/register` - Register new admin
- `POST /api/admin/auth/login` - Login admin
- `GET /api/admin/auth/profile` - Get admin profile (protected)
- `PUT /api/admin/auth/profile` - Update admin profile (protected)
- `POST /api/admin/auth/change-password` - Change password (protected)

#### Categories
- `POST /api/categories` - Create category (protected)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

#### Venues
- `POST /api/venues` - Create venue (protected)
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get venue by ID
- `PUT /api/venues/:id` - Update venue (protected)
- `DELETE /api/venues/:id` - Delete venue (protected)

#### Events
- `POST /api/events` - Create event (protected, with poster upload)
- `GET /api/events` - Get all events (public)
- `GET /api/events/:id` - Get event by ID (public)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)

#### User Authentication
- `POST /api/user/auth/register` - Register new user
- `POST /api/user/auth/login` - Login user
- `GET /api/user/auth/profile` - Get user profile (protected)
- `PUT /api/user/auth/profile` - Update user profile (protected)

#### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/user/my-bookings` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get booking details (protected)
- `POST /api/bookings/:id/cancel` - Cancel booking (protected)
- `GET /api/bookings/event/:eventId` - Get event bookings (protected)
- `GET /api/bookings/event/:eventId/export-csv` - Export bookings as CSV (protected)

#### Check-In
- `POST /api/checkin/checkin` - Check-in user via booking reference (protected)
- `GET /api/checkin/stats/:eventId` - Get check-in statistics (protected)

#### Dashboard
- `GET /api/dashboard/admin` - Get admin dashboard data (protected)

#### Health
- `GET /health` - Health check endpoint

## Error Handling

All responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Authentication

The API uses JWT (JSON Web Token) for authentication.

1. Login to get a token
2. Include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your_token>
   ```

## Folder Structure

```
backend/
├── models/          # MongoDB schemas
├── controllers/     # Business logic
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Helper functions
├── config/          # Configuration files
├── scripts/         # Seed scripts
├── uploads/         # Uploaded files (created at runtime)
├── server.js        # Main entry point
├── package.json
└── .env.example
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File uploads
- **QRCode** - QR code generation
- **json2csv** - CSV export

## Development Notes

- All endpoints are tested with Postman
- Use `.env.example` as a template for `.env`
- Ensure MongoDB is running before starting the server
- Check console logs for detailed error messages

## Security

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days (configurable)
- All sensitive data is protected with middleware
- Input validation on all endpoints
- CORS enabled for frontend communication

## Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Generate strong JWT_SECRET
4. Configure CORS properly
5. Use process manager like PM2
6. Set up reverse proxy (nginx)

## Support

For issues or questions, check the documentation or review the code comments.
