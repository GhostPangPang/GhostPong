export class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement;

  private constructor(src: string) {
    this.audio = new Audio(src);
  }

  public static getInstance(src: string): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager(src);
    }

    return AudioManager.instance;
  }

  public play() {
    this.audio.play();
  }

  public stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
