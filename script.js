let mynotepad=[];
let notes=document.getElementById("notes");
let addbtn=document.getElementById("addbtn");
let deleteAllBtn=document.getElementById("deleteAll");
deleteAllBtn.addEventListener("mousedown", deleteAll);
addbtn.addEventListener("mousedown", overlayOn);
addbtn.index=-1;
init();

function init()                     //recalls previous notes from localstorage and adds them to mynotepad, then calls display
{
    for(let i =0; i<localStorage.length; i++)
        mynotepad.push(new Note(localStorage.key(i),localStorage.getItem(localStorage.key(i))));
    display();
}
function deleteAll()                //deletes everything
{
    mynotepad=[];
    localStorage.clear();
    display();
}
function Note(title, info)          //note object
{
    this.title=title;
    this.info=info;
}
function display()                  //redraws every note object in mynotepad onto the screen, adding eventlisteners etc. also adds current notes to localstorage. 
{
    notes.innerHTML="";
    for(let i =0; i<mynotepad.length; i++)
    {
        let element=document.createElement("div");
        element.className="item";
        let title=document.createElement("div");
        title.className="title";
        title.innerHTML=mynotepad[i].title;
        element.appendChild(title);
        let body=document.createElement("div");
        body.className="body";
        body.innerHTML=mynotepad[i].info;
        element.appendChild(body);
        let del=document.createElement("div");
        del.className="delete";
        del.innerHTML="X";
        del.addEventListener("mousedown",deleteItem);
        del.index=i;
        element.appendChild(del);
        let edit=document.createElement("div");
        edit.className="edit";
        edit.innerHTML="Edit";
        edit.addEventListener("mousedown",overlayOn);
        edit.index=i;
        element.appendChild(edit);
        notes.appendChild(element);
    }
    localStorage.clear();

    for(let i =0; i<mynotepad.length; i++)
        localStorage.setItem(mynotepad[i].title, mynotepad[i].info);
}
function deleteItem(event)          //deletes one note from the page by removing it from the array and calling display
{
    mynotepad.splice(event.currentTarget.index,1);
    display();
}
function overlayOn(event)           //draws the overlay whenever the "New Note" button is pressed or "Edit" is called
{
    document.getElementById("overlay").style.display="grid";
    let n = document.getElementById("overlay");
    let title=document.createElement("input");
    title.setAttribute("type", "text");
    title.id="title";

    if(event.currentTarget.index==-1)       //if edit is called, set the title and text to the previous text instead of creating placeholders.
        title.placeholder="Title";
    else
        title.value=mynotepad[event.currentTarget.index].title;
    n.appendChild(title);
    
    let text = document.createElement("textarea");
    text.setAttribute("type","text");
    text.id="text";
    
    if(event.currentTarget.index==-1)
        text.placeholder="Contents";
    else
        text.value=mynotepad[event.currentTarget.index].info;
    n.appendChild(text);
    
    let cancel = document.createElement("div");
    cancel.id="cancelbtn";
    cancel.innerHTML="Cancel";
    n.appendChild(cancel);
    cancel.addEventListener("mousedown", overlayOff);

    let done = document.createElement("div");
    done.id="donebtn";
    done.innerHTML="Done";
    n.appendChild(done);
    done.index=event.currentTarget.index;
    done.addEventListener("mousedown", addNote);
    display();
}
function overlayOff()               //turns off the overlay whenever cancel is pressed
{
    let n = document.getElementById("overlay");
    n.innerHTML="";
    n.style.display="none";
}
function addNote(event)                  //adds the current note to the screen whenever the "Done" is pressed. if it's an edit, edit the note, if it's an entirely new note, adds it to the list
{
    let title=document.getElementById("title").value;   
    let body=document.getElementById("text").value;
    if(event.currentTarget.index==-1)
        mynotepad.push(new Note(title, body));
    else
    {
        mynotepad[event.currentTarget.index].title=title;
        mynotepad[event.currentTarget.index].info=body;
    }
    overlayOff();
    display();
}