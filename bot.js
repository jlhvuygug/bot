let TelegramBot = require('node-telegram-bot-api');


let token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA';
const bot = new TelegramBot(token, { polling: true });

const CHANNEL_USERNAME = '@elektraudit_uz'; // kanal usernameni @ bilan yoz

// /start komandasi uchun
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ Bot ishga tushdi! Endi xabar yozing.");
});

// Har qanday xabar uchun
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // /start bo'lsa - xech narsa qima
  if (msg.text.startsWith('/start')) return;

  try {
    const members = await bot.getChatAdministrators(CHANNEL_USERNAME);

    let usernames = members.map(member => {
      const user = member.user;
      if (user.username) {
        return `@${user.username}`;
      } else {
        return `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`;
      }
    });

    let text = `👥 Kanal a'zolari:\n\n${usernames.join('\n')}`;

    bot.sendMessage(chatId, text);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Xatolik yuz berdi: " + error.message);
  }
});


