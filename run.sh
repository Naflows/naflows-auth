#!/bin/bash
set -e  # Exit on any error

RESET_ENVIRONMENT=$1
RESET_DB=$2

if [ "$RESET_ENVIRONMENT" = "true" ]; then
    echo -e "\033[1;32mCleaning up existing Docker containers and volumes...\033[0m"
    rm -rf ./backend/auth-data
    
    # Only remove volumes if they exist
    if [ -n "$(docker volume ls -q)" ]; then
        docker volume rm $(docker volume ls -q) || true
    fi
    
    docker system prune -a -f --volumes
    COMPOSE_PROFILES="auth-api,mongo-express,test-services,test-global,dummy-api" docker compose down -v
    
    echo -e "\033[1;32mStarting MongoDB...\033[0m"
    COMPOSE_PROFILES="mongo-nass" docker compose up -d mongo-nass
fi

if [ "$RESET_DB" = "true" ]; then
    echo -e "\033[1;32mResetting database...\033[0m"
    COMPOSE_PROFILES="mongo-nass" docker compose down -v
    
    echo -e "\033[1;32mStarting MongoDB...\033[0m"
    COMPOSE_PROFILES="mongo-nass" docker compose up -d mongo-nass
    
    # Wait for MongoDB to be ready
    echo -e "\033[1;32mWaiting for MongoDB to be ready...\033[0m"
    until docker exec mongo-nass mongosh -u admin -p secret --authenticationDatabase admin --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
        sleep 2
        echo "Waiting for MongoDB..."
    done
    
    # Initialize database manually
    echo -e "\033[1;32mInitializing database...\033[0m"
    docker exec -i mongo-nass mongosh -u admin -p secret --authenticationDatabase admin < ./mongo-init/init.js
fi

if [ "$RESET_ENVIRONMENT" != "true" ]; then
    echo -e "\033[1;32mStopping and removing existing containers, volumes, and networks...\033[0m"
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,test-global,dummy-api" docker compose down
fi

echo -e "\033[1;32mStarting Docker containers for no-test...\033[0m"
COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,dummy-api" docker compose up --build -d

# Check if services actually started
echo -e "\033[1;32mChecking service status...\033[0m"
COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,dummy-api" docker compose ps -a

echo -e "\033[1;32mWaiting for services to initialize...\033[0m"
sleep 10

echo -e "\033[1;32mAll services should be running. Showing logs...\033[0m"

# Run all logs with profiles
COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,dummy-api" docker compose logs -f