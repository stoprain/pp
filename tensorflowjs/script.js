const STATUS = document.getElementById('status');
const VIDEO = document.getElementById('webcam');
const ENABLE_CAM_BUTTON = document.getElementById('enableCam');
const photo = document.getElementById('photo');
const canvas = document.getElementById('canvas');
const predict = document.getElementById('predict');

ENABLE_CAM_BUTTON.addEventListener('click', enableCam);
ENABLE_CAM_BUTTON.disabled = true

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function enableCam() {
  // if (hasGetUserMedia()) {
  //   // getUsermedia parameters.
  //   const constraints = {
  //     video: true,
  //     width: 640, 
  //     height: 480 
  //   };

  //   // Activate the webcam stream.
  //   navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
  //     VIDEO.srcObject = stream;
  //     VIDEO.addEventListener('loadeddata', function() {
  //       videoPlaying = true;
  //       ENABLE_CAM_BUTTON.classList.add('removed');
  //     });
  //   });
  // } else {
  //   console.warn('getUserMedia() is not supported by your browser');
  // }
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

    // var start = new Date().getTime();
    // const img = tf.browser.fromPixels(document.querySelector('img'));
    // const input = tf.expandDims(img);
    // console.log('prepare input: ' + ((new Date()).getTime() - start) + 'ms');
    // let outputTensor = value.predict(input);
    // console.log(value.getProfilingResults());
    // console.log('Execution time: ' + ((new Date()).getTime() - start)+ 'ms');

    // capture().then(
    //   function() {
        
    //   }
    // )
  }
);

async function openCamera() {
  const webcam = await tf.data.webcam(VIDEO, {
    resizeWidth: 512,
    resizeHeight: 512,
  });
  return webcam
}

async function capture(webcam) {

  // var context = canvas.getContext('2d');
  // canvas.width = 512;
  // canvas.height = 512;
  // context.drawImage(VIDEO, 0, 0, 512, 512);

//   var data = canvas.toDataURL('image/png');
//   photo.setAttribute('src', data);
//   const img = Buffer.from(base64str, 'base64')
//   // const img = tf.browser.fromPixels(photo);
// console.log(img)

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
  
  // var mCanvas = createImageFromRGBdata(img, 512, 512);
  // var imgDataUrl = mCanvas.toDataURL();   // make a base64 string of the image data (the array above)
  // PREVIEW.src = imgDataUrl;
  // PREVIEW.setAttribute('style', "width:512px; height:512px; border:solid 1px black"); // make it large enough to be visible

  
}

// /**
//  * Loads the MobileNet model and warms it up so ready for use.
//  **/
//  async function loadMobileNetFeatureModel() {
//   const URL = 
//     'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
  
//   mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});
//   STATUS.innerText = 'MobileNet v3 loaded successfully!';
  
//   // Warm up the model by passing zeros through it once.
//   tf.tidy(function () {
//     let answer = mobilenet.predict(tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]));
//     console.log(answer.shape);
//   });
// }

// // Call the function immediately to start loading.
// loadMobileNetFeatureModel();



// const video = document.getElementById('webcam');
// const liveView = document.getElementById('liveView');
// const demosSection = document.getElementById('demos');
// const enableWebcamButton = document.getElementById('webcamButton');

// // Check if webcam access is supported.
// function getUserMediaSupported() {
//   return !!(navigator.mediaDevices &&
//     navigator.mediaDevices.getUserMedia);
// }

// // If webcam supported, add event listener to button for when user
// // wants to activate it to call enableCam function which we will 
// // define in the next step.
// if (getUserMediaSupported()) {
//   enableWebcamButton.addEventListener('click', enableCam);
// } else {
//   console.warn('getUserMedia() is not supported by your browser');
// }

// // Placeholder function for next step. Paste over this in the next step.
// function enableCam(event) {
// }

// // Enable the live webcam view and start classification.
// function enableCam(event) {
//   // Only continue if the COCO-SSD has finished loading.
//   if (!model) {
//     return;
//   }
  
//   // Hide the button once clicked.
//   event.target.classList.add('removed');  
  
//   // getUsermedia parameters to force video but not audio.
//   const constraints = {
//     video: true
//   };

//   // Activate the webcam stream.
//   navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
//     video.srcObject = stream;
//     video.addEventListener('loadeddata', predictWebcam);
//   });
// }

// // Placeholder function for next step.
// function predictWebcam() {
// }

// // Store the resulting model in the global scope of our app.
// var model = undefined;

// // Before we can use COCO-SSD class we must wait for it to finish
// // loading. Machine Learning models can be large and take a moment 
// // to get everything needed to run.
// // Note: cocoSsd is an external object loaded from our index.html
// // script tag import so ignore any warning in Glitch.
// // cocoSsd.load().then(function (loadedModel) {
// //   model = loadedModel;
// //   // Show demo section now model is ready to use.
// //   demosSection.classList.remove('invisible');
// // });

