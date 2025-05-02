import React from 'react';

const Footer = () => {
  const footerSections = [
    {
      title: 'PRODUCT',
      links: ['Features', 'Pricing'],
    },
    {
      title: 'RESOURCES',
      links: ['Blog', 'User guides', 'Webinars'],
    },
    {
      title: 'COMPANY',
      links: ['About us', 'Contact us'],
    },
    {
      title: 'PLANS & PRICING',
      links: ['Personal', 'Start up', 'Organization'],
    },
  ];

  const socialIcons = [
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'YouTube', icon: '📺', url: '#' },
  ];

  return (
    <footer className="py-8 bg-gray-100 border-t mt-7 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">📊 Study Timetable</span>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <div key={index} className="text-center md:text-left">
              <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Language Selector, Copyright, and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6">
          {/* Language Selector */}
          <div className="mb-4 md:mb-0">
            <select className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>English</option>
            </select>
          </div>

          {/* Copyright */}
          <div className="text-gray-600 text-sm mb-4 md:mb-0">
            © 2024 Brand Inc. • Privacy • Terms • Sitemap
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="text-gray-600 hover:text-blue-600 text-2xl"
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