// let TelegramBot = require('node-telegram-bot-api');

const TelegramBot = require('node-telegram-bot-api');

let token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA';
const bot = new TelegramBot(token, { polling: true });

const CHANNEL_USERNAME = '@kanal_username'; // kanal usernameni @ bilan yoz

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



// let token = '8060564822:AAGh5KAmYdXuoN2_fvidNpKjx3A33dNlJZA';
// let bot = new TelegramBot(token, { polling: true });

// // 🔐 O'Z TELEGRAM ID'ingizNI shu yerga yozing
// let ADMIN_CHAT_ID = 123456789; // bu yerga o'zingizni ID kiriting

// let channels = [
//   { name: 'Kanal 1', username: 'elektraudit_uz' },
//   { name: 'Kanal 2', username: 'Ilova_vebsayt_intrnet_sayt' },
//   { name: 'Kanal 3', username: 'kanal3maniki' }
// ];

// // ✅ A'zolikni tekshiruvchi funksiya
// async function isUserSubscribed(userId) {
//   let nonSubscribedChannels = [];
//   let usersInChannels = [];

//   for (let channel of channels) {
//     try {
//       let member = await bot.getChatMember(channel.username, userId);
//       if (member.status === 'left' || member.status === 'kicked') {
//         nonSubscribedChannels.push(channel);
//       } else {
//         let channelMembers = await bot.getChatAdministrators(channel.username);
//         let channelUsers = channelMembers.map(admin => admin.user.username || `${admin.user.first_name} ${admin.user.last_name || ''}`);
//         usersInChannels.push({ channel: channel.name, members: channelUsers });
//       }
//     } catch (err) {
//       console.log(`❌ ${channel.username} tekshirishda xato: ${err.message}`);
//       nonSubscribedChannels.push(channel);
//     }
//   }

//   return { nonSubscribedChannels, usersInChannels };
// }

// // 📩 Kanallarga ulanish tugmalari
// function getSubscriptionButtons() {
//   let buttons = channels.map(channel => [{
//     text: `➕ ${channel.name}`,
//     url: `https://t.me/${channel.username.replace('@', '')}`
//   }]);
//   buttons.push([{ text: "✅ Tekshirish", callback_data: "check_subscription" }]);
//   return buttons;
// }

// // 🧾 Kanallar ro'yxati matni
// function getChannelsListText() {
//   return channels.map(ch => `🔗 https://t.me/${ch.username}`).join('\n');
// }

// // 📩 Har qanday xabarni olayotganda
// bot.on('message', async (msg) => {
//   let chatId = msg.chat.id;
//   let userId = msg.from.id;

//   if (msg.text && msg.text.startsWith('/start')) return;

//   let { nonSubscribedChannels, usersInChannels } = await isUserSubscribed(userId);

//   if (nonSubscribedChannels.length > 0) {
//     let message = `❗ Iltimos, quyidagi kanallarga a’zo bo‘ling:\n\n${getChannelsListText()}\n\n✅ A’zo bo‘lgach, "Tekshirish" tugmasini bosing.`;
//     return bot.sendMessage(chatId, message, {
//       reply_markup: { inline_keyboard: getSubscriptionButtons() }
//     });
//   }

//   if (usersInChannels.length > 0) {
//     let message = "Siz allaqachon quyidagi kanallarga a'zo bo'lgansiz:\n";
//     usersInChannels.forEach(channelInfo => {
//       message += `\n🔹 ${channelInfo.channel} - A'zolar:\n${channelInfo.members.join(', ')}`;
//     });
//     return bot.sendMessage(chatId, message);
//   }

//   bot.sendMessage(chatId, "😊 Sizning xabaringiz qabul qilindi. Bot sizga xizmatga tayyor.");
// });

// // /start komandasi
// bot.onText(/\/start/, async (msg) => {
//   let chatId = msg.chat.id;
//   let userId = msg.from.id;

//   let { nonSubscribedChannels, usersInChannels } = await isUserSubscribed(userId);

//   if (nonSubscribedChannels.length > 0) {
//     let message = `🔒 Iltimos, quyidagi kanallarga a’zo bo‘ling:\n\n${getChannelsListText()}\n\n✅ A’zo bo‘lgach, "Tekshirish" tugmasini bosing.`;
//     return bot.sendMessage(chatId, message, {
//       reply_markup: { inline_keyboard: getSubscriptionButtons() }
//     });
//   }

//   if (usersInChannels.length > 0) {
//     let message = "Siz allaqachon quyidagi kanallarga a'zo bo'lgansiz:\n";
//     usersInChannels.forEach(channelInfo => {
//       message += `\n🔹 ${channelInfo.channel} - A'zolar:\n${channelInfo.members.join(', ')}`;
//     });
//     return bot.sendMessage(chatId, message);
//   }

//   bot.sendMessage(chatId, "✅ Xush kelibsiz! Siz barcha kanallarga a’zo bo‘lgansiz.");
// });

// // ✅ "Tekshirish" tugmasini bosganda
// bot.on('callback_query', async (query) => {
//   let userId = query.from.id;
//   let chatId = query.message.chat.id;
//   let username = query.from.username || `${query.from.first_name} ${query.from.last_name || ''}`;

//   let { nonSubscribedChannels, usersInChannels } = await isUserSubscribed(userId);

//   if (nonSubscribedChannels.length === 0) {
//     bot.sendMessage(chatId, "🎉 Ajoyib! Siz barcha kanallarga a’zo bo‘lgansiz. Botdan foydalanishingiz mumkin.");

//     // Adminga xabar yuborish
//     bot.sendMessage(ADMIN_CHAT_ID, `✅ Yangi a’zo: @${username} (${userId})`);
//   } else {
//     let message = "❗ Siz hali ham ba'zi kanallarga a’zo emassiz. Iltimos, a'zo bo‘ling va qayta tekshiring.\n\n";
//     message += getChannelsListText();
//     bot.sendMessage(chatId, message);
//   }

//   if (usersInChannels.length > 0) {
//     let message = "Siz allaqachon quyidagi kanallarga a'zo bo'lgansiz:\n";
//     usersInChannels.forEach(channelInfo => {
//       message += `\n🔹 ${channelInfo.channel} - A'zolar:\n${channelInfo.members.join(', ')}`;
//     });
//     bot.sendMessage(chatId, message);
//   }

//   bot.answerCallbackQuery(query.id);
// });
