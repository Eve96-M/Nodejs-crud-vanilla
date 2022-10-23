const http = require("http")
const path = require("path")
const fs = require("fs/promises")

const PORT = 8000

const app = http.createServer(async (request, response) => {
    const methodReq = request.method
    const url = request.url
    const id = url.slice(url.length - 1, url.length)
    const jsonPath = path.resolve("./data.json")
    const jsonFile = await fs.readFile(jsonPath, "utf8")
    const arr = JSON.parse(jsonFile)
    if (url.startsWith("/tasks")) {
        if (methodReq === "GET") {
            response.setHeader("Content-type", "application/json")
            response.write(jsonFile)
        }
        if (methodReq === "POST") {
            request.on("data", (data) => {
                const newTask = JSON.parse(data)
                arr.push(newTask)
                const strData = JSON.stringify(arr)
                fs.writeFile(jsonPath, strData)
                response.writeHead(201)
            })
        }
        if (methodReq === "DELETE") {
            const filteredArray = arr.filter(tf => tf.id != id)
            const strData = JSON.stringify(filteredArray)
            fs.writeFile(jsonPath, strData)
        }

        if (methodReq === "PUT") {
            request.on("data", (data) => {
                const modTask = JSON.parse(data)
                const modArray = arr.map(mA => ({ ...mA, ...mA.id === id && modTask }))
                const strData = JSON.stringify(modArray)
                fs.writeFile(jsonPath, strData)
            })
        }
    }



    response.end()
})


app.listen(8000)