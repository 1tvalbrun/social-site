import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Button } from '@/components/common/button';
import Header from '@/components/layout/header';
import { useNavigate } from 'react-router-dom';

const payments = [
  {
    id: 1038,
    date: 'Apr 28, 2025',
    service: 'DOZEI dues',
    status: 'Completed',
    total: 10.0,
  },
  {
    id: 1037,
    date: 'Apr 15, 2025',
    service: 'DOZEI dues',
    status: 'Completed',
    total: 15.5,
  },
  {
    id: 1036,
    date: 'Apr 10, 2025',
    service: 'DOZEI dues',
    status: 'Failed',
    total: 7.25,
  },
  {
    id: 1035,
    date: 'Mar 25, 2025',
    service: 'DOZEI dues',
    status: 'Completed',
    total: 12.75,
  },
  {
    id: 1034,
    date: 'Mar 18, 2025',
    service: 'DOZEI dues',
    status: 'Refunded',
    total: 8.5,
  },
  {
    id: 1033,
    date: 'Mar 5, 2025',
    service: 'DOZEI dues',
    status: 'Completed',
    total: 9.99,
  },
];

const statusStyles: Record<string, string> = {
  Completed:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Refunded:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
};

const totalPaid = payments
  .filter(p => p.status === 'Completed')
  .reduce((sum, p) => sum + p.total, 0)
  .toFixed(2);

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header onMenuClick={() => {}} />
      <div className="container mx-auto pt-20 pb-10 px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-2"
            aria-label="Back to home"
          >
            <span aria-hidden>←</span>
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <div className="ml-auto">
            <span className="inline-block rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2 font-semibold text-lg">
              Total Paid: ${totalPaid}
            </span>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-semibold">#{p.id}</td>
                      <td className="px-4 py-3">{p.date}</td>
                      <td className="px-4 py-3">{p.service}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[p.status] || ''}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        ${p.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsPage;
