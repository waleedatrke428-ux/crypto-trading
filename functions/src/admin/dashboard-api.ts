import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import { PlanManager } from '../subscriptions/plan-manager';

const corsHandler = cors({ origin: true });

export class DashboardAPI {
  private db: admin.firestore.Firestore;
  private planManager: PlanManager;

  constructor() {
    this.db = admin.firestore();
    this.planManager = new PlanManager();
  }

  // Get dashboard statistics
  async getStats(req: functions.https.Request, res: functions.Response): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        // Get total users
        const usersSnapshot = await this.db.collection('users').get();
        const totalUsers = usersSnapshot.size;

        // Get active subscriptions
        const activeSubsSnapshot = await this.db
          .collection('users')
          .where('subscription.status', '==', 'active')
          .get();
        const activeSubscriptions = activeSubsSnapshot.size;

        // Get signals sent today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const signalsSnapshot = await this.db
          .collection('signals')
          .where('timestamp', '>=', today)
          .get();
        const signalsToday = signalsSnapshot.size;

        // Get revenue this month
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const paymentsSnapshot = await this.db
          .collection('payments')
          .where('timestamp', '>=', thisMonth)
          .get();
        const revenue = paymentsSnapshot.docs.reduce((sum, doc) => {
          return sum + (doc.data().amount || 0);
        }, 0);

        res.json({
          totalUsers,
          activeSubscriptions,
          signalsToday,
          revenue,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
      }
    });
  }

  // Get all users
  async getUsers(req: functions.https.Request, res: functions.Response): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const limit = parseInt(req.query.limit as string) || 50;
        const usersSnapshot = await this.db
          .collection('users')
          .limit(limit)
          .get();

        const users = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        res.json({ users });
      } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Failed to get users' });
      }
    });
  }

  // Get user details
  async getUser(req: functions.https.Request, res: functions.Response): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const userId = req.params.id;
        const userDoc = await this.db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        res.json({ user: userDoc.data() });
      } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Failed to get user' });
      }
    });
  }

  // Update user subscription
  async updateUserSubscription(
    req: functions.https.Request,
    res: functions.Response
  ): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const userId = req.params.id;
        const { planId } = req.body;

        await this.planManager.updateUserSubscription(userId, planId);

        res.json({ success: true });
      } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Failed to update subscription' });
      }
    });
  }

  // Get all signals
  async getSignals(req: functions.https.Request, res: functions.Response): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const limit = parseInt(req.query.limit as string) || 100;
        const signalsSnapshot = await this.db
          .collection('signals')
          .orderBy('timestamp', 'desc')
          .limit(limit)
          .get();

        const signals = signalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        res.json({ signals });
      } catch (error) {
        console.error('Error getting signals:', error);
        res.status(500).json({ error: 'Failed to get signals' });
      }
    });
  }

  // Get subscription plans
  async getPlans(req: functions.https.Request, res: functions.Response): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const plans = await this.planManager.getPlans();
        res.json({ plans });
      } catch (error) {
        console.error('Error getting plans:', error);
        res.status(500).json({ error: 'Failed to get plans' });
      }
    });
  }

  // Create or update plan
  async savePlan(req: functions.https.Request, res: functions.Response): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const plan = req.body;
        const planId = plan.id || `plan_${Date.now()}`;

        await this.db.collection('subscription_plans').doc(planId).set(plan);

        res.json({ success: true, planId });
      } catch (error) {
        console.error('Error saving plan:', error);
        res.status(500).json({ error: 'Failed to save plan' });
      }
    });
  }

  // Delete plan
  async deletePlan(req: functions.https.Request, res: functions.Response): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const planId = req.params.id;

        // Prevent deleting default plans
        if (['free', 'basic', 'premium'].includes(planId)) {
          res.status(400).json({ error: 'Cannot delete default plans' });
          return;
        }

        await this.db.collection('subscription_plans').doc(planId).delete();

        res.json({ success: true });
      } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({ error: 'Failed to delete plan' });
      }
    });
  }

  // Get revenue data
  async getRevenue(req: functions.https.Request, res: functions.Response): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const days = parseInt(req.query.days as string) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const paymentsSnapshot = await this.db
          .collection('payments')
          .where('timestamp', '>=', startDate)
          .orderBy('timestamp', 'asc')
          .get();

        const revenueData: { date: string; amount: number }[] = [];

        paymentsSnapshot.forEach(doc => {
          const payment = doc.data();
          const date = new Date(payment.timestamp.toDate()).toDateString();
          revenueData.push({
            date,
            amount: payment.amount || 0
          });
        });

        res.json({ revenueData });
      } catch (error) {
        console.error('Error getting revenue:', error);
        res.status(500).json({ error: 'Failed to get revenue' });
      }
    });
  }

  // Confirm payment manually (Admin feature)
  async confirmManualPayment(
    req: functions.https.Request,
    res: functions.Response
  ): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const { userId, planId, amount, currency, notes } = req.body;

        if (!userId || !planId) {
          res.status(400).json({ error: 'userId and planId are required' });
          return;
        }

        // Validate plan exists
        const planDoc = await this.db.collection('subscription_plans').doc(planId).get();
        if (!planDoc.exists) {
          res.status(404).json({ error: 'Plan not found' });
          return;
        }

        const plan = planDoc.data();

        // Create payment record
        const paymentRef = await this.db.collection('payments').add({
          userId,
          planId,
          amount: amount || plan.price,
          currency: currency || plan.currency,
          status: 'completed',
          paymentMethod: 'manual',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          notes: notes || 'Manual payment confirmed by admin',
          metadata: {
            planName: plan.name,
            planPrice: plan.price,
            confirmedBy: req.headers['x-admin-id'] || 'admin',
          }
        });

        // Update user subscription
        await this.planManager.updateUserSubscription(userId, planId);

        // Log the action
        await this.db.collection('system_logs').add({
          level: 'info',
          message: `Manual payment confirmed for user ${userId} to plan ${planId}`,
          source: 'admin',
          userId,
          metadata: {
            paymentId: paymentRef.id,
            planId,
            amount,
            notes
          },
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
          success: true,
          paymentId: paymentRef.id,
          message: 'Payment confirmed and subscription activated'
        });
      } catch (error) {
        console.error('Error confirming manual payment:', error);
        res.status(500).json({ error: 'Failed to confirm payment' });
      }
    });
  }

  // Get pending manual payments
  async getPendingPayments(
    req: functions.https.Request,
    res: functions.Response
  ): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const paymentsSnapshot = await this.db
          .collection('payments')
          .where('paymentMethod', '==', 'manual')
          .where('status', '==', 'pending')
          .orderBy('timestamp', 'desc')
          .get();

        const payments = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        res.json({ payments });
      } catch (error) {
        console.error('Error getting pending payments:', error);
        res.status(500).json({ error: 'Failed to get pending payments' });
      }
    });
  }

  // Get all manual payments
  async getAllManualPayments(
    req: functions.https.Request,
    res: functions.Response
  ): Promise<void> {
    corsHandler(req, res, async () => {
      try {
        const limit = parseInt(req.query.limit as string) || 50;
        const paymentsSnapshot = await this.db
          .collection('payments')
          .where('paymentMethod', '==', 'manual')
          .orderBy('timestamp', 'desc')
          .limit(limit)
          .get();

        const payments = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        res.json({ payments });
      } catch (error) {
        console.error('Error getting manual payments:', error);
        res.status(500).json({ error: 'Failed to get manual payments' });
      }
    });
  }
}
