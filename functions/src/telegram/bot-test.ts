import { TelegramBotService } from './bot';

// Simple test to verify bot is working
async function testBot() {
  console.log('Starting Telegram Bot test...');

  const bot = new TelegramBotService();
  console.log('Bot initialized successfully!');

  console.log('Bot token:', process.env.TELEGRAM_BOT_TOKEN || '8981731168:AAGn3S28U93TSCWAh1Gg88sVI_kJC9vOrqE');

  console.log('Please send /start to the bot on Telegram to test it.');
  console.log('Bot should respond with welcome message.');

  // Keep the process running
  process.on('SIGINT', () => {
    console.log('Bot test stopped.');
    process.exit(0);
  });
}

testBot().catch(console.error);
