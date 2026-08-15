require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const LOGISTICS_CHAT_ID = process.env.LOGISTICS_CHAT_ID;
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://wreckage-manicure-pristine.ngrok-free.dev';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Helper to call Telegram API
async function callTelegramApi(method, payload) {
  const response = await fetch(`${TELEGRAM_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': true },
    body: JSON.stringify(payload)
  });
  return await response.json();
}

// ==========================================
// 1. RECEIVE ORDER FROM MINI APP
// ==========================================
app.post('/api/send-order', async (req, res) => {
  try {
    const { name, phone1, phone2, address, productName, qty, total, lang } = req.body;
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;

    const messageText =
      `📦 <b>NEW ORDER #${orderId}</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Customer:</b> ${name || 'N/A'}\n` +
      `📍 <b>Address:</b> ${address || 'N/A'}\n` +
      `📞 <b>Phone 1:</b> <code>${phone1 || 'N/A'}</code>\n` +
      `📞 <b>Phone 2:</b> <code>${phone2 || 'N/A'}</code>\n` +
      `💳 <b>Payment:</b> Cash on Delivery\n` +
      `💰 <b>Total Amount:</b> <b>$${total || 0}</b>\n\n` +
      `🛒 <b>Item:</b> ${productName || 'Vitamin D3'} x${qty || 1}\n` +
      `🌐 <b>Lang:</b> ${(lang || 'en').toUpperCase()}\n` +
      `🔴 Status: Pending Delivery`;

    const tgResponse = await callTelegramApi('sendMessage', {
      chat_id: LOGISTICS_CHAT_ID,
      text: messageText,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚚 Mark as Delivered', callback_data: `deliver_${orderId}` }]
        ]
      }
    });

    if (tgResponse.ok) {
      console.log(`✅ Order #${orderId} sent to logistics chat!`);
      return res.status(200).json({ success: true, orderId });
    } else {
      console.error('❌ Telegram error:', tgResponse);
      return res.status(500).json({ success: false, error: 'Failed to notify team' });
    }
  } catch (error) {
    console.error('🔥 Server error details:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 2. TELEGRAM BOT WEBHOOK (/start & clicks)
// ==========================================
app.post('/api/telegram-webhook', async (req, res) => {
  try {
    const { message, callback_query } = req.body;

    // Handle /start command
    if (message && message.text && message.text.trim() === '/start') {
      const firstName = message.from.first_name || 'Friend';
      await callTelegramApi('sendMessage', {
        chat_id: message.chat.id,
        text: `👋 Hello <b>${firstName}</b>!\n\nWelcome to <b>Natura Store</b> 🌿\nTap below to open our catalog:`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🛍 Open Natura Store', web_app: { url: WEB_APP_URL } }]
          ]
        }
      });
    }

    // Handle logistics button clicks ("Mark as Delivered")
    if (callback_query) {
      const data = callback_query.data;
      const msg = callback_query.message;
      const adminName = callback_query.from.first_name || 'Admin';

      if (data.startsWith('deliver_')) {
        const orderId = data.replace('deliver_', '');
        const updatedText = msg.text.replace(
          '🔴 Status: Pending Delivery',
          `🟢 <b>Status: Delivered by ${adminName}</b> ✅`
        );

        await callTelegramApi('editMessageText', {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
          text: updatedText,
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: [] }
        });

        await callTelegramApi('answerCallbackQuery', {
          callback_query_id: callback_query.id,
          text: `Order #${orderId} marked as delivered!`
        });
      }
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Error');
  }
});

// ==========================================
// 3. STATIC FRONTEND SERVING (Fixed Path)
// ==========================================
app.use(express.static(path.join(__dirname, '../dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
