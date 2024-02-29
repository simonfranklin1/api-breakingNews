// Conectando com o banco de dados
import mongoose from "mongoose";

const connectToDataBase = () => {

    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("Conectado ao MongoDB Atlas"))
            .catch((err) => console.log(err))
}

export default connectToDataBase
