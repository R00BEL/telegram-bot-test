const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  await bot.sendMessage(chatId, resp);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, "Received your message");
});
