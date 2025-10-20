const Admin = require('../models/Admin');
const User = require('../models/User');
const Category = require('../models/Category');
const Venue = require('../models/Venue');
const Event = require('../models/Event');

/**
 * Seed Database Controller
 * Call this endpoint once to populate database with initial data
 */

exports.seedDatabase = async (req, res) => {
  try {
    // Clear ALL existing data before seeding
    console.log('Clearing existing data...');
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Venue.deleteMany({});
    await Event.deleteMany({});
    console.log('Existing data cleared successfully');

    // Create Admin
    const admin = await Admin.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@eventmanagement.com',
      password: 'Admin@123',
      phone: '+1234567890',
      role: 'super_admin',
      permissions: ['manage_events', 'manage_users', 'manage_categories', 'manage_venues', 'view_bookings'],
    });

    // Create Sample Users (using create to trigger pre-save hooks)
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

    // Create Events
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const futureDate2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const futureDate3 = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

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

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        admin: {
          email: admin.email,
          password: 'Admin@123',
        },
        stats: {
          users: users.length,
          categories: categories.length,
          venues: venues.length,
          events: events.length,
        },
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message,
    });
  }
};
