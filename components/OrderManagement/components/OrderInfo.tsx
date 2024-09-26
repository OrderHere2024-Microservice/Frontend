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

interface CheckedOptions {
  delivery: boolean;
  dine_in: boolean;
  pickup: boolean;
}

const OrderInfo = () => {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState<CheckedOptions>({
    delivery: true,
    dine_in: true,
    pickup: true,
  });

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

  const handleChangeOptions = (event: ChangeEvent<HTMLInputElement>) => {
    const newOptions = {
      ...checked,
      [event.target.name]: event.target.checked,
    };
    setChecked(newOptions);
    dispatch({ type: Action.SET_ORDER_OPTION, payload: newOptions });
  };

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
      {/* Search Box */}
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

      {/* Sorting Options */}
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

      {/* Ordering Options */}
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
          ORDERING OPTIONS
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.delivery}
                onChange={handleChangeOptions}
                name="delivery"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="Delivery"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.dine_in}
                onChange={handleChangeOptions}
                name="dine_in"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="Dine In"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.pickup}
                onChange={handleChangeOptions}
                name="pickup"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="Pick Up"
          />
        </FormGroup>
      </Box>

      {/* Order Status */}
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
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedStatus.pending}
                onChange={handleChangeStatus}
                name="pending"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="Pending"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedStatus.finished}
                onChange={handleChangeStatus}
                name="finished"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="Finished"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedStatus.preparing}
                onChange={handleChangeStatus}
                name="preparing"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="Preparing"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedStatus.in_transit}
                onChange={handleChangeStatus}
                name="in_transit"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="In Transit"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedStatus.delayed}
                onChange={handleChangeStatus}
                name="delayed"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="Delayed"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedStatus.delivered}
                onChange={handleChangeStatus}
                name="delivered"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="Delivered"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedStatus.cancelled}
                onChange={handleChangeStatus}
                name="cancelled"
                sx={{
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            }
            label="Cancelled"
          />
        </FormGroup>
      </Box>
    </Container>
  );
};

export default OrderInfo;
