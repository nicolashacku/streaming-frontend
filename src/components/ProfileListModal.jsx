import {
  Modal, Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  IconButton, TextField, Select, MenuItem, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflowY: 'auto'
};

export default function ProfileListModal({ open, onClose, perfiles = [], accountId, onSave }) {
  const [listaPerfiles, setListaPerfiles] = useState([]);

  useEffect(() => {
    setListaPerfiles(perfiles || []);
  }, [perfiles]);

  const handleChange = (index, field, value) => {
    const copia = [...listaPerfiles];
    copia[index][field] = value;
    setListaPerfiles(copia);
  };

  const agregarPerfil = () => {
    setListaPerfiles(prev => [
      ...prev,
      {
        nombrePerfil: '',
        tienePin: false,
        pin: '',
        asignadoACliente: '',
        estadoPerfil: 'Libre'
      }
    ]);
  };

  const eliminarPerfil = (index) => {
    const copia = [...listaPerfiles];
    copia.splice(index, 1);
    setListaPerfiles(copia);
  };

  const guardarCambios = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`https://streaming-backend-gl1f.onrender.com/api/accounts/${accountId}`, {
        perfiles: listaPerfiles
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
      onClose();
    } catch (err) {
      alert('Error al guardar perfiles');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Gestión de Perfiles</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tiene PIN</TableCell>
              <TableCell>PIN</TableCell>
              <TableCell>Asignado a</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listaPerfiles.map((perfil, i) => (
              <TableRow key={i}>
                <TableCell>
                  <TextField
                    value={perfil.nombrePerfil}
                    onChange={(e) => handleChange(i, 'nombrePerfil', e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={perfil.tienePin ? 'true' : 'false'}
                    onChange={(e) => handleChange(i, 'tienePin', e.target.value === 'true')}
                    size="small"
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Sí</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {perfil.tienePin && (
                    <TextField
                      value={perfil.pin || ''}
                      onChange={(e) => handleChange(i, 'pin', e.target.value)}
                      size="small"
                      placeholder="PIN"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <TextField
                    value={perfil.asignadoACliente || ''}
                    onChange={(e) => handleChange(i, 'asignadoACliente', e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={perfil.estadoPerfil}
                    onChange={(e) => handleChange(i, 'estadoPerfil', e.target.value)}
                    size="small"
                  >
                    <MenuItem value="Libre">Libre</MenuItem>
                    <MenuItem value="Ocupado">Ocupado</MenuItem>
                    <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => eliminarPerfil(i)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" onClick={agregarPerfil}>
            Agregar perfil
          </Button>
          <Button variant="contained" onClick={guardarCambios}>
            Guardar cambios
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
