#!/bin/bash

echo -e "\033[1;32mClosing active Git Bash terminals...\033[0m"
# Close active Git Bash terminals before running this script:
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    taskkill //F //IM bash.exe //FI "PID ne %$$%" 2>/dev/null
fi
# Usage: ./run.sh <test-parameter> <reset-environment>
# test-parameter: "no-test", "global", "contracts", "all"



TEST_PARAMETER=$1
RESET_ENVIRONMENT=$2

if [ "$RESET_ENVIRONMENT" = "true" ]; then
    echo -e "\033[1;32mCleaning up existing Docker containers and volumes...\033[0m"
    rm -rf ./backend/auth-data
    docker volume rm $(docker volume ls -q)
    docker system prune -a -f --volumes
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,test-global,dummy-api" docker compose down -v
else
    echo -e "\033[1;32mStopping and removing existing containers, volumes, and networks...\033[0m"
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,test-global,dummy-api" docker compose down
fi

if [ "$TEST_PARAMETER" = "no-test" ]; then
    echo -e "\033[1;32mStarting Docker containers for no-test...\033[0m"
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,dummy-api" docker-compose up --build -d
else
    if [ "$TEST_PARAMETER" = "global" ]; then
        echo -e "\033[1;32mStarting Docker containers for global tests...\033[0m"
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-global,dummy-api" docker-compose up --build -d
    elif [ "$TEST_PARAMETER" = "contracts" ]; then
        echo -e "\033[1;32mStarting Docker containers for contract tests...\033[0m"
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,dummy-api" docker-compose up --build -d
    elif [ "$TEST_PARAMETER" = "all" ]; then
        echo -e "\033[1;32mStarting Docker containers for all tests...\033[0m"
        COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express,test-services,test-global,dummy-api" docker-compose up --build -d
    else
        echo "Unknown test parameter. Please use 'no-test' or 'run-test'."
        bash
        
    fi
fi



echo -e "\033[1;32mWaiting for services to initialize...\033[0m"
sleep 10

# Prevent terminal from closing for debugging errors
echo -e "\033[1;32mClosing terminal in 20 seconds...\033[0m"
sleep 20
