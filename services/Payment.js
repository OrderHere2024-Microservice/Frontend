import http from "../utils/axios";
import { gql } from '@apollo/client';

const createPayment = (payCreateData) => http(`/v1/public/pay`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    data: JSON.stringify(payCreateData)
});

const sendPayResult = (payResultData) => http(`/v1/public/pay/result`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    data: JSON.stringify(payResultData)
});


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
