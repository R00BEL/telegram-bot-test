import { Scenes, Telegraf } from "telegraf";
import axios from "axios";
import scenarioTypeScene from "./controler/start/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const stage = new Scenes.Stage([scenarioTypeScene]);
bot.use(stage.middleware());

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

bot.hears("hi", (ctx) => ctx.stage.enter("CONTACT_DATA_WIZARD_SCENE_ID"));
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
