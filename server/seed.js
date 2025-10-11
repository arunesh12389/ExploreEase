import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './db.js';
import { updatePlaceRatings } from './routes.js';

import { User } from '../models/user.model.js';
import { Place } from '../models/place.model.js';
import { Review } from '../models/review.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Offer } from '../models/offer.model.js';

const seedDatabase = async () => {
  await connectDB();

  try {
    console.log('Clearing existing data...');
    await Review.deleteMany({});
    await Offer.deleteMany({});
    await Vehicle.deleteMany({});
    await Place.deleteMany({});
    await User.deleteMany({});
    
    console.log('Seeding new data...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const createdUsers = await User.insertMany([
      { email: 'admin@vitap.ac.in', password: hashedPassword, name: 'Admin User', isStudent: true, isAdmin: true },
      { email: 'student1@vitap.ac.in', password: hashedPassword, name: 'Aman Kumar', isStudent: true },
      { email: 'student2@vitap.ac.in', password: hashedPassword, name: 'Priya Sharma', isStudent: true },
      { email: 'user@example.com', password: hashedPassword, name: 'Public User', isStudent: false },
    ]);

    // Destructure created documents to get their new MongoDB _id's
    const [adminUser, studentUser1, studentUser2] = createdUsers;
    console.log(`${createdUsers.length} users created.`);
    
    // --- Create Places ---
    const createdPlaces = await Place.insertMany([
      { name: 'Kanaka Durga Temple', category: 'Attractions', description: 'One of the most famous Hindu temples in Andhra Pradesh, dedicated to Goddess Durga. Located on Indrakeeladri hill with stunning views of the Krishna River.', address: 'Vijayawada, Krishna District, Andhra Pradesh 520001', latitude: 16.5189, longitude: 80.6415, images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800'], phone: '+91 866 257 2222', priceRange: 'Free', studentVisitCount: 350, rating: 4.8 },
      { name: 'Prakasam Barrage', category: 'Attractions', description: 'A major irrigation project across the Krishna River, offering beautiful sunset views and a popular spot for evening walks.', address: 'Prakasam Barrage, Vijayawada, Andhra Pradesh 520001', latitude: 16.5062, longitude: 80.6480, images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'], priceRange: 'Free', studentVisitCount: 280, rating: 4.5 },
      { name: 'Cafe Coffee Day', category: 'Cafes', description: 'Popular cafe chain offering a variety of coffee, snacks, and desserts. Perfect spot for hangouts and study sessions.', address: 'MG Road, Vijayawada, Andhra Pradesh 520010', latitude: 16.5100, longitude: 80.6480, images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'], phone: '+91 866 246 8888', website: 'https://www.cafecoffeeday.com', priceRange: '₹200-400', studentVisitCount: 420, rating: 4.4 },
      { name: 'Barbeque Nation', category: 'Restaurants', description: 'Popular chain restaurant known for its unlimited buffet with live grills on the table. Great for group dining.', address: 'PVP Square Mall, Vijayawada, Andhra Pradesh 520010', latitude: 16.5070, longitude: 80.6420, images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'], phone: '+91 866 668 8888', website: 'https://www.barbequenation.com', priceRange: '₹800-1200', studentVisitCount: 150 },
      { name: 'Undavalli Caves', category: 'Attractions', description: 'Ancient rock-cut caves dating back to 4th-5th century, featuring beautiful sculptures and architecture.', address: 'Undavalli, Guntur District, Andhra Pradesh 522501', latitude: 16.4833, longitude: 80.5667, images: ['https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'], priceRange: '₹25', studentVisitCount: 180 },
      { name: 'Dominos Pizza', category: 'Restaurants', description: 'International pizza chain offering a variety of pizzas, sides, and desserts. Quick delivery service available.', address: 'Benz Circle, Vijayawada, Andhra Pradesh 520010', latitude: 16.5150, longitude: 80.6300, images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'], phone: '+91 866 662 2222', website: 'https://www.dominos.co.in', priceRange: '₹300-600', studentVisitCount: 550 },
    ]);
    const [temple, , ccd, bbqNation, , dominos] = createdPlaces;
    console.log(`${createdPlaces.length} places created.`);

    // --- Create Reviews ---
    await Review.insertMany([
      { placeId: temple._id, userId: studentUser1._id, rating: 5, comment: 'Absolutely breathtaking temple! The architecture is stunning and the view from the top is worth the climb. Must visit during festival season.', isStudentReview: true },
      { placeId: ccd._id, userId: studentUser2._id, rating: 4, comment: 'Great place to study and hang out with friends. The coffee is good and they have free WiFi. Can get crowded on weekends.', isStudentReview: true },
      { placeId: dominos._id, userId: studentUser1._id, rating: 5, comment: 'Best pizza in town! Quick delivery and always hot. Their student discount is a lifesaver. Highly recommended for late night cravings.', isStudentReview: true },
    ]);
    console.log('Reviews created.');

    console.log('Updating place ratings from seeded reviews...');
    await updatePlaceRatings(temple._id);
    await updatePlaceRatings(ccd._id);
    await updatePlaceRatings(dominos._id);
    console.log('Place ratings updated.');

    // --- Create Vehicles ---
    await Vehicle.insertMany([
      { ownerId: studentUser1._id, type: 'Bike', brand: 'Royal Enfield', model: 'Classic 350', year: 2022, capacity: 2, pricePerDay: 800, images: ['https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800'], description: 'Well-maintained Royal Enfield Classic 350 perfect for weekend trips.', features: ['Helmet Included', 'Bluetooth Enabled'], location: 'VIT-AP Campus Area', isVerified: true, isAvailable: true },
      { ownerId: studentUser2._id, type: 'Car', brand: 'Maruti Suzuki', model: 'Swift', year: 2021, capacity: 5, pricePerDay: 1500, images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'], description: 'Comfortable hatchback ideal for group trips.', features: ['AC', 'Music System', 'GPS'], location: 'Vijayawada', isVerified: true, isAvailable: true },
      { ownerId: adminUser._id, type: 'Van', brand: 'Toyota', model: 'Innova', year: 2020, capacity: 7, pricePerDay: 2500, images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'], description: 'Spacious 7-seater perfect for large groups.', features: ['7 Seater', 'AC', 'Premium Sound'], location: 'Amaravati', isVerified: false }, // One pending verification
    ]);
    console.log('Vehicles created.');

    // --- Create Offers ---
    await Offer.insertMany([
      { placeId: bbqNation._id, title: 'Student Special Buffet Discount', description: 'Get 20% off on buffet for students with valid college ID.', discountPercentage: 20, code: 'STUDENT20', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { placeId: ccd._id, title: 'Coffee & Cake Combo', description: 'Buy any coffee and get a cake slice at 50% off.', discountPercentage: 50, code: 'CAKE50', expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { placeId: dominos._id, title: 'Buy 1 Get 1 Free on Pizzas', description: 'Order any medium or large pizza and get another one free!', code: 'BOGO', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    ]);
    console.log('Offers created.');

    console.log('\n✅ Database seeded successfully! 🌱');
    console.log('\nTest credentials:');
    console.log('Admin: admin@vitap.ac.in / password123');
    console.log('Student: student1@vitap.ac.in / password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection to allow the script to exit
    mongoose.connection.close();
  }
};

seedDatabase();