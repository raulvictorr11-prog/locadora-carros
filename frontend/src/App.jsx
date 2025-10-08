import React, { useEffect, useState } from "react";

const API = "http://localhost:4000/api"; // coloque sua URL do backend hospedado

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    fetch(`${API}/vehicles`).then(r => r.json()).then(setVehicles);
    fetch(`${API}/clients`).then(r => r.json()).then(setClients);
    fetch(`${API}/rentals`).then(r => r.json()).then(setRentals);
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>🚗 Sistema de Locação</h1>

      <section>
        <h2>Veículos</h2>
        <ul>
          {vehicles.map(v => (
            <li key={v.id}>{v.brand} {v.model} ({v.year}) - R${v.daily_price}/dia</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Clientes</h2>
        <ul>
          {clients.map(c => (
            <li key={c.id}>{c.full_name} - {c.email}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Locações</h2>
        <ul>
          {rentals.map(r => (
            <li key={r.id}>
              Cliente {r.client_name} → {r.vehicle_model} | {r.status}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
