import { SMA, EMA, RSI, MACD, VWAP } from 'technicalindicators';

export interface IndicatorInput {
  close: number[];
  high: number[];
  low: number[];
  volume: number[];
}

export interface IndicatorOutput {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  indicators: {
    macd?: any;
    rsi?: number;
    fibonacci?: any;
    ichimoku?: any;
    vwap?: number;
  };
}

export class TechnicalIndicators {
  // MACD Indicator
  static calculateMACD(prices: number[]): any {
    const macdInput = {
      values: prices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    };

    const macdData = MACD.calculate(macdInput);
    const latest = macdData[macdData.length - 1];

    return {
      macd: latest.MACD,
      signal: latest.signal,
      histogram: latest.histogram,
      bullish: latest.histogram > 0
    };
  }

  // RSI Indicator
  static calculateRSI(prices: number[]): any {
    const rsiInput = {
      values: prices,
      period: 14
    };

    const rsiValues = RSI.calculate(rsiInput);
    const latestRSI = rsiValues[rsiValues.length - 1];

    return {
      value: latestRSI,
      overbought: latestRSI > 70,
      oversold: latestRSI < 30,
      neutral: latestRSI >= 30 && latestRSI <= 70
    };
  }

  // Fibonacci Retracement
  static calculateFibonacci(high: number, low: number): any {
    const diff = high - low;

    return {
      high: high,
      low: low,
      levels: {
        '0%': high,
        '23.6%': high - (diff * 0.236),
        '38.2%': high - (diff * 0.382),
        '50%': high - (diff * 0.5),
        '61.8%': high - (diff * 0.618),
        '78.6%': high - (diff * 0.786),
        '100%': low
      }
    };
  }

  // Ichimoku Cloud
  static calculateIchimoku(data: IndicatorInput): any {
    const { high, low, close } = data;
    const periodTenkan = 9;
    const periodKijun = 26;
    const periodSenkou = 52;

    // Tenkan-sen (Conversion Line)
    const tenkanSen = this.calculateIchimokuLine(high, low, periodTenkan);

    // Kijun-sen (Base Line)
    const kijunSen = this.calculateIchimokuLine(high, low, periodKijun);

    // Senkou Span A (Leading Span A)
    const senkouSpanA = (tenkanSen + kijunSen) / 2;

    // Senkou Span B (Leading Span B)
    const senkouSpanB = this.calculateIchimokuLine(high, low, periodSenkou);

    // Chikou Span (Lagging Span)
    const chikouSpan = close[close.length - 1];

    return {
      tenkanSen,
      kijunSen,
      senkouSpanA,
      senkouSpanB,
      chikouSpan,
      bullish: close[close.length - 1] > Math.max(senkouSpanA, senkouSpanB)
    };
  }

  private static calculateIchimokuLine(high: number[], low: number[], period: number): number {
    const slice = high.length - period;
    const highSlice = high.slice(slice);
    const lowSlice = low.slice(slice);

    const maxHigh = Math.max(...highSlice);
    const minLow = Math.min(...lowSlice);

    return (maxHigh + minLow) / 2;
  }

  // VWAP (Volume Weighted Average Price)
  static calculateVWAP(data: IndicatorInput): any {
    const { close, high, low, volume } = data;
    const typicalPrice = close.map((c, i) => (c + high[i] + low[i]) / 3);
    const tpVolume = typicalPrice.map((tp, i) => tp * volume[i]);

    const sumTPVolume = tpVolume.reduce((a, b) => a + b, 0);
    const sumVolume = volume.reduce((a, b) => a + b, 0);

    const vwap = sumTPVolume / sumVolume;

    return {
      value: vwap,
      above: close[close.length - 1] > vwap,
      below: close[close.length - 1] < vwap
    };
  }

  // Combine all indicators
  static analyze(input: IndicatorInput): IndicatorOutput {
    const close = input.close;
    const high = input.high;
    const low = input.low;

    const macd = this.calculateMACD(close);
    const rsi = this.calculateRSI(close);
    const fibonacci = this.calculateFibonacci(Math.max(...high), Math.min(...low));
    const ichimoku = this.calculateIchimoku(input);
    const vwap = this.calculateVWAP(input);

    // Calculate signals based on indicators
    let buySignals = 0;
    let sellSignals = 0;

    // MACD signals
    if (macd.bullish) buySignals++;
    else sellSignals++;

    // RSI signals
    if (rsi.oversold) buySignals++;
    else if (rsi.overbought) sellSignals++;

    // Ichimoku signals
    if (ichimoku.bullish) buySignals++;
    else sellSignals++;

    // VWAP signals
    if (vwap.above) buySignals++;
    else sellSignals++;

    // Determine final signal
    let signal: 'BUY' | 'SELL' | 'HOLD';
    if (buySignals > sellSignals) {
      signal = 'BUY';
    } else if (sellSignals > buySignals) {
      signal = 'SELL';
    } else {
      signal = 'HOLD';
    }

    // Calculate confidence
    const confidence = Math.abs(buySignals - sellSignals) / 4;

    return {
      signal,
      confidence,
      indicators: {
        macd,
        rsi: rsi.value,
        fibonacci,
        ichimoku,
        vwap: vwap.value
      }
    };
  }
}
