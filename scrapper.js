const config = require('./config.json')
const members = require('./data/users.json')
const fs = require('fs')
const { LinkedInProfileScraper } = require('linkedin-profile-scraper')
const Axios = require('axios')
const mime = require('mime')
const path = require('path')
const chalk = require('chalk')

const run = async () => {
  for (const itm of members) {
    const scraper = new LinkedInProfileScraper({
      sessionCookieValue: config.LINKEDIN_LI_AT_TOKEN,
    })
    await scraper.setup()
    const fileName = `${itm.name}.jpg`
    try {
      console.log(chalk.blue(itm.linkedin))
      const result = await scraper.run(itm.linkedin)
      // console.log(result.userProfile.photo)
      const url = result.userProfile.photo
      console.log(result)
      console.log('AVATAR URL : ' + url)
      const pathFile = path.join(__dirname, '/dist/avatars/', fileName)
      const writer = fs.createWriteStream(pathFile)
      const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream',
      })
      response.data.pipe(writer)

      const doEvent = () => {
        new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
      }
      await doEvent()
    } catch (err) {
      if (err.name === 'SessionExpired') {
        console.log('===============================')
        console.log('FAILED SCRAP')
        console.log('===============================')
        // Do something when the scraper notifies you it's not logged-in anymore
      }
      console.warn(err)
    }
  }
}

// return
run()
