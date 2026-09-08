import { OrderStatus as OrderStatusType } from '../../types/order';

interface OrderStatusProps {
  status: OrderStatusType;
  className?: string;
}

export const OrderStatus = ({ status, className = '' }: OrderStatusProps) => {
  const getStatusConfig = (status: OrderStatusType) => {
    switch (status) {
      case OrderStatusType.PENDING:
        return { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-400' };
      case OrderStatusType.PROCESSING:
        return { label: 'Processing', bg: 'bg-blue-500/10', text: 'text-blue-400' };
      case OrderStatusType.SHIPPED:
        return { label: 'Shipped', bg: 'bg-purple-500/10', text: 'text-purple-400' };
      case OrderStatusType.DELIVERED:
        return { label: 'Delivered', bg: 'bg-emerald-500/10', text: 'text-emerald-400' };
      case OrderStatusType.CANCELLED:
        return { label: 'Cancelled', bg: 'bg-red-500/10', text: 'text-red-400' };
      default:
        return { label: 'Unknown', bg: 'bg-white/5', text: 'text-neutral-400' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full ${config.bg} ${config.text} ${className}`}
    >
      {config.label}
    </span>
  );
};
