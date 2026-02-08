import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IMAGES } from '@/utils/images';

interface MenuItem {
  name: string;
  linkTo: string;
  activePath: string;
  isReady: boolean;
}

const Nav: React.FC = () => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { name: '홈', linkTo: '/home', activePath: '/home', isReady: true },
    { name: '실전', linkTo: '/actual/guideline', activePath: '/actual', isReady: true },
    { name: '연습', linkTo: '/practice', activePath: '/practice', isReady: false },
  ];


  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem) => {
    if (!item.isReady) {
      e.preventDefault(); 
      alert("준비 중이에요!");
    }
  };

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-12 py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={IMAGES.purplelogo} alt="Logo" className="w-[90px] my-2 mb-3" />
          </Link>

          <nav className="ml-12 flex items-center gap-10">
            {menuItems.map((item) => {
              const isActive = item.activePath === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.activePath);
              return (
                <Link
                  key={item.activePath}
                  to={item.linkTo}
                  onClick={(e) => handleLinkClick(e, item)}
                  className="relative flex flex-col items-center py-2 pt-4"
                >
                  <span
                    className={`text-[17px] fontRegular transition-colors ${
                      isActive ? 'text-[#5650FF]' : 'text-[#ACA9FE]'
                    }`}
                  >
                    {item.name}
                  </span>
                  
                  {isActive && (
                    <div className="absolute -bottom-[1px] h-[2px] w-full bg-[#5650FF]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-gray-300" />
          <span className="text-[16px] font-medium text-[#3B3B3B]">김톡희</span>
        </div>
      </header>
    </div>
  );
};

export default Nav;