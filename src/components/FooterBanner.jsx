import React from 'react'
import { Link } from 'react-router-dom';
import { urlFor } from '../lib/client';

const FooterBanner = ({ footerBanner }) => {
    const { discount, largeText1, largeText2, saleTime, smallText, midText, desc, product, buttonText, image } = footerBanner;
  return (
    <div className='footer-banner-container'>
        {footerBanner && (
            <div className="banner-desc">
                <div className="left">
                    <p>{discount}</p>
                    <h3>{largeText1}</h3>
                    <h3>{largeText2}</h3>
                    <p>{saleTime}</p>
                </div>
                <div className="right">
                    <p>{smallText}</p>
                    <h3>{midText}</h3>
                    <div className='company-desc'>{desc}</div>
                    <Link to={`/products/${product}`}>
                        <button type="button">{buttonText}</button>
                    </Link>
                </div>
                <img src={urlFor(image)} className="footer-banner-image" alt='footerBanner' />
            </div>
        )}
    </div>
  )
}

export default FooterBanner;