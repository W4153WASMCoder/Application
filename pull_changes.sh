#!/bin/bash

# Navigate to your project directory
cd /home/admin/Application/ || exit

# Fetch and pull latest changes
git fetch origin
output=$(git pull origin main)

# Check if any files were updated by the pull command
if [[ $output != "Already up to date." ]]; then
    echo "Files have changed."
    echo "Stopping old screen session (if any)..."

    # If a screen session named "myservice" is running, kill it
    if screen -list | grep -q "myservice"; then
        screen -S myservice -X quit
        echo "Old screen session stopped."
    fi

    echo "Starting new screen session for myservice..."
    # Start a new detached screen session named "myservice"
    screen -dmS myservice bash -c "cd /home/admin/Application/react-web-app/ && npm run build && npm start"
    echo "New screen session started."

else
    echo "No changes detected. The application will not be restarted."
fi