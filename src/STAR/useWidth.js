import { useState, useEffect } from "react";

export default function useWidth(myRef) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      console.log("WIDTH", myRef.current.offsetWidth);
      setWidth(myRef.current.offsetWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef, width]);

  return width;
}
