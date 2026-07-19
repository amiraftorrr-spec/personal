import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {

  const cursor = useRef(null);

  useEffect(() => {

    const move = (e) => {

      gsap.to(cursor.current,{

        x:e.clientX,

        y:e.clientY,

        duration:.15

      })

    }

    window.addEventListener("mousemove",move)

    return ()=>window.removeEventListener("mousemove",move)

  },[])

  return(

    <div

      ref={cursor}

      className="
      fixed
      w-6
      h-6
      rounded-full
      border
      border-[#c8a96e]
      pointer-events-none
      z-[9999]
      -translate-x-1/2
      -translate-y-1/2
      "

    />

  )

}