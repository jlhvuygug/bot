const TelegramBot = require('node-telegram-bot-api');

const token = '7744335699:AAGezftVaKh2a94NDWNzZQBzbi6vp2RyblI';
const bot = new TelegramBot(token, { polling: true });

// Kanal username'lari
const channels = [
  '@UzHamyonbop'
];

// Savollar ro'yxati
const questions = {
  'Savol 1': 'Bu 1-savolga javob.',
  'Savol 2': 'Bu 2-savolga javob.',
  'Savol 3': 'Bu 3-savolga javob.'
};

// A'zolikni tekshiruvchi funksiya
const checkMembership = async (channel, userId) => {
  try {
    const member = await bot.getChatMember(channel, userId);
    return ['member', 'administrator', 'creator'].includes(member.status);
  } catch (error) {
    return false;
  }
};

// Foydalanuvchi "tasdiqlash"ni bosganini aniqlash uchun state saqlash
const verifiedUsers = new Set();

// Xabarlar uchun listener
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // A'zolikni tekshirish
  let notJoinedChannels = [];
  for (let channel of channels) {
    const isMember = await checkMembership(channel, userId);
    if (!isMember) {
      notJoinedChannels.push(channel);
    }
  }

  // Agar hali barcha kanallarga a'zo bo'lmasa
  if (notJoinedChannels.length > 0) {
    let buttons = notJoinedChannels.map(channel => {
      return [{ text: `➕ Kanalga qo‘shilish`, url: `https://t.me/${channel.slice(1)}` }];
    });
    buttons.push([{ text: '✅ Tasdiqlash', callback_data: 'verify' }]);

    await bot.sendMessage(chatId, "❗ Iltimos, quyidagi kanallarga qo‘shiling, so‘ngra 'Tasdiqlash' tugmasini bosing:", {
      reply_markup: { inline_keyboard: buttons }
    });
  } else if (!verifiedUsers.has(userId)) {
    // Agar a'zo bo'lgan, ammo hali tasdiqlamagan bo‘lsa
    await bot.sendMessage(chatId, "✅ Endi 'Tasdiqlash' tugmasini bosing:", {
      reply_markup: {
        inline_keyboard: [[{ text: '✅ Tasdiqlash', callback_data: 'verify' }]]
      }
    });
  } else {
    // Tasdiqlagan va endi savollarni tanlashi mumkin
    const questionButtons = Object.keys(questions).map(q => [{ text: q, callback_data: `question_${q}` }]);
    await bot.sendMessage(chatId, "Savollardan birini tanlang:", {
      reply_markup: { inline_keyboard: questionButtons }
    });
  }
});

// Callback handler
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const userId = callbackQuery.from.id;

  if (data === 'verify') {
    // A'zolikni qayta tekshiramiz
    let allJoined = true;
    for (let channel of channels) {
      const isMember = await checkMembership(channel, userId);
      if (!isMember) {
        allJoined = false;
        break;
      }
    }

    if (allJoined) {
      verifiedUsers.add(userId);

      const questionButtons = Object.keys(questions).map(q => [{ text: q, callback_data: `question_${q}` }]);
      await bot.sendMessage(msg.chat.id, "✅ A'zolik tasdiqlandi. Endi savol tanlang:", {
        reply_markup: { inline_keyboard: questionButtons }
      });
    } else {
      await bot.sendMessage(msg.chat.id, "❗ Hali barcha kanallarga qo‘shilmadingiz. Iltimos, barcha kanallarga qo‘shiling.");
    }
  } else if (data.startsWith('question_')) {
    const question = data.replace('question_', '');
    const answer = questions[question] || "❓ Noma'lum savol.";
    await bot.sendMessage(msg.chat.id, `💬 ${answer}`);
  }
});
