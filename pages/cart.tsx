import Content from '@components/Cart/CartContent/CartContent';
import CartImage from '@components/Cart/CartImage/CartImage';
import CartEmpty from '@components/Cart/CartEmpty/CartEmpty';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

const Cart = () => {
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);

  return (
    <>
      <CartImage />
      {totalItems ? <Content /> : <CartEmpty />}
    </>
  );
};

export default Cart;
