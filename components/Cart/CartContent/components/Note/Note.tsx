import { TextField, Box } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Action from '@store/actionTypes';

const Note = () => {
  const [formData, setFormData] = useState({
    note: '',
  });

  const dispatch = useDispatch();

  const [errors, setErrors] = useState<{ note?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    const newErrors = { ...errors };
    switch (name) {
      case 'note':
        newErrors[name] =
          value.length <= 200 ? '' : 'Should not exceed 200 characters';
        break;
      default:
        break;
    }
    setErrors(newErrors);

    dispatch({ type: Action.SET_NOTE_DATA, payload: newFormData.note });
  };

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', mt: 4 }}>
      <TextField
        fullWidth
        multiline
        margin="normal"
        name="note"
        label="Note"
        value={formData.note}
        error={!!errors.note}
        helperText={errors.note}
        onChange={handleInputChange}
        rows={4}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '30px',
            '& fieldset': {
              borderColor: 'border.main',
            },
          },
          '& .MuiInputBase-input': {
            height: 'auto',
            padding: '10px',
          },
        }}
      />
    </Box>
  );
};

export default Note;
