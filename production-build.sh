#!/bin/bash



rm -rf ./naflows-auth

# Clone repo
echo "Cloning repository..."
git clone https://github.com/naflows/naflows-auth.git


cd ./naflows-auth


sleep 2
# Create .env (note: EOF not E0F)
echo -e "Creating environment configuration files..."
echo -e "Setting up .env for production..."
cat > .env << 'EOF'
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=secret
AUTH_API_URL=http://auth-api-1:3000
MONGO_URL='mongodb://admin:secret@mongo-nass:27017/NASS?authSource=admin'
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USER=noreply-nass@naflows.com
SMTP_PASS=eH#M3#Gv+b5a!3a
SMTP_SECURE=true
EOF

sleep 1

cd ./api
echo -e "Setting up API .env for production..."
cat > .env << 'EOF'
AUTH_API_URL_DEV=http://auth-api-1:3000
EOF

sleep 1

cd ../frontend
echo -e "Setting up Frontend Vite config for production..."
cat > ./vite.config.ts << 'EOF'
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


sleep 1
# Go back to root folder
cd ../

echo "All configuration files set up."

echo "Generating production build..."
echo "-----------------------------------"
echo "1. Installing dependencies..."
# install in each project folder without changing the script's current working directory
if [ -d "./api" ]; then
    (cd ./api && npm install)
else
    echo "Warning: ./api not found, skipping npm install for api"
fi

sleep 1

if [ -d "./backend" ]; then
    (cd ./backend && npm install)
else
    echo "Warning: ./backend not found, skipping npm install for backend"
fi

sleep 1

if [ -d "./frontend" ]; then
    (cd ./frontend && npm install)
else
    echo "Warning: ./frontend not found, skipping npm install for frontend"
fi
echo "2. Building frontend..."
echo "Starting production build..."

# Make build script executable and run it
chmod +x ./build.sh
./build.sh false

echo "Deployment complete!"
