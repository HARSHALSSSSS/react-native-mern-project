require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Category = require('../models/Category');
const Venue = require('../models/Venue');
const Event = require('../models/Event');

/**
 * Seed Script - Creates sample data for development and testing
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Venue.deleteMany({});
    await Event.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin
    const admin = await Admin.create({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@eventmanagement.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      phone: '+1234567890',
      role: 'super_admin',
      permissions: ['manage_events', 'manage_users', 'manage_categories', 'manage_venues', 'view_bookings'],
    });

    console.log('Admin created:', admin.email);

    // Create Sample Users
    const user1 = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1111111111',
    });

    const user2 = await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+2222222222',
    });

    const user3 = await User.create({
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike@example.com',
      password: 'password123',
      phone: '+3333333333',
    });

    const users = [user1, user2, user3];
    console.log('Sample users created:', users.length);

    // Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Music',
        description: 'Music concerts and festivals',
        icon: '🎵',
      },
      {
        name: 'Technology',
        description: 'Tech conferences and workshops',
        icon: '💻',
      },
      {
        name: 'Sports',
        description: 'Sports events and tournaments',
        icon: '⚽',
      },
      {
        name: 'Business',
        description: 'Business conferences and seminars',
        icon: '💼',
      },
    ]);

    console.log('Categories created:', categories.length);

    // Create Venues
    const venues = await Venue.insertMany([
      {
        name: 'Grand Arena',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        capacity: 5000,
        contactPerson: 'John Manager',
        contactPhone: '+1-555-0100',
        contactEmail: 'contact@grandarena.com',
        amenities: ['Parking', 'WiFi', 'Restrooms', 'Food Court'],
      },
      {
        name: 'Tech Conference Center',
        address: '456 Innovation Drive',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        capacity: 2000,
        contactPerson: 'Sarah Tech',
        contactPhone: '+1-555-0200',
        contactEmail: 'info@techcenter.com',
        amenities: ['WiFi', 'Projectors', 'Meeting Rooms'],
      },
      {
        name: 'Sports Stadium',
        address: '789 Athletic Way',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        capacity: 10000,
        contactPerson: 'Mike Sports',
        contactPhone: '+1-555-0300',
        contactEmail: 'bookings@sportsstadium.com',
        amenities: ['Parking', 'Restaurants', 'VIP Lounge'],
      },
    ]);

    console.log('Venues created:', venues.length);

    // Create Events
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const futureDate2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
    const futureDate3 = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000); // 21 days from now

    const events = await Event.insertMany([
      {
        title: 'Summer Music Festival',
        description: 'An amazing summer music festival featuring top artists',
        category: categories[0]._id,
        venue: venues[0]._id,
        startDate: futureDate1,
        endDate: futureDate1,
        startTime: '18:00',
        endTime: '23:00',
        totalCapacity: 5000,
        remainingCapacity: 5000,
        ticketPrice: 50,
        organizer: admin._id,
        tags: ['live', 'music', 'festival'],
        featured: true,
      },
      {
        title: 'Tech Innovation Conference 2025',
        description: 'Learn about the latest technology trends and innovations',
        category: categories[1]._id,
        venue: venues[1]._id,
        startDate: futureDate2,
        endDate: futureDate2,
        startTime: '09:00',
        endTime: '17:00',
        totalCapacity: 2000,
        remainingCapacity: 2000,
        ticketPrice: 100,
        organizer: admin._id,
        tags: ['technology', 'conference', 'innovation'],
        featured: true,
      },
      {
        title: 'National Championship Finals',
        description: 'The thrilling final match of the national championship',
        category: categories[2]._id,
        venue: venues[2]._id,
        startDate: futureDate3,
        endDate: futureDate3,
        startTime: '19:00',
        endTime: '22:00',
        totalCapacity: 10000,
        remainingCapacity: 10000,
        ticketPrice: 75,
        organizer: admin._id,
        tags: ['sports', 'championship', 'final'],
        featured: false,
      },
    ]);

    console.log('Events created:', events.length);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);

    console.log('\nSample User Login Credentials:');
    users.forEach((user) => {
      console.log(`Email: ${user.email}, Password: password123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
