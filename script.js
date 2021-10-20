var addbtn=document.querySelector(".add-btn");
var removebtn=document.querySelector(".remove-btn");
let toggleAdd=false;
var toggleClose=false;
var modal=document.querySelector(".modal-cont");
var main_cont=document.querySelector(".main-cont");
var textbox=document.querySelector(".text-box");
var priority_colors=document.querySelectorAll(".priority-color")
var modalPriorityColor="black";
var toolbox_colors=document.querySelectorAll(".color");


var allColors=[];
console.log("earlier : "+ typeof(allColors));
var allTickets=[];
console.log(toolbox_colors);


console.log("localstorage ke items hai");
console.log(localStorage.getItem("jira-items"));
if(localStorage.getItem("jira-items")){
    allColors=JSON.parse(localStorage.getItem("jira-items"));
    allColors.forEach(color=>{
        createTicket(color.ticketColor,color.ticketContent,color.ticketId);
    })
}
// on left click show filtered items
toolbox_colors.forEach(colorElement=>{
    
    var color=colorElement.classList[0];
    //console.log("color is : "+ color);
    colorElement.addEventListener("click",()=>{
      var filteredColors=allColors.filter(ticketObj=>{
          return ticketObj.ticketColor==color;
      });
      for(var i=0;i<allTickets.length;i++){
          allTickets[i].remove();
        }
      
   //   removeChilds(main_cont);
      
      console.log("filtered colors length : "+ filteredColors.length);
      for(var i=0;i<filteredColors.length;i++){
          createTicket(filteredColors[i].ticketColor,filteredColors[i].ticketContent,filteredColors[i].ticketId);
      }
    })
})
// on right click show all elements
toolbox_colors.forEach(colorElement=>{
    colorElement.addEventListener("contextmenu",()=>{
        console.log("double click called");
        for(var i=0;i<allTickets.length;i++){
            allTickets[i].remove();
          }

          for(var i=0;i<allColors.length;i++){
            createTicket(allColors[i].ticketColor,allColors[i].ticketContent,allColors[i].ticketId);
          }
    })
})

var colors=["lightpink","lightblue","lightgreen","black"];
// console.log("priority_colors is : "+priority_colors);
// console.log(typeof(priority_colors));
// console.log(priority_colors);

removebtn.addEventListener("click",()=>{
    toggleClose=!toggleClose;
    // if(toggleClose){
    //   toggleClose.style.backgroundColor="rgb(48,54,60)";
    // }else{
    //     toggleClose.style.backgroundColor="rgb(3d,3d,3d)";
    // }
})

var lock="fa-lock";
var unlock="fa-lock-open";
// adding borders pn color block while clicking on them
priority_colors.forEach(element => {
    element.addEventListener("click",()=>{
        priority_colors.forEach(color=>{
            color.classList.remove("border");
        })
        modalPriorityColor=element.classList[0];
        console.log("modalpriporityColor : "+modalPriorityColor);
        element.classList.add("border");
    })
    
});
 // showing a modal on clicking add button
