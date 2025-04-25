const TelegramBot = require('node-telegram-bot-api');


const token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA'; 

const bot = new TelegramBot(token, { polling: true });



const channels = [
  { name: 'Kanal 1', username: 'elektraudit_uz' },
  { name: 'Kanal 2', username: 'Ilova_vebsayt_intrnet_sayt' },
  { name: 'Kanal 3', username: 'kanal3maniki' }
];

// A'zolikni tekshirish funksiyasi
async function isUserSubscribed(userId) {
  for (const channel of channels) {
    try {
      const member = await bot.getChatMember(channel.username, userId);
      if (member.status === 'left' || member.status === 'kicked') {
        return false;
      }
    } catch (error) {
      console.log(`Error in ${channel.username}:`, error.message);
      return false;
    }
  }
  return true;
}

// /start buyrug‘i
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const subscribed = await isUserSubscribed(userId);

  if (!subscribed) {
    // Tugmalar yaratish
    const buttons = channels.map(channel => [{
      text: `➕ ${channel.name}`,
      url: `https://t.me/${channel.username.replace('@', '')}`
    }]);

    buttons.push([{ text: "✅ Tekshirish", callback_data: "check_subscription" }]);

    const message = `🔒 Iltimos, quyidagi kanallarga a’zo bo‘ling:\n\n` +
      channels.map(ch => `🔗 ${ch.username}`).join('\n') +
      `\n\n✅ A’zo bo‘lgach, pastdagi "Tekshirish" tugmasini bosing.`;

    await bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  } else {
    bot.sendMessage(chatId, "✅ Xush kelibsiz! Siz barcha kanallarga a’zo bo‘lgansiz.");
  }
});

// Callback tugmasini ishlovchi
bot.on('callback_query', async (query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  if (query.data === "check_subscription") {
    const subscribed = await isUserSubscribed(userId);

    if (subscribed) {
      bot.sendMessage(chatId, "🎉 Ajoyib! Siz barcha kanallarga a’zo bo‘lgansiz. Botdan foydalanishingiz mumkin.");
    } else {
      bot.sendMessage(chatId, "❗ Siz hali ham ba'zi kanallarga a’zo emassiz. Iltimos, a'zo bo‘ling va qayta tekshiring.");
    }

    // Tugmalarni olib tashlash
    bot.answerCallbackQuery(query.id);
  }
});
