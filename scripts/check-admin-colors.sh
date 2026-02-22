#!/bin/bash

# Define forbidden patterns
FORBIDDEN_COLORS=("bg-slate-" "text-slate-" "border-slate-" "bg-blue-" "text-blue-" "bg-indigo-" "text-indigo-" "bg-gray-" "text-gray-")
FORBIDDEN_FILES=$(find app/admin components/admin -name "*.tsx" -o -name "*.ts")

FOUND_ERROR=0

echo "🎨 Checking for forbidden colors in Admin..."

for file in $FORBIDDEN_FILES; do
    for color in "${FORBIDDEN_COLORS[@]}"; do
        if grep -q "$color" "$file"; then
            echo "❌ Forbidden color '$color' found in $file"
            grep -n "$color" "$file"
            FOUND_ERROR=1
        fi
    done
done

if [ $FOUND_ERROR -eq 1 ]; then
    echo "🚫 Commit rejected: Please use semantic colors (bg-background-primary, text-text-secondary, etc.) instead of hardcoded tailwind colors."
    exit 1
fi

echo "✅ No forbidden colors found."
exit 0
