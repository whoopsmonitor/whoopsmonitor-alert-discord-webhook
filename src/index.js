const axios = require('axios')

const webhookUrl = process.env.WM_WEBHOOK_URL

const CHECK_NAME = process.env.WM_CHECK_NAME
const CHECK_OUTPUT = process.env.WM_CHECK_OUTPUT
const CHECK_EXIT_CODE = process.env.WM_CHECK_EXIT_CODE * 1 // to make sure it is a number

let exitLabel = 'ok'
let themeColor = '65280'

if (CHECK_EXIT_CODE === 1) {
  exitLabel = 'warning'
  themeColor = '16753920'
}

if (CHECK_EXIT_CODE === 2) {
  exitLabel = 'critical'
  themeColor = '16711680'
}

let title = `Check "${CHECK_NAME}"`

let summary = `(${exitLabel}) ${CHECK_OUTPUT || ''}`

if (!summary) {
  summary = 'no output'
}

  ; (async () => {
    try {
      await axios.post(webhookUrl,
        {
          "embeds": [
            {
              "title": title,
              "description": summary,
              "color": themeColor
            }
          ]
        }
      )

      console.log(`Message sent to Discord via webhook.`)
      process.exit(0)
    } catch (error) {
      console.log(`Message has not been send to Discord via webhook.`)
      console.error(error.response || error)
      process.exit(2)
    }
  })()
