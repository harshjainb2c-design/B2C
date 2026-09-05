import { OrderStatus as OrderStatusType } from '../../types/order';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

interface OrderStatusProps {
  status: OrderStatusType;
  className?: string;
}

export const OrderStatus = ({ status, className = '' }: OrderStatusProps) => {
  const getStatusConfig = (status: OrderStatusType) => {
    switch (status) {
      case OrderStatusType.PENDING:
        return {
          label: 'Pending',
          icon: Clock,
          bgColor: 'bg-amber-950/30',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-800/60',
          iconColor: 'text-amber-400',
        };
      case OrderStatusType.PROCESSING:
        return {
          label: 'Processing',
          icon: Package,
          bgColor: 'bg-blue-950/30',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-800/60',
          iconColor: 'text-blue-400',
        };
      case OrderStatusType.SHIPPED:
        return {
          label: 'Shipped',
          icon: Truck,
          bgColor: 'bg-purple-950/30',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-800/60',
          iconColor: 'text-purple-400',
        };
      case OrderStatusType.DELIVERED:
        return {
          label: 'Delivered',
          icon: CheckCircle,
          bgColor: 'bg-emerald-950/30',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-800/60',
          iconColor: 'text-emerald-400',
        };
      case OrderStatusType.CANCELLED:
        return {
          label: 'Cancelled',
          icon: XCircle,
          bgColor: 'bg-red-950/30',
          textColor: 'text-red-400',
          borderColor: 'border-red-800/60',
          iconColor: 'text-red-400',
        };
      default:
        return {
          label: 'Unknown',
          icon: Clock,
          bgColor: 'bg-neutral-900',
          textColor: 'text-neutral-400',
          borderColor: 'border-neutral-800',
          iconColor: 'text-neutral-400',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      <Icon className={`w-3 h-3 ${config.iconColor}`} />
      <span>{config.label}</span>
    </span>
  );
};
