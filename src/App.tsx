import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import { useRoomDocument } from './hooks/useRoomDocument';
import { Skeleton } from '@mui/material';

function Copyright() {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{
        color: 'text.secondary',
      }}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://telhai.tech/">
        Tel Hai Tech
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  const { roomData, loading: roomDataLoading, error: roomDataError } = useRoomDocument("RoomIDGoesHere");
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          CoVid Player
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          {roomDataLoading ? <Skeleton /> : roomDataError ? roomDataError.toString() : roomData?.title}
        </Typography>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
