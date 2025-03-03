import connectDB from './config/connection.js';
import { User, Thoughts } from './models/index.js';

const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Thoughts.deleteMany({});

    console.log('Database cleared');

    // Create users
    const users = await User.create([
      { username: 'Bradley_Santiago', email: 'BSantiago@example.com' },
      { username: 'Edward_Apostol', email: 'EApostol@example.com' },
      { username: 'Thais_Cadet', email: 'TCadet@example.com' }
    ]);

    console.log('Users seeded');

    // Create thoughts
    const thoughts = await Thoughts.create([
      {
        thoughtText: 'I am so hoping this works',
        username: 'Bradley_Santiago',
      },
      {
        thoughtText: 'Gee I hope Bradley can get that challenge to work',
        username: 'Edward_Apostol',
      },
      {
        thoughtText: '*Insert Thais inspirational quote here*',
        username: 'Thais_Cadet',
      }
    ]);

    console.log('Thoughts seeded');

    // Add thoughts to users
    await User.findOneAndUpdate(
      { username: 'Bradley_Santiago' },
      { $push: { thoughts: thoughts[0]._id } }
    );

    await User.findOneAndUpdate(
      { username: 'Edward_Apostol' },
      { $push: { thoughts: thoughts[1]._id } }
    );

    await User.findOneAndUpdate(
      { username: 'Thais_Cadet' },
      { $push: { thoughts: thoughts[2]._id } }
    );

    console.log('Added thoughts to users');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Connect to the database and seed
connectDB()
  .then(() => seedDB());