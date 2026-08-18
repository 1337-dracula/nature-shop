require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const TelegramBotModule = require('node-telegram-bot-api');
const TelegramBot = TelegramBotModule.default || TelegramBotModule.TelegramBot || TelegramBotModule;

const token = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://nature-shop-44eb.onrender.com/';

if (!token) {
  console.error("Error: BOT_TOKEN is missing in .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// 1. Set the persistent Menu Button at the bottom left of the chat box
bot.setChatMenuButton({
  menu_button: {
    type: 'web_app',
    text: '🛍️ Open Store',
    web_app: { url: WEB_APP_URL }
  }
}).then(() => {
  console.log("✅ Persistent Menu Button configured successfully!");
}).catch(err => {
  console.error("❌ Failed to set menu button:", err.message);
});

console.log("🤖 Telegram Bot is running locally and listening for messages...");

// 2. Optional: Keep the /start command as a welcome message
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Friend';

  bot.sendMessage(chatId, `Welcome to our store, ${userName}! Tap the **Menu** button at the bottom left or click below to start shopping:`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🛍️ Open Store Now",
            web_app: { url: WEB_APP_URL }
          }
        ]
      ]
    }
  });
});
