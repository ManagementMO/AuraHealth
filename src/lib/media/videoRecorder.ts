import { canvasToImageBlob } from "../utilities/blobUtilities";

type Size = {
  width: number;
  height: number;
};

export class VideoRecorder {
  private videoElement: HTMLVideoElement;
  private photoElement: HTMLCanvasElement;
  private imageSize: Size;
  private mediaStream: MediaStream;

  private constructor(
    videoElement: HTMLVideoElement,
    photoElement: HTMLCanvasElement,
    imageSize: Size,
    mediaStream: MediaStream
  ) {
    this.videoElement = videoElement;
    this.photoElement = photoElement;

    this.imageSize = imageSize;
    this.mediaStream = mediaStream;
  }

  static async create(videoElement: HTMLVideoElement, photoElement: HTMLCanvasElement) {
    console.log("VideoRecorder.create() starting...");

    // Extract the stream from the video element
    const mediaStream = videoElement.srcObject as MediaStream;

    if (!mediaStream) {
      throw new Error("Video element must have a MediaStream assigned to srcObject before creating VideoRecorder");
    }

    console.log("MediaStream found, video element state:", {
      readyState: videoElement.readyState,
      videoWidth: videoElement.videoWidth,
      videoHeight: videoElement.videoHeight,
      paused: videoElement.paused,
    });

    // Ensure the video is playing
    await videoElement.play();
    console.log("Video play() completed");

    console.log("Setting video size...");
    const imageSize = await VideoRecorder.setVideoSize(videoElement, photoElement);
    console.log("Video size set:", imageSize);

    return new VideoRecorder(videoElement, photoElement, imageSize, mediaStream);
  }

  async stopRecording() {
    this.mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  private static setVideoSize(videoElement: HTMLVideoElement, photoElement: HTMLCanvasElement) {
    return new Promise((resolve: (size: Size) => void, reject) => {
      const calculateSize = () => {
        // Check if video has valid dimensions
        if (!videoElement.videoWidth || !videoElement.videoHeight) {
          reject(new Error("Video element has no dimensions"));
          return;
        }

        const videoWidth = 500;
        const videoHeight = (videoElement.videoHeight * videoWidth) / videoElement.videoWidth;

        videoElement.setAttribute("width", videoWidth.toString());
        videoElement.setAttribute("height", videoHeight.toString());
        photoElement.setAttribute("width", videoWidth.toString());
        photoElement.setAttribute("height", videoHeight.toString());

        resolve({ width: videoWidth, height: videoHeight });
      };

      // If video is already ready (readyState >= 3), calculate immediately
      if (videoElement.readyState >= 3 && videoElement.videoWidth > 0) {
        console.log("Video already ready, calculating size immediately");
        calculateSize();
        return;
      }

      // Otherwise, wait for canplay event
      console.log("Video not ready, waiting for canplay event");
      const onCanPlay = () => {
        videoElement.removeEventListener("canplay", onCanPlay);
        videoElement.removeEventListener("error", onError);
        calculateSize();
      };

      const onError = () => {
        videoElement.removeEventListener("canplay", onCanPlay);
        videoElement.removeEventListener("error", onError);
        reject(new Error("Video failed to load"));
      };

      videoElement.addEventListener("canplay", onCanPlay, false);
      videoElement.addEventListener("error", onError, false);

      // Add timeout as fallback
      setTimeout(() => {
        videoElement.removeEventListener("canplay", onCanPlay);
        videoElement.removeEventListener("error", onError);
        reject(new Error("Timeout waiting for video to be ready"));
      }, 5000);
    });
  }

  async takePhoto(format: string = "image/png"): Promise<Blob> {
    const context = this.photoElement.getContext("2d");
    if (!context) {
      console.log("Could not get photo context");
      throw Error("Could not get graphics context from canvas");
    }

    this.photoElement.width = this.imageSize.width;
    this.photoElement.height = this.imageSize.height;
    context.translate(this.imageSize.width, 0);
    context.scale(-1, 1);
    context.drawImage(this.videoElement, 0, 0, this.imageSize.width, this.imageSize.height);

    return await canvasToImageBlob(this.photoElement, format);
  }
}
