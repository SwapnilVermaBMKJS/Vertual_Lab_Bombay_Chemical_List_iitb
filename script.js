const checkBoxMain = document.getElementById('checkboxMain');
const id = document.getElementById('id');
const name = document.getElementById('name');
const vendor = document.getElementById('vendor');
const density = document.getElementById('density');
const viscosity = document.getElementById('viscosity');
const packaging = document.getElementById('packaging');
const size = document.getElementById('size');
const unit = document.getElementById('unit');
const qty = document.getElementById('qty');
const del = document.getElementById('delete');
const reload = document.getElementById('reload');
const saveBtn = document.getElementById('save');
const upBtn = document.getElementById('up');
const downBtn = document.getElementById('down');
const addBtn = document.getElementById('add');
const editBtn = document.getElementById('edit')

const nameSection = document.getElementById('addName');
const vendorSection = document.getElementById('addVendor');
const densitySection = document.getElementById('addDensity');
const viscositySection = document.getElementById('addViscosity');
const packagingSection = document.getElementById('addPackaging');
const packSizeSection = document.getElementById('addPackSize');
const unitSection = document.getElementById('addUnit');
const qtySection = document.getElementById('addQty');
const submitBtn = document.getElementById('submit')

let dataOutput = document.querySelector("#data-output");

const addContainer = document.getElementById('add-container')

let data;

let sortedFlag = false;
let submitFlag = false;
let flgcheckBox = true;

let selectedArray = [];

function loadData() {
    if (localStorage.getItem('myChemicalData') == null) {
        fetch("list.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (products) {
                data = products
                let myData = JSON.stringify(products)
                localStorage.setItem('myChemicalData', myData)
                insertData(products)
            });
    } else {
        let currData = localStorage.getItem('myChemicalData');
        let currObjData = JSON.parse(currData);
        data = currObjData
        insertData(data)
    }
}
loadData()


checkBoxMain.addEventListener('change', function () {
    if (this.checked) {
        data.map((e) => { selectedArray.push(+e.id); })
        flgcheckBox = false;
    } else {
        selectedArray = [];
    }
});



function insertData(data) {
    let i = 1;
    data.map((e) => {
        let tr = document.createElement('tr');
        tr.setAttribute('class', 'lists')
        let td0 = document.createElement('td');
        let inp = document.createElement('input')
        inp.type = 'checkbox'
        inp.name = 'checkBox'
        inp.id = e.id
        inp.setAttribute('class', 'boxes')
        inp.addEventListener('change', function () {
            if (flgcheckBox) {
                if (this.checked) {
                    selectedArray.push(+this.id);
                    this.parentNode.parentNode.classList.add('checked-row');
                } else {
                    let newArr = selectedArray.filter((e) => e != this.id)
                    selectedArray = newArr
                    this.parentNode.parentNode.classList.remove('checked-row');
                }
            }
        })
        td0.appendChild(inp)
        let td1 = document.createElement('td');
        td1.innerHTML = i++;
        let td2 = document.createElement('td');
        td2.innerText = e.chemicalName;
        let td3 = document.createElement('td');
        td3.innerText = e.vendor;
        let td4 = document.createElement('td');
        td4.innerText = e.density
        let td5 = document.createElement('td');
        td5.innerText = e.viscosity;
        let td6 = document.createElement('td');
        td6.innerText = e.packaging;
        let td7 = document.createElement('td');
        td7.innerText = e.packSize
        let td8 = document.createElement('td');
        td8.innerText = e.unit;
        let td9 = document.createElement('td');
        td9.innerText = e.quantity;
        tr.append(td0, td1, td2, td3, td4, td5, td6, td7, td8, td9)
        dataOutput.append(tr)
    })
}

// deleting a row

function deleteItem() {
    if (selectedArray.length == 0) {
        alert("Please select any chemical");
    }
    if (selectedArray.length != 0) {
        let newData = data.filter((e) => selectedArray.includes(e.id) == false);
        data = newData;
        console.log(newData);
        clearList();
        insertData(data)
    }
}

del.addEventListener('click', () => {
    deleteItem()
})



// saving current data

function saveItems() {
    localStorage.removeItem('myChemicalData')
    localStorage.setItem('myChemicalData', JSON.stringify(data));
    alert("Saved")
}

saveBtn.addEventListener('click', () => {
    saveItems();
})


// moving up down

// Add event listener for the up button
upBtn.addEventListener('click', function () {
    moveRow(-1);
});

// Add event listener for the down button
downBtn.addEventListener('click', function () {
    moveRow(1);
});