addbtn.addEventListener("click",(e)=>{
    console.log("clicked");
    if(toggleAdd){
modal.style.display="flex";
    }else{
        modal.style.display="none";
    }
    toggleAdd=!toggleAdd;
    // if(toggleAdd){
    //     toggleAdd.style.backgroundColor="#485460";
    //   }else{
    //       toggleAdd.style.backgroundColor="#3d3d3d";
    //   }
});
// closing a modal on pressing shift button
modal.addEventListener("keydown",(e)=>{
    console.log("modal click listener called");
    console.log(e.key);
    if(e.key=="Shift"){
        console.log("shift hai")
        createTicket(modalPriorityColor,textbox.value);
        toggleAdd=false;
        setModalToDefault();
        
    }
})
// function to create a ticket 
function createTicket(ticketColor,ticketContent,id){
    console.log("id is : "+ id);
    var ticketId=id || shortid();
    console.log(allTickets);
    console.log(allColors);
  //  console.log("ticketColor : "+ticketColor);
  //  console.log("ticketId : "+ticketId);
    // console.log("ticketContent : "+ticketContent);
    // console.log("create ticket gets called");
    var ticket=document.createElement('div');
    ticket.setAttribute("class","ticket-cont");
    ticket.innerHTML=`
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${ticketId}</div>
    <div class="task-content">${ticketContent}</div>
    <div class="ticket-lock">
    <i class="fa fa-lock" aria-hidden="true"></i>
    </div>
    `;
    main_cont.appendChild(ticket);
   // console.log(main_cont);
   // when this function is called via toolbox color click, just to prevent already existing colors to get added into this
   if(id==undefined){
       console.log("all colors set hua");
    allColors.push({ticketColor,ticketContent,ticketId});
    console.log(allColors[0]);
    console.log(allColors.length);
    localStorage.setItem("jira-items",JSON.stringify(allColors));
    console.log("if mein aye array set local storage set");
    console.log(allColors);
   }
    
    allTickets.push(ticket);
    // adding listener to each ticket so that when close button is activated and if we click on any ticket it gets deleted
    addingListener(ticket,ticketId);
    // functionality to handle lock unlock situation
    handleTicketLock(ticket,ticketId);
    // functionality to get shifted to next prioritsed color from the given array
    handleTicketColor(ticket,ticketId);
}

function getTicketIdx(id){
    console.log("within getTicketIdx fn ");
    console.log("id is : "+ id);
    console.log("allcolors length : "+allColors.length);
    for(var i=0;i<allColors.length;i++){
        console.log(allColors[i].ticketId);
        console.log(allColors[i].ticketId.localeCompare(id)==0);
        if(allColors[i].ticketId.localeCompare(id)==0){
            console.log("if mein ghusgye");
            return i;
        }
    }
    return -1;
}

function addingListener(ticket,ticketId){
    ticket.addEventListener("click",()=>{
        if(toggleClose){
            ticket.remove();
            var index=getTicketIdx(ticketId);
    allColors.splice(index,1);
    localStorage.setItem("jira-items",JSON.stringify(allColors));
        }
        
    })

    
}
function handleTicketLock(ticket,ticketId){
  //  console.log("handleTicketLock mein hai");
    var ticketLockElement=ticket.querySelector(".ticket-lock");
    var ticketLock=ticketLockElement.children[0];
    var ticketText=ticket.querySelector(".task-content");
    ticketLock.addEventListener("click",()=>{
        if(ticketLock.classList.contains(lock)){
            console.log("lock hai")
            console.log(ticketLock.classList)
            ticketLock.classList.remove(lock);
            ticketLock.classList.add(unlock);
            console.log(ticketLock);
            ticketText.setAttribute("contenteditable","true");
        }else{
            ticketLock.classList.add(lock);
            ticketLock.classList.remove(unlock);
            ticketText.setAttribute("contenteditable","false");
            var index=getTicketIdx(ticketId);
    console.log(ticketId);
    console.log(allColors);
    console.log("while changing ticket content index is  : "+index);
    allColors[index].ticketContent=ticketText.innerText;
    console.log("ticket text ka inner text : "+ ticketText.innerText);
    localStorage.setItem("jira-items",JSON.stringify(allColors));
        }
        console.log("within handle ticket lock");
    })
    
    
}
function handleTicketColor(ticket,ticketId){
    var ticketColor=ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",()=>{
        var currentColor=ticketColor.classList[1];
        var currentColorIdx=colors.findIndex(color=>{
            return color==currentColor;
        })
        var nextcolorIdx=(currentColorIdx+1)%colors.length;
        var nextColor=colors[nextcolorIdx];
        ticketColor.classList.remove(currentColor);
        ticketColor.classList.add(nextColor);
        console.log("within handle ticket color");
        var index=getTicketIdx(ticketId);
        console.log("index is : "+ index);
    allColors[index].ticketColor=nextColor;
    localStorage.setItem("jira-items",JSON.stringify(allColors));
    });
    
}

function setModalToDefault(){
    modalPriorityColor=colors[colors.length-1];
    textbox.value="";
    modal.style.display="none";
    priority_colors.forEach(color=>{
        if(color.classList.contains("border")){
            color.classList.remove("border");
        }
        if(color.classList.contains("black")){
            color.classList.add("border");
        }
    })

    
}
