let TelegramBot = require('node-telegram-bot-api');


let token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA';
const bot = new TelegramBot(token, { polling: true });


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;  // Botga yozgan foydalanuvchining chat ID'si
  const userId = msg.from.id;  // Foydalanuvchining ID'si

  try {
    // Foydalanuvchi haqida ma'lumot olish (kanalda bormi yoki yo'qmi)
    const member = await bot.getChatMember('@elektraudit_uz', userId);
    
    if (member.status === 'member' || member.status === 'administrator' || member.status === 'creator') {
      bot.sendMessage(chatId, "Siz kanalda mavjud ekansiz.");
    } else {
      bot.sendMessage(chatId, "Siz kanalda mavjud emassiz.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Xatolik yuz berdi: " + error.message);
  }
});



