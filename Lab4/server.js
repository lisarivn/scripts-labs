import 'dotenv/config';
import app from './app.js';
import { connectDB } from './src/config/database.js';

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(
            'Не вдалося запустити сервер:',
            error.message
        );
        process.exit(1);
    }
}

startServer();