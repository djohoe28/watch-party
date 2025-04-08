import * as React from 'react';
import { Typography, Container, Box } from '@mui/material';
import { ProTip } from './ProTip';
import { AuthProvider } from './Providers/AuthProvider';
import { Room } from './Room/Room';
import { Copyright } from './Copyright';

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
