import {
  Modal, Box, Typography, TextField, Button
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export default function EditAccountModal({ open, onClose, account, onSave }) {
  const [formData, setFormData] = useState({
    nombreServicio: '',
    correoAcceso: '',
    contrasenaAcceso: '',
    notasAdicionales: '',
    fechaExpiracion: ''
  });

  useEffect(() => {
    if (account) {
      setFormData({
        nombreServicio: account.nombreServicio,
        correoAcceso: account.correoAcceso,
        contrasenaAcceso: account.contrasenaAcceso,
        notasAdicionales: account.notasAdicionales || '',
        fechaExpiracion: account.fechaExpiracion
          ? new Date(account.fechaExpiracion).toISOString().split('T')[0]
          : ''
      });
    }
  }, [account]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`https://streaming-backend-gl1f.onrender.com/api/accounts/${account._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();  // Recarga lista
      onClose(); // Cierra modal
    } catch (err) {
      alert('Error al actualizar la cuenta');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>Editar cuenta</Typography>

        <TextField
          label="Servicio"
          name="nombreServicio"
          fullWidth margin="normal"
          value={formData.nombreServicio}
          onChange={handleChange}
        />
        <TextField
          label="Correo"
          name="correoAcceso"
          fullWidth margin="normal"
          value={formData.correoAcceso}
          onChange={handleChange}
        />
        <TextField
          label="Contraseña"
          name="contrasenaAcceso"
          fullWidth margin="normal"
          value={formData.contrasenaAcceso}
          onChange={handleChange}
        />
        <TextField
          label="Fecha de expiración"
          name="fechaExpiracion"
          type="date"
          fullWidth margin="normal"
          value={formData.fechaExpiracion}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Notas"
          name="notasAdicionales"
          fullWidth margin="normal"
          value={formData.notasAdicionales}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }} fullWidth>
          Guardar cambios
        </Button>
      </Box>
    </Modal>
  );
}
