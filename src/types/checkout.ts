export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  notes?: string;
  paymentMethod: 'transfer' | 'mobile_payment' | 'pending';
}

export interface CheckoutOrder {
  hotelSlug: string;
  hotelName?: string;
  planId: number;
  planName?: string;
  checkIn: string;
  checkOut: string;
  price: number;
  formattedPrice: string;
}

export interface CheckoutPayload {
  customer: CheckoutCustomer;
  order: CheckoutOrder;
}
