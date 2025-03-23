// SEE: https://codesandbox.io/p/sandbox/videojs-with-react-typescript-8z22h?file=%2Fsrc%2Fvideo.tsx%3A24%2C1
import { useEffect, useRef } from "react";
import videojs from "video.js/dist/video.min";

// Styles
import "video.js/dist/video-js.css";

type PlayerOptions = videojs.PlayerOptions;
interface IMediaPlayerProps {
    options?: PlayerOptions;
}

const initialOptions: PlayerOptions = {
    controls: true,
    fluid: true,
    controlBar: {
        volumePanel: {
            inline: false
        }
    }
};

const VideoJSPlayer: React.FC<IMediaPlayerProps> = ({ options }) => {
    const videoNode = useRef<HTMLVideoElement>(null);
    const player = useRef<videojs.Player | null>(null);

    useEffect(() => {
        if (!videoNode.current) {
            return () => "Error loading video node...";
        }

        // Check if the player is already initialized
        if (!player.current) {
            player.current = videojs(videoNode.current, {
                ...initialOptions,
                ...options
            }).ready(function () {
                // console.log('onPlayerReady', this);
            });
        } else if (options) {
            // Update player options if already initialized
            player.current.src(options.sources || []);
            player.current.autoplay(options.autoplay || false);
            player.current.controls(options.controls || false);
        }

        return () => {
            if (player.current) {
                player.current.dispose();
                player.current = null; // Reset the player reference
            }
        };
    }, [options]);

    return <video ref={videoNode} className="video-js" />;
};

export default VideoJSPlayer;
