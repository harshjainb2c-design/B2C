import { useState } from 'react';
import { OrderStatus } from '../../types/order';
import { useUpdateOrderStatus } from '../../hooks/useAdminOrders';

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: OrderStatus;
  onSuccess?: () => void;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: OrderStatus.PENDING, label: 'Pending' },
  { value: OrderStatus.PROCESSING, label: 'Processing' },
  { value: OrderStatus.SHIPPED, label: 'Shipped' },
  { value: OrderStatus.DELIVERED, label: 'Delivered' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled' },
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
      alert('Order status updated successfully');
      onSuccess?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-4 text-white">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
          Current Status
        </label>
        <span className="inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-neutral-900 border border-white/20 text-white">
          {currentStatus}
        </span>
      </div>

      <div>
        <label htmlFor="order-status-select" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
          Select New Status
        </label>
        <select
          id="order-status-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
          className="w-full rounded-xl bg-black border border-white/20 text-white text-xs px-4 py-3 outline-none focus:border-white transition-colors"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-black text-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleUpdate}
        disabled={updateStatus.isPending || selectedStatus === currentStatus}
        className="w-full px-5 py-3 text-xs font-bold uppercase tracking-wider bg-white text-black rounded-xl active:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {updateStatus.isPending ? 'Updating...' : 'Confirm Update'}
      </button>
    </div>
  );
};
