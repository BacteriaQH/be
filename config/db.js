import moongoose from 'mongoose';

const connetDB = async () => {
    try {
        const conn = await moongoose.connect(process.env.DB_URL, {
            // useUnifiedTopology: true,
            // useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connetDB;
