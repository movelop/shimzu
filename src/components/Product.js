import React from 'react'
import { TbCurrencyNaira } from 'react-icons/tb';
import { Link } from 'react-router-dom';

import { urlFor } from '../lib/client';

const Product = ({ product }) => {
  const { images, name, price, slug, color } = product;
  return (
    <div>
        <Link to={`/products/${slug.current}`} >
            <div className="product-card">
              <img 
                  src={ urlFor(images && images[0])} 
                  alt="product"
                  className="product-image"
              />
              <p className="product-name">{name} ({color})</p>
              <p className="product-price"><TbCurrencyNaira />{price.toLocaleString('en-US')}</p>
            </div>
      </Link>
    </div>
  )
}

export default Product;