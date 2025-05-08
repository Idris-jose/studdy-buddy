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
              <span className="text-2xl flex items-center justify-center gap-1.5 font-bold text-gray-900"><BookOpen className='bg-blue-600 w-10 h-10 p-1  rounded text-white' /> Study Timetable</span>
            </div>
            <p className="text-gray-600 max-w-sm">
              Organize your study schedule efficiently and achieve your academic goals.
            </p>
          </div>

          {/* Empty column for spacing on large screens */}
          <div className="hidden lg:block"></div>

          {/* Newsletter Subscription */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Subscribe to our newsletter</h3>
            <p className="text-sm text-gray-600">Get the latest updates and tips delivered to your inbox.</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <label htmlFor="email-input" className="sr-only">Email address</label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby="email-description"
                />
                {subscriptionStatus === 'success' && (
                  <p id="email-description" className="mt-1 text-sm text-green-600">Thanks for subscribing!</p>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? 'Submitting...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-gray-200">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

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