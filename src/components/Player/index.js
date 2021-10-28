import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';

import VideoPlayer from './VideoPlayer';
import ControlBar from './ControlBar';

import useFullscreen from '../../hooks/useFullscreen';

const Player = ({ url, playing, playedSeconds, onPlayerReady, onTogglePlay, onVideoSeek }) => {
  const [isPlayerReady, setIsPlayerReady] = useState(true);
  const [isPlaying, setIsPlaying] = useState(playing);

  const [address, setAddress] = useState(url);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(playedSeconds);
  const [volume, setVolume] = useState(0.2);

  const container = useRef(null);
  const player = useRef(null);

  const [isFullscreenEnabled, toggleFullscreen] = useFullscreen(container);

  const handlePlayerReady = () => {
    if (!isPlayerReady) {
      setIsPlayerReady(true);
      onPlayerReady(true);
    }
  };

  const handleTogglePlay = (state) => {
    setIsPlaying(state);
    onTogglePlay(state, progress);
  };

  const handleAddressChange = (newAddress) => {
    setIsPlayerReady(false);
    setAddress(newAddress);
  };

  const handleVideoDuration = (seconds) => {
    setDuration(seconds);
  };

  const handleVideoProgress = (progress) => {
    setProgress(progress.playedSeconds);
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  const handleVideoSeek = (seconds) => {
    if (isPlayerReady) {
      player.current.seekTo(seconds);
      onVideoSeek(seconds);
    }
  };

  const handleToggleFullscreen = () => {
    toggleFullscreen();
  };

  useEffect(() => {
    handleAddressChange(url);
  }, [url]);

  useEffect(() => {
    setIsPlaying(playing);
  }, [playing]);

  useEffect(() => {
    if (isPlayerReady && playedSeconds !== progress) {
      player.current.seekTo(playedSeconds);
    }
    // eslint-disable-next-line
  }, [isPlayerReady, playedSeconds]);

  return (
    <Box position="relative" paddingTop="56.25%" overflow="hidden" ref={container} {...null}>
      <VideoPlayer
        url={address}
        playing={isPlaying}
        volume={volume}
        onDuration={handleVideoDuration}
        onProgress={handleVideoProgress}
        onReady={handlePlayerReady}
        ref={player}
      />
      <ControlBar
        isPlaying={isPlaying}
        isFullscreenEnabled={isFullscreenEnabled}
        progress={progress}
        duration={duration}
        volume={volume}
        onTogglePlay={handleTogglePlay}
        onToggleFullscreen={handleToggleFullscreen}
        onVideoSeek={handleVideoSeek}
        onVolumeChange={handleVolumeChange}
      />
    </Box>
  );
};

Player.propTypes = {
  url: PropTypes.string,
  playing: PropTypes.bool,
  playedSeconds: PropTypes.number,
  onPlayerReady: PropTypes.func.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
  onVideoSeek: PropTypes.func.isRequired,
};

Player.defaultProps = {
  url: '',
  playing: false,
  playedSeconds: 0,
};

export default Player;
