import "./style/index.scss"
import {createApp} from "vue"
import App from "./App.vue"

const app = createApp(App)

const a = new Map()
a.set(1, 1)
console.log(a)
app.mount("#app")