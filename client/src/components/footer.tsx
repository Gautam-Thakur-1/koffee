import React from 'react';
import NavColumn  from './navigation/NavColumn';

// Link data structured for scalability
const footerLinks = [
  { title: 'About Us', links: [{ label: 'Team', href: '/' }, { label: 'Careers', href: '/' }, { label: 'Blog', href: '/' }] },
  { title: 'Services', links: [{ label: 'Real Time Documente sharing', href: '/' }, { label: 'Faster and Reliable', href: '/' }, { label: 'Remote Live Editing Access', href: '/' }] },
  { title: 'Contact', links: [{ label: 'Email', href: '/' }, { label: 'Support', href: '/' }, { label: 'FAQ', href: '/' }] },
];

const Footer: React.FC = () => {
  return (
    <footer className="absolute mt-8 rounded bg-gray-900  w-full  text-white px-4 py-4">
      {/* <div className="absolute inset-0 bg-no-repeat bg-center bg-[url('../src/assets/logo.svg')] -z-10000 opacity-30"></div> */}
      {/* <div className="absolute top-3 slide-out-to-left-1/4 w-1/2 h-1/4  bg-purple-500 rounded-full filter blur-[128px] opacity-20" />
      <div className="absolute bottom-1/4 slide-out-to-right-1 w-1/2 h-1/4 bg-blue-500 rounded-full filter blur-[128px] opacity-20" /> */}
      <div className="container  py-3 mx-auto grid grid-cols-1 justify-items-center sm:grid-cols-3 gap-8 ">
        {footerLinks.map((column, index) => (
          <NavColumn key={index} title={column.title} links={column.links} />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
