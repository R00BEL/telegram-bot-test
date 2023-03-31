import { Telegraf, Context, Markup } from 'telegraf';
import axios from 'axios';
import { config } from './config.js';

const bot = new Telegraf(config.telegramToken);

bot.start(async (ctx) => {
  await ctx.reply("Hi! I'm bot. Can I help you?");
  await ctx.replyWithPhoto(
    'https://avatars.mds.yandex.net/get-marketpic/8526285/picdfa0abde605bee8112630a9fe241bb5b/600x800',
  );
  await ctx.reply(
    'You can control me by sending these button:',
    Markup.inlineKeyboard([
      Markup.button.callback('Get random quote', 'randomquote'),
      Markup.button.callback('Get random image', 'randomimage'),
    ]),
  );
});

bot.action('randomquote', async (ctx) => {
  const { anime, character, quote } = await getDataFromApi({
    ctx,
    url: 'https://animechan.vercel.app/api/random',
  });

  await ctx.sendMessage(`Anime: ${anime}\n\nCharacter: ${character}\n\nQuote: ${quote}`);
});

bot.action('randomimage', async (ctx) => {
  const {
    results: [{ url }],
  } = await getDataFromApi({
    ctx,
    url: 'https://nekos.best/api/v2/neko',
  });

  await ctx.sendPhoto(url);
});

const getDataFromApi = async ({ ctx, url }: { ctx: Context; url: string }) => {
  const tempMessage = await ctx.sendMessage('Give me a moment...');
  const res = await axios.get(url);
  await ctx.deleteMessage(tempMessage.message_id);

  return res.data;
};

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
