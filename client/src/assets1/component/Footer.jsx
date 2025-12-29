import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-stone-800 text-stone-300 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2 font-semibold text-white">Gramin Vikas Portal - Empowering Rural India</p>
        <p className="text-sm">
          © {new Date().getFullYear()} All Rights Reserved. | 
          <span className="mx-2 text-amber-500 hover:underline cursor-pointer">Privacy Policy</span> | 
          <span className="mx-2 text-amber-500 hover:underline cursor-pointer">Terms of Service</span>
        </p>
        <p className="text-xs mt-4 text-stone-500">
          Digital India Initiative | Connected Gram Panchayat
        </p>
      </div>
    </footer>
  );
};

export default Footer;