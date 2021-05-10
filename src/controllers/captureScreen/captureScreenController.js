const {OK, BAD_REQUEST, METHOD_FAILURE} = require('http-status-codes');
const webshot = require('webshot');
const fs = require('fs');
const {success} = require('../../helpers/response');
const {ErrorHandler} = require('../../errorHandlers');

function urlValidator(url) {
  const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  const regex = new RegExp(expression);
  return url.match(regex);
}

async function captureScreen(req, res) {
  /* capture screen */
  const {
    remoteUrl,
    imageName,
    screenSize = {},
    shotSize = {},
    format,
  } = req.body;

  console.log({remoteUrl, imageName, screenSize, shotSize, format});
  const options = {
    stramType: 'png',
    screenSize: {
      width: screenSize.width || 1200,
      height: screenSize.height || 1200,
    },
    shotSize: {
      width: shotSize.width || 'all',
      height: shotSize.height || 'all',
    },
  };
  console.log('options', options);
  if (!urlValidator(remoteUrl.trim())) {
    throw new ErrorHandler(BAD_REQUEST, 'Enter valid url');
  }
  (async () => {
    await webshot(remoteUrl.trim(), imageName.trim(), options, function(err) {
      if (err) {
        throw new ErrorHandler(
          METHOD_FAILURE,
          'Image capture having issue',
          err
        );
      }
      let contentType;

      if (format === 'PNG') {
        contentType = `type=image/png,fileName=${imageName.trim()}`;
      } else if (format === 'JPG') {
        contentType = `type=image/jpg,fileName=${imageName.trim()}`;
      } else {
        contentType = `type=application/pdf,fileName=${imageName.trim()}`;
      }
      res.setHeader(
        'Content-disposition',
        `attachment;fileName=${imageName.trim()}`
      );
      const s = fs.createReadStream(imageName.trim());
      s.on('open', function() {
        res.set('Content-Type', contentType);
        s.pipe(res);
      });
    });
  })();

  // success(req, res, OK, {}, 'Screen Captured');
}

module.exports = {captureScreen};
