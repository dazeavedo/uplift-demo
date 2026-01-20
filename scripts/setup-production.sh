#!/bin/bash

# ============================================================
# UPLIFT PRODUCTION SETUP SCRIPT
# Run this script to configure your environment for production
# ============================================================

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║            UPLIFT PRODUCTION SETUP                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Creating .env.production instead."
    ENV_FILE=".env.production"
else
    ENV_FILE=".env"
fi

# Generate JWT secret
echo "🔐 Generating secure JWT secret..."
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')

# Start creating the env file
cat > $ENV_FILE << ENVEOF
# ============================================================
# UPLIFT PRODUCTION CONFIGURATION
# Generated: $(date)
# ============================================================

# -------------------- Server --------------------
NODE_ENV=production
PORT=3000
API_URL=https://api.yourdomain.com

# -------------------- Database --------------------
# IMPORTANT: Update this with your production database URL
DATABASE_URL=postgres://user:password@your-db-host:5432/uplift
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50

# -------------------- Authentication --------------------
# Secure JWT secret (auto-generated)
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cookie settings - UPDATE DOMAIN FOR PRODUCTION
COOKIE_DOMAIN=yourdomain.com
COOKIE_SECURE=true

# -------------------- Stripe --------------------
# IMPORTANT: Replace with your LIVE keys from Stripe Dashboard
STRIPE_SECRET_KEY=sk_live_REPLACE_WITH_YOUR_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_REPLACE_WITH_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_YOUR_SECRET

# Price IDs from Stripe
STRIPE_PRICE_GROWTH=price_REPLACE
STRIPE_PRICE_SCALE=price_REPLACE

# -------------------- Email (SendGrid) --------------------
# IMPORTANT: Get API key from https://app.sendgrid.com/settings/api_keys
SENDGRID_API_KEY=SG.REPLACE_WITH_YOUR_KEY
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Uplift

# -------------------- CORS --------------------
# Update with your actual frontend domains
CORS_ORIGINS=https://app.yourdomain.com,https://yourdomain.com

# -------------------- Rate Limiting --------------------
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# -------------------- Logging --------------------
LOG_LEVEL=info

# -------------------- Error Tracking --------------------
# Recommended: Set up Sentry for error monitoring
# SENTRY_DSN=https://xxx@sentry.io/xxx

# -------------------- Feature Flags --------------------
ENABLE_MFA=true
ENABLE_GAMIFICATION=true
ENABLE_AI_SCHEDULING=true

# -------------------- Mobile App --------------------
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api
ENVEOF

echo ""
echo "✅ Created $ENV_FILE with secure JWT secret"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Update DATABASE_URL with your production database credentials"
echo ""
echo "2. Set up Stripe:"
echo "   - Get live keys from https://dashboard.stripe.com/apikeys"
echo "   - Create webhook at https://dashboard.stripe.com/webhooks"
echo "   - Point webhook to: https://api.yourdomain.com/api/billing/webhooks/stripe"
echo ""
echo "3. Set up SendGrid:"
echo "   - Get API key from https://app.sendgrid.com/settings/api_keys"
echo "   - Verify your sender email domain"
echo ""
echo "4. Update CORS_ORIGINS with your actual frontend domains"
echo ""
echo "5. Update COOKIE_DOMAIN with your actual domain"
echo ""
echo "6. Run database migrations:"
echo "   npm run db:migrate"
echo ""
echo "7. Seed the database (optional, for demo data):"
echo "   npm run db:seed"
echo ""
echo "8. Deploy using Docker or Kubernetes:"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo "   # or"
echo "   kubectl apply -f k8s/ -n uplift"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
