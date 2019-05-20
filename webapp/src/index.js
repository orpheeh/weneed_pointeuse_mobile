const QRCode = require('qrcode');
const randomWords = require('random-words');

let CODE = 'we need';
let _pointage = [];
let _last_code = null;
loadCode();

document.querySelector('#generate').addEventListener('click', (e) => manuallyGenerateQRCode());
document.querySelector('#save').addEventListener('click', (e) => registerCode());
document.querySelector('#search').addEventListener('click', (e) => showSearchInput());
document.querySelector('#refresh').addEventListener('click', (e) => loadPointage());
document.querySelector('#search-member').addEventListener('keypress', (e) => {
  const req = document.querySelector('#search-member').value;
  const array = _pointage.filter((value, index, array) => {
    const fullname = array[index].member.nom + " " + array[index].member.prenom;
    return fullname.match(new RegExp(req, 'i')) != null ||
      array[index].member.status.match(new RegExp(req, 'i')) != null;
  });
  update_pointage(array, req);
});

function loadCode() {
  ajax('GET', 'http://localhost:3000/code', {}, (json) => {
    if (json.length == 0) {
      return;
    }
    _last_code = json[json.length - 1];
    const date = new Date(json[json.length - 1].date);
    const date_today = new Date();
    if (isSameDay(date, date_today)) {
      document.querySelector('#save').classList.add('btn-off');
      generateQRCode(json[json.length - 1].text);
      const print_button = document.querySelector('#print');
      print_button.classList.remove('btn-off');
      const filename = ('weneed-pointeuse-mobile-qrcode-' + (new Date()).toISOString()).toUpperCase() + ".png";
      print_button.setAttribute('download', filename);
      print_button.setAttribute('href', canvas.toDataURL("image/png"));
      loadPointage();
    }
  });
}

function isSameDay(date1, date2) {
  return date1.getDate() == date2.getDate()
    && date1.getMonth() == date2.getMonth()
    && date1.getFullYear() == date2.getFullYear();
}

function manuallyGenerateQRCode() {
  const generate_button = document.querySelector('#generate');
  if (isOff(generate_button)) {
    return;
  }
  CODE = randomWords({ exactly: 5, join: ' ' });
  generateQRCode(CODE);
}

function generateQRCode(code) {
  const canvas = document.getElementById('qrcodecanvas')
  QRCode.toCanvas(canvas, code, function (error) {
    if (error) console.error(error)
    console.log('success!');
  });
  //activer le bouton enregistrer
  const save_button = document.querySelector('#save');
  save_button.classList.remove('btn-off');
  //Désactiver le bouton générer
  document.querySelector('#generate').classList.add('btn-off');
}


function ajax(method, url, data, callback) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(this.responseText));
    }
  }
  xhttp.open(method, url, true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(data));
}

function registerCode() {
  const save_button = document.querySelector('#save');
  if (save_button.classList.contains('btn-off')) {
    return;
  }
  const json = {
    text: CODE
  };
  ajax('POST', 'http://localhost:3000/code', json, () => { });
  //désactiver le bouton save et activer le bouton imprimer
  const print_button = document.querySelector('#print');
  save_button.classList.add('btn-off');
  print_button.classList.remove('btn-off');
  //changer l'option d'enregistrment download="WENEED-POINTEUSE-MOBILE-QRCODE-AAAMMJJHHMMSS.png"
  const filename = ('weneed-pointeuse-mobile-qrcode-' + (new Date()).toISOString()).toUpperCase() + ".png";
  const canvas = document.getElementById('qrcodecanvas')
  print_button.setAttribute('download', filename);
  print_button.setAttribute('href', canvas.toDataURL("image/png"));
}


function showSearchInput() {
  const input = document.querySelector('.main-input');
  input.classList.toggle('show-input');
}

function loadPointage() {
  console.log(_last_code);
  if(_last_code == null){
    return;
  }
  //Effacer le contenu du tableau contenant la liste de pointage du jour
  freeTable('.pointage-tbody');
  //Récupérer toute les pointage
  ajax('GET', 'http://localhost:3000/pointage', {}, (json) => {
    _pointage = [];
    const today = new Date();
    const date = new Date(_last_code.date);
    for (let i = 0; i < json.length; i++) {
      if (isSameDay(date, today) && json[i].idcode == _last_code._id) {
        const new_pointage = { pointage: json[i] };
        ajax('GET', 'http://localhost:3000/member/' + json[i].idmember, {}, (response) => {
          new_pointage.member = response;
          loadTable(document.querySelector('.pointage-tbody'), new_pointage, '');
          _pointage.push(new_pointage);
        });
      }
    }
  });
}

function freeTable(selector) {
  const tbody = document.querySelector(selector);
  const allchild = tbody.querySelectorAll('*');
  for (let j = 0; j < allchild.length; j++) {
    allchild[j].remove();
  }
}

function loadTable(tbody, json, mark) {
  let tr = document.createElement('tr');
  tbody.appendChild(tr);
  //Nom(s) et Prénom(s)
  let td = document.createElement('td');
  let fullname = (json.member.nom + " " + json.member.prenom);
  let found = fullname.substr(fullname.search(new RegExp(mark, 'i')), mark.length);
  fullname = fullname.replace(new RegExp(mark, 'i'), '<mark>' + found + '</mark>');
  td.innerHTML = fullname;
  tr.appendChild(td);
  //Status
  td = document.createElement('td');
  found = json.member.status.substr(json.member.status.search(new RegExp(mark, 'i')), mark.length);
  const status = json.member.status.replace(new RegExp(mark, 'i'), '<mark>' + found + '</mark>');
  td.innerHTML = status;
  tr.appendChild(td);

  td = document.createElement('td');
  td.innerHTML = json.member.mobile;
  tr.appendChild(td);

  td = document.createElement('td');
  td.innerHTML = json.member.email;
  tr.appendChild(td);

  td = document.createElement('td');
  td.innerHTML = json.pointage.arrivee;
  tr.appendChild(td);

  td = document.createElement('td');
  if (json.pointage.depart === undefined) {
    td.innerHTML = 'En attente';
  } else {
    td.innerHTML = json.pointage.depart;
    tr.style.backgroundColor = '#ff0000';
  }
  tr.appendChild(td);
}

function update_pointage(array, mark) {
  //Effacer le tableau contenant la liste de pointage du jour
  freeTable('.pointage-tbody');
  for (let i = 0; i < array.length; i++) {
    loadTable(document.querySelector('.pointage-tbody'), array[i], mark);
  }
}


function isOff(button) {
  return button.classList.contains('btn-off');
}