// // const model3 = tf.loadLayersModel('web_model/model.json');
// // model3.then(
// //   function(value) {
// //     console.log(value)
// //   }
// // )
// // const MODEL_URL = 'web_model/model.json';
// // const model3 = tf.loadGraphModel(MODEL_URL);
// // model3.then(
// //   function(value) {
// //     console.log(value)
// //     const img = tf.browser.fromPixels(document.querySelector('img'));
// //     const input = tf.div(tf.expandDims(img), 255);
// //     console.log(input)
// //     value.execute(input);
// //   }
// // )

// // const tfliteModel = tflite.loadTFLiteModel(
// //   'https://tfhub.dev/tensorflow/lite-model/mobilenet_v2_1.0_224/1/metadata/1');
// // const model3 = tfTask.ImageClassification.CustomModel.TFLite.load({
// //   model: 'docdetect-lite.tflite'});

// tf.setBackend('webgl');
// const tfliteModel = tflite.loadTFLiteModel(
//   'docqa-lite-new.tflite', {"enableProfiling": true});
// tfliteModel.then(
//   function(value) {

//     console.log("tf.getBackend(): " + tf.getBackend());
//     console.log(value)
//         // Get pixels data from an image.
//         var start = new Date().getTime();
//         const img = tf.browser.fromPixels(document.querySelector('img'));
//         console.log(img);
//         // Normalize (might also do resize here if necessary).
//         // const input = tf.div(tf.expandDims(img), 255);
//         // const input = tf.expandDims(img);
//         // const input = tf.div(tf.expandDims(img), 255);
//         const input = tf.expandDims(img);
//         console.log(input);
//         console.log('prepare input: ' + ((new Date()).getTime() - start) + 'ms');
//         // Run the inference.
//         let outputTensor = value.predict(input);
//         // De-normalize the result.
//         // console.log(outputTensor)
//         // outputTensor.print()
//         console.log(value.getProfilingResults());
//         console.log('Execution time: ' + ((new Date()).getTime() - start)+ 'ms');;
//         // alert('Execution time: ' + time);

//         repeat(function () { 
//           var start = new Date().getTime();
//           let outputTensor = value.predict(input);
//           // De-normalize the result.
//           // console.log(outputTensor)
//           var end = new Date().getTime();
//           var time = end - start;
          
//           alert('Execution time: ' + time);
//         }, 20);
    
//     // const img = tf.browser.fromPixels(document.querySelector('img'));
//     // // var input = tf.sub(tf.div(tf.expandDims(img), 255), 1);
//     // // const input = tf.sub(tf.div(tf.expandDims(img), 127.5), 1);
//     // const input = tf.div(tf.zeros([1,416,416,3]), 255)
//     // console.log(input)
//     // var input1 = tf.div(tf.zeros([1,1,1,1,1,4]), 255)
//     // console.log(input1)
//     // var outputTensor = value.predict([input, input1]);
//     // console.log(outputTensor)
//   }
// );

// function repeat(func, times) {
//   func();
//   times && --times && repeat(func, times);
// }

// var children = [];

// function predictWebcam() {
//   // Now let's start classifying a frame in the stream.
//   model.detect(video).then(function (predictions) {
//     // Remove any highlighting we did previous frame.
//     for (let i = 0; i < children.length; i++) {
//       liveView.removeChild(children[i]);
//     }
//     children.splice(0);
    
//     // Now lets loop through predictions and draw them to the live view if
//     // they have a high confidence score.
//     for (let n = 0; n < predictions.length; n++) {
//       // If we are over 66% sure we are sure we classified it right, draw it!
//       if (predictions[n].score > 0.66) {
//         const p = document.createElement('p');
//         p.innerText = predictions[n].class  + ' - with ' 
//             + Math.round(parseFloat(predictions[n].score) * 100) 
//             + '% confidence.';
//         p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
//             + (predictions[n].bbox[1] - 10) + 'px; width: ' 
//             + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

//         const highlighter = document.createElement('div');
//         highlighter.setAttribute('class', 'highlighter');
//         highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
//             + predictions[n].bbox[1] + 'px; width: ' 
//             + predictions[n].bbox[2] + 'px; height: '
//             + predictions[n].bbox[3] + 'px;';

//         liveView.appendChild(highlighter);
//         liveView.appendChild(p);
//         children.push(highlighter);
//         children.push(p);
//       }
//     }
    
//     // Call this function again to keep predicting when the browser is ready.
//     window.requestAnimationFrame(predictWebcam);
//   });
// }