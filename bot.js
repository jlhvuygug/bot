let TelegramBot = require('node-telegram-bot-api');

let token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA';
const bot = new TelegramBot(token, { polling: true });

// Kanal username'lari
const channels = [
  '@elektraudit_uz',  // Kanal 1
  '@Ilova_vebsayt_intrnet_sayt',  // Kanal 2
  '@kanal3maniki'   // Kanal 3
];

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;  // Botga yozgan foydalanuvchining chat ID'si
  const userId = msg.from.id;  // Foydalanuvchining ID'si

  try {
    // Kanalga a'zo bo'lishini tekshiruvchi funksiya
    const checkMembership = async (channel) => {
      try {
        const member = await bot.getChatMember(channel, userId);
        return member.status === 'member' || member.status === 'administrator' || member.status === 'creator';
      } catch (error) {
        return false;  // Agar kanalga ulanishda xatolik yuzaga kelsa, a'zo emas deb hisoblanadi
      }
    };

    // A'zo bo'lgan kanallarni tekshirish
    let notJoinedChannels = [];
    for (let channel of channels) {
      const isMember = await checkMembership(channel);
      if (!isMember) {
        notJoinedChannels.push(channel);
      }
    }

    // Agar foydalanuvchi barcha kanallarga a'zo bo'lsa
    if (notJoinedChannels.length === 0) {
      bot.sendMessage(chatId, "Siz barcha kanallarga a'zo bo'ldingiz!");
    } else {
      // Qaysi kanallarga a'zo bo'lmaganligini yuborish
      let buttons = [];
      notJoinedChannels.forEach(channel => {
        // Kanalga havola tugmasi yaratish
        buttons.push([{ text: `Qo'shiling: ${channel}`, url: `https://t.me/${channel.slice(1)}` }]);
      });

      // Kanallarni button shaklida yuborish
      const replyMarkup = {
        keyboard: buttons,
        one_time_keyboard: true,
        resize_keyboard: true
      };

      bot.sendMessage(chatId, "Siz quyidagi kanallarga qo'shilishingiz kerak:", { reply_markup: replyMarkup });
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Xatolik yuz berdi: " + error.message);
  }
});
