#!/bin/bash

echo "🚨 NUCLEAR DOCKER RESET - This will destroy EVERYTHING 🚨"
echo "This will remove:"
echo "- All containers (running and stopped)"
echo "- All images"
echo "- All volumes" 
echo "- All networks"
echo "- All build cache"
echo "- Your project's data directories"
echo ""
read -p "Are you absolutely sure? Type 'YES' to continue: " -r
if [[ ! $REPLY =~ ^YES$ ]]; then
    echo "Aborted."
    exit 1
fi

echo "Starting complete Docker environment reset..."

# 1. Stop all running containers
echo "Stopping all containers..."
docker stop $(docker ps -q) 2>/dev/null || echo "No running containers to stop"

# 2. Remove all containers
echo "Removing all containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "No containers to remove"

# 3. Remove all images
echo "Removing all images..."
docker rmi $(docker images -q) -f 2>/dev/null || echo "No images to remove"

# 4. Remove all volumes
echo "Removing all volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null || echo "No volumes to remove"

# 5. Remove all networks (except defaults)
echo "Removing all custom networks..."
docker network rm $(docker network ls -q) 2>/dev/null || echo "No custom networks to remove"

# 6. System prune (removes build cache, unused networks, etc.)
echo "Running system prune..."
docker system prune -a -f --volumes

# 7. Remove local data directories
echo "Removing local data directories..."
rm -rf ./backend/auth-data
rm -rf ./frontend/node_modules
rm -rf ./backend/node_modules
rm -rf ./api/node_modules

# 8. Clean Docker builder cache
echo "Cleaning Docker builder cache..."
docker builder prune -a -f

# 9. Restart Docker daemon (optional - uncomment if needed)
# echo "Restarting Docker daemon..."
# sudo systemctl restart docker

echo "✅ Complete Docker environment reset finished!"
echo ""
echo "Next steps:"
echo "1. Verify with: docker ps -a (should be empty)"
echo "2. Verify with: docker images (should be empty)"
echo "3. Verify with: docker volume ls (should be empty)"
echo "4. Run your project: ./run.sh no-test false"
echo ""
echo "Everything will be rebuilt from scratch on next run."