#!/bin/bash
# PointsUp Mini App - Quick Start Commands

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 PointsUp Mini App - Quick Start${NC}"
echo "=================================="
echo ""

# Step 1: Install Dependencies
echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo ""

# Step 2: Create .env.local
echo -e "${BLUE}Step 2: Setting up environment...${NC}"
if [ ! -f .env.local ]; then
  cat > .env.local << EOF
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_URL=http://localhost:3000
EOF
  echo -e "${GREEN}✅ Created .env.local${NC}"
  echo "   ⚠️  Update NEXT_PUBLIC_ONCHAINKIT_API_KEY with your actual API key"
else
  echo "ℹ️  .env.local already exists"
fi
echo ""

# Step 3: Build check
echo -e "${BLUE}Step 3: Checking build...${NC}"
npm run build
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo "❌ Build failed - check errors above"
  exit 1
fi
echo ""

# Step 4: Ready to run
echo -e "${GREEN}=================================="
echo "✅ Setup complete! You're ready to go!"
echo "==================================${NC}"
echo ""
echo -e "${BLUE}To start the development server:${NC}"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Then open:${NC}"
echo "  http://localhost:3000"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  - README.md - Full documentation"
echo "  - BUILD_SUMMARY.md - What was built"
echo "  - DEPLOYMENT_CHECKLIST.md - Pre-launch checklist"
echo ""
