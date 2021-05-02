import express = require('express')
import dotenv = require('dotenv')
const bodyParser = require('body-parser')
import http = require('http')
const { 
    jwtAuth,
    handleAuthError
} = require('./src/modules/auth/middleware/auth')
const rbacMiddleware = require('./src/modules/auth/middleware/rbacMiddleware')
const corsMiddleware = require('./src/modules/middleware/corsMiddleware')

const app = express()
let server = http.createServer(app)
dotenv.config()

//Routes
const authRoutes = require('./src/modules/auth/routes')

const port = process.env.PORT_BACKEND || 8000

//Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require(process.env.NODE_ENV == "development" ? '../swagger/swagger.json' : './swagger/swagger.json')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(function (err: any, req: any, res: any, next: any) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

//CORS Middleware
app.use(corsMiddleware)

//Body Parse
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//AUTH Middleware
app.use(jwtAuth)
app.use(handleAuthError)

//RBAC Middleware
app.use(rbacMiddleware)

//Routes
app.use('/', authRoutes)

app.get('/', (req: any, res: any) => { res.send("Hello, listening port: "+process.env.PORT_BACKEND) })
server.listen(port, () => console.log('Listening port: ' + port))