import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import BorderColorSharpIcon from '@mui/icons-material/BorderColorSharp';
import {
  updateUserProfile,
  getUserProfile,
  updateUserAvatar,
} from '@services/Profile';
import PlacesAutocomplete, { Suggestion } from 'react-places-autocomplete';
import { UserGetDto } from '@interfaces/UserDTOs';

interface Profile {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  avatarUrl: string;
  language: string;
  privacy: string;
  address: string;
}

const ProfileForm = () => {
  const [editMode, setEditMode] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'info' | 'success' | 'error'
  >('info');

  const defaultProfile: Profile = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    points: 0,
    avatarUrl: '',
    language: 'English',
    privacy: 'Public',
    address: '',
  };

  const [originalProfile, setOriginalProfile] =
    useState<Profile>(defaultProfile);
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      const response = (await getUserProfile()) as { data: UserGetDto };
      const data = response.data;
      setProfile({
        userName: data.username,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        points: data.point,
        avatarUrl: data.avatarUrl,
        language: 'English',
        privacy: 'Public',
        address: data.address,
      });
      setOriginalProfile({
        userName: data.username,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        points: data.point,
        avatarUrl: data.avatarUrl,
        language: 'English',
        privacy: 'Public',
        address: data.address,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile().catch((error) => {
      console.error('Error fetching user profile:', error);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('imageFile', file);

      try {
        const response = (await updateUserAvatar(formData)) as {
          status: number;
          data: string;
        };
        if (response.status === 200) {
          setProfile({
            ...profile,
            avatarUrl: response.data,
          });
          setOriginalProfile({
            ...originalProfile,
            avatarUrl: response.data,
          });
          setSnackbarMessage('Avatar change successful!');
          setSnackbarSeverity('success');
        } else {
          setSnackbarMessage('Failed to update avatar.');
          setSnackbarSeverity('error');
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
        setSnackbarMessage('Failed to update avatar.');
        setSnackbarSeverity('error');
      } finally {
        setSnackbarOpen(true);
        router.reload();
      }
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleEdit = () => {
    if (editMode) {
      setProfile(originalProfile); // Revert changes if editing is canceled
    } else {
      setOriginalProfile(profile); // Save the current state
    }
    setEditMode(!editMode);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const userProfileUpdateDTO = {
        username: profile.userName,
        firstname: profile.firstName,
        lastname: profile.lastName,
        address: profile.address,
      };
      await updateUserProfile(userProfileUpdateDTO);
      setOriginalProfile(profile); // Save the updated profile as the new original
      setSnackbarMessage('User information change successful!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error updating user profile:', error);
      setSnackbarMessage('Failed to update user information.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      router.reload();
    }
    setEditMode(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ position: 'relative', textAlign: 'center', pb: 4, mt: 0 }}>
        <Box
          sx={{
            height: 150,
            filter: 'blur(5px)',
            backgroundImage: 'url(/image/ProfileHeader.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: 'borderRadius',
            borderTopRightRadius: 'borderRadius',
          }}
        />
        <Avatar
          src={profile?.avatarUrl}
          alt={`${profile.userName}`}
          sx={{
            width: 100,
            height: 100,
            border: '3px solid white',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%) translateY(20%)',
            bottom: 0,
            backgroundColor: 'background.paper',
          }}
        />

        <Button
          component="label"
          sx={{
            position: 'absolute',
            left: '54%',
            bottom: '-10%',
            transform: 'translateX(-50%)',
          }}
        >
          <BorderColorSharpIcon />
          <input
            type="file"
            hidden
            onChange={(e) => {
              handleAvatarChange(e).catch((error) => {
                console.error('Error updating avatar:', error);
              });
            }}
          />
        </Button>
      </Box>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e).catch((error) => {
              console.error('Error submitting payment:', error);
            });
          }}
        >
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={6}>
              <Paper variant={'outlined'} sx={{ padding: 2 }}>
                <Typography variant="h6">Basic Information</Typography>
                <TextField
                  fullWidth
                  label="User Name"
                  name="userName"
                  value={profile.userName}
                  onChange={handleChange}
                  margin="normal"
                  disabled={!editMode}
                />
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  margin="normal"
                  disabled={!editMode}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  margin="normal"
                  disabled={!editMode}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  margin="normal"
                  disabled={true}
                />
                <TextField
                  fullWidth
                  label="Points"
                  name="points"
                  value={profile.points}
                  margin="normal"
                  disabled={true}
                />
                <PlacesAutocomplete
                  value={profile.address}
                  onChange={(value) =>
                    setProfile({ ...profile, address: value })
                  }
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div>
                      <TextField
                        {...getInputProps({
                          label: 'Address',
                          fullWidth: true,
                          margin: 'normal',
                          disabled: !editMode,
                        })}
                      />
                      <div>
                        {suggestions.map((suggestion: Suggestion) => (
                          <div
                            {...getSuggestionItemProps(suggestion)}
                            key={suggestion.placeId}
                          >
                            {suggestion.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant={'outlined'} sx={{ padding: 2 }}>
                <Typography variant="h6">System Settings</Typography>
                <Box>
                  <FormControl
                    component="fieldset"
                    margin="normal"
                    disabled={!editMode}
                  >
                    <Typography>Language</Typography>
                    <RadioGroup
                      name="language"
                      value={profile.language}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="English"
                        control={<Radio />}
                        label="English"
                      />
                      <FormControlLabel
                        value="Chinese"
                        control={<Radio />}
                        label="Chinese"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl
                    component="fieldset"
                    margin="normal"
                    disabled={!editMode}
                  >
                    <Typography>Privacy Settings</Typography>
                    <RadioGroup
                      name="privacy"
                      value={profile.privacy}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Public"
                        control={<Radio />}
                        label="Public"
                      />
                      <FormControlLabel
                        value="Private"
                        control={<Radio />}
                        label="Private"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <Box textAlign="center" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
              sx={{
                marginRight: 1,
                width: '120px',
                height: '40px',
                borderRadius: '40px',
                backgroundColor: '#1976d2',
              }}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={!editMode}
              sx={{
                width: '120px',
                height: '40px',
                borderRadius: '40px',
                backgroundColor: '#1976d2',
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileForm;
