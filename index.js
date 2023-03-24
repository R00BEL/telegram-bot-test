const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.from.id;

  await bot.sendMessage(chatId, "Hi! I'm bot. Can I help you?");
  await bot.sendPhoto(
    chatId,
    "https://avatars.mds.yandex.net/get-marketpic/8526285/picdfa0abde605bee8112630a9fe241bb5b/600x800"
  );
  await bot.sendMessage(
    chatId,
    "You can control me by sending these commands:"
  );
  await bot.sendMessage(chatId, "/randomquote - random anime quote");
});

bot.onText(/\/randomquote/, async (msg) => {
  const chatId = msg.from.id;

  const tempMessage = await bot.sendMessage(chatId, "Give me a moment...");

  const res = await axios.get("https://animechan.vercel.app/api/random");
  const { anime, character, quote } = res.data;

  await bot.deleteMessage(chatId, tempMessage.message_id);

  await bot.sendMessage(chatId, "Anime: " + anime);
  await bot.sendMessage(chatId, "Character: " + character);
  await bot.sendMessage(chatId, "Quote: " + quote);
});
