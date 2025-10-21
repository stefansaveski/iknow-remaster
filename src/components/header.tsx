"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logos and University Info */}
          <div className="flex items-center gap-4">
            {/* UKIM Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/ukim-logo.png"
                alt="UKIM Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            
            {/* FINKI Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/finki-logo.png"
                alt="FINKI Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            
            {/* University Text */}
            <div className="hidden sm:block">
              <div className="text-gray-900 font-medium text-sm">
                Универзитет „Св. КИРИЛ И МЕТОДИЈ“ - Скопје
              </div>
              <div className="text-gray-700 text-sm">
                Факултет за информатички науки и компјутерско инженерство
              </div>
            </div>
          </div>

          {/* Right side - User Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full">
                <FontAwesomeIcon icon={faUser} className="text-sm" />
              </div>
              
              {/* User Name */}
              <div className="hidden sm:block text-gray-900 font-medium">
                Стефан Савески
              </div>
              
              {/* Logout Button */}
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
