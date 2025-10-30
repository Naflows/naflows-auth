import * as path from 'path';
import * as dotenv from 'dotenv';

// Load base .env first, then overlay with .env.test (test-specific vars)
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

export default {
  globalSetup: './tests/setup.ts',
  testTimeout: 100000 // optional, if your app takes time to boot
};