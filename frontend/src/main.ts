import './assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { SoundManager } from './utils/soundManager'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const soundManager = SoundManager.getInstance()
soundManager.addSound('button_click', '/sounds/button_click.mp3')
soundManager.addSound('player_turn', '/sounds/player_turn.mp3')
soundManager.addSound('kill_pawn', '/sounds/kill_pawn.mp3')
soundManager.addSound('lose_pawn', '/sounds/lose_pawn.mp3')
soundManager.addSound('win', '/sounds/win.mp3')
soundManager.addSound('lose', '/sounds/lose.mp3')

app.directive('button-click-sound', {
  mounted(el) {
    el.addEventListener('click', () => {
      soundManager.playSound('button_click')
    })
  }
})

app.mount('#app')
