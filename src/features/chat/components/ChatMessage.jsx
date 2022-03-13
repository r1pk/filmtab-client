import PropTypes from 'prop-types';

import { Tooltip, ListItem, ListItemText, Typography } from '@mui/material';

const ChatMessage = ({ author, content, timestamp }) => {
  const sentAt = new Date(timestamp).toLocaleString();

  return (
    <Tooltip title={sentAt}>
      <ListItem sx={{ '&:hover': { background: 'rgba(0, 0, 0, 0.2)' } }}>
        <ListItemText
          secondary={
            <>
              <Typography component="span" variant="subtitle2">
                {author.name}
              </Typography>
              <Typography component="span" variant="body2" sx={{ wordWrap: 'break-word' }}>
                {`: ${content}`}
              </Typography>
            </>
          }
        />
      </ListItem>
    </Tooltip>
  );
};

ChatMessage.propTypes = {
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
};

export default ChatMessage;
