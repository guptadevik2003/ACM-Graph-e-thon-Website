const Jimp = require('jimp');

module.exports = async ({ volunteerName, universityName }) => {

  const poppinsmed32 = await Jimp.loadFont('fonts/poppinsmed32/poppinsmed32.fnt');

  const certificate = await Jimp.read('Certificate-Template-Line.png');

  await certificate.print(
    poppinsmed32,
    220,
    1134,
    volunteerName
  );

  await certificate.print(
    poppinsmed32,
    182,
    1203,
    universityName
  );

  return certificate.getBufferAsync(Jimp.MIME_PNG);

}
