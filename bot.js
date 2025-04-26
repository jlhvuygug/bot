let TelegramBot = require('node-telegram-bot-api');

let token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA';
let bot = new TelegramBot(token, { polling: true });

// 🔐 O'Z TELEGRAM ID'ingizNI shu yerga yozing
let ADMIN_CHAT_ID = 123456789; // bu yerga o'zingizni ID kiriting

let channels = [
  { name: 'Kanal 1', username: 'elektraudit_uz' },
  { name: 'Kanal 2', username: 'Ilova_vebsayt_intrnet_sayt' },
  { name: 'Kanal 3', username: 'kanal3maniki' }
];



// ✅ A'zolikni tekshiruvchi funksiya
async function isUserSubscribed(userId) {
  for (let channel of channels) {
    try {
      let member = await bot.getChatMember(channel.username, userId);
      if (member.status === 'left' || member.status === 'kicked') return false;
    } catch (err) {
      console.log(`❌ ${channel.username} tekshirishda xato: ${err.message}`);
      return false;
    }
  }
  return true;
}

// 📩 Kanallarga ulanish tugmalari
function getSubscriptionButtons() {
  let buttons = channels.map(channel => [{
    text: `➕ ${channel.name}`,
    url: `https://t.me/${channel.username.replace('@', '')}`
  }]);
  buttons.push([{ text: "✅ Tekshirish", callback_data: "check_subscription" }]);
  return buttons;
}

// 🧾 Kanallar ro'yxati matni
function getChannelsListText() {
  return channels.map(ch => `🔗 https://t.me/${ch.username}`).join('\n');
}

// 📩 Har qanday xabarni olayotganda
bot.on('message', async (msg) => {
  let chatId = msg.chat.id;
  let userId = msg.from.id;

  if (msg.text && msg.text.startsWith('/start')) return;

  let subscribed = await isUserSubscribed(userId);

  if (!subscribed) {
    let message = `❗ Iltimos, quyidagi kanallarga a’zo bo‘ling:\n\n${getChannelsListText()}\n\n✅ A’zo bo‘lgach, "Tekshirish" tugmasini bosing.`;
    return bot.sendMessage(chatId, message, {
      reply_markup: { inline_keyboard: getSubscriptionButtons() }
    });
  }

  bot.sendMessage(chatId, "😊 Sizning xabaringiz qabul qilindi. Bot sizga xizmatga tayyor.");
});

// /start komandasi
bot.onText(/\/start/, async (msg) => {
  let chatId = msg.chat.id;
  let userId = msg.from.id;

  let subscribed = await isUserSubscribed(userId);

  if (!subscribed) {
    let message = `🔒 Iltimos, quyidagi kanallarga a’zo bo‘ling:\n\n${getChannelsListText()}\n\n✅ A’zo bo‘lgach, "Tekshirish" tugmasini bosing.`;
    return bot.sendMessage(chatId, message, {
      reply_markup: { inline_keyboard: getSubscriptionButtons() }
    });
  }

  bot.sendMessage(chatId, "✅ Xush kelibsiz! Siz barcha kanallarga a’zo bo‘lgansiz.");
});

// ✅ "Tekshirish" tugmasini bosganda
bot.on('callback_query', async (query) => {
  let userId = query.from.id;
  let chatId = query.message.chat.id;
  let username = query.from.username || `${query.from.first_name} ${query.from.last_name || ''}`;

  let subscribed = await isUserSubscribed(userId);

  if (subscribed) {
    bot.sendMessage(chatId, "🎉 Ajoyib! Siz barcha kanallarga a’zo bo‘lgansiz. Botdan foydalanishingiz mumkin.");

    // Adminga xabar yuborish
    bot.sendMessage(ADMIN_CHAT_ID, `✅ Yangi a’zo: @${username} (${userId})`);
  } else {
    bot.sendMessage(chatId, "❗ Siz hali ham ba'zi kanallarga a’zo emassiz. Iltimos, a'zo bo‘ling va qayta tekshiring.");
  }

  bot.answerCallbackQuery(query.id);

});

