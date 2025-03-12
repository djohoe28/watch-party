import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import { useRoomDocument } from './hooks/useRoomDocument';
import { Button, Skeleton, TextField } from '@mui/material';
import { useSendMessage } from './hooks/useSendMessage';
import { MessageList } from './components/MessageList';
import { useRoomMessagesQuery } from './hooks/useRoomMessagesQuery';

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
  const [roomId, setRoomId] = React.useState<string>("RoomIDGoesHere");
  const { data: roomData, loading: roomDataLoading, error: roomDataError } = useRoomDocument(roomId);
  const [message, setMessage] = React.useState<string>("");
  const [senderId, setSenderId] = React.useState<string>("UserIDGoesHere");
  const { sendMessage, sending, error: sendMessageError } = useSendMessage(roomId);
  const { data: messages, loading: messagesLoading, error: messagesError } = useRoomMessagesQuery(roomId);
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          CoVid Player
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          {roomDataLoading ? <Skeleton /> : roomDataError ? roomDataError.toString() : roomData?.title}
        </Typography>
        <TextField onChange={(e) => setMessage(e.target.value)} value={message} label="Message" variant="outlined" fullWidth></TextField>
        <TextField onChange={(e) => setSenderId(e.target.value)} value={senderId} label="Sender ID" variant="outlined" fullWidth></TextField>
        <Button onClick={() => sendMessage(message, senderId)} disabled={sending} variant="contained" color="primary" fullWidth>Send</Button>
        <MessageList roomId={roomId} />
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
