// Correct the import paths:
import connectDB from '../config/connection.js';
import { User } from '../models/index.js';
const seedDB = async () => {
    try {
        const users = await User.create([
        // User data
        ]);
        // Use the users variable
        console.log(`${users.length} users created!`);
        // ...
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
// Connect and seed
connectDB().then(() => seedDB());
