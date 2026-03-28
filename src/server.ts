import app from "./app.js"
import { PORT } from "./constants/api.js"

app.listen(PORT, ()=>{
    console.log(`Server started on http://localhost:${PORT}`)
})