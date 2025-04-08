import * as React from 'react';
import { Link, Typography, Container, Box } from '@mui/material';
import { ProTip } from './ProTip';
import { AuthProvider } from './Providers/AuthProvider';
import { Room } from './Room/Room';


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

export function App() {
  const roomId = "RoomIDGoesHere"; // window.location.href.split('room/')[1]; // TODO: Use Regex.
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <AuthProvider>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            CoVid Player
          </Typography>
          <Room roomId={roomId} />
        </AuthProvider>
        {/* <Temp /> */}
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
