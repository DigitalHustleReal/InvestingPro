# Content Distribution Setup - Telegram & WhatsApp Channels

## Overview
Automatically post new articles to Telegram channels and WhatsApp channels when they're published.

---

## ✅ What Gets Automated

When an article is **published**, it automatically:
1. ✅ Posts to **Telegram channels** (if configured)
2. ✅ Posts to **WhatsApp channels** (if configured)
3. ✅ Posts to **Twitter** (if API configured)
4. ✅ Posts to **LinkedIn** (via RSS or manual)
5. ✅ Sends **newsletter email** to subscribers (via Resend)

---

## 📱 Telegram Channel Setup

### Step 1: Create Telegram Bot (if not done)
1. Open Telegram, search for **@BotFather**
2. Send `/newbot` and follow prompts
3. Save the **bot token** you receive

### Step 2: Create Telegram Channel
1. Create a new channel in Telegram (e.g., "InvestingPro Articles")
2. Make it **Public** (so bot can post) OR keep private and add bot as admin
3. Note the channel username (e.g., `@investingpro_articles`) or channel ID

### Step 3: Add Bot as Channel Admin
1. Go to channel settings → **Administrators**
2. Click **Add Administrator**
3. Search for your bot username
4. Give it permission to **Post Messages**
5. **Save**

### Step 4: Get Channel ID
**For Public Channels:**
- Use `@channelusername` format (e.g., `@investingpro_articles`)

**For Private Channels:**
1. Forward any message from channel to `@userinfobot`
2. It will show you the channel ID (e.g., `-1001234567890`)
3. OR visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Post something in channel, check the response for `chat.id`

### Step 5: Configure Environment Variables
```bash
# Telegram Bot Token (same as revenue reports)
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather

# Telegram Channels (comma-separated - can be usernames or IDs)
TELEGRAM_CONTENT_CHANNELS=@investingpro_articles,@investingpro_hindi,-1001234567890
```

**Multiple channels:** Separate with commas (no spaces)

---

## 📱 WhatsApp Channel Setup

### Option 1: WhatsApp Cloud API (Meta)

**Requirements:**
- Meta Business Account
- WhatsApp Business API access

**Setup:**
1. Go to https://developers.facebook.com/
2. Create Meta App → Add WhatsApp product
3. Get **Phone Number ID** and **Access Token**
4. Add phone numbers to your WhatsApp Business contacts

**Environment Variables:**
```bash
# WhatsApp Cloud API
WHATSAPP_CLOUD_API_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_API_VERSION=v21.0

# WhatsApp Channels (phone numbers with country code)
WHATSAPP_CONTENT_CHANNELS=+911234567890,+919876543210
```

**Note:** For WhatsApp groups/channels, you need the group's phone number ID (not individual numbers). WhatsApp Cloud API doesn't directly support public channels like Telegram. You can:
- Send to WhatsApp Business contacts (individuals)
- Use WhatsApp Business API to send to lists (broadcast lists)

---

### Option 2: Twilio WhatsApp

**Free Tier:** 1,000 conversations/month

**Setup:**
1. Sign up at https://www.twilio.com/
2. Get verified
3. Go to WhatsApp Sandbox
4. Join sandbox by sending code to Twilio number

**Environment Variables:**
```bash
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# WhatsApp Channels (with whatsapp: prefix)
WHATSAPP_CONTENT_CHANNELS=whatsapp:+911234567890,whatsapp:+919876543210
```

**Note:** Twilio sandbox requires verified numbers. For production, you'll need an approved Twilio WhatsApp number.

---

## 🔄 How It Works

### Automatic Trigger
The system automatically distributes articles when:
1. **Article is published** (status changes to 'published')
2. **Cron job runs** (every 6 hours, checks for new articles in last 24 hours)

### Message Format Example

```
📈 Best Credit Cards for Online Shopping in India 2026

Discover the top credit cards that offer maximum rewards on online purchases. Compare cashback rates, annual fees, and exclusive benefits.

🔗 Read more: https://investingpro.in/article/best-credit-cards-online-shopping

Published by InvestingPro.in
```

---

## ✅ Complete Environment Variables

```bash
# Telegram (Required for Telegram channels)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CONTENT_CHANNELS=@investingpro_articles,@investingpro_hindi

# WhatsApp Cloud API (Option 1)
WHATSAPP_CLOUD_API_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_id
WHATSAPP_CONTENT_CHANNELS=+911234567890,+919876543210

# OR Twilio WhatsApp (Option 2)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_CONTENT_CHANNELS=whatsapp:+911234567890

# Email (Resend - for newsletter)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=InvestingPro <newsletter@investingpro.in>

# Social Media (Optional)
TWITTER_BEARER_TOKEN=your_token
```

---

## 🧪 Testing

### Test Manual Distribution
1. Publish an article in admin panel
2. Check cron job logs or manually trigger:
   ```
   GET /api/cron/content-distribution
   ```
3. Verify posts appear in:
   - Telegram channels ✅
   - WhatsApp channels ✅
   - Twitter (if configured) ✅
   - Email subscribers (if configured) ✅

### Test Telegram
1. Create a test channel
2. Add bot as admin
3. Add channel to `TELEGRAM_CONTENT_CHANNELS`
4. Publish test article
5. Check channel for post

### Test WhatsApp
1. Add your number to `WHATSAPP_CONTENT_CHANNELS`
2. For Twilio: First send "join <code>" to Twilio sandbox number
3. Publish test article
4. Check WhatsApp for message

---

## 📊 Distribution Status

You can check distribution status in:
- **Admin Dashboard** → Content → Distribution Logs (if implemented)
- **Cron Job Response** → Check API response for success/failure
- **Telegram/WhatsApp** → Verify posts appear in channels

---

## 🔧 Troubleshooting

### Telegram Not Posting
- ✅ Check `TELEGRAM_BOT_TOKEN` is correct
- ✅ Verify bot is admin in channel (with post permissions)
- ✅ Check channel ID/username format:
  - Public: `@channelusername`
  - Private: `-1001234567890` (negative number)
- ✅ Test bot: Visit `https://api.telegram.org/bot<TOKEN>/getMe`

### WhatsApp Not Posting
**Cloud API:**
- ✅ Check access token is valid (not expired)
- ✅ Verify phone numbers include country code
- ✅ Ensure recipients are in your WhatsApp Business contacts

**Twilio:**
- ✅ Verify phone number is in Twilio sandbox
- ✅ Use `whatsapp:` prefix for numbers
- ✅ Join sandbox first: Send "join <code>" to Twilio number

---

## 💰 Cost Summary

| Service | Cost |
|---------|------|
| Telegram Bot API | **100% FREE, Unlimited** |
| WhatsApp Cloud API | Free tier: 1,000 conv/day |
| Twilio WhatsApp | Free tier: 1,000 conv/month |

**Recommended:** Use Telegram for article distribution (unlimited, free)

---

## 🎯 Best Practices

1. **Separate Channels by Language:**
   - `@investingpro_english` (English articles)
   - `@investingpro_hindi` (Hindi articles)

2. **Separate Channels by Category:**
   - `@investingpro_creditcards`
   - `@investingpro_mutualfunds`

3. **Use Private Channels for Testing:**
   - Create test channel
   - Add yourself and bot
   - Test before adding to public channels

4. **Monitor Distribution:**
   - Check logs regularly
   - Set up alerts for failures
   - Track engagement in channels

---

**Last Updated:** January 23, 2026  
**Status:** ✅ Ready to use - Configure channels and publish articles!
