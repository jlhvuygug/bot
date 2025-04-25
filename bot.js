const TelegramBot = require('node-telegram-bot-api');

// TO‘LIQ tokenni shu yerga yozing:
const token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA'; // bu faqat misol!

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;


  bot.sendMessage(chatId, `Salom, siz manga shunday yozdingiz: ${text}`);
});
