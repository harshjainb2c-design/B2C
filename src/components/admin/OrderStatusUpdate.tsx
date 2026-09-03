import { useState } from 'react';
import { OrderStatus } from '../../types/order';
import { useUpdateOrderStatus } from '../../hooks/useAdminOrders';

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: OrderStatus;
  onSuccess?: () => void;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: OrderStatus.PENDING, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: OrderStatus.PROCESSING, label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: OrderStatus.SHIPPED, label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: OrderStatus.DELIVERED, label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export const OrderStatusUpdate = ({ orderId, currentStatus, onSuccess }: OrderStatusUpdateProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const updateStatus = useUpdateOrderStatus();

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) {
      alert('Please select a different status');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to change the order status from "${currentStatus}" to "${selectedStatus}"?`
    );

    if (!confirmed) return;

    try {
      await updateStatus.mutateAsync({ orderId, status: selectedStatus });
      alert('Order status updated successfully!');
      onSuccess?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update order status');
    }
  };

  const currentStatusOption = STATUS_OPTIONS.find((opt) => opt.value === currentStatus);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Status
        </label>
        <span
          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${currentStatusOption?.color}`}
        >
          {currentStatusOption?.label}
        </span>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
          New Status
        </label>
        <select
          id="status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
          className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-3 border transition-all"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleUpdate}
        disabled={updateStatus.isPending || selectedStatus === currentStatus}
        className="w-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
      >
        {updateStatus.isPending ? 'Updating...' : 'Update Status'}
      </button>
    </div>
  );
};
