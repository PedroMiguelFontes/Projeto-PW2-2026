import mongoose from 'mongoose';
try {
 const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
 const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
 await mongoose.connect(uri, {
    dbName: DB_NAME
});
 console.log("Connected to MongoDB");
} catch (error) {
 console.error("Error connecting to MongoDB:", error);
}