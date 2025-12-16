import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const routes = [
    { name: 'Resume Builder', path: '/resume-builder' },
    { name: 'ATS Checker', path: '/ats-checker' },
    { name: 'Cover Letter', path: '/cover-letter' },
    // Add other routes as needed
  ];

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Resume Builder
        </Link>
        <div className="space-x-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`hover:text-blue-300 ${
                pathname === route.path ? 'text-blue-300' : ''
              }`}
            >
              {route.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;