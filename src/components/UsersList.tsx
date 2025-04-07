import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Fragment, useContext } from 'react';
import { UsersContext } from '../contexts/UsersContext';
import UserAvatar from './UserAvatar';
import { DEFAULT_NAME } from '../utils/String.utils';

export default function UsersList() {
	// Contexts
	const usersContext = useContext(UsersContext);
	return (
		<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
			{usersContext?.map((user) => (
				<Fragment key={user.id}>
					<ListItem alignItems="flex-start">
						<ListItemAvatar>
							<UserAvatar user={user} />
						</ListItemAvatar>
						<ListItemText
							primary={user.name ?? DEFAULT_NAME}
							secondary={user.id}
						/>
					</ListItem>
					{/** LINT: Divider between users; Necessary? */}
					<Divider variant="inset" component="li" />
				</Fragment>
			))}
		</List>
	);
}