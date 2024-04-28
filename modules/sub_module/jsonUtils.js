/*
  name: read and write json module
*/

const fs = require('fs')

function readJSONFile (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }
      try {
        const jsonData = JSON.parse(data)
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    })
  })
}

function writeJSONFile (filePath, data) {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

module.exports = {
  readJSONFile,
  writeJSONFile
}
