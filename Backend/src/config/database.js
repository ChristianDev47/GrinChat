import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await connect(uri, {
      useNewUrlParser: true,
      UseUnifiedTopology: true,
    })
      .then(() => console.log('MONGODB CONNECTED SUCCESSFULLY!'))
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default connectDB;
