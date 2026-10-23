import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../services/firebase_service.dart';

class SubscriptionsScreen extends StatefulWidget {
  const SubscriptionsScreen({super.key});

  @override
  State<SubscriptionsScreen> createState() => _SubscriptionsScreenState();
}

class _SubscriptionsScreenState extends State<SubscriptionsScreen> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Text(
              'خطط الاشتراك',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'اختر الخطة المناسبة لك',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),

            // Current subscription
            _buildCurrentSubscription(),
            const SizedBox(height: 24),

            // Plans
            _buildPlanCard(
              'مجاني',
              0,
              '🆓',
              [
                '3 إشارات يومية',
                'شارتات محدودة',
                'إشعارات عادية',
              ],
              Colors.grey,
              isFree: true,
            ),
            const SizedBox(height: 16),

            _buildPlanCard(
              'أساسي',
              29,
              '⭐',
              [
                '10 إشارات يومية',
                'شارتات غير محدودة',
                'إشعارات فورية',
                'تحليلات متقدمة',
              ],
              Colors.blue,
            ),
            const SizedBox(height: 16),

            _buildPlanCard(
              'احترافي',
              99,
              '👑',
              [
                'إشارات غير محدودة',
                'شارتات VIP',
                'تحليلات AI مخصصة',
                'دعم فني مخصص',
                'إشعارات أولوية',
              ],
              Colors.purple,
              isRecommended: true,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentSubscription() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'اشتراكك الحالي',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontSize: 18,
                  ),
            ),
            const SizedBox(height: 12),
            StreamBuilder<DocumentSnapshot>(
              stream: FirebaseService.auth.currentUser != null
                  ? FirebaseService.firestore
                      .collection('users')
                      .doc(FirebaseService.auth.currentUser!.uid)
                      .snapshots()
                  : null,
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return const Text('جاري التحميل...');
                }

                final userData = snapshot.data!.data() as Map<String, dynamic>?;
                final subscription = userData?['subscription'] as Map<String, dynamic>?;
                final planId = subscription?['planId'] ?? 'free';

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _getPlanName(planId),
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'الحالة: ${subscription?['status'] ?? 'نشط'}',
                      style: TextStyle(
                        color: subscription?['status'] == 'active'
                            ? Colors.green
                            : Colors.orange,
                      ),
                    ),
                    if (planId != 'free') ...[
                      const SizedBox(height: 4),
                      Text(
                        'تاريخ البدء: ${subscription?['startDate'] != null ? _formatDate(subscription['startDate']) : '-'}',
                      ),
                    ],
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanCard(
    String name,
    int price,
    String emoji,
    List<String> features,
    Color color, {
    bool isFree = false,
    bool isRecommended = false,
  }) {
    return Card(
      elevation: isRecommended ? 8 : 2,
      child: Container(
        decoration: isRecommended
            ? BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: color, width: 2),
              )
            : null,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(
                        emoji,
                        style: const TextStyle(fontSize: 32),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        name,
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                              fontSize: 20,
                            ),
                      ),
                    ],
                  ),
                  if (isRecommended)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: color,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'موصى به',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),

              // Price
              Text(
                isFree ? 'مجاني' : '\$$price/شهر',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontSize: 28,
                      color: color,
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 16),

              // Features
              ...features.map((feature) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Icon(
                          Icons.check_circle,
                          color: color,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(feature),
                      ],
                    ),
                  )),
              const SizedBox(height: 16),

              // Subscribe button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: isFree
                      ? null
                      : () {
                          // Navigate to payment
                          _showPaymentDialog(name, price);
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: color,
                  ),
                  child: Text(
                    isFree ? 'الخطة الحالية' : 'اشترك الآن',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showPaymentDialog(String planName, int price) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('اشتراك في $planName'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('السعر: \$$price/شهر'),
            const SizedBox(height: 16),
            const Text('سيتم توجيهك لصفحة الدفع الآمنة.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              // Integrate with Stripe here
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('سيتم إضافة الدفع قريباً'),
                ),
              );
            },
            child: const Text('متابعة'),
          ),
        ],
      ),
    );
  }

  String _getPlanName(String planId) {
    switch (planId) {
      case 'free':
        return 'مجاني';
      case 'basic':
        return 'أساسي';
      case 'premium':
        return 'احترافي';
      default:
        return 'مجاني';
    }
  }

  String _formatDate(dynamic date) {
    if (date is Timestamp) {
      final d = date.toDate();
      return '${d.day}/${d.month}/${d.year}';
    }
    return '-';
  }
}
