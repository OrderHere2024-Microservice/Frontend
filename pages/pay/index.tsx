import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '@components/Payment/PaymentForm';
import { useMutation } from '@apollo/client';
import { CREATE_PAYMENT } from '@services/Payment';
import { useRouter } from 'next/router';
import { PaymentCreateDto, PaymentPostDto } from '@interfaces/PaymentDTOs';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

const PayPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null | undefined>(
    '',
  );
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const router = useRouter();
  const { orderId, totalPrice } = router.query;
  const parsedOrderId = parseInt(orderId as string, 10);
  const amount = parseFloat(totalPrice as string);
  const currency = 'aud';

  const [createPayment] = useMutation<
    { createPayment: PaymentCreateDto },
    { paymentPostDto: PaymentPostDto }
  >(CREATE_PAYMENT);

  useEffect(() => {
    const paymentPostDto: PaymentPostDto = {
      orderId: parsedOrderId,
      amount: amount,
      currency: currency,
    };

    createPayment({
      variables: {
        paymentPostDto,
      },
    })
      .then((response) => {
        const { createPayment } = response.data!;
        if (createPayment.clientSecret && createPayment.paymentId) {
          setClientSecret(createPayment.clientSecret);
          setPaymentId(createPayment.paymentId);
        } else {
          console.error(
            'Client secret or payment ID not found in response:',
            createPayment,
          );
        }
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
      });
  }, [orderId, amount, currency, createPayment]);

  const appearance = {
    theme: 'stripe' as 'flat' | 'stripe' | 'night',
  };

  const options = clientSecret
    ? {
        clientSecret,
        appearance,
      }
    : undefined;

  return (
    <div className="App">
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm paymentId={paymentId} orderId={orderId} />
        </Elements>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PayPage;
