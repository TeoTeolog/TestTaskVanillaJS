const requestURL = 'http://localhost:8000';
const contentBox = document.getElementById("content_box");
const editBox = document.getElementById("edit_box");
const request = new XMLHttpRequest();
request.open('POST', requestURL);
request.responseType = 'json';
let contentData;

function myFetch(){
    // request.send();

    // console.log("[myFetch] response:", fetch(requestURL, {
    //     method: 'POST',
    //     body: 'Hello world'
    // }))
    // contentBox.innerHTML =
}

const itemDivWith = 220;
const itemFontSize = 14;

function calcMaxTextLen(div){                       //<-------------------------------------fix it
    return 2 * (itemDivWith / itemFontSize);
}

function calcTextLen(div){
    return div.clientHeight;
}

function checkAbout(){
    const about = document.getElementsByClassName("about");
    for (let i =0; i < about.length; i++){
        console.log('[checkAbout] about len:', calcTextLen(about[i]));
    }
}

function formatText(text){
    let res = '';
    let max = calcMaxTextLen(document.getElementsByClassName("table-item")[0])
    let i = 0;
    while (res.length < max - 3) {
        res += text[i];
        i++;
    }
    return res + '...';
}

function parsePerson(data, index){ //HTMLString
    let classByIndex = 'dark-back';
    if (index % 2 === 0) classByIndex = 'light-back';
    let personComponentString =
        `<div class="table-row `+classByIndex+`" id="`+data.id+`">
                <div class="table-item firstName">
                    `+data.name.firstName+`
                </div>
                <div class="table-item lastName">
                    `+data.name.lastName+`
                </div>
                <div class="table-item about">
                    `+formatText(data.about)+`
                </div>
                <div class="table-item eyeColor">
                    `+data.eyeColor+`
                </div>
            </div>`
    return personComponentString
}

function addEventListener(){
    const elementsRow = document.getElementsByClassName("table-row")
    for (let i = 1; i < elementsRow.length; i++){
        elementsRow[i].onclick = function(e){
            console.log(this.id)
            editBox.innerHTML = parseEdit(findJSONByValue(contentData, "id", this.id))
            for (let i = 1; i < elementsRow.length; i++){
                elementsRow[i].className = elementsRow[i].className.replace('selected', ' ');
            }
            this.className += ' selected';
        }
    }
}

function parseEdit(data){ //HTMLString
    console.log('[parseEdit] data', data)
    let personComponentString =
        `
            <div class="input-field">
                <span class="out-text">Имя</span>
                <input id="firstNameInput" type="text" value="`+data.name.firstName+`"/>
            </div>
            <div class="input-field">
                <span class="out-text">Фамилия</span>
                <input id="lastNameInput" type="text" value="`+data.name.lastName+`"/>
            </div>
            <div class="input-field">
                <span class="out-text">Телефон</span>
                <input id="phoneInput" type="text" value="`+data.phone+`"/>
            </div>
            <div class="input-field">
                <span class="out-text">Описание</span>
                <textarea id="aboutInput">`+data.about+`</textarea>
            </div>
            <div class="input-field">
                <span class="out-text">Цвет глаз</span>
                <input id="eyeColorInput" type="text" value="`+data.eyeColor+`"/>
            </div>
            <div class="input-field">
                    <button onclick="clickOnSave('`+data.id+`')">Сохранить</button><button onclick="clickOnCancel('`+data.id+`')">Отменить</button>
                </div>
        `
    return personComponentString
}

// const JOPA = ['name.firstName', 'name.secondName', 'phone', 'about', 'eyeColor'];

function myParse(jsonData, key, value){
    jsonData[key] = value;
}

function clickOnSave(id){
    let temp = findJSONByValue(contentData, 'id', id);
    temp.name.firstName = document.getElementById('firstNameInput').value;
    temp.name.lastName = document.getElementById('lastNameInput').value;
    temp.phone = document.getElementById('phoneInput').value;
    temp.about = document.getElementById('aboutInput').value;
    temp.eyeColor = document.getElementById('eyeColorInput').value;
    fillTable();
}

function clickOnCancel(id){
    editBox.innerHTML = parseEdit(findJSONByValue(contentData, 'id', id));
}

function findJSONByValue(jsonArray, key, value){
    for (let i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i][key] === value)
            return jsonArray[i]
    }
    return NaN
}

