import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditAccountModal from "./EditAccountModal";
import CreateAccountModal from "./CreateAccountModal";
import ProfileListModal from "./ProfileListModal";

export default function AccountTable() {
  const [cuentas, setCuentas] = useState([]);
  const [cuentaEditar, setCuentaEditar] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [modalPerfilesAbierto, setModalPerfilesAbierto] = useState(false);
  const [perfilesActivos, setPerfilesActivos] = useState([]);
  const [cuentaPerfilesId, setCuentaPerfilesId] = useState(null);
  const [filtroServicio, setFiltroServicio] = useState("Todos");

  const abrirModal = (cuenta) => {
    setCuentaEditar(cuenta);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCuentaEditar(null);
  };

  useEffect(() => {
    obtenerCuentas();
  }, []);

  const obtenerCuentas = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://streaming-backend-gl1f.onrender.com/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCuentas(res.data))
      .catch((err) => console.error("Error al obtener cuentas:", err));
  };

  const eliminarCuenta = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar esta cuenta?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://streaming-backend-gl1f.onrender.com/api/accounts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      obtenerCuentas();
    } catch (err) {
      alert("Error al eliminar la cuenta");
    }
  };

  const serviciosUnicos = ["Todos", ...new Set(cuentas.map((c) => c.nombreServicio))];

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pt: 2, pb: 1 }}>
          <Typography variant="h6">Cuentas de Streaming</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Filtrar</InputLabel>
              <Select
                value={filtroServicio}
                label="Filtrar"
                onChange={(e) => setFiltroServicio(e.target.value)}
              >
                {serviciosUnicos.map((servicio) => (
                  <MenuItem key={servicio} value={servicio}>
                    {servicio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={() => setModalNuevoAbierto(true)}>
              Agregar cuenta
            </Button>
          </Stack>
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Servicio</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Perfiles</TableCell>
              <TableCell>Disponibilidad</TableCell>
              <TableCell>Expira</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Ver Perfiles</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cuentas
              .filter((cuenta) => filtroServicio === "Todos" || cuenta.nombreServicio === filtroServicio)
              .map((cuenta) => {
                const libres = cuenta.perfiles.filter((p) => p.estadoPerfil === "Libre").length;
                const total = cuenta.perfiles.length;
                const hayDisponibles = libres > 0;

                return (
                  <TableRow key={cuenta._id}>
                    <TableCell>{cuenta.nombreServicio}</TableCell>
                    <TableCell>{cuenta.correoAcceso}</TableCell>
                    <TableCell>{cuenta.perfiles.map((p) => p.nombrePerfil).join(", ")}</TableCell>
                    <TableCell>
                      <Tooltip title={`${libres} disponibles de ${total}`}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: hayDisponibles ? "green" : "red",
                            mx: "auto",
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {cuenta.fechaExpiracion
                        ? new Date(cuenta.fechaExpiracion).toLocaleDateString()
                        : "Sin fecha"}
                    </TableCell>
                    <TableCell>{cuenta.notasAdicionales || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setPerfilesActivos(cuenta.perfiles);
                          setCuentaPerfilesId(cuenta._id);
                          setModalPerfilesAbierto(true);
                        }}
                      >
                        Ver
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => abrirModal(cuenta)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton color="error" onClick={() => eliminarCuenta(cuenta._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <EditAccountModal open={modalAbierto} onClose={cerrarModal} account={cuentaEditar} onSave={obtenerCuentas} />
      <CreateAccountModal open={modalNuevoAbierto} onClose={() => setModalNuevoAbierto(false)} onSave={obtenerCuentas} />
      <ProfileListModal open={modalPerfilesAbierto} onClose={() => setModalPerfilesAbierto(false)} perfiles={perfilesActivos} accountId={cuentaPerfilesId} onSave={obtenerCuentas} />
    </>
  );
}
