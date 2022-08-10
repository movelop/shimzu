import React, { useState, useEffect } from 'react';
import { AiFillStar, AiOutlineMinus, AiOutlinePlus, AiOutlineStar } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import { TbCurrencyNaira } from 'react-icons/tb';

// import { products } from '../Assets/Data/data';
import { Loading, Product } from '../components';
import { useStateContext } from '../context/StateContext';
import { client, urlFor } from '../lib/client';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const location = useLocation();
  const slug = location.pathname.split('/')[2];
  const [index, setIndex] = useState(0);
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const { images, name, price, details, size, color } = product;
  const { decQty, incQty, qty, onAdd, setShowCart, loading, setLoading } = useStateContext();
  useEffect(() => {
    const getserverside = async() => {
      setLoading(true);
      const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
      const productsQuery = `*[_type == "product" && slug.current != '${slug}']`;
      const productData = await client.fetch(query);
      const productsData = await client.fetch(productsQuery);

      setProduct(productData);
      setProducts(productsData.sort(() => .5 - Math.random()).slice(0, 10));
      setLoading(false);
    }
    getserverside();
  },[slug, setLoading]);

  const handleAdd = () => {
    if(selectedSize !== "") {
      onAdd(product, qty, selectedSize);
    } else {
      toast.error('Please select a size');
    }
  }

  const handleBuyNow = () => {

    if(selectedSize !== '') {
      onAdd(product, qty, selectedSize);
      setShowCart(true);
    } else {
      toast.error('Please select a size');
    }
    
  };

  return (
    <div>
      {loading ? <Loading text={'Loading ...'} /> : (
        <>
          <div className="product-detail-container">
            <div>
              <div className="image-container">
                {images && <img src={ urlFor(images[index]) } alt='product' className='product-detail-image'/>}
              </div>
              <div className="small-images-container">
                {images?.map((item, i) => (
                  <img 
                    key={i}
                    src={urlFor(item)} 
                    alt="product-mini" 
                    className={i === index? 'small-image selected-image' : 'small-image'}
                    onMouseEnter={ () => setIndex(i) }
                    onClick={ () => setIndex(i) }
                  />  
                ))}
                </div>
            </div>
            <div className="product-detail-desc">
              <h1>{name}</h1>
              <div className="reviews">
                <div>
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiOutlineStar />
                </div>
                <p>
                  (20)
                </p>
              </div>
              <h4>Details: </h4>
              <p>{details}</p>
              <p className="price"><TbCurrencyNaira />{price?.toLocaleString('en-US')}</p>
              <div className="quantity">
                <h3>Quantity: </h3>
                <p className="quantity-desc">
                  <span className="minus" onClick={decQty}><AiOutlineMinus/></span>
                  <span className="num">{qty}</span>
                  <span className="plus" onClick={incQty}><AiOutlinePlus/></span>
                </p>
              </div>
              <div className="colors">
                <h3>Color:</h3>
                <span>{color}</span>
              </div>
              <div className="colors">
                <h3>Sizes:</h3>
                <div className="sizes">
                  {size?.map((item, i) => (
                    <div className="size" key={i}>
                      <label>{item}</label>
                      <input type="radio" name={selectedSize} value={item} onChange={() => setSelectedSize(item)} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="buttons">
                <button type='button' className="add-to-cart" onClick={handleAdd}>
                  Add to cart
                </button>
                <button type='button' className="buy-now" onClick={handleBuyNow}>
                  Buy now
                </button>
              </div>
            </div>
          </div>
          <div className="maylike-products-wrapper">
            <h2>You may also like</h2>
            <div className="marquee">
              <div className="maylike-products-container track">
                  {products?.map((item, i) => (
                      <Product key={i} product={item} />
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductDetails;