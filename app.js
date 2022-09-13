const mode = document.querySelector('.toggleBtn')
const containerAll = document.querySelector('.contain-all');
const form = document.querySelector('.item-form')
const input = document.getElementById('text');
const submitBtn= document.querySelector('.submit-btn');
const container = document.querySelector('.item-container');
const list = document.querySelector('.todo-list');
const alert = document.querySelector('.alert')
const clearBtn = document.querySelector('.clear-btn');




//EDIT OPTION*****************
let editElement;
let editFlag = false;
let editId = ""


//EVENT LISTENER 
//dark mode toggle 
mode.addEventListener('click',moder)

//submit item
submitBtn.addEventListener('click',addItems)
//clearitem 
clearBtn.addEventListener('click',clearItems)
// load items 
window.addEventListener('DOMContentLoaded',setUpItems)




//***FUNCTIONS */
function addItems(e){
    e.preventDefault()
    const value = input.value
    const id = new Date().getTime().toString();
    if(value && !editFlag){
      createListItem(id,value)
       container.classList.add('show-container');
       displayAlert('item added to the list', 'sucess');

         //ADD TO LOCAL STORAGE
         addToLocalStorage(id, value);

//setback to default
       setBackToDefault()
    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert('value changed','sucess')
         // edit local storage 

         editLocalStorage(editId,value)


        setBackToDefault()
    }
    else{
        displayAlert('please input value','danger')
    }
}
function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)
    setTimeout(() => {
        alert.textContent = ''
        alert.classList.remove(`alert-${action}`) 
    },1000);

}

//set back to default function

function setBackToDefault(){
    input.value = "";
    editFlag =false;
     editId =''
     submitBtn.textContent= 'Submit'

}
//FUNCTION FOR DELETE ITEM 

function deleteItem(e){
  const element =  e.currentTarget.parentElement.parentElement
  list.removeChild(element)
  displayAlert('item deleted', 'danger')
  const id = element.dataset.id

  if(list.children.length === 0){
    container.classList.remove('show-container')
   
  }
  setBackToDefault();
 // REmove from local storage
 removeFromLocalStorage(id)
}
// function for  edit item 
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement ;
     //set edit item
     editElement = e.currentTarget.parentElement.previousElementSibling;

     //set form value
     input.value = editElement.innerHTML;
     editFlag = true;
     editId= element.dataset.id;
     submitBtn.textContent = 'Edit'
    
}
// fuction for clear item 
function clearItems(){
    const items = document.querySelectorAll('.todo-item');
    if(items.length > 0){
        items.forEach((item)=>{
            list.removeChild(item)
        
           });
}
container.classList.remove('show-container')
   displayAlert('All item is cleared', 'sucess')
   setBackToDefault()
   localStorage.removeItem('list')

}

//DARK MODE FUNCTION
function moder(){
containerAll.classList.toggle('darkMode')
if(containerAll.classList.contains('darkMode')){
   mode.classList.add('show-light')
}
else{
    mode.classList.remove('show-light')
}
}

//get local storage


//local storage
function addToLocalStorage(id, value){
    const input ={id,value }
    let items = getLocalStorage()
    items.push(input)
 
    localStorage.setItem('list', JSON.stringify(items))
    

 
 }
 function editLocalStorage(id, value){
     let items = getLocalStorage()
 
     items = items.map(function(item){
         if(item.id === id ){
             item.value = value
 
         }
         return item
     })
    localStorage.setItem('list', JSON.stringify(items))
 
 }
 function getLocalStorage(){
     return  localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[];
   } 
 // remove item from local storage 
 function removeFromLocalStorage(id){
  let items = getLocalStorage();
  items= items.filter(function(item){
     if(item.id !== id){
         return item
     }
  })
  localStorage.setItem('list', JSON.stringify(items))
 
 }

//  setUpItems

function setUpItems(id,value){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id,item.value)
        })
        container.classList.add('show-container')
    }
}

function createListItem(id,value){
    const element = document.createElement('article');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr)
    element.classList.add('todo-item');
  
    element.innerHTML =`
    
    <input type="checkbox" name="" id="checkbox">
    <p class="title">${value}</p>
    <div class="btn-container">

        <button type="button" class="edit-btn"><i class='bx bxs-edit'></i></button>
        <button type="button" class="delete-btn">
        <i class='bx bx-trash' ></i>
        </button>
    </div>`
    list.appendChild(element)
    
    
    //delete button
    const deleteBtn = element.querySelector('.delete-btn')
    
    deleteBtn.addEventListener('click', deleteItem)
    
    //edit button
    const editBtn = element.querySelector('.edit-btn')
    editBtn.addEventListener('click', editItem);
    
    
}