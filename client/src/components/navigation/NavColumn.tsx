import React from 'react';
import NavItem from './NavItem';

interface NavColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

const NavColumn: React.FC<NavColumnProps> = ({ title, links }) => (
  <div className='text-center md:text-left '>
    <h4 className="text-lg font-semibold mb-4">{title}</h4>
    <ul className="space-y-3 ">
      {links.map((link, index) => (
        <NavItem key={index} label={link.label} href={link.href} />
      ))}
    </ul>   
  </div>
);

export default NavColumn;