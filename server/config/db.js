import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI || 'mongodb+srv://ganesh_db_user:ganesh$123@cluster0.cj37bht.mongodb.net/';
    const isValidScheme = /^mongodb(\+srv)?:\/\//i.test(uri);
    if (!isValidScheme) {
      console.warn('MONGO_URI is missing or has an invalid scheme. Falling back to local MongoDB on 127.0.0.1:27017.');
      uri = 'mongodb+srv://ganesh_db_user:ganesh$123@cluster0.cj37bht.mongodb.net/';
    }
    const conn = await mongoose.connect(uri);

    console.log(`\n MongoDB Connected Successfully`);
    const sanitizedHost = conn.connection.host.replace(/:.*@/, ':<hidden>@');
    console.log(`Host: ${sanitizedHost}`);
    console.log(`Database: ${conn.connection.name}`);

  } catch (error) {
    console.error(`\n MongoDB Connection Error: ${error.message}`);
    console.error('Please check your connection string or ensure mongod is running.');
    process.exit(1); 
  }
};

export default connectDB;