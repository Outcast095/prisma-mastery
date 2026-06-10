// index.ts
import express from 'express'
import userRouters from "./src/routes/userRouter.js"; // Не забывай про .js расширения в ESM!
import postRouters from "./src/routes/postRouter.js";

const app = express()
const PORT = 5000

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
})

// Подключаем наши роуты
app.use("/user", userRouters);
app.use("/post", postRouters); // <-- Добавили роут для постов

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})