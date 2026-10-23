import TelegramBot from 'telegram-bot-api';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AISignal } from '../trading/ai-algorithm';
import { ContentFilter } from './content-filter';

export class TelegramBotService {
  private bot: TelegramBot;
  private contentFilter: ContentFilter;
  private db: admin.firestore.Firestore;

  constructor(token?: string) {
    // قراءة التوكن من متعددة المصادر
    const botToken = token ||
                      process.env.TELEGRAM_BOT_TOKEN ||
                      functions.config().telegram?.token ||
                      '8981731168:AAGn3S28U93TSCWAh1Gg88sVI_kJC9vOrqE'; // التوكن المقدم

    this.bot = new TelegramBot({
      token: botToken,
      updates: {
        enabled: true
      }
    });

    this.contentFilter = new ContentFilter();
    this.db = admin.firestore();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.bot.on('message', async (message: any) => {
      await this.handleMessage(message);
    });

    this.bot.on('callback_query', async (query: any) => {
      await this.handleCallbackQuery(query);
    });
  }

  private async handleMessage(message: any): Promise<void> {
    const chatId = message.chat.id;
    const text = message.text;

    if (!text) return;

    // Content filtering
    if (!this.contentFilter.isContentAllowed(text)) {
      await this.sendMessage(chatId, '⚠️ المحتوى غير مسموح. يرجى الالتزام بقواعد الاستخدام.');
      return;
    }

    // Handle commands
    if (text.startsWith('/')) {
      await this.handleCommand(chatId, text);
    } else {
      await this.sendMessage(chatId, '👋 أهلاً بك! استخدم /start للبدء');
    }
  }

  private async handleCommand(chatId: number, command: string): Promise<void> {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();

    switch (cmd) {
      case '/start':
        await this.handleStart(chatId);
        break;
      case '/help':
        await this.handleHelp(chatId);
        break;
      case '/subscribe':
        await this.handleSubscribe(chatId);
        break;
      case '/signals':
        await this.handleSignals(chatId);
        break;
      case '/portfolio':
        await this.handlePortfolio(chatId);
        break;
      case '/premium':
        await this.handlePremium(chatId);
        break;
      default:
        await this.sendMessage(chatId, '❌ الأمر غير معروف. استخدم /help للمساعدة');
    }
  }

  private async handleStart(chatId: number): Promise<void> {
    const welcomeMessage = `
🎉 أهلاً بك في نظام التداول الذكي!

🤖 نحن نقدم إشارات تداول احترافية مدعومة بالذكاء الاصطناعي

📊 المؤشرات المستخدمة:
• MACD
• RSI
• Fibonacci
• Ichimoku Cloud
• VWAP

📱 الاشتراكات:
• مجاني: 3 إشارات يومية
• أساسي: 10 إشارات يومية
• احترافي: إشارات غير محدودة

استخدم /help لرؤية جميع الأوامر
    `;

    await this.sendMessage(chatId, welcomeMessage);

    // Save user to database
    await this.db.collection('telegram_users').doc(chatId.toString()).set({
      chatId,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
      subscription: 'free'
    }, { merge: true });
  }

  private async handleHelp(chatId: number): Promise<void> {
    const helpMessage = `
📚 الأوامر المتاحة:

/start - بدء استخدام البوت
/help - عرض هذه المساعدة
/subscribe - الاشتراك في الخدمة
/signals - عرض الإشارات الحالية
/portfolio - عرض محفظتك
/premium - معلومات الاشتراكات المدفوعة

❓ إذا كان لديك أي استفسار، تواصل مع الدعم الفني
    `;

    await this.sendMessage(chatId, helpMessage);
  }

