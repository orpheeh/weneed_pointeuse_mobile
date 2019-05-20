
loadAllMemberOnTable();

const member_tab = document.querySelector('#member-tab-head');
const pointage_tab = document.querySelector('#pointage-tab-head');

member_tab.addEventListener('click', () => change_tab(member_tab));
pointage_tab.addEventListener('click', (e) => change_tab(pointage_tab));


function change_tab(tab) {
    member_tab.classList.remove('active-tab');
    pointage_tab.classList.remove('active-tab');

    tab.classList.add('active-tab');

    document.querySelector('#member-container').classList.remove('active-tab');
    document.querySelector('#pointage-container').classList.remove('active-tab');

    document.querySelector('#' + tab.href.split('#')[1]).classList.add('active-tab');
}

let _member = [];

function loadAllMemberOnTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const json = JSON.parse(this.responseText);
            console.log(this.responseText);
            const response = JSON.parse(this.responseText);

            const tbody = document.querySelector('.member-tbody');
            tbody.innerHTML = '';
            for (let i = 0; i < response.length; i++) {
                let json = response[i];
                update_table_contain(json, tbody);
                _member.push(json);

            }
        }
    }
    xhttp.open('GET', 'http://localhost:3000/member', true);
    xhttp.send();
}

function search_member() {
    const request = document.querySelector('.search-member').value;

    const tbody = document.querySelector('.member-tbody');
    console.log('Search');
    //Effacer le contenu du tableau
    const allchild = tbody.querySelectorAll('.member-tbody *');
    for (let i = 0; i < allchild.length; i++) {
        allchild[i].remove();
    }

    //Récupérer les ligne qui contienent la recherche
    let array = _member.filter((value, index, array) => {
        const fullname = array[index].nom + " " + array[index].prenom;
        return fullname.match(new RegExp(request, 'i')) != null;
    });

    //Les afficher dans le tableau
    for (let i = 0; i < array.length; i++) {
        update_table_contain(array[i], tbody);
    }
}

function update_table_contain(json, tbody) {
    let tr = document.createElement('tr');
    tbody.appendChild(tr);

    let td = document.createElement('td');
    const input_nom = document.createElement('input');
    input_nom.type = 'text';
    input_nom.value = json.nom;
    td.appendChild(input_nom);
    tr.appendChild(td);

    td = document.createElement('td');
    const input_prenom = document.createElement('input');
    input_prenom.type = 'text';
    input_prenom.value = json.prenom;
    td.appendChild(input_prenom);
    tr.appendChild(td);

    const STATUS = [
        { inner: '-- Status --', value: 'none' },
        { value: 'BENEVOL', inner: 'Bénévol' },
        { value: 'STAGIAIRE', inner: 'Stagiaire' },
        { value: 'STAFF', inner: 'Salarié' },
        { value: 'PRESIDENT', inner: 'Président' },
        { value: 'SG', inner: 'Sécretaire Général' }];

    td = document.createElement('td');
    const select_status = document.createElement('select');
    for (let j = 0; j < STATUS.length; j++) {
        const option = document.createElement('option');
        option.selected = STATUS[j].value == json.status;
        option.value = STATUS[j].value;
        option.innerHTML = STATUS[j].inner;
        select_status.appendChild(option);
    }
    td.appendChild(select_status);
    tr.appendChild(td);

    td = document.createElement('td');
    const input_mobile = document.createElement('input');
    input_mobile.type = 'text';
    input_mobile.value = json.mobile;
    td.appendChild(input_mobile);
    tr.appendChild(td);

    td = document.createElement('td');
    const input_email = document.createElement('input');
    input_email.type = 'text';
    input_email.value = json.email;
    td.appendChild(input_email);
    tr.appendChild(td);

    //Delete
    td = document.createElement('td');
    const delete_link = document.createElement('a');
    delete_link.href = "#";
    const i_delete = document.createElement('i');
    i_delete.classList.add("fa");
    i_delete.classList.add("fa-trash-alt");
    delete_link.appendChild(i_delete);
    td.appendChild(delete_link);
    delete_link.onclick = function () {
        ajax_member('DELETE', 'http://localhost:3000/member/' + json._id, {}, (json) => {
            ajax_member('GET', 'http://localhost:3000/mc/', {}, (json2) => {
                const code = json2.find((value, index, obj) => value.idmember == json._id);
                if (code !== undefined) {
                    ajax_member('DELETE', 'http://localhost:3000/mc/' + code._id, {}, (json3) => { });
                }
                window.location = 'data.html';
            });
            //Suppression des données de pointage
            ajax_member('GET', 'http://localhost:3000/pointage/', {}, (json2) => {
                const code = json2.find((value, index, obj) => value.idmember == json._id);
                if (code !== undefined) {
                    ajax_member('DELETE', 'http://localhost:3000/pointage/' + code._id, {}, (json3) => { });
                }
                window.location = 'data.html';
            });
        });
    }

    //Update
    const update_link = document.createElement('a');
    update_link.href = "#";
    const i_update = document.createElement('i');
    i_update.classList.add("fa");
    i_update.classList.add("fa-sync");
    update_link.appendChild(i_update);
    td.appendChild(update_link);
    update_link.onclick = function () {
        const data = {
            nom: input_nom.value,
            prenom: input_prenom.value,
            status: select_status.value,
            mobile: input_mobile.value,
            email: input_email.value
        }
        ajax_member('PUT', 'http://localhost:3000/member/' + json._id, data, (json) => { window.location = 'data.html' });
    }
    tr.appendChild(td);
}

