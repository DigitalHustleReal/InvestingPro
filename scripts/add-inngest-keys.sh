#!/bin/bash
# Bash Script to Add Inngest Keys to .env.local
# Run: chmod +x scripts/add-inngest-keys.sh && ./scripts/add-inngest-keys.sh

ENV_FILE=".env.local"
EVENT_KEY="EJhfpQ-6Vc60U3ziqwd1O4QsAQ13BGelG_F93VPSZjmpIesnhsx6cmXeRk9ndpgChp7jI-7svdgXVqBr51Yq1g"
SIGNING_KEY="signkey-prod-87bbb2bb3a6f761c51cedfb5491a239e754b363f1ca7c8fb5bdfc33a0bd03f29"

echo "🔑 Adding Inngest API Keys to .env.local..."

# Check if .env.local exists
if [ -f "$ENV_FILE" ]; then
    echo "✅ Found .env.local file"
    
    # Check if keys already exist
    if grep -q "INNGEST_EVENT_KEY" "$ENV_FILE"; then
        echo "⚠️  INNGEST_EVENT_KEY already exists. Updating..."
        sed -i.bak "s|INNGEST_EVENT_KEY=.*|INNGEST_EVENT_KEY=$EVENT_KEY|" "$ENV_FILE"
    else
        echo "➕ Adding INNGEST_EVENT_KEY..."
        echo "" >> "$ENV_FILE"
        echo "# Inngest Configuration" >> "$ENV_FILE"
        echo "INNGEST_EVENT_KEY=$EVENT_KEY" >> "$ENV_FILE"
    fi
    
    if grep -q "INNGEST_SIGNING_KEY" "$ENV_FILE"; then
        echo "⚠️  INNGEST_SIGNING_KEY already exists. Updating..."
        sed -i.bak "s|INNGEST_SIGNING_KEY=.*|INNGEST_SIGNING_KEY=$SIGNING_KEY|" "$ENV_FILE"
    else
        echo "➕ Adding INNGEST_SIGNING_KEY..."
        echo "INNGEST_SIGNING_KEY=$SIGNING_KEY" >> "$ENV_FILE"
    fi
    
    echo "✅ Keys added to .env.local"
else
    echo "📝 Creating .env.local file..."
    cat > "$ENV_FILE" << EOF
# Inngest Configuration
INNGEST_EVENT_KEY=$EVENT_KEY
INNGEST_SIGNING_KEY=$SIGNING_KEY
EOF
    echo "✅ Created .env.local with Inngest keys"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Restart your dev server (if running)"
echo "2. Run: npx tsx scripts/verify-inngest-setup.ts"
echo "3. Test the API endpoint"
