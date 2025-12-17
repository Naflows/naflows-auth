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
    print_red "WARNING: You have chosen to reset the TEST environment. This will delete the test Docker containers and volumes."
    print_red "Your development database (mongo-nass) will remain untouched.\n"
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
    printf "| %-${COL1_WIDTH}s | %-${COL2_WIDTH}s | %-${COL3_WIDTH}s | %-${COL4_WIDTH}s |\n" "2" "2fa" "Test 2fa security" "$green_text"
    printf -- "+-------+------------+----------------------+---------------------+\n"
    print_separator
    read -p "Enter a test number: " TEST_NUMBER

    case $TEST_NUMBER in
        1)
            TEST_PARAMETER="methods"
            ;;
        2)
            TEST_PARAMETER="2fa"
            ;;
        *)
            print_red "Invalid test number."
            exit 1
            ;;
    esac
fi

print_title "$TEST_PARAMETER"

function reset_test_db {
    echo -e "\033[1;32mResetting TEST database...\033[0m"
    COMPOSE_PROFILES="mongo-nass-test" docker compose down -v
    echo -e "\033[1;32mStarting MongoDB TEST instance...\033[0m"
    COMPOSE_PROFILES="mongo-nass-test,auth-api-test" docker compose up -d --build
    # Wait for MongoDB to be ready
    sleep 5

    # Initialize database manually
    echo -e "\033[1;32mInitializing TEST database...\033[0m"
    docker exec -i mongo-nass-test mongosh -u admin -p pass --authenticationDatabase admin < ./mongo-init/init.js

}

# Ensure that any running containers are stopped and removed
# And prevent already-located ports from causing issues
function end_running_containers {
    echo -e "\033[1;32mStopping existing containers to prevent conflicts... - Instance 'mongo-nass' remains untouched.\033[0m"
    COMPOSE_PROFILES="mongo-nass-test,auth-api-test,dummy-api,mongo-nass,auth-api" docker compose down
}


function launch_dummy_api {
    echo -e "\033[1;32mStarting dummy-api service...\033[0m"
    COMPOSE_PROFILES="dummy-api" docker compose up --build -d dummy-api
}

function save_test_result_with_current_commit {
    # This function saves the current commit ID, branch, test result, and timestamp in a structured format.
    TEST_EXIT_CODE=$1

    # Name of the file: test_results.log
    FILE_NAME="test_results.log"
    COMMIT_ID=$(git rev-parse HEAD)
    BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        TEST_RESULT="PASS"
    else
        TEST_RESULT="FAIL"
    fi

    # Format the log entry as a table row
    printf "%-40s %-20s %-10s %-20s\n" "$COMMIT_ID" "$BRANCH_NAME" "$TEST_RESULT" "$TIMESTAMP" >> "$FILE_NAME"
}

if [ "$RESET_ENVIRONMENT" = "true" ]; then
    echo -e "\033[1;32mCleaning up existing TEST Docker containers and volumes...\033[0m"
    rm -rf ./backend/auth-data-test
    docker volume rm mongo-data-test 2>/dev/null || true
    COMPOSE_PROFILES="auth-api-test,test-services,test-global,mongo-nass-test" docker compose down -v
fi



end_running_containers
reset_test_db

# If mongo-express is not running, start it
if ! docker ps --format '{{.Names}}' | grep -q '^mongo-express$'; then
    echo -e "\033[1;32mStarting mongo-express service...\033[0m"
    COMPOSE_PROFILES="mongo-nass-test" docker compose up -d mongo-express
fi


# Wait for services to start and MongoDB to be ready
echo -e "\033[1;32mWaiting for services to start...\033[0m"
sleep 2

# Run tests inside the auth-api-test container
echo -e "\033[1;32mRunning methods tests inside auth-api-test container...\033[0m"
if [ "$TEST_PARAMETER" = "2fa" ]; then
    docker exec auth-api-test sh -c "cd /app && npm run 2fa-test -- --forceExit --testPathPattern=2fa"
elif [ "$TEST_PARAMETER" = "methods" ]; then
    docker exec auth-api-test sh -c "cd /app && npm run methods-test -- --forceExit"
fi

TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -eq 0 ]; then
    # Clear terminal
    clear 
    echo -e "\033[1;32m✓ All tests passed successfully.\033[0m"
else
    # Clear terminal
    echo -e "\033[1;31m✗ Some tests failed (Exit code: $TEST_EXIT_CODE).\033[0m"
    COMPOSE_PROFILES="mongo-nass-test,auth-api-test,dummy-api" docker compose down
fi

save_test_result_with_current_commit $TEST_EXIT_CODE

print_blue "\nAll tests ran. To run the same suite again, press 'y'. To exit, press any other key."
read -n 1 -s USER_INPUT
if [ "$USER_INPUT" = "y" ] || [ "$USER_INPUT" = "Y" ]; then
    clear_terminal
    bash tests.sh $RESET_ENVIRONMENT $TEST_PARAMETER
else
    COMPOSE_PROFILES="mongo-nass-test,auth-api-test,dummy-api" docker compose down
    exit 1
fi
