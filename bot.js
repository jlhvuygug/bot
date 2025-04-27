let TelegramBot = require('node-telegram-bot-api');


let token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA';
const bot = new TelegramBot(token, { polling: true });


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;  // Botga yozgan foydalanuvchining chat ID'si
  const userId = msg.from.id;  // Foydalanuvchining ID'si

  try {
    // Kanal adminlarini olish
    const members = await bot.getChatAdministrators('@elektraudit_uz');
    
    // Adminlar ro'yxatidagi userId ni solishtirib chiqamiz
    const isInChannel = members.some(member => member.user.id === userId);

    if (isInChannel) {
      bot.sendMessage(chatId, "Siz kanalda mavjud ekansiz.");
    } else {
      bot.sendMessage(chatId, "Siz kanalda mavjud emassiz.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Xatolik yuz berdi: " + error.message);
  }
});

