#!/bin/bash

# Run the script
./bingo.sh

# Check the exit status of the script
if [ $? -eq 0 ]; then
  echo "bingo executed successfully."
else
  echo "bingo failed."
fi

./countdown.sh

if [ $? -eq 0 ]; then
  echo "countdown executed successfully."
else
  echo "countdown failed."
fi

./fortune.sh

if [ $? -eq 0 ]; then
  echo "fortune executed successfully."
else
  echo "fortune failed."
fi

./questionnaries.sh

if [ $? -eq 0 ]; then
  echo "questionnaries executed successfully."
else
  echo "questionnaries failed."
fi
