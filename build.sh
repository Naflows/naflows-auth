#!/bin/bash

# This script is used to build the Docker images for the project for production. 

PRUNE=$1

if [ "$PRUNE" = "true" ]; then
    echo -e "\033[1;32mCleaning up existing Docker containers and volumes...\033[0m"
    rm -rf ./backend/auth-data
    volumes=$(docker volume ls -q)
    if [ -n "$volumes" ]; then
    docker volume rm $volumes
    fi
    docker system prune -a -f --volumes
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,test-global,dummy-api,frontend" docker compose down -v
fi

echo -e "\033[1;32mBuilding containers for production...\033[0m"

## First, modify /frontend/vite.config.ts to use the docker service names instead of localhost for the APIs.
## Example: Change 'http://localhost:3005' to 'http://dummy-api:3005' for DUMMY_API_URL_DEV


echo -e "\033[1;32mStarting Docker containers...\033[0m"
COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,dummy-api" docker-compose up --build -d

echo -e "\033[1;32mWaiting for services to initialize...\033[0m"
sleep 15


echo -e "\033[1;32mStarting Frontend...\033[0m"
docker-compose --profile frontend up --build -d
# After building, revert the changes in /frontend/vite.config.ts back to localhost for local development.


echo -e "\033[1;32mWaiting for services to initialize...\033[0m"
sleep 10


# End of build.sh