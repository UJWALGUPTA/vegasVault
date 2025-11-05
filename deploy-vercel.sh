#!/bin/bash

# VegasVault - Vercel Deployment Script
# This script helps deploy the application to Vercel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 VegasVault - Vercel Deployment${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI is not installed.${NC}"
    echo ""
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
    echo ""
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel${NC}"
    echo ""
    echo "Please login to Vercel:"
    vercel login
    echo ""
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local file not found${NC}"
    echo ""
    echo "Creating .env.local from env.example..."
    if [ -f env.example ]; then
        cp env.example .env.local
        echo -e "${GREEN}✅ Created .env.local${NC}"
        echo -e "${YELLOW}⚠️  Please update .env.local with your actual values${NC}"
    else
        echo -e "${RED}❌ env.example file not found${NC}"
        exit 1
    fi
    echo ""
fi

# Check if project is already linked
if [ ! -f .vercel/project.json ]; then
    echo -e "${BLUE}📦 Linking project to Vercel...${NC}"
    vercel link
    echo ""
fi

# Ask for deployment type
echo "Select deployment type:"
echo "1) Preview deployment (recommended for testing)"
echo "2) Production deployment"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Deploying to preview...${NC}"
        vercel
        ;;
    2)
        echo -e "${BLUE}🚀 Deploying to production...${NC}"
        vercel --prod
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Vercel Dashboard"
echo "2. Test the deployed application"
echo "3. Verify all functionality works"
echo ""
echo "For more information, see VERCEL_DEPLOYMENT.md"

