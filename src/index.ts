import { Telegraf, Context, Markup } from 'telegraf';
import axios from 'axios';
import { config } from './config.js';

const bot = new Telegraf(config.telegramToken);

bot.start(async (ctx) => {
  await ctx.reply("Hi! I'm bot. Can I help you?");
  await ctx.replyWithPhoto(
    'https://avatars.mds.yandex.net/get-marketpic/8526285/picdfa0abde605bee8112630a9fe241bb5b/600x800',
  );
  await sendCommandList(ctx, 'You can control me by sending these button:');
});

bot.action('randomquote', async (ctx) => {
  const { anime, character, quote } = await getDataFromApi({
    ctx,
    url: 'https://animechan.vercel.app/api/random',
  });

  await ctx.sendMessage(`Anime: ${anime}\n\nCharacter: ${character}\n\nQuote: ${quote}`);
  await sendCommandList(ctx);
});

bot.action('randomimage', async (ctx) => {
  const {
    results: [{ url }],
  } = await getDataFromApi({
    ctx,
    url: 'https://nekos.best/api/v2/neko',
  });

  await ctx.sendPhoto(url);
  await sendCommandList(ctx);
});

const getDataFromApi = async ({ ctx, url }: { ctx: Context; url: string }) => {
  const tempMessage = await ctx.sendMessage('Give me a moment...');
  const res = await axios.get(url);
  await ctx.deleteMessage(tempMessage.message_id);

  return res.data;
};

const sendCommandList = async (ctx: Context, text?: string) => {
  await ctx.reply(
    text ?? 'I can:',
    Markup.inlineKeyboard(
      [
        Markup.button.callback('Get random quote', 'randomquote'),
        Markup.button.callback('Get random image', 'randomimage'),
      ],
      { columns: 1 },
    ),
  );
};

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
