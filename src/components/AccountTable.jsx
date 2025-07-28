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
    const confirmar = window.confirm(
      "¿Estás seguro de que quieres eliminar esta cuenta?"
    );
    if (!confirmar) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://streaming-backend-gl1f.onrender.com/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      obtenerCuentas(); // Recarga lista después de eliminar
    } catch (err) {
      alert("Error al eliminar la cuenta");
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, pt: 2 }}
        >
          <Typography variant="h6">Cuentas de Streaming</Typography>
          <Button
            variant="contained"
            onClick={() => setModalNuevoAbierto(true)}
          >
            Agregar cuenta
          </Button>
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Servicio</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Perfiles</TableCell>
              <TableCell>Expira</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Ver Perfiles</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cuentas.map((cuenta) => (
              <TableRow key={cuenta._id}>
                <TableCell>{cuenta.nombreServicio}</TableCell>
                <TableCell>{cuenta.correoAcceso}</TableCell>
                <TableCell>
                  {cuenta.perfiles.map((p) => p.nombrePerfil).join(", ")}
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
                    <IconButton
                      color="primary"
                      onClick={() => abrirModal(cuenta)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      color="error"
                      onClick={() => eliminarCuenta(cuenta._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de edición */}
      <EditAccountModal
        open={modalAbierto}
        onClose={cerrarModal}
        account={cuentaEditar}
        onSave={obtenerCuentas}
      />

      {/* Modal de creación */}
      <CreateAccountModal
        open={modalNuevoAbierto}
        onClose={() => setModalNuevoAbierto(false)}
        onSave={obtenerCuentas}
      />

      {/* Modal de perfiles con edición */}
      <ProfileListModal
        open={modalPerfilesAbierto}
        onClose={() => setModalPerfilesAbierto(false)}
        perfiles={perfilesActivos}
        accountId={cuentaPerfilesId}
        onSave={obtenerCuentas}
      />
    </>
  );
}
