const TelegramBot = require('telegram-bot-api');

const BOT_TOKEN = '8981731168:AAGn3S28U93TSCWAh1Gg88sVI_kJC9vOrqE';

console.log('Starting Telegram Bot...');
console.log('Bot Token:', BOT_TOKEN);

const bot = new TelegramBot({
  token: BOT_TOKEN,
  updates: {
    enabled: true
  }
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log(`Received message from ${chatId}: ${text}`);

  if (text === '/start') {
    bot.sendMessage({
      chat_id: chatId,
      text: '🎉 أهلاً بك في نظام التداول الذكي!\n\n🤖 نحن نقدم إشارات تداول احترافية مدعومة بالذكاء الاصطناعي\n\n📊 المؤشرات المستخدمة:\n• Price Action\n• Fibonacci Retracement\n• Liquidity Analysis\n• Accumulation/Distribution\n\nاستخدم /help لرؤية جميع الأوامر'
    });
  } else if (text === '/help') {
    bot.sendMessage({
      chat_id: chatId,
      text: '📚 الأوامر المتاحة:\n\n/start - بدء الاستخدام\n/help - عرض هذه المساعدة\n/signals - عرض الإشارات\n\n❓ إذا كان لديك أي استفسار، تواصل مع الدعم الفني'
    });
  } else {
    bot.sendMessage({
      chat_id: chatId,
      text: '👋 أهلاً بك! استخدم /start للبدء'
    });
  }
});

console.log('Bot is running! Send /start to test it.');
console.log('Press Ctrl+C to stop.');

process.on('SIGINT', () => {
  console.log('\nBot stopped.');
  process.exit(0);
});
