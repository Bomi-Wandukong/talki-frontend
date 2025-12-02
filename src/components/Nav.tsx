import React from "react";

const Nav = () => {
  return (
    <div className="w-full fixed top-0 left-0 z-50">
      <header className="flex items-center justify-between px-12 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-10">
          <div className="flex items-center">
            <img src="/imgs/logo2.png" alt="Logo" className="w-23 mb-4" />
            <div className="flex items-center gap-10 ml-12">
              <span className="text-md fonSB text-[#ACA9FE] mb-[9px]">홈</span>
              <div className="flex flex-col items-center">
                <span className="text-md fonSB text-[#5650FF]">실전</span>
                <div className="h-px w-5 bg-[#5650FF] mt-2" />
              </div>
              <span className="text-md fonSB text-[#ACA9FE] mb-[9px]">
                연습
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-300" />
          <span className="text-sm text-gray-700">김톡희</span>
        </div>
      </header>
    </div>
  );
};

export default Nav;
