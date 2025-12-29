# ⚡ Quick API Setup - 2 Minutes

## 🎯 You NEED OpenAI API Key for Real Generation!

**Current Status**: ❌ No API key → Mock responses only
**After Setup**: ✅ Real AI generation → Investopedia/NerdWallet-grade content

---

## 🚀 3-Step Setup

### Step 1: Get API Key (1 minute)
1. Go to: **https://platform.openai.com/api-keys**
2. Sign up (free $5 credit) or log in
3. Click **"Create new secret key"**
4. **Copy the key** (starts with `sk-...`)

### Step 2: Add to `.env.local` (30 seconds)
Open `.env.local` and add this line:

```env
OPENAI_API_KEY=sk-paste-your-key-here
```

**Example:**
```env
OPENAI_API_KEY=sk-proj-abc123xyz789def456...
```

### Step 3: Restart Server (30 seconds)
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## ✅ Test It

1. Go to: `http://localhost:3000/admin/ai-generator`
2. Enter topic: "Best SIP Plans for Retirement"
3. Click "Generate Content"
4. **You should see REAL content** (not "Draft Summary" placeholder)

---

## 💰 Cost

- **Free**: $5 credit when you sign up
- **Per Article**: ~$0.01-0.03 (1500 words)
- **100 Articles**: ~$2-3
- **Very affordable!**

---

## 🐛 Troubleshooting

**"Mock response" message?**
→ API key not set or server not restarted

**"Incorrect API key"?**
→ Check key is correct (starts with `sk-`)

**"Quota exceeded"?**
→ Add payment method at https://platform.openai.com/account/billing

---

## 📝 Summary

**YES, you need `OPENAI_API_KEY`!**

1. Get key: https://platform.openai.com/api-keys
2. Add to `.env.local`
3. Restart server
4. Generate real content! 🎉

---

**Without API key = Mock responses (not real)**
**With API key = Real AI generation (professional content)**
















