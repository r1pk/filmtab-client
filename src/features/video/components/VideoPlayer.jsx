import { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Plyr from 'plyr-react';

import { resolveVideoSource } from '../utils/resolveVideoSource';
import { buildPlayerOptions } from '../utils/buildPlayerOptions';

const VideoPlayer = ({ url, playing, progress, onTogglePlay, onSeekVideo, onIntervalProgressTick, ...rest }) => {
  const [shouldSynchronizePlayer, setShouldSynchronizePlayer] = useState(false);
  const player = useRef(null);

  const handleTogglePlay = () => {
    const { playing, currentTime } = player.current.plyr;

    onTogglePlay(!playing, currentTime);
  };

  const handleSeekVideo = (e) => {
    const currentVideoProgress = (e.target.value / e.target.max) * player.current.plyr.media.duration;

    onSeekVideo(currentVideoProgress);
  };

  const videoSource = useMemo(() => resolveVideoSource(url), [url]);
  const playerOptions = useMemo(
    () =>
      buildPlayerOptions({
        play: handleTogglePlay,
        seek: handleSeekVideo,
      }),
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    const setPlayerParameters = async () => {
      await player.current.plyr.togglePlay(playing);
      player.current.plyr.currentTime = progress;
    };

    if (shouldSynchronizePlayer && player.current.plyr.ready) {
      setPlayerParameters();
    }
  }, [shouldSynchronizePlayer, playing, progress]);

  useEffect(() => {
    let interval;
    const handleIntervalTick = () => {
      if (player.current.plyr.source) {
        clearInterval(interval);
        setShouldSynchronizePlayer(true);
      }
    };

    if (!shouldSynchronizePlayer) {
      interval = setInterval(handleIntervalTick, 100);
    }

    return () => {
      clearInterval(interval);
    };
  }, [shouldSynchronizePlayer]);

  useEffect(() => {
    let interval;
    const handleIntervalTick = () => {
      onIntervalProgressTick(player.current.plyr.currentTime);
    };

    if (playing && player.current.plyr.ready) {
      interval = setInterval(handleIntervalTick, 250);
    }

    return () => {
      clearInterval(interval);
    };
  }, [playing, onIntervalProgressTick]);

  return <Plyr ref={player} source={videoSource} options={playerOptions} {...rest} />;
};

VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  playing: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
  onSeekVideo: PropTypes.func.isRequired,
  onIntervalProgressTick: PropTypes.func.isRequired,
};

export default VideoPlayer;