// Move the selected row up or down
function moveRow(offset) {
    if (selectedArray.length == 0) {
        alert('Select any Row')
        return
    }
    if (selectedArray.length != 1) {
        alert('Only one Row is allowed for this function')
        return
    }

    // Get the selected row
    let selectedId = selectedArray[0];
    console.log(selectedId);
    let indexOfSelectedId;
    data.forEach((element, i) => {
        if(element.id == selectedId) {
            indexOfSelectedId = i;
        }
    });

    let newIndexOfSelectedId;
    if(offset < 0) {
        // move up
        if(indexOfSelectedId == 0) {
            alert("Cannot move this row up")
            return;
        }
        newIndexOfSelectedId = indexOfSelectedId-1;
        let temp = data[newIndexOfSelectedId];
        data[newIndexOfSelectedId] = data[indexOfSelectedId];
        data[indexOfSelectedId] = temp;
    }
    else {
        // move down
        if(indexOfSelectedId == data.length - 1) {
            alert("Cannot move this row down");
            return;
        }
        newIndexOfSelectedId = indexOfSelectedId+1;
        let temp = data[newIndexOfSelectedId];
        data[newIndexOfSelectedId] = data[indexOfSelectedId];
        data[indexOfSelectedId] = temp;
    }
    clearList();
    insertData(data);

      // mark checkbox the present selected index 
      selectedId = data[newIndexOfSelectedId].id;
      checkbox = document.querySelector(`input[id="${selectedId}"]`);
      console.log(checkbox);
      checkbox.checked = true;
}




// add button


addBtn.addEventListener('click', () => {
    submitFlag = !submitFlag;
    if (!submitFlag) {
        addContainer.style.display = 'none'
        return;
    }
    addContainer.style.display = 'flex'
})


function getNewData(data) {
    let currSize = data.length;
    let newObj = {
        id: currSize + 1,
        chemicalName: nameSection.value,
        vendor: vendorSection.value,
        density: +densitySection.value,
        viscosity: +viscositySection.value,
        packaging: packagingSection.value,
        packSize: +packSizeSection.value,
        unit: unitSection.value,
        quantity: +qtySection.value
    }
    console.log(newObj);
    data = [...data, newObj];
    console.log(data);
    return data

}

submitBtn.addEventListener('click', () => {
    if (!nameSection.value || !vendorSection.value || !densitySection.value || !viscositySection.value || !packagingSection.value || !packSizeSection.value || !unitSection.value || !qtySection.value) {
        alert('Please fill all the fields')
        return
    }
    data = getNewData(data);
    clearList();
    console.log('data after clear ', data);
    insertData(data)
    nameSection.value = "";
    vendorSection.value = "";
    densitySection.value = "";
    viscositySection.value = "";
    packagingSection.value = "";
    packSizeSection.value = "";
    unitSection.value = "";
    qtySection.value = "";
    addContainer.style.display = 'none'
})





//edit button

editBtn.addEventListener('click', () => {
    if (selectedArray.length != 1) {
        alert('Select only 1 element')
        return
    }
    let myArr = data.filter((e) => e.id == selectedArray[0])
    let selectedChemical = myArr[0];
    console.log(selectedChemical);
    let updatedArray = data.filter((e) => e.id !== selectedArray[0])
    data = updatedArray
    addContainer.style.display = 'flex'
    nameSection.value = selectedChemical.chemicalName;
    vendorSection.value = selectedChemical.vendor;
    densitySection.value = selectedChemical.density;
    viscositySection.value = selectedChemical.viscosity;
    packagingSection.value = selectedChemical.packaging;
    packSizeSection.value = selectedChemical.packSize;
    unitSection.value = selectedChemical.unit;
    qtySection.value = selectedChemical.quantity;
    getNewData(data);
    selectedArray = []
})


// to clear the list

function clearList() {
    let l = document.getElementsByClassName('lists')
    let myArr = Array.from(l);
    Object.keys(myArr).map((key) => myArr[key].remove())
}

let indexOfArrow=0;

function sort(target,targetElm,text) {
    if (sortedFlag) {
        sortedFlag = !sortedFlag
        data.sort((a, b) => {
            if (a[target] > b[target])
                return 1;
            else if (a[target] < b[target])
                return -1;
            else return 0;
        })
        targetElm.innerHTML = text+" ↓";
    } else {
        //for Decreasing Order
        sortedFlag = !sortedFlag
        data.sort((a, b) => {
            if (a[target] > b[target])
                return -1;
            else if (a[target] < b[target])
                return 1;
            else return 0;
        })
        targetElm.innerHTML = text+" ↑";
    }
        // Remove the ↑ or ↓ sign from other columns if present
        let thList = document.querySelectorAll("th");
        for (let i = 0; i < thList.length; i++) {
            if (thList[i] !== targetElm) {
               
                thList[i].textContent = thList[i].textContent.replace(/[\u2191\u2193]/g, "");
            }
        }
}

vendor.addEventListener('click', () => {
    sort('vendor',vendor,'Vendor');
    clearList();
    insertData(data);
})

name.addEventListener('click', () => {
    sort('chemicalName',name,'Chemical name')
    clearList()
    insertData(data)
})
density.addEventListener('click', () => {
    sort('density',density,"Density <br><span>g/m²</span>");
    clearList()
    insertData(data)
})
viscosity.addEventListener('click', () => {
    sort('viscosity',viscosity,"Viscosity <br><span>m²/s</span>")
    clearList()
    insertData(data)
})
packaging.addEventListener('click', () => {
    sort('packaging',packaging,'Packaging')
    clearList()
    insertData(data)
})
size.addEventListener('click', () => {
    sort('packSize',size,'Pack size')
    clearList()
    insertData(data)
})
unit.addEventListener('click', () => {
    sort('unit',unit,'Unit')
    clearList()
    insertData(data)
})
qty.addEventListener('click', () => {
    sort('quantity',qty,'Quantity')
    clearList()
    insertData(data)
})


//Reload Button;

reload.addEventListener('click', function () {
    location.reload();
})
