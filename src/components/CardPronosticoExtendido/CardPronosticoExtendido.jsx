import { useRef } from "react";

import PropTypes from "prop-types";

import "./card-pronostico-extendido.css";

const CardPronosticoExtendido = ({ dia }) => {
  CardPronosticoExtendido.propTypes = {
    dia: PropTypes.object.isRequired,
  };

  const cardRef = useRef(null);

  const rotateToMouse = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const bounds = cardRef.current.getBoundingClientRect();
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    cardRef.current.style.transform = `
        scale3d(1.07, 1.07, 1.07)
        rotate3d(
          ${center.y / 100},
          ${-center.x / 100},
          0,
          ${Math.log(distance) * 2}deg
        )
      `;

    cardRef.current.querySelector(".glow").style.backgroundImage = `
        radial-gradient(
          circle at
          ${center.x * 2 + bounds.width / 2}px
          ${center.y * 2 + bounds.height / 2}px,
          #ffffff55,
          #0000000f
        )
      `;
  };

  const handleMouseEnter = () => {
    document.addEventListener("mousemove", rotateToMouse);
  };

  const handleMouseLeave = () => {
    document.removeEventListener("mousemove", rotateToMouse);
    cardRef.current.style.transform = "";
    cardRef.current.querySelector(".glow").style.backgroundImage = "";
  };

  const nombreDia = (fecha) => {
    const fechaFormateada = new Date(fecha);
    const nombreDia = fechaFormateada.toLocaleDateString("es-ES", {
      weekday: "long",
    });
    return nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);
  };

  return (
    <div
      className="card"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      key={dia.date}
    >
      <div className="card-pronosticos">
        <div className="contenedor-fecha">
          <h1>{nombreDia(dia.date)} </h1>
        </div>
        <div className="contenedor-icono">
          <img src={dia.day.condition.icon} alt="" />
        </div>
        <div className="contenedor-temperatura">
          <h3>{dia.day.mintemp_c}°C</h3>
          <h3>{dia.day.maxtemp_c}°C</h3>
        </div>
        <div className="contenedor-descripcion">
          <h4>{dia.day.condition.text}</h4>
        </div>
      </div>
      <div className="glow" />
    </div>
  );
};

export default CardPronosticoExtendido;
