import { Emotion, EmotionName } from "../../lib/data/emotion";
import { None, Optional } from "../../lib/utilities/typeUtilities";
import { useContext, useEffect, useRef, useState } from "react";

import { HumeContext } from "../../contexts/HumeContext";
import { Descriptor } from "./Descriptor";
import { FacePrediction } from "../../lib/data/facePrediction";
import { LoaderSet } from "./LoaderSet";
import { TopEmotions } from "./TopEmotions";
import { TrackedFace } from "../../lib/data/trackedFace";
import { VideoRecorder } from "../../lib/media/videoRecorder";
import { blobToBase64 } from "../../lib/utilities/blobUtilities";
import { Environment, getApiUrlWs } from "../../lib/utilities/environmentUtilities";

type FaceWidgetsProps = {
  onCalibrate: Optional<(emotions: Emotion[]) => void>;
  customVideoElement?: HTMLVideoElement;
};

export function FaceWidgets({ onCalibrate, customVideoElement }: FaceWidgetsProps) {
  const humeContext = useContext(HumeContext);
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<VideoRecorder | null>(null);
  const photoRef = useRef<HTMLCanvasElement | null>(null);
  const mountRef = useRef(true);
  const recorderCreated = useRef(false);
  const numReconnects = useRef(0);
  const [trackedFaces, setTrackedFaces] = useState<TrackedFace[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [status, setStatus] = useState("");
  const [isVideoReady, setIsVideoReady] = useState(false);
  const numLoaderLevels = 5;
  const maxReconnects = 3;
  const loaderNames: EmotionName[] = [
    "Calmness",
    "Joy",
    "Amusement",
    "Anger",
    "Confusion",
    "Disgust",
    "Sadness",
    "Horror",
    "Surprise (negative)",
  ];

  useEffect(() => {
    console.log("Mounting component");
    mountRef.current = true;

    // Only proceed if video element is provided and valid
    if (customVideoElement) {
      console.log("Custom video element provided:", {
        hasStream: !!customVideoElement.srcObject,
        readyState: customVideoElement.readyState,
        videoWidth: customVideoElement.videoWidth,
        videoHeight: customVideoElement.videoHeight,
      });
      onVideoReady(customVideoElement);
    } else {
      console.warn("No video element provided - waiting for video element");
      setStatus("Waiting for video element...");
    }

    return () => {
      console.log("Tearing down component");
      stopEverything();
    };
  }, [customVideoElement]);

  // Connect to socket only after video is ready
  useEffect(() => {
    if (isVideoReady && humeContext.apiKey) {
      console.log("Video ready and auth available, connecting to server");
      connect();
    }
  }, [isVideoReady, humeContext.apiKey]);

  function connect() {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Socket already exists, will not create");
    } else {
      const baseUrl = getApiUrlWs(Environment.Prod);
      const endpointUrl = `${baseUrl}/v0/stream/models`;
      const socketUrl = `${endpointUrl}?apikey=${humeContext.apiKey}`;
      console.log(`Connecting to websocket... (using ${endpointUrl})`);
      setStatus(`Connecting to server...`);

      const socket = new WebSocket(socketUrl);

      socket.onopen = socketOnOpen;
      socket.onmessage = socketOnMessage;
      socket.onclose = socketOnClose;
      socket.onerror = socketOnError;

      socketRef.current = socket;
    }
  }

  async function socketOnOpen() {
    console.log("Connected to websocket");
    setStatus("Connected! Starting analysis...");

    // Since we only connect after video recorder is ready, we can start immediately
    if (recorderRef.current) {
      console.log("Video recorder ready, starting photo capture");
      await capturePhoto();
    } else {
      console.error("Expected video recorder to be ready, but it's not available");
      setStatus("Video recorder not ready");
    }
  }

  async function socketOnMessage(event: MessageEvent) {
    setStatus("");
    const response = JSON.parse(event.data);
    console.log("Got response", response);
    const predictions: FacePrediction[] = response.face?.predictions || [];
    const warning = response.face?.warning || "";
    const error = response.error;
    if (error) {
      setStatus(error);
      console.error(error);
      stopEverything();
      return;
    }

    if (predictions.length === 0) {
      setStatus(warning.replace(".", ""));
      setEmotions([]);
    }

    const newTrackedFaces: TrackedFace[] = [];
    predictions.forEach(async (pred: FacePrediction, dataIndex: number) => {
      newTrackedFaces.push({ boundingBox: pred.bbox });
      if (dataIndex === 0) {
        const newEmotions = pred.emotions;
        setEmotions(newEmotions);
        if (onCalibrate) {
          onCalibrate(newEmotions);
        }
      }
    });
    setTrackedFaces(newTrackedFaces);

    await capturePhoto();
  }

  async function socketOnClose(event: CloseEvent) {
    console.log("Socket closed");

    if (mountRef.current === true) {
      setStatus("Reconnecting");
      console.log("Component still mounted, will reconnect...");
      connect();
    } else {
      console.log("Component unmounted, will not reconnect...");
    }
  }

  async function socketOnError(event: Event) {
    console.error("Socket failed to connect: ", event);
    if (numReconnects.current >= maxReconnects) {
      setStatus(`Failed to connect to the Hume API (Prod).
      Please log out and verify that your API key is correct.`);
      stopEverything();
    } else {
      numReconnects.current++;
      console.warn(`Connection attempt ${numReconnects.current}`);
    }
  }

  function stopEverything() {
    console.log("Stopping everything...");
    mountRef.current = false;
    setIsVideoReady(false);

    const socket = socketRef.current;
    if (socket) {
      console.log("Closing socket");
      socket.close();
      socketRef.current = null;
    } else {
      console.warn("Could not close socket, not initialized yet");
    }
    const recorder = recorderRef.current;
    if (recorder) {
      console.log("Stopping recorder");
      recorder.stopRecording();
      recorderRef.current = null;
    } else {
      console.warn("Could not stop recorder, not initialized yet");
    }

    // Reset the recorder creation flag for next mount
    recorderCreated.current = false;
  }

  async function onVideoReady(videoElement: HTMLVideoElement) {
    console.log("Video element is ready");
    setStatus("Preparing video recorder...");

    if (!photoRef.current) {
      console.error("No photo element found");
      setStatus("Photo canvas not available");
      return;
    }

    if (!recorderRef.current && recorderCreated.current === false) {
      console.log("No recorder yet, creating one now");
      recorderCreated.current = true;

      try {
        // Check if component is still mounted
        if (!mountRef.current) {
          console.log("Component unmounted during video setup, aborting");
          recorderCreated.current = false;
          return;
        }

        // Check if video element has a stream
        if (!videoElement.srcObject) {
          console.error("Video element has no srcObject (MediaStream)");
          setStatus("Video element missing stream");
          recorderCreated.current = false;
          return;
        }

        const stream = videoElement.srcObject as MediaStream;
        if (!stream || stream.getTracks().length === 0) {
          console.error("Video element has invalid or empty MediaStream");
          setStatus("Invalid video stream");
          recorderCreated.current = false;
          return;
        }

        console.log("Video element validation passed, creating recorder...");

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("VideoRecorder creation timed out")), 10000);
        });

        const recorderPromise = VideoRecorder.create(videoElement, photoRef.current);

        const recorder = (await Promise.race([recorderPromise, timeoutPromise])) as VideoRecorder;

        // Check if component is still mounted after async operation
        if (!mountRef.current) {
          console.log("Component unmounted during recorder creation, cleaning up");
          recorder.stopRecording();
          recorderCreated.current = false;
          return;
        }

        console.log("Recorder created successfully");
        recorderRef.current = recorder;

        // Mark video as ready, which will trigger socket connection
        setIsVideoReady(true);
        setStatus("Connecting to server...");
      } catch (error) {
        console.error("Failed to create video recorder:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setStatus(`Failed to initialize: ${errorMessage}`);
        recorderCreated.current = false;
      }
    }
  }

  async function capturePhoto() {
    const recorder = recorderRef.current;

    if (!recorder) {
      console.error("No recorder found");
      return;
    }

    const photoBlob = await recorder.takePhoto();
    sendRequest(photoBlob);
  }

  async function sendRequest(photoBlob: Blob) {
    const socket = socketRef.current;

    if (!socket) {
      console.log("No socket found");
      return;
    }

    const encodedBlob = await blobToBase64(photoBlob);
    const requestData = JSON.stringify({
      data: encodedBlob,
      models: {
        face: {},
      },
    });

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(requestData);
    } else {
      console.error("Socket connection not open. Will not capture a photo");
      socket.close();
    }
  }

  return (
    <div>
      <div className="md:flex">
        <div>
          {!onCalibrate && (
            <>
              <TopEmotions emotions={emotions} />
              <LoaderSet
                className="mt-8 ml-5"
                emotionNames={loaderNames}
                emotions={emotions}
                numLevels={numLoaderLevels}
              />
              <Descriptor className="mt-8" emotions={emotions} />
            </>
          )}
        </div>
      </div>

      <div className="pt-6">{status}</div>
      <canvas className="hidden" ref={photoRef}></canvas>
    </div>
  );
}

FaceWidgets.defaultProps = {
  onCalibrate: None,
};
