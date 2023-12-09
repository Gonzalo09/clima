import { useEffect, useState } from "react";
import { config } from "../../config/config";

import Reloj from "../Reloj/Reloj";
import CardPronosticoExtendido from "../CardPronosticoExtendido/CardPronosticoExtendido";

import "./card.css";

const Card = () => {
  const provinciaElegida = localStorage.getItem("provinciaElegida");
  const departamentoElegido = localStorage.getItem("departamentoElegido");

  const [data, setData] = useState(null);
  const [provincias, setProvincias] = useState([]);
  const [provincia, setProvincia] = useState(
    provinciaElegida || "Buenos Aires"
  );
  const [departamentos, setDepartamentos] = useState([]);
  const [departamento, setDepartamento] = useState(
    departamentoElegido || "25 de Mayo"
  );

  useEffect(() => {
    const traerProvincias = async () => {
      const res = await fetch(
        `${config.apiGeoRefUrl}/provincias?orden=nombre&aplanar=true&campos=estandar&max=1000&exacto=true`
      );
      const data = await res.json();
      setProvincias(data.provincias);
    };
    const traerDepartamentos = async () => {
      const res = await fetch(
        `${config.apiGeoRefUrl}/departamentos?provincia=${provincia}&orden=nombre&aplanar=true&campos=estandar&max=1000&exacto=true`
      );
      const data = await res.json();
      setDepartamentos(data.departamentos);
    };

    traerProvincias();
    traerDepartamentos();
  }, [provincia]);

  useEffect(() => {
    const traerDatos = async () => {
      const res = await fetch(
        `${config.apiUrl}/forecast.json?key=${config.apiKey}&q=${
          provincia + " " + departamento
        }&days=6&aqi=yes&alerts=yes&lang=es`
      );
      const data = await res.json();
      setData(data);
    };
    traerDatos();
  }, [provincia, departamento]);

  const handleChangeProvincia = (e) => {
    setProvincia(e.target.value);
    localStorage.setItem("provinciaElegida", e.target.value);
  };

  const handleChangeDepartamento = (e) => {
    setDepartamento(e.target.value);
    localStorage.setItem("departamentoElegido", e.target.value);
  };

  const formatoFecha = (fecha) => {
    const fechaFormateada = new Date(fecha);
    const dia = fechaFormateada.getDate();
    const mes = fechaFormateada.getMonth() + 1;
    const anio = fechaFormateada.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  const escalaCalidadDelAire = (indice) => {
    const calidadDelAire = {
      0: "Excelente",
      20: "Normal",
      50: "Deficiente",
      100: "Insalubre",
      150: "Muy insalubre",
      250: "Peligroso",
    };

    let etiqueta = "No disponible";

    Object.keys(calidadDelAire).forEach((rango) => {
      if (indice >= rango) {
        etiqueta = calidadDelAire[rango];
      }
    });

    return etiqueta;
  };

  return (
    <div className="container">
      <div className="container-datos-extra">
        <div className="datos-extra datos-extra-posicion">
          <div className="contenedor-cambio-locacion">
            <div className="contenedor-provincia">
              <select
                name="provincia"
                id="provincia"
                value={provincia}
                onChange={handleChangeProvincia}
              >
                {provincias.map((provincia) => (
                  <option
                    value={provincia.nombre
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")}
                    key={provincia.id}
                  >
                    {provincia.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="contenedor-departamento">
              <select
                name="departamento"
                id="departamento"
                value={departamento}
                onChange={handleChangeDepartamento}
              >
                {departamentos.map((departamento) => (
                  <option
                    value={departamento.nombre
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")}
                    key={departamento.id}
                  >
                    {departamento.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="contenedor-info">
            <h2>Hoy</h2>
            <div className="contenedor-info-detallada">
              <span className="titulo-info">Visibilidad</span>
              <span className="valor-info">
                {data && data.current.vis_km} km
              </span>
            </div>
            <div className="contenedor-info-detallada">
              <span className="titulo-info">Humedad</span>
              <span className="valor-info">
                {data && data.current.humidity}%
              </span>
            </div>
            <div className="contenedor-info-detallada">
              <span className="titulo-info">Viento</span>
              <span className="valor-info">
                {data && data.current.wind_kph} km/h
              </span>
            </div>
            <div className="contenedor-info-detallada">
              <span className="titulo-info">Presión</span>
              <span className="valor-info">
                {data && data.current.pressure_mb} mb
              </span>
            </div>
            <div className="contenedor-info-detallada">
              <span className="titulo-info">Índice UV</span>
              <span className="valor-info">{data && data.current.uv}</span>
            </div>
            <div className="contenedor-info-detallada">
              <span className="titulo-info">Calidad del aire</span>
              <span className="valor-info">
                {data && escalaCalidadDelAire(data.current.air_quality["no2"])}{" "}
                ({data && Math.round(data.current.air_quality["no2"])})
              </span>
            </div>
          </div>
          <h2>Extendido</h2>
          <div className="contenedor-cards">
            {data &&
              data.forecast.forecastday.map((dia) => (
                <CardPronosticoExtendido dia={dia} key={dia.date} />
              ))}
          </div>
        </div>
      </div>
      <div className="container-datos-principales">
        <div className="datos-principales ">
          <div className="datos-principales__inner">
            <h2>
              {data && data.location.name} - {data && data.location.region}{" "}
              <br />
              {data && data.location.country}
              <br />
              <br />
              {data && formatoFecha(data.location.localtime)}
            </h2>
            <div className="temperatura">
              <h1>{data && data.current.temp_c}°C</h1>
              <h4>{data && data.current.condition.text}</h4>
            </div>

            <div className="reloj">
              <Reloj />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
