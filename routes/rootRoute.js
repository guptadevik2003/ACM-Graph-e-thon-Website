const express = require('express')
const router = express.Router()
const fs = require('fs')
const removeExtraSpace = require('../functions/removeExtraSpace')
const editCert = require('../functions/editCert')
const titleCase = require('../functions/titleCase')
const { PDFDocument, rgb } = require('pdf-lib')

router.get('/', async (req, res) => {
  res.sendFile('index.html')
})

router.get('/favicon.ico', async (req, res) => {
  res.sendFile(`${process.cwd()}/public/favicon.png`)
})

router.post('/fetchCertificate', async (req, res) => {
  const { name, university } = req.body

  if(!name) return res.json({ success: false, error: 'name undefined!' })
  if(!university) return res.json({ success: false, error: 'university undefined!' })
  
  if(!['GEU','GEHU'].includes(university)) return res.json({ success: false, error: 'wrong university entered!' })

  let students = fs.readFileSync('students.txt', 'utf-8')
  
  students = students.toLowerCase()
  students = students.split('\r\n')
  students = students.filter(s => s!=='')
  students.forEach((it, ind) => {
    students[ind] = removeExtraSpace(students[ind])
  })

  let formattedName = removeExtraSpace(name).toLowerCase()

  if(!students.includes(formattedName)) return res.json({ success: false, error: 'name not found!' })           

  formattedName = titleCase(formattedName)

  let imageBuffer = await editCert({
    volunteerName: formattedName,
    universityName: university==='GEU'?'Graphic Era deemed to be University' : 'Graphic Era Hill University'
  })

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([1414,2000])

  const imageEmbed = await pdfDoc.embedPng(imageBuffer)
  const { width, height } = imageEmbed.scaleToFit(page.getWidth(), page.getHeight())

  page.drawImage(imageEmbed, {
    x: page.getWidth() / 2 - width / 2,
    y: page.getHeight() / 2 - height / 2,
    width,
    height,
    color: rgb(1,1,1),
  })

  const pdfBytes = await pdfDoc.save()
  
  let base64 = Buffer.from(pdfBytes).toString('base64')

  return res.json({ success: true, base64, fileName: `Graph-E-Thon Certificate - ${formattedName} - ${university}.pdf` })
  
})

module.exports = router
