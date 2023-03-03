const { ipcRenderer } = require("electron")
const Item = require("../testModel")
const itemForm = document.querySelector("#itemForm")
const itemName = document.querySelector("#itemName")
const itemMessage = document.querySelector("#itemMessage")
const { session } = require('electron');
const { remote } = require('electron');
const { webContents } = remote.getCurrentWebContents();

// session.defaultSession.setProxy({
//     proxyRules: 'http://localhost:8080'
//   });

// webContents.on('did-navigate-in-page', (event, url) => {
//     console.log('//////////******************///////////////', url);
//   });

// console.log('Current URL:', window.location.href);

const showModal = document.getElementById('show-modal')
      closeModal = document.getElementById('close-modal')
      modal = document.getElementById('modal')
      addItem = document.getElementById('add-item')
      itemUrl = document.getElementById('url')






const toggleModalButtons = () => {
    if (addItem.disabled === true) {
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline'

    } else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'
    }
}



showModal.addEventListener('click', e => {
    modal.style.display = 'flex'
    itemUrl.focus()
})

closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
})

addItem.addEventListener('click', e => {
    if(itemUrl.value) {
        ipcRenderer.send('new-item', itemUrl.value)
        toggleModalButtons()
    }
})

ipcRenderer.on('new-item-success', (e, newItem) => {
    console.log(newItem)
    toggleModalButtons()
    modal.style.display = 'none'
    itemUrl.value = ''

})

itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') addItem.click()
}) 

itemForm.addEventListener("submit", async (e) => {

    e.preventDefault()
    const item = {
        name: itemName.value,
        message: itemMessage.value
    }
ipcRenderer.invoke("new-item", item).then(res => {
    console.log("res:", res)
    // const response = document.createElement("div")
    // const result = document.createElement("div")
    // result.innerHTML = res
    // const display = document.getElementById("display-object")
    // result.appendChild(document.createTextNode(res))
    // display.appendChild(result)
    // const newItem = new Item
    // const itemSaved = res.save()
})
})