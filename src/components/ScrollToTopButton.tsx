import { useState, useEffect, useRef } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const prevScrollPos = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollPos = window.scrollY;

      // if (currentScrollPos < prevScrollPos.current && currentScrollPos !== 0) {
      if (currentScrollPos === 0) {
        setIsVisible(false);
      } else if (currentScrollPos < prevScrollPos.current) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      prevScrollPos.current = currentScrollPos;
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full focus:outline-none"
      >
        <FaArrowCircleUp className="w-6 h-6 md:w-7 md:h-7 animate-bounce" />
      </button>
    </div>
  );
}

export default ScrollToTopButton;