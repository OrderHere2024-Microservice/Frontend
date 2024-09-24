import React, { useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { TimeView } from '@mui/x-date-pickers';
import { useDispatch } from 'react-redux';
import * as Action from '@store/actionTypes';

const DineIn = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(dayjs());
  const [personCount, setPersonCount] = useState<string>('');

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(dayjs(date));
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      dispatch({ type: Action.SET_DATE_DATA, payload: formattedDate });
    }
  };

  const handleTimeChange = (time: Dayjs | null) => {
    if (time) {
      setSelectedTime(dayjs(time));
      const formattedTime = dayjs(time).format('HH:mm');
      dispatch({ type: Action.SET_TIME_DATA, payload: formattedTime });
    }
  };

  const handlePersonCountChange = (event: SelectChangeEvent<string>) => {
    setPersonCount(event.target.value);
    dispatch({
      type: Action.SET_PERSON_COUNT_DATA,
      payload: event.target.value,
    });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: Action.SET_NAME_DATA, payload: event.target.value });
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({ type: Action.SET_PHONE_DATA, payload: event.target.value });
  };

  const disablePastDates = (date: Dayjs | null) => {
    return dayjs(date).isBefore(dayjs(), 'day');
  };

  const disablePastTimes = (value: Dayjs, view: TimeView) => {
    if (selectedDate && selectedDate.isSame(dayjs(), 'day')) {
      if (view === 'hours') {
        return value.hour() < dayjs().hour();
      } else if (view === 'minutes') {
        return value.minute() < dayjs().minute();
      }
    }
    return false;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          maxWidth: '100%',
          margin: 'auto',
          padding: 3,
          border: 1,
          borderRadius: 2,
          borderColor: 'border.main',
          mt: 4,
        }}
      >
        <Typography
          sx={{ paddingBottom: 2, fontSize: '32px', fontWeight: 600 }}
        >
          Dine In:
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 3,
            marginTop: '20px',
          }}
        >
          <DatePicker
            label="Pick a Date"
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={disablePastDates}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'border.main',
                borderRadius: '40px',
              },
            }}
            slotProps={{ textField: { variant: 'outlined' } }}
          />

          <TimePicker
            label="Pick a Time"
            value={selectedTime}
            onChange={handleTimeChange}
            shouldDisableTime={disablePastTimes}
            ampm={false}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'border.main',
                borderRadius: '40px',
              },
            }}
            slotProps={{ textField: { variant: 'outlined' } }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 3,
            marginTop: '20px',
          }}
        >
          <TextField
            margin="normal"
            name="name"
            label="Name"
            rows={1}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '40px',
                '& fieldset': {
                  borderColor: 'border.main',
                },
              },
              '& .MuiInputBase-input': {
                height: 'auto',
              },
            }}
            onChange={handleNameChange}
          />

          <TextField
            margin="normal"
            name="phone"
            label="Phone number"
            rows={1}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '40px',
                '& fieldset': {
                  borderColor: 'border.main',
                },
              },
              '& .MuiInputBase-input': {
                height: 'auto',
              },
            }}
            onChange={handlePhoneNumberChange}
          />
        </Box>

        <Select
          value={personCount}
          onChange={handlePersonCountChange}
          displayEmpty
          fullWidth
          sx={{
            marginTop: '20px',
            borderRadius: '40px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'border.main',
            },
          }}
          renderValue={(selected) => {
            if (selected === '') {
              return (
                <Typography sx={{ color: 'gray' }}>
                  Please select Number of People
                </Typography>
              );
            }
            return `${selected} Person`;
          }}
        >
          <MenuItem value="" disabled>
            Please select Number of People
          </MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>
      </Box>
    </LocalizationProvider>
  );
};

export default DineIn;
