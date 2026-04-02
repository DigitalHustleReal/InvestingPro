#!/bin/bash

# Check admin components for non-semantic color usage
# Gray is allowed (V2 design system). Only check for truly forbidden colors.
FORBIDDEN_COLORS=("bg-blue-" "text-blue-" "bg-indigo-" "text-indigo-" "bg-cyan-" "text-cyan-" "bg-teal-" "text-teal-" "bg-sky-" "text-sky-" "bg-slate-" "text-slate-" "border-slate-")

FOUND_ERROR=0

echo "🎨 Checking for forbidden colors in Admin..."

for color in "${FORBIDDEN_COLORS[@]}"; do
    MATCHES=$(grep -rn "$color" app/admin/ components/admin/ --include="*.tsx" --include="*.ts" 2>/dev/null | head -5)
    if [ -n "$MATCHES" ]; then
        echo "❌ Forbidden color '$color' found:"
        echo "$MATCHES"
        FOUND_ERROR=1
    fi
done

if [ $FOUND_ERROR -eq 1 ]; then
    echo "🚫 Commit rejected: Use semantic colors or green-*/gray-* tokens."
    exit 1
fi

echo "✅ No forbidden colors found."
exit 0
