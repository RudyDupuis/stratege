import { isDefined } from '@shared/utils/TypeGuard'
import { ref } from 'vue'

export class SoundManager {
  private static instance: SoundManager
  private sounds: Record<string, HTMLAudioElement> = {}
  private isMuted = ref<boolean>(localStorage.getItem('soundMuted') === 'true')

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  public addSound(key: string, path: string) {
    const audio = new Audio(path)
    audio.preload = 'auto'
    this.sounds[key] = audio
  }

  public playSound(key: string) {
    if (this.isMuted.value) {
      return
    }
    const sound = this.sounds[key]
    if (isDefined(sound)) {
      sound.currentTime = 0
      sound.play()
    }
  }

  public toggleMuteSwitch() {
    this.isMuted.value = !this.isMuted.value
    localStorage.setItem('soundMuted', String(this.isMuted.value))
  }

  public getIsMuted() {
    return this.isMuted.value
  }
}
