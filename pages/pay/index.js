import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '@components/Payment/PaymentForm';
import { useMutation } from '@apollo/client';
import { CREATE_PAYMENT } from '@services/Payment';
import { useRouter } from 'next/router';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const PayPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const router = useRouter();
  let { orderId, totalPrice } = router.query;
  orderId = parseInt(orderId, 10);
  const amount = parseFloat(totalPrice);
  const currency = 'aud';

  const [createPayment] = useMutation(CREATE_PAYMENT);

  useEffect(() => {
    const paymentPostDto = {
      orderId: orderId,
      amount: amount,
      currency: currency,
    };

    createPayment({
      variables: {
        paymentPostDto,
      },
    })
      .then((response) => {
        const data = response.data.createPayment;
        if (data.clientSecret && data.paymentId) {
          setClientSecret(data.clientSecret);
          setPaymentId(data.paymentId);
        } else {
          console.error(
            'Client secret or payment ID not found in response:',
            data,
          );
        }
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
      });
  }, [orderId, amount, currency, createPayment]);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm
            paymentId={paymentId}
            clientSecret={clientSecret}
            orderId={orderId}
          />
        </Elements>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PayPage;
