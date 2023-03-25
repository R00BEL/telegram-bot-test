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
    "You can control me by sending these commands:\n/randomquote - random anime quote\n/randomimage - random image from anime"
  );
});

bot.onText(/\/randomquote/, async (msg) => {
  const chatId = msg.from.id;
  const { anime, character, quote } = await getDataFromApi({
    chatId,
    url: "https://animechan.vercel.app/api/random",
  });

  await bot.sendMessage(
    chatId,
    `Anime: ${anime}\n\nCharacter: ${character}\n\nQuote: ${quote}`
  );
});

bot.onText(/\/randomimage/, async (msg) => {
  const chatId = msg.from.id;
  const {
    results: [{ url }],
  } = await getDataFromApi({
    chatId,
    url: "https://nekos.best/api/v2/neko",
  });

  await bot.sendPhoto(chatId, url);
});

const getDataFromApi = async ({ chatId, url }) => {
  const tempMessage = await bot.sendMessage(chatId, "Give me a moment...");
  const res = await axios.get(url);
  await bot.deleteMessage(chatId, tempMessage.message_id);

  return res.data;
};