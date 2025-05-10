import React, { useState } from 'react';
import { Twitter, Facebook, Instagram, Youtube, ChevronDown,BookOpen } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'User guides', href: '/guides' },
        { name: 'Webinars', href: '/webinars' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About us', href: '/about' },
        { name: 'Contact us', href: '/contact' },
      ],
    },
    {
      title: 'Plans & Pricing',
      links: [
        { name: 'Personal', href: '/pricing/personal' },
        { name: 'Start up', href: '/pricing/startup' },
        { name: 'Organization', href: '/pricing/organization' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: <Twitter size={20} />, href: 'https://twitter.com/studytimetable' },
    { name: 'Facebook', icon: <Facebook size={20} />, href: 'https://facebook.com/studytimetable' },
    { name: 'Instagram', icon: <Instagram size={20} />, href: 'https://instagram.com/studytimetable' },
    { name: 'YouTube', icon: <Youtube size={20} />, href: 'https://youtube.com/studytimetable' },
  ];

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscriptionStatus('success');
      setEmail('');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubscriptionStatus(null);
      }, 3000);
    }, 1000);
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10 border-b border-gray-200">
          {/* Logo & Tagline */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <span className="text-2xl flex items-center justify-center gap-1.5 font-bold text-gray-900"><BookOpen className='bg-blue-600 w-10 h-10 p-1  rounded text-white' /> Study Buddy</span>
            </div>
            <p className="text-gray-600 max-w-sm">
              Organize your study schedule efficiently and achieve your academic goals.
            </p>
          </div>

          {/* Empty column for spacing on large screens */}
          <div className="hidden lg:block"></div>

          {/* Newsletter Subscription */}
         
        </div>

        {/* Footer Links */}
       
        {/* Bottom Section: Language, Copyright, Social */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 gap-4">
          {/* Language Selector */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 space-x-2 cursor-pointer hover:bg-gray-50">
              <span className="text-sm text-gray-700">English</span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            <h1 className='text-blue-600'>Made by idris </h1>
            © {new Date().getFullYear()} Study Buddy• 
            <a href="/privacy" className="hover:text-blue-600 ml-1 mr-1">Privacy</a> • 
            <a href="/terms" className="hover:text-blue-600 mr-1">Terms</a> • 
            <a href="/sitemap" className="hover:text-blue-600">Sitemap</a>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={`Follow us on ${social.name}`}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;