import * as Colyseus from 'colyseus.js';

import * as room from '../actions/room';
import * as notifications from '../actions/notifications';

export const colyseusMiddleware = (store) => {
  const colyseus = {
    client: new Colyseus.Client(process.env.REACT_APP_COLYSEUS_ENDPOINT),
    room: null,
  };

  const enhanceActionPayload = (action) => {
    return {
      ...action,
      payload: {
        ...action.payload,
        roomId: colyseus.room.id,
        sessionId: colyseus.room.sessionId,
      },
    };
  };

  const onStateChange = (state) => {
    store.dispatch(room.updateRoomState(state));
  };
  const onPlayedSecondsMessage = ({ playedSeconds }) => {
    store.dispatch(room.updatePlayedSeconds(playedSeconds));
  };
  const onErrorHandler = (code, message) => {
    store.dispatch(notifications.addNotification('error', message));
  };
  const onLeaveHandler = () => {
    colyseus.room.removeAllListeners();
  };

  const setupListeners = () => {
    colyseus.room.onStateChange.once(onStateChange);
    colyseus.room.onStateChange(onStateChange);

    colyseus.room.onError(onErrorHandler);
    colyseus.room.onLeave(onLeaveHandler);

    colyseus.room.onMessage('video::playedSeconds', onPlayedSecondsMessage);
  };

  return (next) => async (action) => {
    try {
      switch (action.type) {
        case room.JOIN_ROOM: {
          const { roomId, username } = action.payload;
          colyseus.room = await colyseus.client.joinById(roomId, { username });
          setupListeners();

          return next(enhanceActionPayload(action));
        }
        case room.CREATE_ROOM: {
          const { isRoomPrivate, username } = action.payload;
          colyseus.room = await colyseus.client.create('video-room', { private: isRoomPrivate, username });
          setupListeners();

          return next(enhanceActionPayload(action));
        }
        case room.LEAVE_ROOM: {
          await colyseus.room.leave(true);

          return next(action);
        }

        case room.SEND_USER_STATUS: {
          const { status = true } = action.payload;
          await colyseus.room.send('user::status', { status });

          return next(action);
        }
        case room.SET_VIDEO: {
          const { url } = action.payload;
          await colyseus.room.send('video::set', { url });

          return next(action);
        }
        case room.PLAY_VIDEO: {
          const { playedSeconds } = action.payload;
          await colyseus.room.send('video::play', { playedSeconds });

          return next(action);
        }
        case room.PAUSE_VIDEO: {
          const { playedSeconds } = action.payload;
          await colyseus.room.send('video::pause', { playedSeconds });

          return next(action);
        }
        case room.SEEK_VIDEO: {
          const { playedSeconds } = action.payload;
          await colyseus.room.send('video::seek', { playedSeconds });

          return next(action);
        }
        default:
          return next(action);
      }
    } catch (error) {
      store.dispatch(notifications.addNotification('error', error.message));
    }
  };
};
