import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || '';

async function seed() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('exploreease');

    console.log('Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('places').deleteMany({});
    await db.collection('reviews').deleteMany({});
    await db.collection('vehicles').deleteMany({});
    await db.collection('offers').deleteMany({});
    await db.collection('trips').deleteMany({});

    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const adminUser = await db.collection('users').insertOne({
      email: 'admin@vitap.ac.in',
      password: hashedPassword,
      name: 'Admin User',
      isStudent: true,
      isAdmin: true,
      createdAt: new Date(),
    });

    const studentUsers = await db.collection('users').insertMany([
      {
        email: 'student1@vitap.ac.in',
        password: hashedPassword,
        name: 'Rahul Kumar',
        isStudent: true,
        isAdmin: false,
        createdAt: new Date(),
      },
      {
        email: 'student2@vitap.ac.in',
        password: hashedPassword,
        name: 'Priya Sharma',
        isStudent: true,
        isAdmin: false,
        createdAt: new Date(),
      },
    ]);

    const publicUser = await db.collection('users').insertOne({
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Public User',
      isStudent: false,
      isAdmin: false,
      createdAt: new Date(),
    });

    console.log('Creating places...');
    const places = await db.collection('places').insertMany([
      {
        name: 'Kanaka Durga Temple',
        category: 'Attractions',
        description: 'One of the most famous Hindu temples in Andhra Pradesh, dedicated to Goddess Durga. Located on Indrakeeladri hill with stunning views of the Krishna River.',
        address: 'Vijayawada, Krishna District, Andhra Pradesh 520001',
        latitude: 16.5189,
        longitude: 80.6415,
        images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800'],
        phone: '+91 866 257 2222',
        priceRange: 'Free',
        rating: 4.6,
        studentRating: 4.8,
        reviewCount: 245,
        studentReviewCount: 89,
        visitCount: 1200,
        studentVisitCount: 350,
        createdAt: new Date(),
      },
      {
        name: 'Prakasam Barrage',
        category: 'Attractions',
        description: 'A major irrigation project across the Krishna River, offering beautiful sunset views and a popular spot for evening walks.',
        address: 'Prakasam Barrage, Vijayawada, Andhra Pradesh 520001',
        latitude: 16.5062,
        longitude: 80.6480,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
        priceRange: 'Free',
        rating: 4.4,
        studentRating: 4.5,
        reviewCount: 178,
        studentReviewCount: 65,
        visitCount: 980,
        studentVisitCount: 280,
        createdAt: new Date(),
      },
      {
        name: 'Cafe Coffee Day',
        category: 'Cafes',
        description: 'Popular cafe chain offering a variety of coffee, snacks, and desserts. Perfect spot for hangouts and study sessions.',
        address: 'MG Road, Vijayawada, Andhra Pradesh 520010',
        latitude: 16.5100,
        longitude: 80.6480,
        images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'],
        phone: '+91 866 246 8888',
        website: 'https://www.cafecoffeeday.com',
        priceRange: '₹200-400',
        rating: 4.2,
        studentRating: 4.4,
        reviewCount: 156,
        studentReviewCount: 92,
        visitCount: 850,
        studentVisitCount: 420,
        createdAt: new Date(),
      },
      {
        name: 'Barbeque Nation',
        category: 'Restaurants',
        description: 'Popular chain restaurant known for its unlimited buffet with live grills on the table. Great for group dining.',
        address: 'PVP Square Mall, Vijayawada, Andhra Pradesh 520010',
        latitude: 16.5070,
        longitude: 80.6420,
        images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
        phone: '+91 866 668 8888',
        website: 'https://www.barbequenation.com',
        priceRange: '₹800-1200',
        rating: 4.3,
        studentRating: 4.2,
        reviewCount: 289,
        studentReviewCount: 134,
        visitCount: 1100,
        studentVisitCount: 380,
        createdAt: new Date(),
      },
      {
        name: 'Undavalli Caves',
        category: 'Attractions',
        description: 'Ancient rock-cut caves dating back to 4th-5th century, featuring beautiful sculptures and architecture.',
        address: 'Undavalli, Guntur District, Andhra Pradesh 522501',
        latitude: 16.4833,
        longitude: 80.5667,
        images: ['https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'],
        priceRange: '₹25',
        rating: 4.5,
        studentRating: 4.7,
        reviewCount: 198,
        studentReviewCount: 78,
        visitCount: 720,
        studentVisitCount: 210,
        createdAt: new Date(),
      },
      {
        name: 'Dominos Pizza',
        category: 'Restaurants',
        description: 'International pizza chain offering a variety of pizzas, sides, and desserts. Quick delivery service available.',
        address: 'Benz Circle, Vijayawada, Andhra Pradesh 520010',
        latitude: 16.5150,
        longitude: 80.6300,
        images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'],
        phone: '+91 866 662 2222',
        website: 'https://www.dominos.co.in',
        priceRange: '₹300-600',
        rating: 4.1,
        studentRating: 4.3,
        reviewCount: 421,
        studentReviewCount: 267,
        visitCount: 1450,
        studentVisitCount: 680,
        createdAt: new Date(),
      },
    ]);

    const placeIds = Object.values(places.insertedIds);
    const userIds = [
      ...Object.values(studentUsers.insertedIds),
      publicUser.insertedId,
    ];

    console.log('Creating reviews...');
    await db.collection('reviews').insertMany([
      {
        placeId: placeIds[0].toString(),
        userId: userIds[0].toString(),
        rating: 5,
        comment: 'Absolutely breathtaking temple! The architecture is stunning and the view from the top is worth the climb. Must visit during festival season.',
        images: [],
        isStudentReview: true,
        createdAt: new Date(),
      },
      {
        placeId: placeIds[2].toString(),
        userId: userIds[1].toString(),
        rating: 4,
        comment: 'Great place to study and hang out with friends. The coffee is good and they have free WiFi. Can get crowded on weekends.',
        images: [],
        isStudentReview: true,
        createdAt: new Date(),
      },
      {
        placeId: placeIds[5].toString(),
        userId: userIds[0].toString(),
        rating: 5,
        comment: 'Best pizza in town! Quick delivery and always hot. Their student discount is a lifesaver. Highly recommended for late night cravings.',
        images: [],
        isStudentReview: true,
        createdAt: new Date(),
      },
    ]);

    console.log('Creating vehicles...');
    await db.collection('vehicles').insertMany([
      {
        ownerId: userIds[0].toString(),
        type: 'Bike',
        brand: 'Royal Enfield',
        model: 'Classic 350',
        year: 2022,
        capacity: 2,
        pricePerDay: 800,
        images: ['https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800'],
        description: 'Well-maintained Royal Enfield Classic 350 perfect for weekend trips. Comes with two helmets and basic toolkit.',
        features: ['Helmet Included', 'Bluetooth Enabled', 'Good Mileage'],
        location: 'VIT-AP Campus Area',
        isVerified: true,
        isAvailable: true,
        rating: 4.8,
        reviewCount: 12,
        totalRentals: 24,
        createdAt: new Date(),
      },
      {
        ownerId: userIds[1].toString(),
        type: 'Car',
        brand: 'Maruti Suzuki',
        model: 'Swift',
        year: 2021,
        capacity: 5,
        pricePerDay: 1500,
        images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'],
        description: 'Comfortable hatchback ideal for group trips. AC, music system, and GPS included. Well maintained and fuel efficient.',
        features: ['AC', 'Music System', 'GPS', 'Fuel Efficient'],
        location: 'Vijayawada',
        isVerified: true,
        isAvailable: true,
        rating: 4.6,
        reviewCount: 8,
        totalRentals: 16,
        createdAt: new Date(),
      },
      {
        ownerId: userIds[2].toString(),
        type: 'Van',
        brand: 'Toyota',
        model: 'Innova',
        year: 2020,
        capacity: 7,
        pricePerDay: 2500,
        images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'],
        description: 'Spacious and comfortable 7-seater perfect for large groups. Great for road trips and family outings.',
        features: ['7 Seater', 'AC', 'Premium Sound', 'Spacious Boot'],
        location: 'Amaravati',
        isVerified: true,
        isAvailable: true,
        rating: 4.9,
        reviewCount: 15,
        totalRentals: 28,
        createdAt: new Date(),
      },
    ]);

    console.log('Creating offers...');
    await db.collection('offers').insertMany([
      {
        placeId: placeIds[3].toString(),
        title: 'Student Special Buffet Discount',
        description: 'Get 20% off on buffet for students with valid college ID. Valid on weekdays only.',
        discountPercentage: 20,
        code: 'STUDENT20',
        terms: 'Valid only with college ID on weekdays',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
      },
      {
        placeId: placeIds[2].toString(),
        title: 'Coffee & Cake Combo',
        description: 'Buy any coffee and get a cake slice at 50% off. Limited time offer!',
        discountPercentage: 50,
        code: 'CAKE50',
        terms: 'Valid till stocks last',
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
      },
      {
        placeId: placeIds[5].toString(),
        title: 'Buy 1 Get 1 Free on Pizzas',
        description: 'Order any medium or large pizza and get another pizza of equal or lesser value free!',
        discountPercentage: 50,
        code: 'BOGO',
        terms: 'Not valid with other offers',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
      },
    ]);

    console.log('Seed data created successfully!');
    console.log('\nTest credentials:');
    console.log('Admin: admin@vitap.ac.in / password123');
    console.log('Student: student1@vitap.ac.in / password123');
    console.log('Public User: user@example.com / password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seed();
