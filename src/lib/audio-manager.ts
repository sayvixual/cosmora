// Shared Space Ambience Audio Manager Singleton
type AudioStateListener = (isPlaying: boolean) => void;

class SpaceAudioManager {
  private static instance: SpaceAudioManager;
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private targetVolume: number = 0.45;

  private constructor() {
    if (typeof window !== "undefined") {
      this.initAudio();
    }
  }

  public static getInstance(): SpaceAudioManager {
    if (!SpaceAudioManager.instance) {
      SpaceAudioManager.instance = new SpaceAudioManager();
    }
    return SpaceAudioManager.instance;
  }

  private initAudio() {
    if (this.audio) return;
    try {
      this.audio = new Audio("/audio/amb_sfx.mp3");
      this.audio.loop = true;
      this.audio.volume = 0;
      this.audio.preload = "auto";

      this.audio.addEventListener("ended", () => {
        if (this.isPlaying && this.audio) {
          this.audio.play().catch(() => {});
        }
      });
    } catch {
      this.audio = null;
    }
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.fadeOutAndPause();
      return false;
    } else {
      return this.fadeInAndPlay();
    }
  }

  public async fadeInAndPlay(): Promise<boolean> {
    this.initAudio();
    if (!this.audio) return false;

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    try {
      this.audio.volume = 0;
      await this.audio.play();
      this.isPlaying = true;
      this.notify();

      // Smooth fade in over 800ms
      let currentVol = 0;
      const step = this.targetVolume / 20;
      this.fadeInterval = setInterval(() => {
        if (!this.audio) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          return;
        }
        currentVol = Math.min(this.targetVolume, currentVol + step);
        this.audio.volume = currentVol;
        if (currentVol >= this.targetVolume) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
        }
      }, 40);

      return true;
    } catch (err) {
      console.warn("Audio autoplay policy prevented playback or audio missing:", err);
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public fadeOutAndPause() {
    if (!this.audio || !this.isPlaying) return;

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    let currentVol = this.audio.volume;
    const step = currentVol / 15;

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        return;
      }
      currentVol = Math.max(0, currentVol - step);
      this.audio.volume = currentVol;
      if (currentVol <= 0.01) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.audio.pause();
        this.isPlaying = false;
        this.notify();
      }
    }, 30);
  }
}

export const spaceAudio = typeof window !== "undefined" ? SpaceAudioManager.getInstance() : null;
