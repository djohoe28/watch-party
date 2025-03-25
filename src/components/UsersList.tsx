import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Fragment, useContext } from 'react';
import { UsersContext } from '../contexts/UsersContext';
import UserAvatar from './UserAvatar';

export default function UsersList() {
	const usersContext = useContext(UsersContext);
	return (
		<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
			{usersContext?.data?.map((user) => (
				<Fragment>
					<ListItem alignItems="flex-start">
						<ListItemAvatar>
							<UserAvatar user={user} />
						</ListItemAvatar>
						<ListItemText
							primary={user.name}
							secondary={user.id}
						/>
					</ListItem>
					<Divider variant="inset" component="li" />
				</Fragment>
			))}
		</List>
	);
}