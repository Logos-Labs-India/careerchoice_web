import { Link, useLocation } from "wouter";

const SectionNav = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    { path: "/dashboard", label: "Overview" },
    { path: "/results/riasec", label: "RIASEC Profile" },
    { path: "/results/aptitude", label: "Aptitude Assessment" },
    { path: "/results/ocean", label: "OCEAN Personality" },
    { path: "/results/careers", label: "Career Matches" },
  ];

  return (
    <div className="border-b border-gray-200 mb-8 overflow-x-auto">
      <nav className="flex -mb-px overflow-x-auto">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm sm:text-base focus:outline-none transition-colors ${
                isActive(item.path)
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SectionNav;
