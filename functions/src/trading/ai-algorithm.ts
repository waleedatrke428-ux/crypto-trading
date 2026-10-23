import * as tf from '@tensorflow/tfjs-node';
import { AdvancedIndicators, IndicatorInput } from './advanced-indicators';

export interface AISignal {
  pair: string;
  type: 'SPOT' | 'FUTURES';
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  timeframe: string;
  timestamp: Date;
  indicators: any;
  aiProbability: number;
  reasoning: string[];
}

export class TradingAI {
  private model: tf.LayersModel | null = null;
  private isModelLoaded = false;

  constructor() {
    this.loadModel();
  }

  // Load or create AI model
  private async loadModel(): Promise<void> {
    try {
      // Try to load existing model
      // In production, load from Firebase Storage
      this.model = await this.createModel();
      this.isModelLoaded = true;
    } catch (error) {
      console.error('Error loading AI model:', error);
      // Create new model if loading fails
      this.model = await this.createModel();
      this.isModelLoaded = true;
    }
  }

  // Create neural network model
  private async createModel(): Promise<tf.LayersModel> {
    const model = tf.sequential();

    // Input layer - accepts features from advanced indicators
    model.add(tf.layers.dense({
      units: 128,
      activation: 'relu',
      inputShape: [15] // 15 features from advanced indicators
    }));

    // Hidden layers
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.2 }));

    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));

    // Output layer - 3 neurons (BUY, SELL, HOLD)
    model.add(tf.layers.dense({
      units: 3,
      activation: 'softmax'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  // Prepare features for AI model from advanced indicators
  private prepareFeatures(advancedIndicators: AdvancedIndicators): number[] {
    const { priceAction, fibonacci, liquidity, accumulationDistribution } = advancedIndicators;

    return [
      // Price Action features
      priceAction.trend === 'bullish' ? 1 : priceAction.trend === 'bearish' ? 0 : 0.5,
      priceAction.strength,

      // Fibonacci features
      fibonacci.activeZone === 'strong_bullish' ? 1 :
      fibonacci.activeZone === 'bullish' ? 0.75 :
      fibonacci.activeZone === 'bearish' ? 0.25 :
      fibonacci.activeZone === 'oversold' ? 0 : 0.5,

      // Liquidity features
      liquidity.liquidityRatio,
      liquidity.buyWalls.length / 5, // Normalized 0-1
      liquidity.sellWalls.length / 5, // Normalized 0-1

      // Accumulation/Distribution features
      accumulationDistribution.trend === 'accumulating' ? 1 :
      accumulationDistribution.trend === 'distributing' ? 0 : 0.5,
      accumulationDistribution.divergence ? 1 : 0,

      // Additional features
      (fibonacci.levels['50%'] - fibonacci.currentPrice) / fibonacci.levels['50%'], // Distance from 50%
      priceAction.keyLevels.support.length / 3, // Normalized support count
      priceAction.keyLevels.resistance.length / 3, // Normalized resistance count
    ];
  }

  // Predict using AI model
  private async predict(features: number[]): Promise<{ buy: number; sell: number; hold: number }> {
    if (!this.model || !this.isModelLoaded) {
      // Fallback to simple logic if model not loaded
      return { buy: 0.33, sell: 0.33, hold: 0.34 };
    }

    const tensor = tf.tensor2d([features]);
    const prediction = this.model.predict(tensor) as tf.Tensor;
    const probabilities = await prediction.data();

    tensor.dispose();
    prediction.dispose();

    return {
      buy: probabilities[0],
      sell: probabilities[1],
      hold: probabilities[2]
    };
  }

  // Generate trading signal with AI (updated to use advanced indicators)
  async generateSignal(
    pair: string,
    type: 'SPOT' | 'FUTURES',
    input: IndicatorInput,
    currentPrice: number,
    timeframe: string
  ): Promise<AISignal> {
    // Get advanced indicators analysis
    const advancedAnalysis = AdvancedIndicators.analyzeComprehensive(input);

    // Generate signal from advanced indicators
    const indicatorSignal = AdvancedIndicators.generateSignal(advancedAnalysis);

    // Prepare features for AI
    const features = this.prepareFeatures(advancedAnalysis);

    // Get AI prediction
    const aiPrediction = await this.predict(features);

    // Combine advanced indicators and AI signals
    const combinedSignal = this.combineSignals(indicatorSignal, aiPrediction);

    // Calculate entry, take profit, and stop loss
    const { entryPrice, takeProfit, stopLoss } = this.calculatePriceLevels(
      currentPrice,
      combinedSignal.signal,
      type
    );

    return {
      pair,
      type,
      signal: combinedSignal.signal,
      confidence: combinedSignal.confidence,
      entryPrice,
      takeProfit,
      stopLoss,
      timeframe,
      timestamp: new Date(),
      indicators: advancedAnalysis,
      aiProbability: Math.max(aiPrediction.buy, aiPrediction.sell, aiPrediction.hold),
      reasoning: indicatorSignal.reasoning
    };
  }

  // Combine advanced indicators and AI signals
  private combineSignals(
    indicatorSignal: { signal: 'BUY' | 'SELL' | 'HOLD'; confidence: number; reasoning: string[] },
    ai: { buy: number; sell: number; hold: number }
  ): { signal: 'BUY' | 'SELL' | 'HOLD'; confidence: number } {
    // Weight advanced indicators at 70% and AI at 30%
    const indicatorWeight = 0.7;
    const aiWeight = 0.3;

    let buyScore = 0;
    let sellScore = 0;
    let holdScore = 0;

    // Advanced indicators scores
    if (indicatorSignal.signal === 'BUY') buyScore += indicatorWeight;
    else if (indicatorSignal.signal === 'SELL') sellScore += indicatorWeight;
    else holdScore += indicatorWeight;

    // AI scores
    buyScore += ai.buy * aiWeight;
    sellScore += ai.sell * aiWeight;
    holdScore += ai.hold * aiWeight;

    // Determine final signal
    let signal: 'BUY' | 'SELL' | 'HOLD';
    if (buyScore > sellScore && buyScore > holdScore) {
      signal = 'BUY';
    } else if (sellScore > buyScore && sellScore > holdScore) {
      signal = 'SELL';
    } else {
      signal = 'HOLD';
    }

    // Calculate confidence
    const maxScore = Math.max(buyScore, sellScore, holdScore);
    const confidence = maxScore;

    return { signal, confidence };
  }
    else holdScore += technicalWeight;

    // AI scores
    buyScore += ai.buy * aiWeight;
    sellScore += ai.sell * aiWeight;
    holdScore += ai.hold * aiWeight;

    // Determine final signal
    let signal: 'BUY' | 'SELL' | 'HOLD';
    if (buyScore > sellScore && buyScore > holdScore) {
      signal = 'BUY';
    } else if (sellScore > buyScore && sellScore > holdScore) {
      signal = 'SELL';
    } else {
      signal = 'HOLD';
    }

    // Calculate confidence
    const maxScore = Math.max(buyScore, sellScore, holdScore);
    const confidence = maxScore;

    return { signal, confidence };
  }

  // Calculate price levels
  private calculatePriceLevels(
    currentPrice: number,
    signal: 'BUY' | 'SELL' | 'HOLD',
    type: 'SPOT' | 'FUTURES'
  ): { entryPrice: number; takeProfit: number; stopLoss: number } {
    const leverage = type === 'FUTURES' ? 10 : 1;
    const riskPercentage = 0.02; // 2% risk
    const rewardPercentage = 0.04; // 4% reward (1:2 risk-reward)

    let entryPrice = currentPrice;
    let takeProfit: number;
    let stopLoss: number;

    if (signal === 'BUY') {
      stopLoss = currentPrice * (1 - riskPercentage / leverage);
      takeProfit = currentPrice * (1 + rewardPercentage / leverage);
    } else if (signal === 'SELL') {
      stopLoss = currentPrice * (1 + riskPercentage / leverage);
      takeProfit = currentPrice * (1 - rewardPercentage / leverage);
    } else {
      // HOLD - set conservative levels
      stopLoss = currentPrice * (1 - riskPercentage / leverage);
      takeProfit = currentPrice * (1 + rewardPercentage / leverage);
    }

    return { entryPrice, takeProfit, stopLoss };
  }

  // Train model with historical data
  async trainModel(trainingData: any[]): Promise<void> {
    if (!this.model) return;

    // Prepare training data
    const features = trainingData.map(d => this.prepareFeatures(d.indicators));
    const labels = trainingData.map(d => {
      const label = [0, 0, 0];
      if (d.signal === 'BUY') label[0] = 1;
      else if (d.signal === 'SELL') label[1] = 1;
      else label[2] = 1;
      return label;
    });

    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);

    // Train model
    await this.model.fit(xs, ys, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2
    });

    xs.dispose();
    ys.dispose();

    console.log('Model training completed');
  }
}
