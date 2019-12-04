/* eslint-disable prettier/prettier */
import fs from 'fs'
import readline from 'readline'
import { google } from 'googleapis'
import Mail from './createMail'
const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
]
const TOKEN_PATH = 'token.json'
const sendMessage = (userEmail, link) => {
    fs.readFile('credentials.json', (err, content) => {
        if (err) {
            return console.log('Error loading client secret file:', err)
        }

        authorize(JSON.parse(content), getAuth(userEmail, link))
    })
}


function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            return getNewToken(oAuth2Client, callback)
        }
        oAuth2Client.setCredentials(JSON.parse(token))
        callback(oAuth2Client)
    })
}


function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    rl.question('Enter the code from that page here: ', code => {
        rl.close()
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.log('Error retrieving access token', err)
            oAuth2Client.setCredentials(token)
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), error => {
                if (error) return console.log(error)
                console.log('Token stored to', TOKEN_PATH)
            })
            callback(oAuth2Client)
        })
    })
}

const getAuth = (userEmail, link) => (auth) => {
    const newEmail = new Mail(auth, userEmail, 'Confirmation Link', link, 'mail')
    newEmail.makeBody()
}

export default sendMessage;