  private async handleSubscribe(chatId: number): Promise<void> {
    const subscribeMessage = `
💰 خطط الاشتراك:

🆓 المجاني:
• 3 إشارات يومية
• شارتات محدودة
• إشعارات عادية

⭐ الأساسي ($29/شهر):
• 10 إشارات يومية
• شارتات غير محدودة
• إشعارات فورية
• تحليلات متقدمة

👑 الاحترافي ($99/شهر):
• إشارات غير محدودة
• شارتات VIP
• تحليلات AI مخصصة
• دعم فني مخصص
• إشعارات أولوية

للاشتراك، قم بزيارة موقعنا: [رابط الموقع]
    `;

    await this.sendMessage(chatId, subscribeMessage);
  }

  private async handleSignals(chatId: number): Promise<void> {
    // Get user subscription
    const userDoc = await this.db.collection('telegram_users').doc(chatId.toString()).get();
    const userData = userDoc.data();

    if (!userData) {
      await this.sendMessage(chatId, '❌ يرجى استخدام /start أولاً');
      return;
    }

    // Get latest signals based on subscription
    const signalsQuery = await this.db.collection('signals')
      .orderBy('timestamp', 'desc')
      .limit(userData.subscription === 'free' ? 3 : 10)
      .get();

    if (signalsQuery.empty) {
      await this.sendMessage(chatId, '📊 لا توجد إشارات حالياً');
      return;
    }

    let message = '📈 الإشارات الحالية:\n\n';

    signalsQuery.forEach(doc => {
      const signal = doc.data();
      message += this.formatSignal(signal);
    });

    await this.sendMessage(chatId, message);
  }

  private async handlePortfolio(chatId: number): Promise<void> {
    await this.sendMessage(chatId, '📊 هذه الميزة قيد التطوير. قريباً!');
  }

  private async handlePremium(chatId: number): Promise<void> {
    await this.handleSubscribe(chatId);
  }

  private async handleCallbackQuery(query: any): Promise<void> {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Handle button clicks
    if (data === 'subscribe_basic') {
      await this.sendMessage(chatId, '⭐ سيتم توجيهك لصفحة الدفع...');
    } else if (data === 'subscribe_premium') {
      await this.sendMessage(chatId, '👑 سيتم توجيهك لصفحة الدفع...');
    }

    // Answer callback query
    await this.bot.answerCallbackQuery(query.id);
  }

  // Send signal to user
  async sendSignal(chatId: number, signal: AISignal): Promise<void> {
    const message = this.formatSignal(signal);
    await this.sendMessage(chatId, message);
  }

  // Broadcast signal to all subscribers
  async broadcastSignal(signal: AISignal): Promise<void> {
    const usersSnapshot = await this.db.collection('telegram_users').get();

    const message = this.formatSignal(signal);

    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const chatId = parseInt(doc.id);

      // Check if user is subscribed
      if (userData.subscription !== 'free' || userData.freeSignalsUsed < 3) {
        await this.sendMessage(chatId, message);

        // Update free signals count
        if (userData.subscription === 'free') {
          await this.db.collection('telegram_users').doc(doc.id).update({
            freeSignalsUsed: admin.firestore.FieldValue.increment(1)
          });
        }
      }
    }
  }

  private formatSignal(signal: any): string {
    const emoji = signal.signal === 'BUY' ? '🟢' : signal.signal === 'SELL' ? '🔴' : '⚪';
    const type = signal.type === 'SPOT' ? '📊' : '🔮';

    return `
${emoji} ${type} ${signal.pair}

💰 سعر الدخول: $${signal.entryPrice.toFixed(2)}
🎯 الهدف: $${signal.takeProfit.toFixed(2)}
🛑 وقف الخسارة: $${signal.takeProfit.toFixed(2)}

⏱️ الإطار الزمني: ${signal.timeframe}
📊 الثقة: ${(signal.confidence * 100).toFixed(1)}%
🤖 احتمالية AI: ${(signal.aiProbability * 100).toFixed(1)}%

⏰ ${new Date(signal.timestamp).toLocaleString('ar-SA')}
─────────────────
    `;
  }

  private async sendMessage(chatId: number, text: string): Promise<void> {
    try {
      await this.bot.sendMessage({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
