let TelegramBot = require('node-telegram-bot-api');


let token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA'; 

let bot = new TelegramBot(token, { polling: true });



let channels = [
  { name: 'Kanal 1', username: 'elektraudit_uz' },
  { name: 'Kanal 2', username: 'Ilova_vebsayt_intrnet_sayt' },
  { name: 'Kanal 3', username: 'kanal3maniki' }
];

// A'zolikni tekshirish funksiyasi
async function isUserSubscribed(userId) {
  for (let channel of channels) {
    try {
      let member = await bot.getChatMember(channel.username, userId);
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




bot.on('message', async (msg) => {
  let chatId = msg.chat.id;
  let userId = msg.from.id;

  // /start buyrug‘ini alohida ishlovchi oldin qo‘yilgan, shuni qayta ishlamaslik uchun
  if (msg.text && msg.text.startsWith('/start')) return;

  let subscribed = await isUserSubscribed(userId);

  if (!subscribed) {
    let buttons = channels.map(channel => [{
      text: `➕ ${channel.name}`,
      url: `https://t.me/${channel.username.replace('@', '')}`
    }]);

    buttons.push([{ text: "✅ Tekshirish", callback_data: "check_subscription" }]);

    let message = `❗ Iltimos, quyidagi kanallarga a’zo bo‘ling:\n\n` +
      channels.map(ch => `🔗 ${ch.username}`).join('\n') +
      `\n\n✅ A’zo bo‘lgach, "Tekshirish" tugmasini bosing.`;

    await bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: buttons
      }
    });

    return; // A’zo bo‘lmagani uchun boshqa xabarlar ishlanmaydi
  }

  // A'zolik tasdiqlangan bo‘lsa — bu yerda siz asosiy bot funksiyalarini bajarasiz
  bot.sendMessage(chatId, "😊 Sizning xabaringiz qabul qilindi. Bot sizga xizmatga tayyor.");
});

// /start buyrug‘i
bot.onText(/\/start/, async (msg) => {
  let chatId = msg.chat.id;
  let userId = msg.from.id;

  let subscribed = await isUserSubscribed(userId);

  if (!subscribed) {
    // Tugmalar yaratish
    let buttons = channels.map(channel => [{
      text: `➕ ${channel.name}`,
      url: `https://t.me/${channel.username.replace('@', '')}`
    }]);

    buttons.push([{ text: "✅ Tekshirish", callback_data: "check_subscription" }]);

    let message = `🔒 Iltimos, quyidagi kanallarga a’zo bo‘ling:\n\n` +
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

bot.on('chat_member', (msg) => {
  let status = msg.new_chat_member?.status;
  let user = msg.new_chat_member?.user;
  let chat = msg.chat;

  if (status === 'member') {
    bot.sendMessage(ADMIN_CHAT_ID, `👤 @${user.username || user.first_name} ${chat.title} guruhiga qo'shildi.`);
  }
});

// Callback tugmasini ishlovchi
bot.on('callback_query', async (query) => {
  let userId = query.from.id;
  let chatId = query.message.chat.id;

  if (query.data === "check_subscription") {
    let subscribed = await isUserSubscribed(userId);

    if (subscribed) {
      bot.sendMessage(chatId, "🎉 Ajoyib! Siz barcha kanallarga a’zo bo‘lgansiz. Botdan foydalanishingiz mumkin.");
    } else {
      bot.sendMessage(chatId, "❗ Siz hali ham ba'zi kanallarga a’zo emassiz. Iltimos, a'zo bo‘ling va qayta tekshiring.");
    }

    // Tugmalarni olib tashlash
    bot.answerCallbackQuery(query.id);
  }
});
