import { useEffect } from "react";

import "./reloj.css";

const Reloj = () => {
  const deg = 6;

  useEffect(() => {
    const hour = document.querySelector(".hour");
    const min = document.querySelector(".min");
    const sec = document.querySelector(".sec");

    const setClock = () => {
      let day = new Date();
      let hh = day.getHours() * 30;
      let mm = day.getMinutes() * deg;
      let ss = day.getSeconds() * deg;

      hour.style.transform = `rotateZ(${hh + mm / 12}deg)`;
      min.style.transform = `rotateZ(${mm}deg)`;
      sec.style.transform = `rotateZ(${ss}deg)`;
    };

    // Primera vez que se ejecuta la función
    setClock();
    // Se actualiza cada 1000 ms
    const intervalId = setInterval(setClock, 1000);

    // Función de limpieza para limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container-clock">
      <div className="clock">
        <div className="hour"></div>
        <div className="min"></div>
        <div className="sec"></div>
      </div>
    </div>
  );
};

export default Reloj;
