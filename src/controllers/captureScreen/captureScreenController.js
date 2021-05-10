const {OK, BAD_REQUEST, METHOD_FAILURE} = require('http-status-codes');
const webshot = require('webshot');
const {success} = require('../../helpers/response');
const {ErrorHandler} = require('../../errorHandlers');

function urlValidator(url) {
  const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  const regex = new RegExp(expression);
  return url.match(regex);
}

async function captureScreen(req, res) {
  /* capture screen */
  const {remoteUrl, imageName, screenSize = {}, shotSize = {}} = req.body;

  console.log({remoteUrl, imageName, screenSize, shotSize});
  const options = {
    stramType: 'png',
    screenSize: {
      width: screenSize.width || 'all',
      height: screenSize.height || 'all',
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
    const image = await webshot(
      remoteUrl.trim(),
      imageName.trim(),
      options,
      function(err) {
        if (err) {
          throw new ErrorHandler(METHOD_FAILURE, 'Image capture having issue');
        }

        res.setHeader(
          'Content-disposition',
          `attachment;filename=${imageName.trim()}`,
        );
        res.set('Content-Type', 'image/jpg');
        res.status(OK).download(image);
      },
    );
  })();

  // success(req, res, OK, {}, 'Screen Captured');
}

module.exports = {captureScreen};
