
import React from 'react';

interface ProductTotalPriceProps {
  price: number;
  quantity: number;
}

const ProductTotalPrice = ({ price, quantity }: ProductTotalPriceProps) => {
  const totalPrice = price * quantity;
  
  return (
    <div className="text-left">
      <span className="text-lg font-bold text-green-400">
        {totalPrice.toLocaleString('ar-EG')} ر.س
      </span>
      <div className="text-xs text-slate-400">
        ({quantity} × {price})
      </div>
    </div>
  );
};

export default ProductTotalPrice;
