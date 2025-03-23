import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import { Room } from './components/Room';
import { UserContextProvider } from './contexts/UserContext';
import { Temp } from './components/Temp';



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
  const roomId = "RoomIDGoesHere"; // window.location.href.split('room/')[1]; // TODO: Use Regex.
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <UserContextProvider>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            CoVid Player
          </Typography>
          <Room roomId={roomId} />
        </UserContextProvider>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
