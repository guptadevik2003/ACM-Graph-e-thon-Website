let certForm = document.getElementById('certForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  let name = document.getElementById('name').value
  let university = document.getElementById('university').value

  if(name == '') {
    return alert('Please enter your Full Name!')
  }
  if(university == 'placeholder') {
    return alert('Please select a University!')
  }
  
  await fetch('/fetchCertificate', {
    method: 'POST',
    body: new URLSearchParams({
      "name": name,
      "university": university
    })
  })
  .then(res => res.json())
  .then(async data => {
    if(data.success) {

      const dataURL = `data:application/pdf;base64,${data.base64}`

      const downloadLink = document.createElement('a')
      downloadLink.href = dataURL
      downloadLink.download = data.fileName

      downloadLink.click();

    } else {
      alert(data.error)
    }
  })

})
