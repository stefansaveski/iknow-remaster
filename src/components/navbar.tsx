"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faBars, faTimes, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { icon: faUser, label: 'Профил', href: '/students/profile' },
    { icon: faBookmark, label: 'Семестри', href: '/students/semesters' },
    { icon: faBook, label: 'Предмети', href: '/students/subjects' },
    { icon: faPenToSquare, label: 'Пријави', href: '/students/applications' },
    { icon: faListCheck, label: 'Положени', href: '/students/exams' },
    { icon: faFilePdf, label: 'Документи', href: '/students/documents' }
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex flex-row gap-2 justify-evenly bg-primary text-white p-7 rounded-xl my-5 text-xl">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div className="group flex flex-row items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white hover:bg-opacity-20 hover:scale-105 hover:shadow-lg hover:text-primary">
              <FontAwesomeIcon icon={item.icon} className="transition-transform duration-300 group-hover:rotate-12" />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-primary text-white rounded-xl my-5">
        <div className="flex justify-between items-center p-4">
          {/* IKnow Logo/Text */}
          <div className="flex items-center gap-2 text-xl font-bold">
            <FontAwesomeIcon icon={faGraduationCap} className="text-xl" />
            IKnow
          </div>
          
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors duration-300"
          >
            <FontAwesomeIcon 
              icon={isMenuOpen ? faTimes : faBars} 
              className="text-xl transition-transform duration-300"
            />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pb-4 space-y-2">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <div className="group flex flex-row items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white hover:bg-opacity-20 hover:text-primary">
                  <FontAwesomeIcon icon={item.icon} className="transition-transform duration-300 group-hover:rotate-12" />
                  <span className="text-lg">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
