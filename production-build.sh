#!/bin/bash



rm -rf ./naflows-auth

# Clone repo


# Create .env (note: EOF not E0F)
cat > .env << 'EOF'
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=secret
AUTH_API_URL=http://auth-api-1:3000
MONGO_URL='mongodb://admin:secret@mongo-nass:27017/NASS?authSource=admin'
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USER=noreply-nass@naflows.com
SMTP_PASS=TVw_&2dB.4WMq/@
SMTP_SECURE=true
EOF

cat > ./api/.env << 'EOF'
AUTH_API_URL_DEV=http://auth-api-1:3000
EOF

cat > ./frontend/vite.config.ts << 'EOF'
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'


    // https://vite.dev/config/
    export default defineConfig({
    plugins: [react()],

    server : {
        host: '0.0.0.0',
        port: 8080
    },

    define: {
        'process.env': {
        'DUMMY_API_URL_DEV': "https://nass.naflows.com/client-service",
        'STRIPE_API_PUBLIC_KEY': "pk_test_51S9m2OLiJo83k1CounymnaDfJJnyJfZCthqDbScBLEjoStuBC4cOnE9m4a7rDeSZi36wigl7ME3IA2c5s1Q9ucGm00RhYbrNy6"
        }
    }
    })
EOF

# Make build script executable and run it
chmod +x ./build.sh
./build.sh false

echo "Deployment complete!"
