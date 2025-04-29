const TelegramBot = require('node-telegram-bot-api');

const token = '7744335699:AAGezftVaKh2a94NDWNzZQBzbi6vp2RyblI';
const bot = new TelegramBot(token, { polling: true });

const adminId = 123456789; // 👉 Bu yerga o'zingizning Telegram ID'ingizni yozing

// Kanal username'lari
const channels = ['@UzHamyonbop'];

// Savollar ro'yxati
const questions = {
  "Qanday qilib savdoga qo'shilish mumkun": 'Quydagi saytda batafsil malumot olasiz',
  "Qanday mablag'ni yechib olish mumkun": "Saytda pulni naxtlash qismida Istalgan bank kartasiga to'lovni amalga oshirish mumkun",
  "Savdodagi darajani qanday oshirish mumkun": "Sayt orqali ariza topshirish yo'li bilan"
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

const verifiedUsers = new Set();
const awaitingSuggestions = new Set();

// Message handler
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  // Agar foydalanuvchi taklif yuborayotgan bo‘lsa
  if (awaitingSuggestions.has(userId)) {
    awaitingSuggestions.delete(userId);
    bot.sendMessage(adminId, `📩 Yangi taklif:\n\n👤 ${msg.from.first_name} (@${msg.from.username || 'yo‘q'})\n📝 ${text}`);
    bot.sendMessage(chatId, `✅ Taklifingiz muvaffaqiyatli yuborildi! Rahmat.  ${userId}`);
    return;
  }

  // A'zolikni tekshirish
  let notJoinedChannels = [];
  for (let channel of channels) {
    const isMember = await checkMembership(channel, userId);
    if (!isMember) {
      notJoinedChannels.push(channel);
    }
  }

  if (notJoinedChannels.length > 0) {
    const buttons = notJoinedChannels.map(channel => {
      return [{ text: `➕ ${channel} ga qo‘shilish`, url: `https://t.me/${channel.slice(1)}` }];
    });

    buttons.push([{ text: '✅ Tasdiqlash', callback_data: 'verify' }]);

    await bot.sendMessage(chatId, "📢 Iltimos, quyidagi kanallarga a'zo bo‘ling, so‘ng 'Tasdiqlash' tugmasini bosing:", {
      reply_markup: { inline_keyboard: buttons }
    });
  } else if (!verifiedUsers.has(userId)) {
    await bot.sendMessage(chatId, "✅ Endi 'Tasdiqlash' tugmasini bosing:", {
      reply_markup: {
        inline_keyboard: [[{ text: '✅ Tasdiqlash', callback_data: 'verify' }]]
      }
    });
  } else {
    const questionButtons = Object.keys(questions).map(q => [{ text: q, callback_data: `question_${q}` }]);
    questionButtons.push([{ text: "💬 Talab va takliflar", callback_data: "suggest" }]);

    await bot.sendMessage(chatId, "Quyidagilardan birini tanlang:", {
      reply_markup: { inline_keyboard: questionButtons }
    });
  }
});

// ... yuqoridagi kod o'zgarmagan holda davom etadi

// // Message handler
// bot.on('message', async (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;
//   const text = msg.text;

//   // Agar foydalanuvchi taklif yuborayotgan bo‘lsa
//   if (awaitingSuggestions.has(userId)) {
//     awaitingSuggestions.delete(userId);

//     const replyText = `📩 Sizning taklifingiz:\n\n🆔 ID: ${userId}\n📝 Matn: ${text}`;
//     bot.sendMessage(chatId, replyText);

//     return;
//   }

//   // A'zolik tekshiruv va savollar qismini shu yerda davom ettirasiz
//   // ...
// });


// Callback handler
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const userId = callbackQuery.from.id;

  if (data === 'verify') {
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
      questionButtons.push([{ text: "💬 Talab va takliflar", callback_data: "suggest" }]);

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
  } else if (data === 'suggest') {
    awaitingSuggestions.add(userId);
    await bot.sendMessage(msg.chat.id, "📩 Taklif yoki fikringizni yozib yuboring:");
  }
});
