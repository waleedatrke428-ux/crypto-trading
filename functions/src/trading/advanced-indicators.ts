import * as admin from 'firebase-admin';

export interface IndicatorInput {
  close: number[];
  high: number[];
  low: number[];
  volume: number[];
  open: number[];
}

export interface AdvancedIndicators {
  priceAction: {
    trend: 'bullish' | 'bearish' | 'sideways';
    strength: number; // 0-1
    keyLevels: {
      support: number[];
      resistance: number[];
    };
  };
  fibonacci: {
    levels: {
      '0%': number;
      '23.6%': number;
      '38.2%': number;
      '50%': number;
      '61.8%': number;
      '78.6%': number;
      '100%': number;
    };
    activeZone: string;
  };
  liquidity: {
    buyWalls: number[];
    sellWalls: number[];
    liquidityRatio: number;
  };
  accumulationDistribution: {
    adLine: number[];
    trend: 'accumulating' | 'distributing' | 'neutral';
    divergence: boolean;
  };
}

export class AdvancedIndicators {
  // Price Action Analysis
  static analyzePriceAction(data: IndicatorInput): any {
    const { close, high, low } = data;
    const recentClose = close.slice(-20); // آخر 20 شمعة

    // تحديد الاتجاه
    const sma20 = this.calculateSMA(recentClose);
    const sma50 = this.calculateSMA(close.slice(-50));
    const lastClose = close[close.length - 1];

    let trend: 'bullish' | 'bearish' | 'sideways';
    let strength = 0;

    if (lastClose > sma20 && sma20 > sma50) {
      trend = 'bullish';
      strength = Math.min(1, (lastClose - sma50) / sma50 * 10);
    } else if (lastClose < sma20 && sma20 < sma50) {
      trend = 'bearish';
      strength = Math.min(1, (sma50 - lastClose) / sma50 * 10);
    } else {
      trend = 'sideways';
      strength = 0.5;
    }

    // تحديد مستويات الدعم والمقاومة
    const recentHighs = high.slice(-20);
    const recentLows = low.slice(-20);
    const resistance = this.findResistanceLevels(recentHighs);
    const support = this.findSupportLevels(recentLows);

    return {
      trend,
      strength,
      keyLevels: {
        support,
        resistance
      }
    };
  }

  // Fibonacci Retracement (مُحسّن)
  static calculateFibonacciAdvanced(data: IndicatorInput): any {
    const { high, low, close } = data;
    const period = 100; // فترة أطول للدقة

    const recentHighs = high.slice(-period);
    const recentLows = low.slice(-period);

    const swingHigh = Math.max(...recentHighs);
    const swingLow = Math.min(...recentLows);
    const range = swingHigh - swingLow;

    const levels = {
      '0%': swingHigh,
      '23.6%': swingHigh - (range * 0.236),
      '38.2%': swingHigh - (range * 0.382),
      '50%': swingHigh - (range * 0.5),
      '61.8%': swingHigh - (range * 0.618),
      '78.6%': swingHigh - (range * 0.786),
      '100%': swingLow
    };

    const currentPrice = close[close.length - 1];

    // تحديد المنطقة النشطة
    let activeZone = 'neutral';
    if (currentPrice >= levels['50%'] && currentPrice <= levels['23.6%']) {
      activeZone = 'strong_bullish';
    } else if (currentPrice >= levels['61.8%'] && currentPrice <= levels['50%']) {
      activeZone = 'bullish';
    } else if (currentPrice >= levels['78.6%'] && currentPrice <= levels['61.8%']) {
      activeZone = 'bearish';
    } else if (currentPrice <= levels['78.6%']) {
      activeZone = 'oversold';
    }

    return {
      levels,
      activeZone,
      currentPrice
    };
  }

  // Liquidity Analysis
  static analyzeLiquidity(data: IndicatorInput): any {
    const { close, volume, high, low } = data;

    // تحديد جدران الشراء والبيع بناءً على الحجم والسعر
    const avgVolume = volume.reduce((a, b) => a + b, 0) / volume.length;
    const buyWalls: number[] = [];
    const sellWalls: number[] = [];

    // تحليل الحجم عند مستويات سعرية مختلفة
    for (let i = 0; i < close.length; i++) {
      if (volume[i] > avgVolume * 2) {
        // حجم عالي - جدار سيولة
        if (close[i] > close[i - 1]) {
          buyWalls.push(close[i]);
        } else {
          sellWalls.push(close[i]);
        }
      }
    }

    // حساب نسبة السيولة
    const totalBuyVolume = buyWalls.length;
    const totalSellVolume = sellWalls.length;
    const liquidityRatio = totalBuyVolume / (totalBuyVolume + totalSellVolume);

    return {
      buyWalls: buyWalls.slice(0, 5), // أعلى 5 جدران شراء
      sellWalls: sellWalls.slice(0, 5), // أعلى 5 جدران بيع
      liquidityRatio
    };
  }

  // Accumulation/Distribution (نموذج التجميع والتوزيع)
  static analyzeAccumulationDistribution(data: IndicatorInput): any {
    const { close, high, low, volume } = data;

    const adLine: number[] = [];
    let cumAD = 0;

    for (let i = 0; i < close.length; i++) {
      const highLow = high[i] - low[i];
      let mfm = 0; // Money Flow Multiplier

      if (highLow !== 0) {
        mfm = ((close[i] - low[i]) - (high[i] - close[i])) / highLow;
      }

      const mfv = mfm * volume[i]; // Money Flow Volume
      cumAD += mfv;
      adLine.push(cumAD);
    }

    // تحديد الاتجاه
    const recentAD = adLine.slice(-20);
    const trend = this.calculateSMA(recentAD);
    const prevTrend = this.calculateSMA(adLine.slice(-40, -20));

    let adTrend: 'accumulating' | 'distributing' | 'neutral';
    if (trend > prevTrend) {
      adTrend = 'accumulating';
    } else if (trend < prevTrend) {
      adTrend = 'distributing';
    } else {
      adTrend = 'neutral';
    }

    // تحقق من الاختلاف (Divergence)
    const priceTrend = close[close.length - 1] > close[close.length - 20];
    const adTrendDirection = adLine[adLine.length - 1] > adLine[adLine.length - 20];
    const divergence = priceTrend !== adTrendDirection;

    return {
      adLine: adLine.slice(-20),
      trend: adTrend,
      divergence
    };
  }

