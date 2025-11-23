import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import AccountTable from '../components/AccountTable';
import Navbar from "../components/Navbar"; // ajusta la ruta si es necesario

export default function DashboardPage() {
  const [cuentas, setCuentas] = useState([]);
  const [resumen, setResumen] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/accounts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setCuentas(res.data);
      generarResumen(res.data);
    })
    .catch(err => {
      console.error('Error al obtener cuentas:', err);
    });
  }, []);

  const generarResumen = (data) => {
    const total = data.length;
    const servicios = {};

    data.forEach(cuenta => {
      const servicio = cuenta.nombreServicio;
      servicios[servicio] = (servicios[servicio] || 0) + 1;
    });

    setResumen({ total, servicios });
  };

  return (
    <Container>
      <Box my={4}>
        <Navbar />
        <br/>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Total de cuentas</Typography>
              <Typography>{resumen.total}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              
              <Typography variant="h6">Cuentas por servicio</Typography>
              {Object.entries(resumen.servicios || {}).map(([servicio, cantidad]) => (
                <Typography key={servicio}>{servicio}: {cantidad}</Typography>
              ))}
            </Paper>
          </Grid>
        </Grid>
        <AccountTable />
      </Box>
    </Container>
  );
}
