# WhatsApp & Telegram Setup Guide for Revenue Reports

## Overview
This guide explains how to set up **FREE** WhatsApp and Telegram notifications for daily/weekly/monthly revenue reports.

---

## ✅ Telegram Setup (100% Free, Unlimited)

### Step 1: Create Telegram Bot
1. Open Telegram and search for **@BotFather**
2. Start a chat and send: `/newbot`
3. Follow the prompts:
   - Bot name: `InvestingPro Revenue Bot` (or any name)
   - Username: `InvestingProRevenueBot` (must end in `bot`)
4. BotFather will give you a **token** like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### Step 2: Get Chat/Channel ID

#### For Telegram Group:
1. Add your bot to the group
2. Send any message in the group
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find `"chat":{"id":-123456789}` - that's your group chat ID (negative number)

#### For Telegram Channel:
1. Create a channel or use existing one
2. Add your bot as an **admin** to the channel
3. Post a message in the channel
4. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Find `"chat":{"id":-1001234567890}` - that's your channel ID

#### For Personal Chat:
1. Start a chat with your bot
2. Send `/start` to your bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find `"chat":{"id":123456789}` - that's your personal chat ID (positive number)

### Step 3: Add to Environment Variables
```bash
# .env.local or Vercel Environment Variables
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
REVENUE_REPORT_TELEGRAM_CHATS=-123456789,-1001234567890,123456789
```

**Multiple chats:** Separate with commas (no spaces, or trim spaces in code)

---

## ✅ WhatsApp Setup (Free Tier Available)

### Option 1: WhatsApp Cloud API (Meta - Free for Verified Businesses)

**Requirements:**
- Meta Business Account
- Meta Verified Business (for free tier)
- Free tier: 1,000 conversations/day

**Setup:**
1. Go to https://developers.facebook.com/
2. Create a Meta App
3. Add "WhatsApp" product
4. Get your:
   - **Phone Number ID**
   - **Access Token** (temporary, need to generate permanent)
5. Verify your phone number

**Environment Variables:**
```bash
WHATSAPP_CLOUD_API_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_API_VERSION=v21.0  # Optional, defaults to v21.0
REVENUE_REPORT_WHATSAPP_NUMBERS=+911234567890,+919876543210
```

**Format:** Phone numbers with country code (e.g., `+91` for India, `+1` for US)

---

### Option 2: Twilio WhatsApp (Free Tier)

**Free Tier:** 1,000 conversations/month

**Setup:**
1. Sign up at https://www.twilio.com/
2. Get verified (verify your phone number)
3. Go to "WhatsApp Sandbox" in Twilio Console
4. Join the sandbox by sending WhatsApp message to Twilio number
5. Get your:
   - **Account SID**
   - **Auth Token**
   - **From Number** (Twilio WhatsApp number)

**Environment Variables:**
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  # Twilio sandbox number
REVENUE_REPORT_WHATSAPP_NUMBERS=whatsapp:+911234567890,whatsapp:+919876543210
```

**Format:** Use `whatsapp:` prefix with phone numbers

**Note:** Twilio sandbox only works with verified numbers. For production, you'll need to get your Twilio number approved for WhatsApp.

---

## 📋 Complete Environment Variables

```bash
# Telegram (Required for Telegram notifications)
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
REVENUE_REPORT_TELEGRAM_CHATS=-123456789,-1001234567890

# WhatsApp Cloud API (Option 1)
WHATSAPP_CLOUD_API_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# OR Twilio WhatsApp (Option 2)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Recipients (comma-separated)
REVENUE_REPORT_WHATSAPP_NUMBERS=+911234567890,+919876543210
```

---

## 🚀 How It Works

### Daily Reports
- **Schedule:** 9 AM IST daily (configurable in Vercel cron)
- **Sends to:** All Telegram chats and WhatsApp numbers configured
- **Format:** Text message with emojis, formatted for mobile

### Weekly Reports
- **Schedule:** Sunday 9 AM IST
- **Format:** Same as daily, but for weekly period

### Monthly Reports
- **Schedule:** 1st of month, 9 AM IST
- **Format:** Same as daily, but for monthly period

---

## 📱 Message Format Example

```
Daily Revenue Report
📅 23 Jan 2026

💰 Total Revenue: ₹12,345.67
📊 Previous: ₹10,000.00
📈 Growth: +23.46%

✅ Conversions: 15
📈 Conversion Rate: 3.45%

🏆 Top Articles:
1. Best Credit Cards for Online Shopping...
   ₹5,000.00
2. SIP Investment Guide 2026...
   ₹3,500.00

Automated report from InvestingPro.in
```

---

## ✅ Testing

### Test Telegram
1. Start chat with your bot
2. Get your chat ID (see Step 2 above)
3. Add to `REVENUE_REPORT_TELEGRAM_CHATS`
4. Manually trigger: `GET /api/cron/daily-revenue-report`
5. Check Telegram for message

### Test WhatsApp
1. Add your number to `REVENUE_REPORT_WHATSAPP_NUMBERS`
2. For Twilio: First send "join <code>" to Twilio sandbox number
3. Manually trigger: `GET /api/cron/daily-revenue-report`
4. Check WhatsApp for message

---

## 🔧 Troubleshooting

### Telegram Not Sending
- ✅ Check `TELEGRAM_BOT_TOKEN` is correct
- ✅ Verify chat ID format (can be negative for groups/channels)
- ✅ Make sure bot is added to group/channel as admin
- ✅ Test token: `https://api.telegram.org/bot<TOKEN>/getMe`

### WhatsApp Not Sending
**Cloud API:**
- ✅ Check `WHATSAPP_CLOUD_API_TOKEN` is valid (not expired)
- ✅ Verify `WHATSAPP_PHONE_NUMBER_ID` is correct
- ✅ Ensure phone numbers include country code (`+91` for India)
- ✅ Check Meta Business Account is verified

**Twilio:**
- ✅ Verify phone number is in Twilio sandbox
- ✅ Check Account SID and Auth Token
- ✅ Use `whatsapp:` prefix for numbers
- ✅ Join sandbox: Send "join <code>" to Twilio WhatsApp number

---

## 💰 Cost Summary

| Service | Free Tier | Cost After Free Tier |
|---------|-----------|---------------------|
| Telegram Bot API | **Unlimited** | **Free forever** |
| WhatsApp Cloud API | 1,000 conv/day (Meta Verified) | Paid tier after |
| Twilio WhatsApp | 1,000 conv/month | $0.005 per message |

**Recommended Setup:**
- ✅ **Telegram:** Use for daily reports (unlimited, free)
- ✅ **WhatsApp:** Use for critical alerts (Twilio free tier is enough)

---

## 🔐 Security Best Practices

1. **Never commit tokens to Git** - Use environment variables
2. **Rotate tokens regularly** - Especially for production
3. **Use separate bots/tokens** - For dev vs production
4. **Monitor usage** - Check Twilio/WhatsApp Cloud dashboard
5. **Rate limiting** - Telegram: 30 messages/second, WhatsApp: Check provider limits

---

## 📚 Additional Resources

- **Telegram Bot API:** https://core.telegram.org/bots/api
- **WhatsApp Cloud API:** https://developers.facebook.com/docs/whatsapp
- **Twilio WhatsApp:** https://www.twilio.com/docs/whatsapp

---

**Last Updated:** January 23, 2026  
**Status:** ✅ Telegram (100% free) | ⚠️ WhatsApp (free tier available)