  // تحليل شامل يجمع كل المؤشرات
  static analyzeComprehensive(data: IndicatorInput): AdvancedIndicators {
    const priceAction = this.analyzePriceAction(data);
    const fibonacci = this.calculateFibonacciAdvanced(data);
    const liquidity = this.analyzeLiquidity(data);
    const accumulationDistribution = this.analyzeAccumulationDistribution(data);

    return {
      priceAction,
      fibonacci,
      liquidity,
      accumulationDistribution
    };
  }

  // تحديد إشارة بناءً على التحليل الشامل
  static generateSignal(indicators: AdvancedIndicators): {
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string[];
  } {
    const reasons: string[] = [];
    let buyScore = 0;
    let sellScore = 0;

    // Price Action
    if (indicators.priceAction.trend === 'bullish') {
      buyScore += indicators.priceAction.strength * 3;
      reasons.push(`Price Action bullish (strength: ${indicators.priceAction.strength.toFixed(2)})`);
    } else if (indicators.priceAction.trend === 'bearish') {
      sellScore += indicators.priceAction.strength * 3;
      reasons.push(`Price Action bearish (strength: ${indicators.priceAction.strength.toFixed(2)})`);
    }

    // Fibonacci
    if (indicators.fibonacci.activeZone === 'strong_bullish' || indicators.fibonacci.activeZone === 'bullish') {
      buyScore += 2;
      reasons.push(`Price in Fibonacci bullish zone (${indicators.fibonacci.activeZone})`);
    } else if (indicators.fibonacci.activeZone === 'bearish' || indicators.fibonacci.activeZone === 'oversold') {
      sellScore += 2;
      reasons.push(`Price in Fibonacci bearish zone (${indicators.fibonacci.activeZone})`);
    }

    // Liquidity
    if (indicators.liquidity.liquidityRatio > 0.6) {
      buyScore += 1.5;
      reasons.push(`Strong buy walls (liquidity ratio: ${indicators.liquidity.liquidityRatio.toFixed(2)})`);
    } else if (indicators.liquidity.liquidityRatio < 0.4) {
      sellScore += 1.5;
      reasons.push(`Strong sell walls (liquidity ratio: ${indicators.liquidity.liquidityRatio.toFixed(2)})`);
    }

    // Accumulation/Distribution
    if (indicators.accumulationDistribution.trend === 'accumulating') {
      buyScore += 2;
      reasons.push('Accumulation phase detected');
    } else if (indicators.accumulationDistribution.trend === 'distributing') {
      sellScore += 2;
      reasons.push('Distribution phase detected');
    }

    // Divergence (علامة قوية)
    if (indicators.accumulationDistribution.divergence) {
      if (indicators.priceAction.trend === 'bullish') {
        sellScore += 1.5; // Bearish divergence
        reasons.push('Bearish divergence detected (potential reversal)');
      } else {
        buyScore += 1.5; // Bullish divergence
        reasons.push('Bullish divergence detected (potential reversal)');
      }
    }

    // تحديد الإشارة النهائية
    let signal: 'BUY' | 'SELL' | 'HOLD';
    const totalScore = buyScore + sellScore;
    const confidence = Math.max(buyScore, sellScore) / totalScore;

    if (buyScore > sellScore && confidence > 0.6) {
      signal = 'BUY';
    } else if (sellScore > buyScore && confidence > 0.6) {
      signal = 'SELL';
    } else {
      signal = 'HOLD';
    }

    return {
      signal,
      confidence,
      reasoning: reasons
    };
  }

  // دالة مساعدة: حساب SMA
  private static calculateSMA(data: number[]): number {
    const sum = data.reduce((a, b) => a + b, 0);
    return sum / data.length;
  }

  // دالة مساعدة: إيجاد مستويات المقاومة
  private static findResistanceLevels(highs: number[]): number[] {
    const resistance: number[] = [];
    const threshold = 2; // عدد المرات التي يجب أن يصل السعر للمستوى

    for (let i = 0; i < highs.length; i++) {
      const currentHigh = highs[i];
      let count = 0;

      for (let j = 0; j < highs.length; j++) {
        if (Math.abs(highs[j] - currentHigh) / currentHigh < 0.01) {
          count++;
        }
      }

      if (count >= threshold && !resistance.includes(currentHigh)) {
        resistance.push(currentHigh);
      }
    }

    return resistance.sort((a, b) => b - a).slice(0, 3);
  }

  // دالة مساعدة: إيجاد مستويات الدعم
  private static findSupportLevels(lows: number[]): number[] {
    const support: number[] = [];
    const threshold = 2;

    for (let i = 0; i < lows.length; i++) {
      const currentLow = lows[i];
      let count = 0;

      for (let j = 0; j < lows.length; j++) {
        if (Math.abs(lows[j] - currentLow) / currentLow < 0.01) {
          count++;
        }
      }

      if (count >= threshold && !support.includes(currentLow)) {
        support.push(currentLow);
      }
    }

    return support.sort((a, b) => a - b).slice(0, 3);
  }
}
