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
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
        };
      case OrderStatusType.PROCESSING:
        return {
          label: 'Processing',
          icon: Package,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
        };
      case OrderStatusType.SHIPPED:
        return {
          label: 'Shipped',
          icon: Truck,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          iconColor: 'text-purple-600',
        };
      case OrderStatusType.DELIVERED:
        return {
          label: 'Delivered',
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
        };
      case OrderStatusType.CANCELLED:
        return {
          label: 'Cancelled',
          icon: XCircle,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
        };
      default:
        return {
          label: 'Unknown',
          icon: Clock,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${className}`}
    >
      <Icon className={`w-4 h-4 ${config.iconColor}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
};
