import React, { useRef, useState } from 'react'
import { AiOutlineLeft, AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import { TbCurrencyNaira } from 'react-icons/tb';
import { TiDeleteOutline } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import { client } from '../lib/client';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import { Loading } from '.'

const Cart = () => {
  const cartRef = useRef();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
  });
  const [shippingAddress, setShippingAddress] = useState({
      address: '',
      city: '',
      postalCode: '',
      country: '',
  })
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [pay, setPay] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove, loading, setLoading } = useStateContext();
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleAddressChange = (e) => {
    setShippingAddress({...shippingAddress, [e.target.name]: e.target.value  });
  };

  const handleClick = (e) => {
    if(e.target.classList.contains('cart-wrapper')){
      setShowCart(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    for (let val in formData) {
      if (formData[val] === "") {
        setMsg("You must Fill Out Every Field");
        return setError(true);
      }
    }
    if (isNaN(Number(formData.phone))) {
      setMsg("Phone number must only contain numbers");
      return setError(true);
    }
    if (/.+@.+\..+/.test(formData.email) === false) {
      setMsg("Must be a valid email");
      return setError(true);
    }
    for (let val in shippingAddress) {
      if (shippingAddress[val] === "") {
        setMsg("You must Fill Out Every Field");
        return setError(true);
      }
    }
    setPay(true);
  }

  const handleSuccess = async(reference) => {
    const newOrder = {
      _id: reference,
      _type: 'order',
      email: formData.email,
      fullname: formData.fullname,
      phone: formData.phone,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      createdAt: new Date().toISOString(),
      orderItems: cartItems.map((x) => ({
        ...x,
        _type: undefined,
        categories: undefined,
        slug: undefined,
        _key: uuidv4(),
        details: undefined,
        size: undefined,
      }))
    } 
    setLoading(true)
    const response = await client.create(newOrder)
    setLoading(false);
    setShowCart(false);
    navigate(`/success`, { state: { response: response } })

  }

  const componentProps = {
    email: formData.email,
    name: formData.fullname,
    amount: totalPrice * 100,
    metadata: {
      name: formData.fullname,
      phone: formData.phone,
    },
    publicKey: publicKey,
    text: "Continue to payment",
    onSuccess: (reference) =>{
      handleSuccess(reference.reference);
    },   
    onClose: () => alert("Wait! Don't leave :("),
  }

  console.log(cartItems);
  
  return (
    <div className='cart-wrapper' ref={cartRef} onClick={handleClick}>
      <div className="cart-container">
        {loading ? <Loading text={'Processing...'} /> :(
          <>
          {!checkout && <button type='button' className="cart-heading" onClick={() => setShowCart(false)}>
            <AiOutlineLeft />
            <span className="heading">Your Cart</span>
            <span className="cart-num-items">({totalQuantities} items)</span>
          </button>}

          {checkout && <button type='button' className="cart-heading" onClick={() => setCheckout(false)}>
            <AiOutlineLeft />
            <span className="heading">Back to Cart</span>
          </button>}

          {cartItems.length < 1 && (
            <div className="empty-cart">
              <AiOutlineShopping size={150}/>
              <h3>Your shopping cart is empty</h3>
              <Link to="/">
                <button
                  type="button"
                  onClick={() => setShowCart(false)}
                  className="btn"
                >
                  Continue Shopping
                </button>
              </Link>
            </div>
          )}

          <div className="product-container">
            {cartItems.length >= 1 && !checkout && cartItems.map((item, i) => (
              <div className="product" key={item._id + i}>
                <img src={urlFor(item?.images[0])} alt="product" className='cart-product-image'/>
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name} ({item.preferredSize})</h5>
                    <h4><TbCurrencyNaira />{item.price?.toLocaleString('en-US')}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span className="minus" onClick={() => toggleCartItemQuantity(item.uniqueCode, 'dec')}>
                          <AiOutlineMinus/>
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span className="plus" onClick={() => toggleCartItemQuantity(item.uniqueCode, 'inc')}>
                          <AiOutlinePlus/>
                        </span>
                      </p>
                    </div>
                  <button type='button' className="remove-item" onClick={() => onRemove(item)}>
                    <TiDeleteOutline />
                  </button>
                </div>
                </div>
              </div>
            ))}
            {checkout &&  <div className="customer-details">
                <h3>Customer Details:</h3>
                <form>
                  {error && <span className="error-message">{msg}</span>}
                  <div className="form-input">
                    <label>Full Name</label>
                    <input type="text" name='fullname' onChange={handleChange} />
                  </div>
                  <div className="form-input">
                    <label>Email</label>
                    <input type="email" name='email' onChange={handleChange} />
                  </div>
                  <div className="form-input">
                    <label>Phone No</label>
                    <input type="tel" name="phone" onChange={handleChange} />
                  </div>
                  <div className="form-input">
                    <label>Address</label>
                    <input type="text" name='address' onChange={handleAddressChange} />
                  </div>
                  <div className="form-input">
                    <label>City</label>
                    <input type="text" name='city' onChange={handleAddressChange} />
                  </div>
                  <div className="form-input">
                    <label>Postal code</label>
                    <input type="text" name='postalCode' onChange={handleAddressChange} />
                  </div>
                  <div className="form-input">
                    <label>Country</label>
                    <input type="text" name='country' onChange={handleAddressChange} />
                  </div>
                </form>
              </div>}
          </div>
          {cartItems.length >= 1 && (
            <div className='cart-bottom'>
              <div className="total">
                <h3>Subtotal: </h3>
                <h3><TbCurrencyNaira />{totalPrice.toLocaleString('en-US')}</h3>
              </div>
              
              <div className="btn-container"> 
                {pay ? <PaystackButton {...componentProps} className='btn pay' />:checkout? <button type='button' className="btn" onClick={handleSubmit}>
                  Confirm Details
                </button>: <button type='button' className="btn" onClick={() => setCheckout(true)}>
                  Continue to checkout
                </button>}
              </div>
            </div>
          )}
        </>)}
      </div>
    </div>
  )
}

export default Cart;