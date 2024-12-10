import React from 'react';
import YouTube from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      controls: 1,
      showinfo: 0,
      fs: 1,
    },
  };

  const onReady = (event: any) => {
    // Access to player in all event handlers via event.target
    const player = event.target;
  };

  const onError = (error: any) => {
    console.error('YouTube Error:', error);
  };

  return (
    <div className="aspect-video w-full">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onError={onError}
        className="w-full h-full"
        iframeClassName="w-full h-full rounded-lg"
      />
    </div>
  );
};

export default VideoPlayer;