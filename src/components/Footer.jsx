import React from 'react'
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { RiWhatsappFill } from 'react-icons/ri';

const Footer = () => {
  return (
    <div className='footer-container'>
      <p>@{new Date().getFullYear()} Shimzu Leather Brand All rights reserved</p>
      <div className="icons">
        <a href="https://www.instagram.com/shimzuleatherbrand/" target="_blank" rel="noopener noreferrer" >
          <AiFillInstagram />
        </a>
        <a href="https://www.instagram.com/shimzuleatherbrand/" target="_blank" rel="noopener noreferrer" >
          <AiOutlineTwitter />
        </a>
        <a href="https://www.instagram.com/shimzuleatherbrand/" target="_blank" rel="noopener noreferrer" >
          <RiWhatsappFill />
        </a>
      </div>
    </div>
  )
}

export default Footer;