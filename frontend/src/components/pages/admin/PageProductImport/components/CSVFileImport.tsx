import { useRef, useState } from 'react';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorIcon from '@mui/icons-material/Error';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { AlertColor, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { LOCALSTORAGE_AUTH_TOKEN_KEY } from '~/constants/apiPaths';

type CSVFileImportProps = {
  url: string;
};

const getToken = () => localStorage.getItem(LOCALSTORAGE_AUTH_TOKEN_KEY) ?? '';

export default function CSVFileImport({ url }: CSVFileImportProps) {
  const [file, setFile] = useState<File>();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [token, setToken] = useState(getToken());
  const [snackbarOptions, setSnackbarOptions] = useState({
    open: false,
    severity: 'info',
    message: '',
  });
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [error, setError] = useState<null | { message: string; code?: number | string }>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const handleTokenDialogClose = (event: React.SyntheticEvent, reason: string, save = true) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    if (save) {
      if (token) {
        localStorage.setItem(LOCALSTORAGE_AUTH_TOKEN_KEY, token);
        setSnackbarOptions({
          open: true,
          severity: 'success',
          message: 'The token has been saved to localStorage.',
        });
      } else {
        localStorage.removeItem(LOCALSTORAGE_AUTH_TOKEN_KEY);
        setSnackbarOptions({
          open: true,
          severity: 'warning',
          message: 'The token has been removed from localStorage.',
        });
      }
    }
    setTokenDialogOpen(false);
  };

  const handleResultDialogClose = () => {
    setResultDialogOpen(false);
    setTimeout(() => setError(null), 400);
  };

  const handeleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOptions({ ...snackbarOptions, open: false });
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  };

  const uploadFile = async () => {
    if (!file) {
      console.error('Error: File is missing');
      return;
    }
    try {
      console.log('Get the presigned URL');
      const response = await axios({
        method: 'GET',
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        ...(token && {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }),
        validateStatus: () => true,
      });
      console.log('Response: ', response);
      if (response.status !== 200) {
        setError({
          message: response.data.message,
          code: response.status,
        });
      } else {
        console.log('File to upload: ', file.name);
        console.log('Uploading to: ', response.data);
        const result = await fetch(response.data, {
          method: 'PUT',
          body: file,
        });
        if (result.ok) {
          console.log('Result: ', result);
          console.log('Uploaded successfully!');
          setFile(undefined);
        }
      }
    } catch (error) {
      console.error('There was an error uploading the file', error);
      setError({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setResultDialogOpen(true);
    }
  };

  return (
    <>
      <Box>
        {/* Dialog Set Token */}
        <Dialog
          open={tokenDialogOpen}
          onClose={handleTokenDialogClose}
          aria-labelledby="token-dialog-title"
          aria-describedby="token-dialog-description"
          sx={{ '& .MuiDialog-paper': { width: '442px' } }}
          aria-hidden={!tokenDialogOpen}
        >
          <DialogTitle id="token-dialog-title">Authorization Token</DialogTitle>
          <DialogContent>
            <TextField
              // autoFocus
              autoComplete="off"
              margin="dense"
              sx={{ input: { color: (theme) => theme.palette.info.dark } }}
              slotProps={{
                input: {
                  endAdornment: token && (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setToken('')}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                },
              }}
              id="token"
              label="Token Value (Base64)"
              type="text"
              fullWidth
              variant="outlined"
              value={token}
              onChange={handleTokenChange}
            />
          </DialogContent>
          <DialogActions sx={{ mr: 2.2, pb: 3.2, gap: '8px' }}>
            <Button
              variant="outlined"
              onClick={(event) => handleTokenDialogClose(event, 'closeDialog', false)}
              sx={{ minWidth: '92px' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={(event) => handleTokenDialogClose(event, 'closeDialog')}
              sx={{ minWidth: '92px' }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog Result */}
        <Dialog
          open={resultDialogOpen}
          onClose={handleResultDialogClose}
          aria-labelledby="result-dialog-title"
          aria-describedby="result-dialog-description"
          aria-hidden={!resultDialogOpen}
        >
          <div
            style={{ textAlign: 'center', marginTop: '24px', maxWidth: '360px', minWidth: '300px' }}
          >
            {error ? (
              <ErrorIcon color="error" sx={{ fontSize: 42 }} />
            ) : (
              <TaskAltIcon color="success" sx={{ fontSize: 42 }} />
            )}
            <DialogTitle id="result-dialog-title" sx={{ mt: -1 }}>
              {error ? `Error ${error.code || ''}`.trim() : 'File uploaded successfully!'}
            </DialogTitle>
            {error && (
              <DialogContent>
                <DialogContentText color="error" sx={{ textAlign: 'center', paddingBottom: '4px' }}>
                  {error.message}
                </DialogContentText>
              </DialogContent>
            )}
          </div>
          <DialogActions sx={{ pb: 3.2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleResultDialogClose} sx={{ minWidth: '92px' }}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {!file ? (
          <>
            <input
              hidden
              type="file"
              accept=".csv,.json"
              onChange={onFileChange}
              ref={uploadInputRef}
            />
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
              sx={{ pb: 0 }}
            >
              Import CSV File
            </Button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="small"
              color="warning"
              variant="contained"
              onClick={removeFile}
              sx={{ pb: 0 }}
            >
              Remove file
            </Button>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={uploadFile}
              sx={{ pb: 0 }}
            >
              Upload file
            </Button>
            <Button
              size="small"
              color="info"
              variant="contained"
              onClick={() => setTokenDialogOpen(true)}
              sx={{ pb: 0 }}
            >
              Token
            </Button>
          </div>
        )}
      </Box>
      <Snackbar open={snackbarOptions.open} autoHideDuration={6000} onClose={handeleSnackbarClose}>
        <Alert
          onClose={handeleSnackbarClose}
          severity={snackbarOptions.severity as AlertColor}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarOptions.message}
        </Alert>
      </Snackbar>
    </>
  );
}
