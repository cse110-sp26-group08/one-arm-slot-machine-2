import 'dotenv/config';
import { createApp, connectToDatabase } from './app.js';

const BACKEND_PORT = Number.parseInt(process.env.BACKEND_PORT ?? '4000', 10);

/**
 * Starts the backend HTTP server on a fixed port for local frontend integration.
 *
 * @returns {Promise<void>} Promise resolved when the server has started.
 */
async function startServer() {
  const application = createApp();

  try {
    await connectToDatabase(process.env.MONGODB_URI);
  } catch (error) {
    console.warn('MongoDB connection was not established. Continuing without a live database.');
    console.warn(error);
  }

  application.listen(BACKEND_PORT, () => {
    console.log(`Backend listening on http://localhost:${BACKEND_PORT}`);
  });
}

void startServer();
