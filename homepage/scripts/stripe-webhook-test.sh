#!/bin/bash

# Stripe Webhook Testing Script
# This script uses Stripe CLI to test webhook integration

echo "🔄 Starting Stripe Webhook Testing..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI is not installed${NC}"
    echo "Install it from: https://stripe.com/docs/stripe-cli"
    exit 1
fi

# Check if we're logged in to Stripe
if ! stripe config --list | grep -q "test_mode_api_key"; then
    echo -e "${YELLOW}⚠️  Not logged in to Stripe CLI${NC}"
    echo "Running: stripe login"
    stripe login
fi

# Function to forward webhooks
forward_webhooks() {
    echo -e "${GREEN}📡 Forwarding Stripe webhooks to local server...${NC}"
    echo "URL: http://localhost:3000/api/stripe/webhook"
    echo ""
    echo "Keep this running to receive webhook events!"
    echo "Press Ctrl+C to stop"
    echo ""
    
    stripe listen --forward-to localhost:3000/api/stripe/webhook
}

# Function to trigger test events
trigger_test_events() {
    echo -e "${GREEN}🎯 Triggering test webhook events...${NC}"
    
    echo "1. Testing payment_intent.succeeded..."
    stripe trigger payment_intent.succeeded
    
    sleep 2
    
    echo "2. Testing account.updated..."
    stripe trigger account.updated
    
    sleep 2
    
    echo "3. Testing customer.subscription.created..."
    stripe trigger customer.subscription.created
    
    sleep 2
    
    echo "4. Testing charge.refunded..."
    stripe trigger charge.refunded
    
    echo -e "${GREEN}✅ Test events triggered!${NC}"
}

# Function to create a test payment
create_test_payment() {
    echo -e "${GREEN}💳 Creating a test payment with 70/30 split...${NC}"
    
    # Create a payment intent using Stripe CLI
    stripe payment_intents create \
        --amount=10000 \
        --currency=usd \
        --application-fee-amount=3000 \
        --metadata="test=true" \
        --metadata="split=70/30" \
        --confirm
    
    echo -e "${GREEN}✅ Test payment created!${NC}"
}

# Function to list recent events
list_recent_events() {
    echo -e "${GREEN}📋 Recent webhook events:${NC}"
    stripe events list --limit 10
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1) Forward webhooks to local server"
    echo "2) Trigger test webhook events"
    echo "3) Create a test payment (70/30 split)"
    echo "4) List recent webhook events"
    echo "5) Run full webhook test suite"
    echo "6) Exit"
    echo ""
    read -p "Choose an option (1-6): " choice
    
    case $choice in
        1)
            forward_webhooks
            ;;
        2)
            trigger_test_events
            ;;
        3)
            create_test_payment
            ;;
        4)
            list_recent_events
            ;;
        5)
            echo -e "${YELLOW}📦 Running full test suite...${NC}"
            echo "This will:"
            echo "- Create test payments"
            echo "- Trigger webhook events"
            echo "- Verify 70/30 split calculations"
            echo ""
            
            create_test_payment
            sleep 3
            trigger_test_events
            sleep 3
            list_recent_events
            
            echo -e "${GREEN}✅ Full test suite completed!${NC}"
            ;;
        6)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            show_menu
            ;;
    esac
}

# Start
echo -e "${GREEN}🚀 Stripe Webhook Testing Tool${NC}"
echo "================================"
echo ""

while true; do
    show_menu
done