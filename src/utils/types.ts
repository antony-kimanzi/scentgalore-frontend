export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
    quantity?: number;
    tone?: string;
    stock?: string;
}

export interface InputProps {
  id: string;
  value: string | number;
  label: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
}

export interface OrderSummaryProps {
    shippingCost: number;
    buttonText: string;
}