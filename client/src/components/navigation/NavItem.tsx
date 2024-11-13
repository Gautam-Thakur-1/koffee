import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  label: string;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ label, href }) => (
  <li>
    <Link to={href} className="text-gray-400 hover:text-white transition duration-200">
      {label}
    </Link>
  </li>
);

export default NavItem;
