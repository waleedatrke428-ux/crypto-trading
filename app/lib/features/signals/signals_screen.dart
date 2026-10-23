import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../services/firebase_service.dart';

class SignalsScreen extends StatefulWidget {
  const SignalsScreen({super.key});

  @override
  State<SignalsScreen> createState() => _SignalsScreenState();
}

class _SignalsScreenState extends State<SignalsScreen> {
  String _selectedPair = 'ALL';
  final List<String> _pairs = ['ALL', 'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];

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
                  'إشارات التداول',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 16),

                // Pair filter
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

          // Signals list
          Expanded(
            child: _selectedPair == 'ALL'
                ? _buildAllSignals()
                : _buildPairSignals(_selectedPair),
          ),
        ],
      ),
    );
  }

  Widget _buildAllSignals() {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseService.getSignals(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(
            child: Text('خطأ: ${snapshot.error}'),
          );
        }

        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return const Center(
            child: Text('لا توجد إشارات حالياً'),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: snapshot.data!.docs.length,
          itemBuilder: (context, index) {
            final signal = snapshot.data!.docs[index].data() as Map<String, dynamic>;
            return _buildSignalCard(context, signal);
          },
        );
      },
    );
  }

  Widget _buildPairSignals(String pair) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseService.getSignalsByPair(pair),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(
            child: Text('خطأ: ${snapshot.error}'),
          );
        }

        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return const Center(
            child: Text('لا توجد إشارات لهذا الزوج'),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: snapshot.data!.docs.length,
          itemBuilder: (context, index) {
            final signal = snapshot.data!.docs[index].data() as Map<String, dynamic>;
            return _buildSignalCard(context, signal);
          },
        );
      },
    );
  }

  Widget _buildSignalCard(BuildContext context, Map<String, dynamic> signal) {
    final isBuy = signal['signal'] == 'BUY';
    final color = isBuy ? Colors.green : Colors.red;
    final emoji = isBuy ? '🟢' : '🔴';
    final type = signal['type'] == 'SPOT' ? '📊' : '🔮';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '$emoji $type ${signal['pair']}',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontSize: 18,
                      ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    signal['signal'],
                    style: TextStyle(
                      color: color,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Price levels
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  _buildPriceRow('سعر الدخول', signal['entryPrice'], Colors.blue),
                  const Divider(),
                  _buildPriceRow('الهدف', signal['takeProfit'], Colors.green),
                  const Divider(),
                  _buildPriceRow('وقف الخسارة', signal['stopLoss'], Colors.red),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Additional info
            Row(
              children: [
                Expanded(
                  child: _buildInfoRow(
                    'الإطار الزمني',
                    signal['timeframe'] ?? '-',
                  ),
                ),
                Expanded(
                  child: _buildInfoRow(
                    'الثقة',
                    '${((signal['confidence'] ?? 0) * 100).toStringAsFixed(1)}%',
                  ),
                ),
                Expanded(
                  child: _buildInfoRow(
                    'AI',
                    '${((signal['aiProbability'] ?? 0) * 100).toStringAsFixed(1)}%',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Timestamp
            Text(
              signal['timestamp'] != null
                  ? _formatTimestamp(signal['timestamp'])
                  : '-',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceRow(String label, dynamic value, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 14),
        ),
        Text(
          '\$${(value as num?)?.toStringAsFixed(2) ?? '0.00'}',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
        Text(
          value,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  String _formatTimestamp(dynamic timestamp) {
    if (timestamp is Timestamp) {
      final date = timestamp.toDate();
      return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute}';
    }
    return '-';
  }
}
