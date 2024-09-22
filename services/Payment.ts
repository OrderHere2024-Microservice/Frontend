import { gql } from '@apollo/client';

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($paymentPostDto: PaymentPostDtoInput!) {
    createPayment(paymentPostDto: $paymentPostDto) {
      paymentId
      clientSecret
    }
  }
`;

export const SEND_PAYMENT_RESULT = gql`
  mutation GetPaymentResult($paymentResultDto: PaymentResultDtoInput!) {
    getPaymentResult(paymentResultDto: $paymentResultDto)
  }
`;
