import React from 'react'
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { RiWhatsappFill } from 'react-icons/ri';

const Footer = () => {
  return (
    <div className='footer-container'>
      <p>@{new Date().getFullYear()} Shimzu Leather Brand All rights reserved</p>
      <p className="icons">
        <AiFillInstagram />
        <AiOutlineTwitter />
        <RiWhatsappFill />
      </p>
    </div>
  )
}

export default Footer;