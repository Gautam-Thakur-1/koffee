import { Link } from "react-router-dom";

interface UserSidebarProps {
  activeLink: string;
  navLinks: { label: string; path: string }[];
  
}

const UserSidebar = ({ activeLink, navLinks }: UserSidebarProps) => {
  return (
    <div className="w-full h-full">
      <ul className="flex flex-col gap-y-4 w-full h-full">
        {navLinks.map((link) => (
          <li key={link.label} className="w-full">
            <Link to={link.path} className={`text-xl hover:text-black pl-2 ${activeLink === link.path ? "text-black" : "text-neutral-500"}`}>
              {link.label}
            </Link>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSidebar;
