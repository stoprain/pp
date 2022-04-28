const STATUS = document.getElementById('status');
const VIDEO = document.getElementById('webcam');
const ENABLE_CAM_BUTTON = document.getElementById('enableCam');
const photo = document.getElementById('photo');
const canvas = document.getElementById('canvas');
const predict = document.getElementById('predict');

ENABLE_CAM_BUTTON.addEventListener('click', enableCam);
ENABLE_CAM_BUTTON.disabled = true

var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function enableCam() {
  openCamera().then(
    function(webcam) {
      capture(webcam).then(

      )
    }
  )
}

var model = undefined

const tfliteModel = tflite.loadTFLiteModel('./docqa-lite.tflite');
tfliteModel.then(
  function(value) {
    ENABLE_CAM_BUTTON.disabled = false
    STATUS.innerText = 'docqa-lite loaded successfully!';
    model = value
  }
);

async function openCamera() {
  VIDEO.playsInline = true;
  VIDEO.autoplay = true;
  const webcam = await tf.data.webcam(VIDEO, {
    resizeWidth: 512,
    resizeHeight: 512,
    facingMode: iOSSafari ? 'environment' : 'user'
  });
  return webcam
}

async function capture(webcam) {
  var start = new Date().getTime();
  const img = await webcam.capture();
  const img32 = tf.cast(img, 'int32')
  const input = tf.expandDims(img32);
  let outputTensor = model.predict(input);
  let result = outputTensor.dataSync()
  var end = new Date().getTime();
  var time = end - start;
  predict.innerText = 'Execution time: ' + time + "ms\n" + "Result: Fine: " + result[0]/256 + ", lowquality: " + result[1]/256
  setTimeout(() => {
    capture(webcam)
  }, 1000);  
}