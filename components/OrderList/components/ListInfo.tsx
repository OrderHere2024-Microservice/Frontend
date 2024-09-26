import React, { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as Action from '@store/actionTypes';
import { SelectChangeEvent } from '@mui/material';

interface CheckedStatus {
  pending: boolean;
  preparing: boolean;
  finished: boolean;
  in_transit: boolean;
  delayed: boolean;
  delivered: boolean;
  cancelled: boolean;
}

const ListInfo = () => {
  const dispatch = useDispatch();
  const [checkedStatus, setCheckedStatus] = useState<CheckedStatus>({
    pending: true,
    preparing: true,
    finished: true,
    in_transit: true,
    delayed: true,
    delivered: true,
    cancelled: true,
  });
  const [sortValue, setSortValue] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    setSearchText('');
    dispatch({ type: Action.SET_SEARCH_TEXT, payload: '' });
  }, [dispatch]);

  const handleChangeStatus = (event: ChangeEvent<HTMLInputElement>) => {
    const newStatus = {
      ...checkedStatus,
      [event.target.name]: event.target.checked,
    };
    setCheckedStatus(newStatus);
    dispatch({ type: Action.SET_ORDER_STATUS, payload: newStatus });
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const newSort = event.target.value;
    setSortValue(newSort);
    dispatch({ type: Action.SET_SORTED_ORDER, payload: newSort });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    dispatch({ type: Action.SET_SEARCH_TEXT, payload: value });
  };

  return (
    <Container sx={{ width: 'auto', fontFamily: 'Gothic A1', ml: 0 }}>
      <Box
        my={2}
        sx={{ border: '1px solid #D9D9D9', borderRadius: '3px', p: 1 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search"
          size="small"
          value={searchText}
          onChange={handleSearchChange}
          sx={{
            mr: '20px',
            backgroundColor: '#F2F2F2',
            borderRadius: '20px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box my={2}>
        <FormControl
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: '1px solid #D9D9D9',
                borderRadius: '3px',
              },
            },
            '& .MuiInputLabel-root': {
              backgroundColor: 'transparent',
              '&.Mui-focused': {
                color: '#000',
              },
            },
            '& .MuiInputBase-root': {
              borderRadius: '3px',
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
          }}
        >
          <InputLabel id="sort-label">Sorted By</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            label="Sorted By"
            value={sortValue}
            onChange={handleSortChange}
          >
            <MenuItem value="orderNumber">Order Number</MenuItem>
            <MenuItem value="priceLTH">Price: Low To High</MenuItem>
            <MenuItem value="priceHTL">Price: High To Low</MenuItem>
            <MenuItem value="orderDateNTO">Order Date: New To Old</MenuItem>
            <MenuItem value="orderDateOTN">Order Date: Old To New</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        my={2}
        sx={{
          border: '1px solid #D9D9D9',
          borderRadius: '3px',
          paddingBlock: 1,
          pl: 2,
        }}
      >
        <Typography sx={{ color: 'black', fontSize: '1.3rem' }}>
          ORDER STATUS
        </Typography>
        <FormGroup>
          {Object.keys(checkedStatus).map((status) => (
            <FormControlLabel
              key={status}
              control={
                <Checkbox
                  checked={checkedStatus[status as keyof CheckedStatus]}
                  onChange={handleChangeStatus}
                  name={status}
                  sx={{
                    '&.Mui-checked': {
                      color: '#1976d2',
                    },
                  }}
                />
              }
              label={status
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            />
          ))}
        </FormGroup>
      </Box>
    </Container>
  );
};

export default ListInfo;
