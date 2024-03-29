let mysql = require('mysql')
let express = require('express')
let session = require('express-session')
let bodyParser = require('body-parser')
let path = require('path')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loginnode'
})

let app = express()

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/login.html'))
})

app.post('/auth', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (username && password) {
        connection.query('SELECT * FROM account WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
            if (results.length > 0) {
                req.session.loggedin = true
                req.session.username = username
                res.redirect('/home')
            } else {
                res.send('Wrong Username and/or Password.')
            }
            res.end()
        })
    } else {
        res.send('Please Enter Username and Password !!')
        res.end()
    }
})

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.send(`Welcome ${req.session.username}`)
    } else {
        res.send('Please Login to be in This Page.')
    }
    res.end()
})


app.listen(3000, () => {
    console.log("Port 3000 is open, You can now open the website.")
})