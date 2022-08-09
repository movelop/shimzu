import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid'; 

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);

    let foundProduct;

    useEffect(() => {
        const cart = localStorage.getItem('cartItems')? JSON.parse(localStorage.getItem('cartItems')) : [];
        const price = localStorage.getItem('totalPrice') ? JSON.parse(localStorage.getItem('totalPrice')) : 0;
        const quantities = localStorage.getItem('totalQuantities') ? JSON.parse(localStorage.getItem('totalQuantities')) : 0;

        setCartItems(cart);
        setTotalPrice(price);
        setTotalQuantities(quantities);
    },[]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);
  
    useEffect(() => {
        localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
    } , [totalPrice]);
  
    useEffect(() => {
        localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities));
    } , [totalQuantities]);

    const onAdd = (product, quantity, selectedSize) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id && item.preferredSize  === selectedSize);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
        const choice = product;
        if(checkProductInCart) {

            const updatedCartItems = cartItems.map(item => {
                if(item._id === product._id) return {
                    ...item,
                    quantity: item.quantity + quantity
                }
                return cartItems
            })
            setCartItems(updatedCartItems);
        } else {
            choice.quantity = quantity;
            choice.preferredSize = selectedSize;
            choice.uniqueCode = uuidv4();
            setCartItems([...cartItems, { ...choice }]);
        }

        toast.success(`${qty} ${product.name} added to the cart.`);
        // setQty(1);
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find(item => item._id === product._id);
        const newCartItems = cartItems.filter(item => item._id !== product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
    }

    const toggleCartItemQuantity =(id, value) => {
        
        foundProduct = cartItems.find(item => item.uniqueCode === id);

        if(value === 'inc') {
            foundProduct.quantity += 1;
            const newCartItems = cartItems.map((item) => {
                if(foundProduct.uniqueCode === item.uniqueCode) return foundProduct;

                return item;    
            });
            setCartItems(newCartItems);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if (value === 'dec') {
            if(foundProduct.quantity > 1){
                foundProduct.quantity -= 1;
                const newCartItems = cartItems.map((item) => {
                    if(foundProduct.uniqueCode === item.uniqueCode) return foundProduct;

                    return item;
                })

                setCartItems(newCartItems);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }

    const incQty = () => {
        setQty((prev) => prev + 1);
    };

    const decQty = () => {
        setQty((prev) => {
            if(prev - 1 < 1) {
                return 1;
            } else {
                return prev - 1;
            }
        })
    }

    return (
        <Context.Provider 
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
                loading,
                setLoading,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);