function insert_member() {
    const data = {
        nom: document.querySelector('#member-nom').value,
        prenom: document.querySelector('#member-prenom').value,
        status: document.querySelector('#member-status').value,
        mobile: document.querySelector('#member-mobile').value,
        email: document.querySelector('#member-email').value,
    }
    ajax_member('POST', 'http://localhost:3000/member', data, (json) => {
        ajax_member('GET', 'http://localhost:3000/member', {}, (json2) => {
            const date = new Date();
            const code = date.getHours() + "" + json2.length + "" + date.getMinutes();
            const mc = {
                'idmember': json._id,
                'code': code
            };
            ajax_member('POST', 'http://localhost:3000/mc', mc, (json3) => {
                console.log(mc);
                document.querySelector('#code-continue').innerHTML = json3.code;
            });
        });
    });
}

function ajax_member(method, url, data, callback) {
    const xhttp = new XMLHttpRequest();;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            if (callback != null) {
                callback(JSON.parse(this.responseText));
            }
        }
    }
    xhttp.open(method, url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}

function show_search_input() {
    console.log('show');
    document.querySelector('.search-member').classList.toggle('show-search');
}

/**
 * pointage
 */

let _pointage = [];

loadTable();

function loadTable() {
    ajax_member('GET', 'http://localhost:3000/pointage', {}, (all_pointage_array) => {
        for (let i = 0; i < all_pointage_array.length; i++) {
            const obj = { pointage: all_pointage_array[i] };
            ajax_member('GET', 'http://localhost:3000/member/' + all_pointage_array[i].idmember, {}, (member) => {
                obj.member = member;
                _pointage.push(obj);
                load_table(obj, 'aaaaaaaaaaaaaaaaaaaaa');
            });
        }
    });
}

function load_table(pointage, mark) {
    const tbody = document.querySelector('.pointage-tbody');

    const tr = document.createElement('tr');

    let td = document.createElement('td');
    let fullname = (pointage.member.nom + " " + pointage.member.prenom);
    let found = fullname.substr(fullname.search(new RegExp(mark, 'i')), mark.length);
    fullname = fullname.replace(new RegExp(mark, 'i'), '<mark>' + found + '</mark>');
    td.innerHTML = fullname;
    tr.appendChild(td);

    td = document.createElement('td');
    let status = pointage.member.status;
    found = status.substr(status.search(new RegExp(mark, 'i')), mark.length);
    status = status.replace(new RegExp(mark, 'i'), '<mark>' + found + '</mark>');
    td.innerHTML = status;
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = pointage.member.mobile;
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = pointage.member.email;
    tr.appendChild(td);

    td = document.createElement('td');
    const date_arrive = new Date(pointage.pointage.arrivee);
    //const date_depart = Date.parse(pointage.pointage.depart);
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septempbre', 'Octobre', 'Novembre', 'Décembre'];
    td.innerHTML = days[date_arrive.getDay()-1] + ", " + date_arrive.getDate() + " " + months[date_arrive.getMonth()]
        + " " + date_arrive.getFullYear();
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = date_arrive.getHours() + ":" + date_arrive.getMinutes();
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = 'Aucun';
    tr.appendChild(td);

    tbody.appendChild(tr);
}

function search_pointage_info(with_date) {
    const request = document.querySelector('.search-pointage').value;
    const date_value = document.querySelector('.date').value;
    const date = new Date(date_value);
    console.log(date);

    const tbody = document.querySelector('.pointage-tbody');
    //Effacer le contenu du tableau
    const allchild = tbody.querySelectorAll('.pointage-tbody *');
    for (let i = 0; i < allchild.length; i++) {
        allchild[i].remove();
    }
    //Récupérer les ligne qui contienent la recherche
    let array = _pointage.filter((value, index, array) => {
        const fullname = array[index].member.nom + " " + array[index].member.prenom;
        const status = array[index].member.status;
        const arrive = new Date(array[index].pointage.arrivee);
        return (fullname.match(new RegExp(request, 'i')) != null ||
            status.match(new RegExp(request, 'i')) != null) &&
            (with_date ? date.getDate() == arrive.getDate() && date.getMonth() == arrive.getMonth()
                && date.getFullYear() == arrive.getFullYear() : true);
    });

    //Les afficher dans le tableau
    for (let i = 0; i < array.length; i++) {
        load_table(array[i], request);
    }
}