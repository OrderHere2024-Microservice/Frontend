export interface PaymentCreateDto {
  paymentId: number;
  clientSecret: string;
}

export interface PaymentPostDto {
  orderId: number;
  amount: number;
  currency: string;
}

export interface PaymentResultDto {
  paymentId: number;
  result: string;
}
