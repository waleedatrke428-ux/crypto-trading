import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge } from '@components/ui';

interface Signal {
  id: string;
  pair: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  timestamp: Date;
}

interface User {
  id: string;
  email: string;
  subscription: {
    planId: string;
    status: string;
  };
}

export const Dashboard: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch signals
      const signalsRes = await fetch('/api/admin/signals');
      const signalsData = await signalsRes.json();
      setSignals(signalsData.signals || []);

      // Fetch users
      const usersRes = await fetch('/api/admin/users');
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (userId: string, planId: string) => {
    try {
      await fetch('/api/admin/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, planId }),
      });
      alert('تم تأكيد الدفع بنجاح');
      fetchDashboardData();
    } catch (error) {
      alert('خطأ في تأكيد الدفع');
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم الإدارية</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">المستخدمين</h3>
          <p className="text-3xl font-bold">{users.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">الإشارات</h3>
          <p className="text-3xl font-bold">{signals.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">الاشتراكات النشطة</h3>
          <p className="text-3xl font-bold">
            {users.filter(u => u.subscription.status === 'active').length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">نسبة النجاح</h3>
          <p className="text-3xl font-bold text-green-600">85%</p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold mb-4">المستخدمون</h2>
        <Table>
          <thead>
            <tr>
              <th>البريد الإلكتروني</th>
              <th>الخطة</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <Badge variant="outline">{user.subscription.planId}</Badge>
                </td>
                <td>
                  <Badge color={user.subscription.status === 'active' ? 'green' : 'gray'}>
                    {user.subscription.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => handleConfirmPayment(user.id, 'basic')}
                  >
                    ترقية
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Signals Table */}
      <Card>
        <h2 className="text-xl font-bold mb-4">الإشارات الأخيرة</h2>
        <Table>
          <thead>
            <tr>
              <th>الزوج</th>
              <th>الإشارة</th>
              <th>السعر</th>
              <th>الثقة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {signals.slice(0, 10).map((signal) => (
              <tr key={signal.id}>
                <td>{signal.pair}</td>
                <td>
                  <Badge color={signal.signal === 'BUY' ? 'green' : 'red'}>
                    {signal.signal}
                  </Badge>
                </td>
                <td>${signal.entryPrice.toFixed(2)}</td>
                <td>{(signal.confidence * 100).toFixed(1)}%</td>
                <td>{new Date(signal.timestamp).toLocaleDateString('ar-SA')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
