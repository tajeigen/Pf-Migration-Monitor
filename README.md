# BullX Coin Migration Monitor

A Node.js application that monitors new coin migrations on BullX platform, analyzes transactions, and sends notifications via Telegram.

## 🚀 Features

- Real-time monitoring of new coin migrations via WebSocket
- Transaction analysis and metrics calculation
- MongoDB integration for data persistence
- Telegram notifications (both bot and user account options)
- Detailed analytics including:
  - Transaction duration tracking
  - Buy/Sell patterns analysis
  - Price range distribution
  - Bundle data analysis

## 📋 Prerequisites

- Node.js (v12 or higher)
- MongoDB
- Telegram Bot Token (or Telegram User Account)
- ngrok (for Telegram bot webhook)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd migratingCoins
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file with the following configurations:
```properties
# Telegram Bot
BOT_TOKEN_ACCESS=your_bot_token
SERVER_URL=your_ngrok_url
CHAT_ID=your_chat_id

# Telegram User Info (if using personal account)
API_ID=your_api_id
API_HASH=your_api_hash
PHONE_NUMBER=your_phone_number
CHANNEL_ID=your_channel_id

# Database
DB_NAME=your_db_name

# URLs
PF_TX=pf_tx_url
BUNDLE_DATA=bundle_data_url
WS_BULLX_MIGRATING_COINS=your_websocket_url
BULLX_EVENT=event_name
```

## 🏃‍♂️ Running the Application

```bash
npm run start
```

## 📁 Project Structure

```
├── config/
│   └── db.js                 # MongoDB configuration
├── logs/
│   ├── logger.js             # Winston logger setup
│   ├── combined.log          # All logs
│   └── error.log            # Error logs only
├── messaging_tg/
│   ├── sendMsgBotTG.js      # Telegram bot implementation
│   └── sendTelegramMessage.js # Personal account messaging
├── models/
│   └── Transaction.js        # MongoDB schema definitions
├── services/
│   ├── fetchBundleData.js    # Bundle data fetching
│   ├── fetchTransactions.js  # Transaction data fetching
│   └── getMigratingCoinsBullX.js # WebSocket handler
├── utils/
│   ├── analytics.js          # Transaction analysis utilities
│   └── processAnalytics.js   # Analytics processing
└── main.js                   # Application entry point
```

## 💡 Features Explanation

### WebSocket Monitoring
- Connects to BullX WebSocket stream
- Monitors new coin migrations
- Filters relevant events

### Transaction Analysis
- Duration tracking
- Buy/Sell pattern analysis
- Price range distribution
- Volume analysis
- Bundle data analysis

### Notification System
Two options available:
1. **Telegram Bot**
   - Requires Bot Token from BotFather
   - Uses webhook for real-time updates
   - Requires ngrok for local development

2. **Personal Telegram Account**
   - Requires API credentials from my.telegram.org
   - Supports session management
   - Direct channel posting

### Data Storage
- MongoDB integration
- Two connected collections:
  - Transaction data
  - Mint addresses

## 🔧 Configuration

### Telegram Bot Setup
1. Create bot via BotFather
2. Get bot token
3. Set up ngrok
4. Configure webhook URL

### Personal Account Setup
1. Visit my.telegram.org
2. Get API credentials
3. Configure phone number

## 📝 Todo List

- [ ] Implement Telegram session management
- [ ] Optimize database schema

## ⚠️ Important Notes

- Keep your .env file secure and never commit it
- Monitor your API rate limits
- Regular database maintenance recommended
- Handle WebSocket reconnections properly

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

