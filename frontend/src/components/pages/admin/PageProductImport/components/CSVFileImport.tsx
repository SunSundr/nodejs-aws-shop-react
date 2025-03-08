import React, { useRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

type CSVFileImportProps = {
  url: string;
};

export default function CSVFileImport({ url }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

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

  const uploadFile = async () => {
    if (!file) {
      console.log('Error: File is missing');
      return;
    }
    console.log('Get the presigned URL');
    const response = await axios({
      method: 'GET',
      url,
      params: {
        name: encodeURIComponent(file.name),
      },
    });
    console.log('File to upload: ', file.name);
    console.log('Uploading to: ', response.data);
    const result = await fetch(response.data, {
      method: 'PUT',
      body: file,
    });
    if (result.ok) {
      console.log('Uploaded successfully!');
    }
    setFile(undefined);
  };

  return (
    <Box>
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
        </div>
      )}
    </Box>
  );
}