function fillTable(){
    contentBox.innerHTML = '';
    contentData.forEach((element,index) => contentBox.innerHTML += parsePerson(element,index))
    addEventListener();
    console.log('[fillTable] typeof contentData', typeof(contentData));
}

function sort(jsonData, keyName){
    let tempKeyNamesArr = keyName.split('.');
    if (tempKeyNamesArr.length === 1){
        console.log('[sort] first element value by keyName', jsonData[0], keyName, jsonData[0][keyName]);
        jsonData.sort((a, b) => a[keyName].localeCompare(b[keyName]));
    }
    else{
        console.log('[sort] first element value by keyNamesArr',
            jsonData[0], tempKeyNamesArr[0], tempKeyNamesArr[1],
            jsonData[0][tempKeyNamesArr[0]][tempKeyNamesArr[1]]);
        jsonData.sort((a, b) => a[tempKeyNamesArr[0]][tempKeyNamesArr[1]].localeCompare(b[tempKeyNamesArr[0]][tempKeyNamesArr[1]]));
    }
    fillTable();
}

function reSort(jsonData, keyName){
    let tempKeyNamesArr = keyName.split('.');
    if (tempKeyNamesArr.length === 1){
        console.log('[sort] first element value by keyName', jsonData[0], keyName, jsonData[0][keyName]);
        jsonData.sort((b, a) => a[keyName].localeCompare(b[keyName]));
    }
    else{
        console.log('[sort] first element value by keyNamesArr',
            jsonData[0], tempKeyNamesArr[0], tempKeyNamesArr[1],
            jsonData[0][tempKeyNamesArr[0]][tempKeyNamesArr[1]]);
        jsonData.sort((b, a) => a[tempKeyNamesArr[0]][tempKeyNamesArr[1]].localeCompare(b[tempKeyNamesArr[0]][tempKeyNamesArr[1]]));
    }
    fillTable();
}

function executeSort(element, jsonData, keyName){
    sort(jsonData,keyName);
    element.onclick = function(){
        executeReSort(element, jsonData, keyName);
    };
    element.innerHTML = `/\\`;
}

function executeReSort(element, jsonData, keyName){
    reSort(jsonData,keyName);
    element.onclick = function(){
        executeSort(element, jsonData, keyName);
    };
    element.innerHTML = `\\/`;
}

function addSort(){
    const sortButtonsId = ['sortByFirstName', 'sortByLastName', 'sortByAbout', 'sortByEyeColor'];
    for (let i = 0; i < sortButtonsId.length; i++){
        let sortButton = document.getElementById(sortButtonsId[i]);
        sortButton.onclick = function(e){
            console.log('[onclick/executeSort] this.parent: ', this.parentElement);
            console.log('[onclick/executeSort] event target: ', e.target);
            executeSort(this, contentData, this.name);
        };
    }
}

addSort();

const headTable = document.getElementsByClassName('table-head');
const headItems = headTable[0].getElementsByClassName('table-item');

function switchHideColumn(columnClassName){
    const columnItems = document.querySelectorAll('.' + columnClassName.split(' ').join('.'));
    if(columnClassName.includes('showColumn')){
        for(let i = 0; i < columnItems.length; i++){
            columnItems[i].className = columnItems[i].className.replace('showColumn','hideColumn');
        }
    }
    else{
        if(columnClassName.includes('hideColumn')){
            for(let i = 0; i < columnItems.length; i++){
                columnItems[i].className = columnItems[i].className.replace('hideColumn','showColumn');
            }
        }
        else
            for(let i = 0; i < columnItems.length; i++) {
                columnItems[i].className += ' hideColumn';
            }
    }
}

function addHide(){
    console.log('[addHide] headItems', headItems);
    for(let i = 0; i < headItems.length; i++){
        headItems[i].onclick = function (e) {
            console.log('[addHide] this', this);
            if(e.target !== this) return;
            switchHideColumn(this.className);
        }
    }
}

fetch(requestURL, {
    method: 'GET',
    headers: {
        'Content-type': "application/json",
    }
})
    .then(function (res){
        return res.json()
    })
    .then(function (data) {
        console.log('Request succeeded with JSON response', data);
        contentData = data;
        fillTable();
        addHide();
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
