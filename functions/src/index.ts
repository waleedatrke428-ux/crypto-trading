import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TelegramBotService } from './telegram/bot';
import { TradingAI } from './trading/ai-algorithm';
import { DashboardAPI } from './admin/dashboard-api';
import { PerformanceTracker } from './trading/performance-tracker';

admin.initializeApp();

// Initialize services
const tradingAI = new TradingAI();
const dashboardAPI = new DashboardAPI();
const performanceTracker = new PerformanceTracker();

// Initialize Telegram Bot automatically with token from env or config
const telegramBot = new TelegramBotService();

// Cloud Function: Generate trading signals for a specific pair
export const generateSignal = functions.https.onRequest(async (req, res) => {
  try {
    const { pair, type, timeframe, data } = req.body;

    if (!pair || !type || !data) {
      res.status(400).json({ error: 'Missing required parameters: pair, type, data' });
      return;
    }

    // Use provided data (from client or external source)
    const indicatorInput = data;
    const currentPrice = data.close[data.close.length - 1];

    // Generate signal using AI
    const signal = await tradingAI.generateSignal(
      pair,
      type,
      indicatorInput,
      currentPrice,
      timeframe
    );

    // Save signal to database
    const signalRef = await admin.firestore().collection('signals').add({
      ...signal,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Track signal performance
    await performanceTracker.trackSignal({
      id: signalRef.id,
      ...signal
    });

    // Broadcast to Telegram subscribers
    if (telegramBot) {
      await telegramBot.broadcastSignal(signal);
    }

    res.json({ success: true, signal, signalId: signalRef.id });
  } catch (error) {
    console.error('Error generating signal:', error);
    res.status(500).json({ error: 'Failed to generate signal' });
  }
});

// Cloud Function: Scheduled signal generation (disabled - requires external data)
// Note: This function is disabled as we no longer use Binance API
// Data should be provided by external data providers or client applications
export const scheduledSignalGeneration = functions.pubsub
  .schedule('every 30 minutes')
  .onRun(async (context) => {
    console.log('Scheduled signal generation is disabled. Please provide data via generateSignal API.');
    return null;
  });

// Cloud Function: Dashboard API - Get Stats
export const apiGetStats = functions.https.onRequest((req, res) => {
  dashboardAPI.getStats(req, res);
});

// Cloud Function: Dashboard API - Get Users
export const apiGetUsers = functions.https.onRequest((req, res) => {
  dashboardAPI.getUsers(req, res);
});

// Cloud Function: Dashboard API - Get User
export const apiGetUser = functions.https.onRequest((req, res) => {
  dashboardAPI.getUser(req, res);
});

// Cloud Function: Dashboard API - Update User Subscription
export const apiUpdateUserSubscription = functions.https.onRequest((req, res) => {
  dashboardAPI.updateUserSubscription(req, res);
});

// Cloud Function: Dashboard API - Get Signals
export const apiGetSignals = functions.https.onRequest((req, res) => {
  dashboardAPI.getSignals(req, res);
});

// Cloud Function: Dashboard API - Get Plans
export const apiGetPlans = functions.https.onRequest((req, res) => {
  dashboardAPI.getPlans(req, res);
});

// Cloud Function: Dashboard API - Save Plan
export const apiSavePlan = functions.https.onRequest((req, res) => {
  dashboardAPI.savePlan(req, res);
});

// Cloud Function: Dashboard API - Delete Plan
export const apiDeletePlan = functions.https.onRequest((req, res) => {
  dashboardAPI.deletePlan(req, res);
});

// Cloud Function: Dashboard API - Get Revenue
export const apiGetRevenue = functions.https.onRequest((req, res) => {
  dashboardAPI.getRevenue(req, res);
});

// Cloud Function: Get Performance Stats
export const apiGetPerformanceStats = functions.https.onRequest(async (req, res) => {
  try {
    const stats = await performanceTracker.getOverallStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting performance stats:', error);
    res.status(500).json({ error: 'Failed to get performance stats' });
  }
});

// Cloud Function: Get Performance by Pair
export const apiGetPerformanceByPair = functions.https.onRequest(async (req, res) => {
  try {
    const { pair } = req.query;
    if (!pair) {
      res.status(400).json({ error: 'Pair is required' });
      return;
    }
    const stats = await performanceTracker.getPerformanceByPair(pair as string);
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting performance by pair:', error);
    res.status(500).json({ error: 'Failed to get performance by pair' });
  }
});

// Cloud Function: Get Performance History
export const apiGetPerformanceHistory = functions.https.onRequest(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const history = await performanceTracker.getRecentHistory(limit);
    res.json({ success: true, history });
  } catch (error) {
    console.error('Error getting performance history:', error);
    res.status(500).json({ error: 'Failed to get performance history' });
  }
});

// Cloud Function: Confirm Manual Payment (Admin)
export const apiConfirmManualPayment = functions.https.onRequest((req, res) => {
  dashboardAPI.confirmManualPayment(req, res);
});

// Cloud Function: Get Pending Payments (Admin)
export const apiGetPendingPayments = functions.https.onRequest((req, res) => {
  dashboardAPI.getPendingPayments(req, res);
});

// Cloud Function: Get All Manual Payments (Admin)
export const apiGetAllManualPayments = functions.https.onRequest((req, res) => {
  dashboardAPI.getAllManualPayments(req, res);
});

// Cloud Function: User creation trigger
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  await admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    subscription: {
      planId: 'free',
      status: 'active',
      signalsUsedToday: 0
    }
  });
});

// Cloud Function: Stripe webhook (for payments)
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const event = req.body;

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.metadata.userId;
        const planId = session.metadata.planId;

        if (userId && planId) {
          const planManager = new (await import('./subscriptions/plan-manager')).PlanManager();
          await planManager.updateUserSubscription(userId, planId, session.subscription);
        }
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const userIdToDelete = subscription.metadata.userId;

        if (userIdToDelete) {
          const planManager = new (await import('./subscriptions/plan-manager')).PlanManager();
          await planManager.cancelSubscription(userIdToDelete);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});
