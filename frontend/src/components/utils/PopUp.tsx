import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { Alert, AlertColor, Button, Snackbar, SnackbarCloseReason } from '@mui/material';

type PopUpProps = {
  error?: Error | null;
  success?: string;
  button?: {
    action: () => void;
    text: string;
  };
  severity?: AlertColor;
};

export function PopUp({ error, success, button, severity }: PopUpProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<{
    severity: AlertColor;
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (error || success) {
      const getAxiosErrorMessage = (err: AxiosError) => {
        const lines: string[] = [];
        const data = err.response?.data;
        if (data && typeof data === 'object' && 'message' in data) {
          lines.push(String(data.message));
          if ('detailedMessage' in data) lines.push(String(data.detailedMessage));
        } else if (typeof data === 'string') {
          lines.push(data);
        } else {
          lines.push('Unknown error');
        }
        return lines.join('\n');
      };
      const newMessage = success
        ? { severity: severity || ('success' as const), msg: success }
        : error
          ? {
              severity: severity || ('error' as const),
              msg: error instanceof AxiosError ? getAxiosErrorMessage(error) : error.message,
            }
          : null;

      setCurrentMessage(newMessage);
      setAlertOpen(true);
    }
  }, [error, success]);

  const handleAlertClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;

    setAlertOpen(false);
    setTimeout(() => setCurrentMessage(null), 300);
  };

  if (!currentMessage || !alertOpen) return null;

  return (
    <Snackbar
      open={alertOpen}
      autoHideDuration={5000}
      onClose={handleAlertClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleAlertClose}
        severity={currentMessage.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{currentMessage.msg}</div>
        {button && (
          <Button
            sx={{ float: 'right', mt: 2, pb: 0.2 }}
            size="small"
            variant="contained"
            color="info"
            onClick={button.action}
          >
            {button.text}
          </Button>
        )}
      </Alert>
    </Snackbar>
  );
}
