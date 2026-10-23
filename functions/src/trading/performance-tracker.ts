import * as admin from 'firebase-admin';

export interface SignalPerformance {
  signalId: string;
  pair: string;
  type: 'SPOT' | 'FUTURES';
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  signal: 'BUY' | 'SELL';
  timestamp: admin.firestore.Timestamp;
  status: 'PENDING' | 'PROFIT' | 'LOSS' | 'BREAKEVEN';
  exitPrice?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  duration?: number; // in hours
  hitTakeProfit?: boolean;
  hitStopLoss?: boolean;
}

export class PerformanceTracker {
  private db: admin.firestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  // Track a new signal
  async trackSignal(signal: any): Promise<void> {
    await this.db.collection('signal_performance').add({
      signalId: signal.id || signal.signalId,
      pair: signal.pair,
      type: signal.type,
      entryPrice: signal.entryPrice,
      takeProfit: signal.takeProfit,
      stopLoss: signal.stopLoss,
      signal: signal.signal,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'PENDING',
      hitTakeProfit: false,
      hitStopLoss: false,
    });
  }

  // Update signal status when price hits target
  async updateSignalStatus(
    signalId: string,
    currentPrice: number,
    status: 'PROFIT' | 'LOSS' | 'BREAKEVEN'
  ): Promise<void> {
    const signalDoc = await this.db
      .collection('signal_performance')
      .where('signalId', '==', signalId)
      .where('status', '==', 'PENDING')
      .limit(1)
      .get();

    if (signalDoc.empty) return;

    const doc = signalDoc.docs[0];
    const data = doc.data() as SignalPerformance;

    const entryPrice = data.entryPrice;
    const isBuy = data.signal === 'BUY';

    let profitLoss: number;
    let profitLossPercentage: number;

    if (isBuy) {
      profitLoss = currentPrice - entryPrice;
      profitLossPercentage = ((currentPrice - entryPrice) / entryPrice) * 100;
    } else {
      profitLoss = entryPrice - currentPrice;
      profitLossPercentage = ((entryPrice - currentPrice) / entryPrice) * 100;
    }

    const entryTime = data.timestamp.toDate();
    const duration = (Date.now() - entryTime.getTime()) / (1000 * 60 * 60); // hours

    await doc.ref.update({
      status,
      exitPrice: currentPrice,
      profitLoss,
      profitLossPercentage,
      duration,
      hitTakeProfit: status === 'PROFIT',
      hitStopLoss: status === 'LOSS',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Get overall performance statistics
  async getOverallStats(): Promise<{
    totalSignals: number;
    profitSignals: number;
    lossSignals: number;
    breakevenSignals: number;
    winRate: number;
    totalProfitLoss: number;
    averageProfitLoss: number;
    averageDuration: number;
  }> {
    const snapshot = await this.db.collection('signal_performance').get();

    let totalSignals = 0;
    let profitSignals = 0;
    let lossSignals = 0;
    let breakevenSignals = 0;
    let totalProfitLoss = 0;
    let totalDuration = 0;

    snapshot.forEach(doc => {
      const data = doc.data() as SignalPerformance;
      totalSignals++;

      if (data.status === 'PROFIT') {
        profitSignals++;
        totalProfitLoss += data.profitLoss || 0;
      } else if (data.status === 'LOSS') {
        lossSignals++;
        totalProfitLoss += data.profitLoss || 0;
      } else if (data.status === 'BREAKEVEN') {
        breakevenSignals++;
      }

      if (data.duration) {
        totalDuration += data.duration;
      }
    });

    const completedSignals = profitSignals + lossSignals + breakevenSignals;
    const winRate = completedSignals > 0 ? (profitSignals / completedSignals) * 100 : 0;
    const averageProfitLoss = completedSignals > 0 ? totalProfitLoss / completedSignals : 0;
    const averageDuration = completedSignals > 0 ? totalDuration / completedSignals : 0;

    return {
      totalSignals,
      profitSignals,
      lossSignals,
      breakevenSignals,
      winRate,
      totalProfitLoss,
      averageProfitLoss,
      averageDuration,
    };
  }

  // Get performance by pair
  async getPerformanceByPair(pair: string): Promise<any> {
    const snapshot = await this.db
      .collection('signal_performance')
      .where('pair', '==', pair)
      .get();

    const stats = {
      totalSignals: snapshot.size,
      profitSignals: 0,
      lossSignals: 0,
      winRate: 0,
      totalProfitLoss: 0,
    };

    snapshot.forEach(doc => {
      const data = doc.data() as SignalPerformance;
      if (data.status === 'PROFIT') {
        stats.profitSignals++;
        stats.totalProfitLoss += data.profitLoss || 0;
      } else if (data.status === 'LOSS') {
        stats.lossSignals++;
        stats.totalProfitLoss += data.profitLoss || 0;
      }
    });

    const completedSignals = stats.profitSignals + stats.lossSignals;
    stats.winRate = completedSignals > 0 ? (stats.profitSignals / completedSignals) * 100 : 0;

    return stats;
  }

  // Get performance by timeframe
  async getPerformanceByTimeframe(days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const snapshot = await this.db
      .collection('signal_performance')
      .where('timestamp', '>=', startDate)
      .get();

    const stats = {
      totalSignals: snapshot.size,
      profitSignals: 0,
      lossSignals: 0,
      winRate: 0,
      totalProfitLoss: 0,
    };

    snapshot.forEach(doc => {
      const data = doc.data() as SignalPerformance;
      if (data.status === 'PROFIT') {
        stats.profitSignals++;
        stats.totalProfitLoss += data.profitLoss || 0;
      } else if (data.status === 'LOSS') {
        stats.lossSignals++;
        stats.totalProfitLoss += data.profitLoss || 0;
      }
    });

    const completedSignals = stats.profitSignals + stats.lossSignals;
    stats.winRate = completedSignals > 0 ? (stats.profitSignals / completedSignals) * 100 : 0;

    return stats;
  }

  // Get recent performance history
  async getRecentHistory(limit: number = 50): Promise<SignalPerformance[]> {
    const snapshot = await this.db
      .collection('signal_performance')
      .orderBy('timestamp', descending: true)
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => doc.data() as SignalPerformance);
  }

  // Check if signal should be updated based on current price
  async checkAndUpdateSignal(signalId: string, currentPrice: number): Promise<void> {
    const signalDoc = await this.db
      .collection('signal_performance')
      .where('signalId', '==', signalId)
      .where('status', '==', 'PENDING')
      .limit(1)
      .get();

    if (signalDoc.empty) return;

    const doc = signalDoc.docs[0];
    const data = doc.data() as SignalPerformance;

    const { takeProfit, stopLoss, signal } = data;
    const isBuy = signal === 'BUY';

    let status: 'PROFIT' | 'LOSS' | 'BREAKEVEN' | null = null;

    if (isBuy) {
      if (currentPrice >= takeProfit) {
        status = 'PROFIT';
      } else if (currentPrice <= stopLoss) {
        status = 'LOSS';
      }
    } else {
      if (currentPrice <= takeProfit) {
        status = 'PROFIT';
      } else if (currentPrice >= stopLoss) {
        status = 'LOSS';
      }
    }

    if (status) {
      await this.updateSignalStatus(signalId, currentPrice, status);
    }
  }
}
