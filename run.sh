#!/bin/bash
# set -e  # Exit on any error
trap 'echo -e "\033[1;31mScript exited with code $?. Press Enter to close...\033[0m"; read' EXIT

RESET_ENVIRONMENT=$1
RESET_DB=$2


echo -e "\033[1;32mStopping running containers...\033[0m"
docker compose down
clear # Clear the terminal for better readability


function reset_db {
    echo -e "\033[1;32mResetting database...\033[0m"
    COMPOSE_PROFILES="mongo-nass" docker compose down -v
    echo -e "\033[1;32mStarting MongoDB...\033[0m"
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express" docker compose up -d --build
    # Wait for MongoDB to be ready
    sleep 5

    # Initialize database manually
    echo -e "\033[1;32mInitializing database...\033[0m"
    docker exec -i mongo-nass mongosh -u admin -p pass --authenticationDatabase admin < ./mongo-init/init.js

}


if [ "$RESET_ENVIRONMENT" = "true" ]; then

    # Ask for confirmation
    read -p "Are you sure you want to reset the entire environment? This will delete all Docker containers and volumes, including mongo-nass (main) database. (yes/no): " CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        echo -e "\033[1;31mEnvironment reset cancelled.\033[0m"
        exit 1
    fi

    echo -e "\033[1;32mCleaning up existing Docker containers and volumes...\033[0m"
    rm -rf ./backend/auth-data
    
    # Only remove volumes if they exist
    if [ -n "$(docker volume ls -q)" ]; then
        docker volume rm $(docker volume ls -q) || true
    fi
    
    docker system prune -a -f --volumes
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,test-global,dummy-api, mongo-nass-test,auth-api-test" docker compose down -v

    
    echo -e "\033[1;32mStarting MongoDB...\033[0m"
    COMPOSE_PROFILES="mongo-nass" docker compose up -d mongo-nass


    
else
    echo -e "\033[1;32mStopping and removing existing containers, volumes, and networks...\033[0m"
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,test-global,dummy-api, mongo-nass-test,auth-api-test" docker compose down
fi

if [ "$RESET_DB" = "true" ]; then
    reset_db
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

echo -e "\033[1;32mAll services are up and running.\033[0m"

echo -e "\033[1;32mAll services should be running. Showing logs...\033[0m"

# If there is a ./frontend-nextjs directory, run asynchronously another script to start the frontend in the background

# Run all logs with profiles
COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,dummy-api" docker compose logs -f

