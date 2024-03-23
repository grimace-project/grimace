#!/bin/bash

# Function to rename files recursively
rename_files() {
    for file in "$1"/*; do
        if [ -d "$file" ]; then
            rename_files "$file"  # Recursively process subdirectories
        elif [ -f "$file" ] && [[ "$file" == *.js ]]; then
            new_file="${file%.js}.mjs"  # Replace .js with .mjs
            mv "$file" "$new_file"
            echo "Renamed: $file -> $new_file"
        fi
    done
}

# Get the directory path from the command line argument
directory="$1"

# Check if the directory exists
if [ ! -d "$directory" ]; then
    echo "Directory '$directory' does not exist."
    exit 1
fi

# Call the rename_files function with the directory path
rename_files "$directory"

echo "File renaming completed."
