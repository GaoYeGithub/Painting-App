window.onload = function () {
  var canvas = document.getElementById("paint-canvas");
  var context = canvas.getContext("2d");
  var boundings = canvas.getBoundingClientRect();
  var brushSize = document.getElementById("brush").value;
  var shape = document.getElementById("shape").value;
  var isDrawing = false;
  var mouseX = 0;
  var mouseY = 0;
  var startX = 0;
  var startY = 0;
  var history = [];
  var historyIndex = -1;

  context.strokeStyle = 'black';
  context.lineWidth = brushSize;
  context.lineCap = 'round';

  document.getElementById('brush').addEventListener('input', function(event) {
    context.lineWidth = event.target.value;
  });

  document.getElementById('color-picker').addEventListener('input', function(event) {
    context.strokeStyle = event.target.value;
  });

  document.getElementById('shape').addEventListener('change', function(event) {
    shape = event.target.value;
  });

  document.getElementById('line-style').addEventListener('change', function(event) {
    context.setLineDash(event.target.value === 'dashed' ? [5, 5] : []);
  });

  document.getElementById('brush-shape').addEventListener('change', function(event) {
    context.lineCap = event.target.value;
  });

  canvas.addEventListener('mousedown', function(event) {
    setMouseCoordinates(event);
    isDrawing = true;
    startX = mouseX;
    startY = mouseY;
    context.beginPath();
    context.moveTo(mouseX, mouseY);
  });

  canvas.addEventListener('mousemove', function(event) {
    if (isDrawing) {
      setMouseCoordinates(event);
      if (shape === 'free') {
        context.lineTo(mouseX, mouseY);
        context.stroke();
      }
    }
  });

  canvas.addEventListener('mouseup', function(event) {
    setMouseCoordinates(event);
    isDrawing = false;
    if (shape !== 'free') {
      drawShape(shape, startX, startY, mouseX, mouseY);
    }
    saveHistory();
  });

  document.getElementById('clear').addEventListener('click', function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  });

  document.getElementById('save').addEventListener('click', function() {
    var imageName = prompt('Please enter image name');
    var canvasDataURL = canvas.toDataURL();
    var a = document.createElement('a');
    a.href = canvasDataURL;
    a.download = imageName || 'drawing';
    a.click();
  });

  document.getElementById('undo').addEventListener('click', function() {
    if (historyIndex > 0) {
      historyIndex--;
      var imgData = history[historyIndex];
      var img = new Image();
      img.src = imgData;
      img.onload = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
    }
  });

  document.getElementById('redo').addEventListener('click', function() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      var imgData = history[historyIndex];
      var img = new Image();
      img.src = imgData;
      img.onload = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
    }
  });

  document.getElementById('eraser').addEventListener('click', function() {
    context.strokeStyle = 'white';
  });

  document.getElementById('text').addEventListener('click', function() {
    var text = prompt('Enter text:');
    if (text) {
      context.font = `${brushSize * 10}px Arial`;
      context.fillText(text, mouseX, mouseY);
      saveHistory();
    }
  });

  function setMouseCoordinates(event) {
    mouseX = event.clientX - boundings.left;
    mouseY = event.clientY - boundings.top;
  }

  function drawShape(shape, x1, y1, x2, y2) {
    context.beginPath();
    if (shape === 'line') {
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
    } else if (shape === 'rectangle') {
      context.rect(x1, y1, x2 - x1, y2 - y1);
    } else if (shape === 'circle') {
      var radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      context.arc(x1, y1, radius, 0, 2 * Math.PI);
    } else if (shape === 'ellipse') {
      var radiusX = (x2 - x1) / 2;
      var radiusY = (y2 - y1) / 2;
      context.ellipse(x1 + radiusX, y1 + radiusY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, 2 * Math.PI);
    }
    context.stroke();
  }

  function saveHistory() {
    historyIndex++;
    history.length = historyIndex;
    history.push(canvas.toDataURL());
  }

  saveHistory();
};
