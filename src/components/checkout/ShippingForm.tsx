import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema, ShippingAddressInput } from '../../lib/validation';

interface ShippingFormProps {
  onSubmit: (data: ShippingAddressInput) => void;
  isLoading?: boolean;
  defaultValues?: Partial<ShippingAddressInput>;
}

const inputBase = 'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-black border rounded-sm text-white placeholder:text-neutral-500 focus:outline-none';
const inputOk = `${inputBase} border-neutral-800 focus:border-neutral-600`;
const inputErr = `${inputBase} border-red-500`;

const ErrorIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export const ShippingForm = ({ onSubmit, isLoading, defaultValues }: ShippingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
          Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          className={errors.fullName ? inputErr : inputOk}
          placeholder="Rahul Sharma"
          disabled={isLoading}
          aria-invalid={errors.fullName ? 'true' : 'false'}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
            <ErrorIcon />
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="addressLine1" className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
          Address Line 1 *
        </label>
        <input
          id="addressLine1"
          type="text"
          {...register('addressLine1')}
          className={errors.addressLine1 ? inputErr : inputOk}
          placeholder="House No., Street Name"
          disabled={isLoading}
          aria-invalid={errors.addressLine1 ? 'true' : 'false'}
          aria-describedby={errors.addressLine1 ? 'addressLine1-error' : undefined}
        />
        {errors.addressLine1 && (
          <p id="addressLine1-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
            <ErrorIcon />
            {errors.addressLine1.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="addressLine2" className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
          Address Line 2
        </label>
        <input
          id="addressLine2"
          type="text"
          {...register('addressLine2')}
          className={errors.addressLine2 ? inputErr : inputOk}
          placeholder="Landmark, Area"
          disabled={isLoading}
          aria-invalid={errors.addressLine2 ? 'true' : 'false'}
          aria-describedby={errors.addressLine2 ? 'addressLine2-error' : undefined}
        />
        {errors.addressLine2 && (
          <p id="addressLine2-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
            <ErrorIcon />
            {errors.addressLine2.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <label htmlFor="city" className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
            City *
          </label>
          <input
            id="city"
            type="text"
            {...register('city')}
            className={errors.city ? inputErr : inputOk}
            placeholder="Indore"
            disabled={isLoading}
            aria-invalid={errors.city ? 'true' : 'false'}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city && (
            <p id="city-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <ErrorIcon />
              {errors.city.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
            State *
          </label>
          <select
            id="state"
            {...register('state')}
            className={errors.state ? inputErr : inputOk}
            disabled={isLoading}
            aria-invalid={errors.state ? 'true' : 'false'}
            aria-describedby={errors.state ? 'state-error' : undefined}
          >
            <option value="">Select State</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Telangana">Telangana</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Kerala">Kerala</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="Bihar">Bihar</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Other">Other</option>
          </select>
          {errors.state && (
            <p id="state-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <ErrorIcon />
              {errors.state.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <label htmlFor="postalCode" className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
            PIN Code *
          </label>
          <input
            id="postalCode"
            type="text"
            {...register('postalCode')}
            className={errors.postalCode ? inputErr : inputOk}
            placeholder="400001"
            maxLength={6}
            disabled={isLoading}
            aria-invalid={errors.postalCode ? 'true' : 'false'}
            aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
          />
          {errors.postalCode && (
            <p id="postalCode-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <ErrorIcon />
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
            Country *
          </label>
          <input
            id="country"
            type="text"
            {...register('country')}
            value="India"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-950 border border-neutral-900 rounded-sm text-neutral-500"
            disabled
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className={errors.phone ? inputErr : inputOk}
          placeholder="+91 98765 43210"
          disabled={isLoading}
          aria-invalid={errors.phone ? 'true' : 'false'}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-xs text-red-400 flex items-center gap-1">
            <ErrorIcon />
            {errors.phone.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-black bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
      >
        {isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
};
