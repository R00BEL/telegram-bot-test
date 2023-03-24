const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(msg.from.id, "Hi! I'm bot. Can I help you?");
  await bot.sendPhoto(
    msg.from.id,
    "https://avatars.mds.yandex.net/get-marketpic/8526285/picdfa0abde605bee8112630a9fe241bb5b/600x800"
  );
});
