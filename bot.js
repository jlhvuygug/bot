let TelegramBot = require('node-telegram-bot-api');

const token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA';
const bot = new TelegramBot(token, { polling: true });

// Kanal username'lari
const channels = [
  '@elektraudit_uz', 
  '@Ilova_vebsayt_intrnet_sayt'
];

// Kinolar turgan kanal username'i
const mainChannel = '@kanal3maniki';  // ❗ o'zingning kinolar turgan kanal username'ini yoz

// A'zolikni tekshiruvchi funksiya
const checkMembership = async (channel, userId) => {
  try {
    const member = await bot.getChatMember(channel, userId);
    return member.status === 'member' || member.status === 'administrator' || member.status === 'creator';
  } catch (error) {
    return false;  // Agar tekshiruvda xatolik bo'lsa, a'zo emas deb hisoblaymiz
  }
};

// Message kelganda ishlovchi funksiya
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  try {
    // 1. Foydalanuvchini kanallarga a'zolik tekshirish
    let notJoinedChannels = [];
    for (let channel of channels) {
      const isMember = await checkMembership(channel, userId);
      if (!isMember) {
        notJoinedChannels.push(channel);
      }
    }

    // 2. Agar barcha kanallarga a'zo bo'lsa
    if (notJoinedChannels.length === 0) {
      // Foydalanuvchi kino kodi yubordimi?
      if (!isNaN(text)) {
        try {
          // Agar text raqam bo'lsa (ya'ni xabar ID)
          await bot.copyMessage(chatId, mainChannel, text);
        } catch (err) {
          console.error(err);
          bot.sendMessage(chatId, "❌ Kino topilmadi yoki xatolik yuz berdi.");
        }
      } else {
        // Agar boshqa text yozsa
        bot.sendMessage(chatId, "✅ Siz kanallarga a'zo bo'lgansiz. Kino kodi yuboring (masalan: 5)!");
      }
    } 
    // 3. Agar hali barcha kanallarga a'zo bo'lmagan bo'lsa
    else {
      let buttons = notJoinedChannels.map(channel => {
        return [{ text: `➕ Kanalga qo‘shilish`, url: `https://t.me/${channel.slice(1)}` }];
      });

      const replyMarkup = {
        inline_keyboard: buttons
      };

      await bot.sendMessage(chatId, "❗ Avval quyidagi kanallarga qo‘shiling:", { reply_markup: replyMarkup });
    }

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Xatolik yuz berdi: " + error.message);
  }
});

