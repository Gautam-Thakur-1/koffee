import { Link } from "react-router-dom";

const routes = [
  {
    label: "Features",
    path: "/#features",
  },
  {
    label: "Pricing",
    path: "/#pricing",
  },
];

const NavRoutes = () => {
  return (
    <ul className="flex items-center gap-x-4">
      {routes.map((route, index) => (
        <li key={index}>
          <Link to={route.path} className="hover:underline">
            {route.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavRoutes;
