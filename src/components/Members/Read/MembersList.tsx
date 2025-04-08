import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Fragment, useContext } from 'react';
import { MembersContext } from '../../../contexts/MembersContext';
import MemberAvatar from './MemberAvatar';
import { DEFAULT_NAME } from '../../../utils/String.utils';

export default function MembersList() {
	// Contexts
	const membersContext = useContext(MembersContext);

	return (
		<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
			{membersContext?.map((member) => (
				<Fragment key={member.id}>
					<ListItem alignItems="flex-start">
						<ListItemAvatar>
							<MemberAvatar member={member} />
						</ListItemAvatar>
						<ListItemText
							primary={member.name ?? DEFAULT_NAME}
							secondary={member.id}
						/>
					</ListItem>
					{/** LINT: Divider between members; Necessary? */}
					<Divider variant="inset" component="li" />
				</Fragment>
			))}
		</List>
	);
}