import React, { useEffect , useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import { client } from '../lib/client';
import { useStateContext } from '../context/StateContext';
import { FooterBanner, HeroBanner, Loading, Product } from '../components';

const Home = () => {
  const { loading, setLoading } = useStateContext();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 })
  useEffect(() => {
    const getserverside = async() => {
      setLoading(true);
      const query = '*[_type == "product"]';
      const productsData = await client.fetch(query);

      const bannerQuery = '*[_type == "banner"]';
      const bannerData = await client.fetch(bannerQuery);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setBanners(bannerData);
      setLoading(false);
    }
    getserverside();
  }, [setLoading])

  const handleFilters = (e) => {
    const value = e.target.value
    setAnimateCard([{ y: 100, opacity: 0 }]);

    setTimeout(() => {
      setAnimateCard([{ y: 0, opacity: 1 }]);
      if(value === 'all') {
        setFilteredProducts(products)
      } else {
        const foundProduct = products.filter((product) => product.categories.includes(value));
        if(foundProduct.length < 1) {
          setFilteredProducts(products);
          toast.error(`No product found for ${value} category`);
        } else {
          setFilteredProducts(foundProduct);
        }
      }
    }, 500);
  }
  
  return (
    <div>
      { loading ? <Loading text={'Loading ...'} /> : (
        <div>
            {banners.length > 0 && <HeroBanner heroBanner = {banners.length && banners[0]} />}
            {products.length && <div className="products-heading">
              <h2>Best Selling Products</h2>
              <p>Footwears of many variations</p>
            </div>}
            {products.length && <div className="filters">
              <div className="select">
                <select id="standard-select" onChange = {handleFilters}>
                  <option value="all">All categories</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="shoes">Shoes</option>
                  <option value="slippers">Slippers</option>
                  <option value="coporate">Coporate </option>
                </select>
              </div>
            </div>}
              <motion.div 
                animate = {animateCard}
                transition={{ duration: 0.5, delayChildren: 0.5 }}
                className="products-container"
              >
              {filteredProducts.map((product, i) => <Product key={i} product={product} /> )}
            </motion.div>
            
            
            {banners.length > 0  && <FooterBanner footerBanner ={banners.length && banners[0]} />}
        </div>
    ) }
    </div>
  )
}

export default Home;