import * as admin from 'firebase-admin';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  signalsPerDay: number;
  chartsAccess: 'limited' | 'unlimited';
  aiAnalysis: boolean;
  prioritySupport: boolean;
}

export class PlanManager {
  private db: admin.firestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  // Get all available plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    const plansSnapshot = await this.db.collection('subscription_plans').get();

    if (plansSnapshot.empty) {
      // Initialize default plans
      await this.initializeDefaultPlans();
      return this.getPlans();
    }

    return plansSnapshot.docs.map(doc => doc.data() as SubscriptionPlan);
  }

  // Get specific plan
  async getPlan(planId: string): Promise<SubscriptionPlan | null> {
    const planDoc = await this.db.collection('subscription_plans').doc(planId).get();

    if (!planDoc.exists) {
      return null;
    }

    return planDoc.data() as SubscriptionPlan;
  }

  // Initialize default plans
  private async initializeDefaultPlans(): Promise<void> {
    const defaultPlans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'مجاني',
        price: 0,
        currency: 'USD',
        interval: 'monthly',
        features: [
          '3 إشارات يومية',
          'شارتات محدودة',
          'إشعارات عادية'
        ],
        signalsPerDay: 3,
        chartsAccess: 'limited',
        aiAnalysis: false,
        prioritySupport: false
      },
      {
        id: 'basic',
        name: 'أساسي',
        price: 29,
        currency: 'USD',
        interval: 'monthly',
        features: [
          '10 إشارات يومية',
          'شارتات غير محدودة',
          'إشعارات فورية',
          'تحليلات متقدمة'
        ],
        signalsPerDay: 10,
        chartsAccess: 'unlimited',
        aiAnalysis: true,
        prioritySupport: false
      },
      {
        id: 'premium',
        name: 'احترافي',
        price: 99,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'إشارات غير محدودة',
          'شارتات VIP',
          'تحليلات AI مخصصة',
          'دعم فني مخصص',
          'إشعارات أولوية'
        ],
        signalsPerDay: -1, // unlimited
        chartsAccess: 'unlimited',
        aiAnalysis: true,
        prioritySupport: true
      }
    ];

    for (const plan of defaultPlans) {
      await this.db.collection('subscription_plans').doc(plan.id).set(plan);
    }
  }

  // Check if user can access feature
  async canUserAccessFeature(
    userId: string,
    feature: 'signals' | 'charts' | 'ai' | 'support'
  ): Promise<{ allowed: boolean; limit?: number }> {
    const userDoc = await this.db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.subscription) {
      // Free user
      const freePlan = await this.getPlan('free');
      return this.checkFeatureAccess(freePlan!, feature);
    }

    const plan = await this.getPlan(userData.subscription.planId);
    if (!plan) {
      return { allowed: false };
    }

    // Check if subscription is active
    if (userData.subscription.status !== 'active') {
      return { allowed: false };
    }

    return this.checkFeatureAccess(plan, feature);
  }

  private checkFeatureAccess(
    plan: SubscriptionPlan,
    feature: string
  ): { allowed: boolean; limit?: number } {
    switch (feature) {
      case 'signals':
        return {
          allowed: true,
          limit: plan.signalsPerDay === -1 ? undefined : plan.signalsPerDay
        };
      case 'charts':
        return {
          allowed: plan.chartsAccess === 'unlimited',
          limit: plan.chartsAccess === 'limited' ? 5 : undefined
        };
      case 'ai':
        return { allowed: plan.aiAnalysis };
      case 'support':
        return { allowed: plan.prioritySupport };
      default:
        return { allowed: false };
    }
  }

  // Get user's current subscription
  async getUserSubscription(userId: string): Promise<any> {
    const userDoc = await this.db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.subscription) {
      return {
        planId: 'free',
        status: 'active',
        signalsUsedToday: 0
      };
    }

    return userData.subscription;
  }

  // Update user subscription
  async updateUserSubscription(
    userId: string,
    planId: string,
    stripeSubscriptionId?: string
  ): Promise<void> {
    const plan = await this.getPlan(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    await this.db.collection('users').doc(userId).update({
      subscription: {
        planId,
        status: 'active',
        stripeSubscriptionId,
        startDate: admin.firestore.FieldValue.serverTimestamp(),
        signalsUsedToday: 0
      }
    });
  }

  // Cancel user subscription
  async cancelSubscription(userId: string): Promise<void> {
    await this.db.collection('users').doc(userId).update({
      'subscription.status': 'cancelled',
      'subscription.cancelledAt': admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Track signal usage
  async trackSignalUsage(userId: string): Promise<void> {
    const userDoc = await this.db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData) return;

    const today = new Date().toDateString();
    const lastReset = userData.subscription?.lastReset?.toDate()?.toDateString();

    // Reset if new day
    if (lastReset !== today) {
      await this.db.collection('users').doc(userId).update({
        'subscription.signalsUsedToday': 0,
        'subscription.lastReset': admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Increment usage
    await this.db.collection('users').doc(userId).update({
      'subscription.signalsUsedToday': admin.firestore.FieldValue.increment(1)
    });
  }
}
