(() => {
  "use strict";

  let audioFocusVideo = null;
  const nativePlay = HTMLMediaElement.prototype.play;

  function getActiveAudioFocus() {
    if (!audioFocusVideo?.isConnected || audioFocusVideo.muted) {
      audioFocusVideo = null;
    }
    return audioFocusVideo;
  }

  HTMLMediaElement.prototype.play = function (...args) {
    const focusedVideo = getActiveAudioFocus();
    if (this instanceof HTMLVideoElement && focusedVideo && this !== focusedVideo) {
      this.pause();
      this.muted = true;
      this.defaultMuted = true;
      this.setAttribute("muted", "");
      return Promise.resolve();
    }
    return nativePlay.apply(this, args);
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.(".sound-button");
    if (!button) return;

    const video = button.closest(".media-frame")?.querySelector("video");
    if (!video) return;

    // This listener runs in the capture phase, before the page's existing
    // sound-button handler. Turning sound on establishes a persistent page
    // playback lock; turning sound off releases it before all videos restart.
    const isTurningSoundOn = video.muted;
    audioFocusVideo = isTurningSoundOn ? video : null;

    if (isTurningSoundOn) {
      queueMicrotask(() => {
        if (audioFocusVideo !== video || video.muted) return;
        const playPromise = nativePlay.call(video);
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      });
    }
  }, true);
})();
