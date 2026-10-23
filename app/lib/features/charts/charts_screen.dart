import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class ChartsScreen extends StatefulWidget {
  const ChartsScreen({super.key});

  @override
  State<ChartsScreen> createState() => _ChartsScreenState();
}

class _ChartsScreenState extends State<ChartsScreen> {
  String _selectedPair = 'BTCUSDT';
  String _selectedTimeframe = '1h';
  bool _isLoading = false;

  final List<String> _pairs = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];
  final List<String> _timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Text(
                  'الشارتات الحية',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 16),

                // Pair selector
                SizedBox(
                  height: 50,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _pairs.length,
                    itemBuilder: (context, index) {
                      final pair = _pairs[index];
                      final isSelected = _selectedPair == pair;

                      return Padding(
                        padding: const EdgeInsets.only(end: 8),
                        child: FilterChip(
                          label: Text(pair),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedPair = pair;
                              _isLoading = true;
                              // Simulate loading
                              Future.delayed(const Duration(seconds: 1), () {
                                if (mounted) {
                                  setState(() {
                                    _isLoading = false;
                                  });
                                }
                              });
                            });
                          },
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),

                // Timeframe selector
                SizedBox(
                  height: 50,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _timeframes.length,
                    itemBuilder: (context, index) {
                      final timeframe = _timeframes[index];
                      final isSelected = _selectedTimeframe == timeframe;

                      return Padding(
                        padding: const EdgeInsets.only(end: 8),
                        child: FilterChip(
                          label: Text(timeframe),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedTimeframe = timeframe;
                              _isLoading = true;
                              // Simulate loading
                              Future.delayed(const Duration(seconds: 1), () {
                                if (mounted) {
                                  setState(() {
                                    _isLoading = false;
                                  });
                                }
                              });
                            });
                          },
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Chart
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _buildChart(),
          ),
        ],
      ),
    );
  }

  Widget _buildChart() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // Price info
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _selectedPair,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontSize: 20,
                        ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '\$${_getRandomPrice().toStringAsFixed(2)}',
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                              fontSize: 20,
                              color: Colors.green,
                            ),
                      ),
                      Text(
                        '+2.5%',
                        style: TextStyle(
                          color: Colors.green,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Line chart
              SizedBox(
                height: 300,
                child: LineChart(
                  LineChartData(
                    gridData: FlGridData(show: true),
                    titlesData: FlTitlesData(
                      show: true,
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (value, meta) {
                            return Text(
                              '${value.toInt()}',
                              style: const TextStyle(fontSize: 10),
                            );
                          },
                        ),
                      ),
                      leftTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (value, meta) {
                            return Text(
                              '\$${value.toInt()}',
                              style: const TextStyle(fontSize: 10),
                            );
                          },
                        ),
                      ),
                      topTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      rightTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                    ),
                    borderData: FlBorderData(show: true),
                    lineBarsData: [
                      LineChartBarData(
                        spots: _generateRandomSpots(),
                        isCurved: true,
                        color: Theme.of(context).colorScheme.primary,
                        barWidth: 2,
                        isStrokeCapRound: true,
                        dotData: FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Indicators
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildIndicator('MACD', 'إيجابي', Colors.green),
                  _buildIndicator('RSI', '65', Colors.blue),
                  _buildIndicator('VWAP', 'فوق', Colors.purple),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildIndicator(String name, String value, Color color) {
    return Column(
      children: [
        Text(
          name,
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  double _getRandomPrice() {
    switch (_selectedPair) {
      case 'BTCUSDT':
        return 65000 + (DateTime.now().millisecond % 1000);
      case 'ETHUSDT':
        return 3500 + (DateTime.now().millisecond % 100);
      case 'BNBUSDT':
        return 600 + (DateTime.now().millisecond % 50);
      case 'SOLUSDT':
        return 150 + (DateTime.now().millisecond % 20);
      default:
        return 100;
    }
  }

  List<FlSpot> _generateRandomSpots() {
    final spots = <FlSpot>[];
    final basePrice = _getRandomPrice();
    final random = DateTime.now().millisecond;

    for (int i = 0; i < 20; i++) {
      spots.add(FlSpot(
        i.toDouble(),
        basePrice + (random % 500 - 250) * (i / 20),
      ));
    }

    return spots;
  }
}
