const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 8888;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/') {
    let requestBody = '';

    req.on('data', (chunk) => {
      requestBody += chunk.toString();
    });

    req.on('end', () => {
      const datos = new URLSearchParams(requestBody);
      const datosJSON = {
        nombre: datos.get('nombre'),
        apellido: datos.get('apellido'),
        telefono: datos.get('telefono'),
        email: datos.get('email'),
        descripcion: datos.get('descripcion')
      };

      guardarContacto(datosJSON, (error) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write('Error al guardar los datos');
          res.end();
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.write('Datos guardados correctamente');
          res.end();
        }
      });
    });
  } else if (req.url === '/353297') {
    const htmlPath = path.join(__dirname, 'www','353297', '353297.html');
    const cssPath = path.join(__dirname, 'www','353297', '353297.css');
    const imagePath = path.join(__dirname, 'www','353297', 'ine.jpeg');
    sendHtmlResponse(htmlPath, res, cssPath, imagePath);
  } else if (req.url === '/353267') {
    const htmlPath = path.join(__dirname, 'www','353267', '353267.html');
    const cssPath = path.join(__dirname, 'www','353267', '353267.css');
    const imagePath = path.join(__dirname, 'www','353267', 'perfilG.jpg');
    sendHtmlResponse(htmlPath, res, cssPath, imagePath);
  } else if (req.url === '/353391') {
    const htmlPath = path.join(__dirname, 'www','353391', '353391.html');
    const cssPath = path.join(__dirname, 'www','353391', '353391.css');
    const imagePath = path.join(__dirname, 'www','353391', 'perfil.jpg');
    sendHtmlResponse(htmlPath, res, cssPath, imagePath);
  } else {
    const file = req.url === '/' ? './www/landing.html' : `./www${req.url}`;

    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('Not Found');
        res.end();
      } else {
        const extension = file.split('.').pop();
        let contentType = '';

        switch (extension) {
          case 'txt':
            contentType = 'text/plain';
            break;
          case 'html':
            contentType = 'text/html';
            break;
          case 'css':
            contentType = 'text/css';
            break;
          case 'png':
            contentType = 'image/png';
            break;
          case 'jpeg':
          case 'jpg':
            contentType = 'image/jpeg';
            break;
          default:
            contentType = 'text/plain';
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
      }
    });
  }
});

function sendHtmlResponse(htmlPath, res, cssPath, imagePath) {
  fs.readFile(htmlPath, 'utf8', (err, htmlContent) => {
    if (err) {
      res.writeHead(404);
      res.write('Archivo no encontrado');
      res.end();
      return;
    }

    fs.readFile(cssPath, 'utf8', (err, cssContent) => {
      if (err) {
        res.writeHead(404);
        res.write('Archivo CSS no encontrado');
        res.end();
        return;
      }

      fs.readFile(imagePath, (err, imageData) => {
        if (err) {
          res.writeHead(404);
          res.write('Archivo de imagen no encontrado');
          res.end();
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        const modifiedHtml = injectCssAndImage(htmlContent, cssContent, imageData);
        res.write(modifiedHtml);
        res.end();
      });
    });
  });
}

function injectCssAndImage(htmlContent, cssContent, imageData) {
  const cssTag = `<style>${cssContent}</style>`;
  const imageTag = `<img src="data:image/jpeg;base64,${imageData.toString('base64')}" alt="Imagen">`;

  const modifiedHtml = htmlContent.replace('<!-- IMAGE_TAG -->', imageTag);

  const headEndTag = '</head>';
  const modifiedHtmlWithCss = modifiedHtml.replace(headEndTag, `${cssTag}\n${headEndTag}`);

  return modifiedHtmlWithCss;
}

function guardarContacto(datos, callback) {
  const archivo = './contactos.txt';
  const contenido = `Nombre: ${datos.nombre}\nApellido: ${datos.apellido}\nTeléfono: ${datos.telefono}\nEmail: ${datos.email}\nDescripción: ${datos.descripcion}\n\n`;

  fs.appendFile(archivo, contenido, (error) => {
    if (error) {
      callback(error);
    } else {
      callback(null);
    }
  });
}

server.listen(port, hostname, () => {
  console.log(`Servidor corriendo en http://${hostname}:${port}/`);
});
