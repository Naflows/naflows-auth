#!/bin/bash

print_red() {
    echo -e "\033[1;31m$1\033[0m"
}
print_green() {
    echo -e "\033[1;32m$1\033[0m"
}
print_blue() {
    echo -e "\033[1;34m$1\033[0m"
}
print_light_grey() {
    echo -e "\033[0;37m$1\033[0m"
}
print_separator() {
    echo -e "\033[1;34m===================================================================\033[0m"
}

clear_terminal() {
    clear
}


print_title() {
    print_green "\033[1;34mStarting test suite #$1\033[0m"
}

RESET_ENVIRONMENT=$1
TEST_PARAMETER=$2

clear_terminal
print_blue "Welcome to the Naflows Authentication Secure System (NASS) Test Suite"
print_light_grey "Production notice: This test suite is intended for development and testing purposes only. Do not use in a production environment.\nHowever, tests may pass before production release.\n"
if [ "$RESET_ENVIRONMENT" = "true" ]; then
    print_red "WARNING: You have chosen to reset the environment. This will delete all existing Docker containers, volumes, and networks related to NASS."
    print_red "Make sure you have backed up any important data before proceeding.\n"
fi
print_separator





if [ -z "$TEST_PARAMETER" ]; then
    # Display centered header
    # Define column widths
    COL1_WIDTH=5
    COL2_WIDTH=10
    COL3_WIDTH=20
    COL4_WIDTH=20

    printf -- "+-------+------------+----------------------+---------------------+\n"
    printf "| %-${COL1_WIDTH}s | %-${COL2_WIDTH}s | %-${COL3_WIDTH}s | %-${COL4_WIDTH}s|\n" "Num." "Name" "Description" "Database Reset"
    printf -- "+-------+------------+----------------------+---------------------+\n"

    # Print table row
    green_text=$(print_green 'Yes')
    COL4_WIDTH=$((COL4_WIDTH + 10)) # Adjust width for color codes
    printf "| %-${COL1_WIDTH}s | %-${COL2_WIDTH}s | %-${COL3_WIDTH}s | %-${COL4_WIDTH}s |\n" "1" "methods" "Test all methods" "$green_text"
    printf -- "+-------+------------+----------------------+---------------------+\n"
    print_separator
    read -p "Enter a test number: " TEST_NUMBER

    case $TEST_NUMBER in
        1)
            TEST_PARAMETER="methods"
            ;;
        *)
            print_red "Invalid test number."
            exit 1
            ;;
    esac
fi

print_title "$TEST_PARAMETER"

function reset_db {
    echo -e "\033[1;32mResetting database...\033[0m"
    COMPOSE_PROFILES="mongo-nass" docker compose down -v
    echo -e "\033[1;32mStarting MongoDB...\033[0m"
    COMPOSE_PROFILES="mongo-nass,auth-api,mongo-express" docker compose up -d --build
    # Wait for MongoDB to be ready
    sleep 5

    # Initialize database manually
    echo -e "\033[1;32mInitializing database...\033[0m"
    docker exec -i mongo-nass mongosh -u admin -p secret --authenticationDatabase admin < ./mongo-init/init.js

}


function launch_dummy_api {
    echo -e "\033[1;32mStarting dummy-api service...\033[0m"
    COMPOSE_PROFILES="dummy-api" docker compose up --build -d dummy-api
}

if [ "$RESET_ENVIRONMENT" = "true" ]; then
    echo -e "\033[1;32mCleaning up existing Docker containers and volumes...\033[0m"
    rm -rf ./backend/auth-data
    docker volume rm $(docker volume ls -q)
    docker system prune -a -f --volumes
    COMPOSE_PROFILES="auth-api,mongo-express,test-services,test-global,dummy-api" docker compose down -v
fi



if [ "$TEST_PARAMETER" = "methods" ]; then
    reset_db
    

    # Wait for services to start and MongoDB to be ready
    echo -e "\033[1;32mWaiting for services to start...\033[0m"
    sleep 2

    # Run tests inside the auth-api container
    echo -e "\033[1;32mRunning methods tests inside auth-api container...\033[0m"
    docker exec auth-api-1 sh -c "cd /app && npm run methods-test -- --forceExit"

    TEST_EXIT_CODE=$?

    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo -e "\033[1;32m✓ All tests passed successfully.\033[0m"
    else
        echo -e "\033[1;31m✗ Some tests failed (Exit code: $TEST_EXIT_CODE).\033[0m"
        docker logs auth-api-1
        COMPOSE_PROFILES="mongo-nass,mongo-express,auth-api,dummy-api" docker compose down
    fi

    print_blue "\nAll tests ran. To run the same suite again, press 'y'. To exit, press any other key."
    read -n 1 -s USER_INPUT
    if [ "$USER_INPUT" = "y" ] || [ "$USER_INPUT" = "Y" ]; then
        clear_terminal
        bash tests.sh $RESET_ENVIRONMENT $TEST_PARAMETER


    else
        COMPOSE_PROFILES="mongo-nass,mongo-express,auth-api,dummy-api" docker compose down
        exit 1
    fi
else
    echo -e "\033[1;32mStarting Docker containers for no-test...\033[0m"
    COMPOSE_PROFILES="mongo-nass,mongo-express,auth-api,dummy-api" docker compose up --build -d
fi