import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsBagCheckFill } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

import { runFireworks } from '../lib/utils';
import { useStateContext } from '../context/StateContext';

const Success = () => {
  const location = useLocation();
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();
  const { response } = location.state;
  console.log(response);
    useEffect(() => {
      setCartItems([]);
      setTotalPrice(0);
      setTotalQuantities(0);
      localStorage.clear();
      runFireworks();
    }, [setCartItems, setTotalPrice, setTotalQuantities])
    
  return (
    <div className="success-wrapper">
        <div className="success">
        <p className="icon">
            <BsBagCheckFill />
        </p>
        <h2>Thank you for your order</h2>
        <h4>{response.fullname}</h4>
        <p className="email-msg">Your order has been processed and delivery is within 3-7 working Days</p>
        <p className="description">
            If you have any questions, please email
            <a className="email" href="mailto:order@example.com">
            order@example.com
            </a>
        </p>
        <Link to="/">
            <button type="button" width="300px" className="btn">
            Continue Shopping
            </button>
        </Link>
        </div>
    </div>
  )
}

export default Success