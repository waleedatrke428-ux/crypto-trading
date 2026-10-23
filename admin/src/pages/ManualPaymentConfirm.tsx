import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input, NumberInput, Textarea, Alert } from '@components/ui';

interface Plan {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  currency: string;
}

export const ManualPaymentConfirm: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [planId, setPlanId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/plans');
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId,
          amount,
          currency,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        setUserId('');
        setPlanId('');
        setAmount(0);
        setNotes('');
      } else {
        setError(data.error || 'Failed to confirm payment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">تأكيد الدفع اليدوي</h1>

      {success && (
        <Alert type="success" className="mb-4">
          تم تأكيد الدفع وتفعيل الاشتراك بنجاح!
        </Alert>
      )}

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Card>
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              معرف المستخدم (User ID)
            </label>
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="أدخل معرف المستخدم"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              يمكنك العثور على معرف المستخدم من صفحة المستخدمين
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              خطة الاشتراك
            </label>
            <Select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              required
            >
              <option value="">اختر الخطة</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.nameAr} - ${plan.price}/{plan.currency}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                المبلغ
              </label>
              <NumberInput
                value={amount}
                onChange={(value) => setAmount(value)}
                placeholder="0.00"
                min={0}
                step={0.01}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                العملة
              </label>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SAR">SAR</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              ملاحظات (اختياري)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات إضافية"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'جاري التأكيد...' : 'تأكيد الدفع وتفعيل الاشتراك'}
          </Button>
        </form>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">معلومات هامة:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>سيتم تفعيل الاشتراك فوراً بعد التأكيد</li>
          <li>سيتم إنشاء سجل دفع في النظام</li>
          <li>سيتم إرسال إشعار للمستخدم (إذا كان متصلاً)</li>
          <li>الإجراء مسجل في سجلات النظام للتدقيق</li>
        </ul>
      </div>
    </div>
  );
};
