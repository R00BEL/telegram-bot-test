const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply("Hi! I'm bot. Can I help you?");
  await ctx.replyWithPhoto(
    "https://avatars.mds.yandex.net/get-marketpic/8526285/picdfa0abde605bee8112630a9fe241bb5b/600x800"
  );
  await ctx.reply(
    "You can control me by sending these commands:\n/randomquote - random anime quote\n/randomimage - random image from anime"
  );
});

bot.command("randomquote", async (ctx) => {
  const { anime, character, quote } = await getDataFromApi({
    ctx,
    url: "https://animechan.vercel.app/api/random",
  });

  await ctx.sendMessage(
    `Anime: ${anime}\n\nCharacter: ${character}\n\nQuote: ${quote}`
  );
});

bot.command("randomimage", async (ctx) => {
  const {
    results: [{ url }],
  } = await getDataFromApi({
    ctx,
    url: "https://nekos.best/api/v2/neko",
  });

  await ctx.sendPhoto(url);
});

const getDataFromApi = async ({ ctx, url }) => {
  const tempMessage = await ctx.sendMessage("Give me a moment...");
  const res = await axios.get(url);
  await ctx.deleteMessage(tempMessage.message_id);

  return res.data;
};

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
