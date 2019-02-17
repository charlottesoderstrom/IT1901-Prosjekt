"use strict";function acceptRequest(e){fetch("/api/user/"+e+"/role/request/accept",{method:"PUT"}).then(function(e){200==e.status?M.toast({html:"Acceptance success."}):M.toast({html:"Acceptance failed."})}),removeRequest(e)}function refuseRequest(e){fetch("/api/user/"+e+"/role/request/refuse",{method:"PUT"}).then(function(e){200==e.status?M.toast({html:"Refusal success."}):M.toast({html:"Refusal failed."})}),removeRequest(e)}function removeRequest(e){var t=document.getElementById("request-user-"+e);t.parentElement.removeChild(t)}var roleSelection=document.createElement("select"),roleDiv=document.createElement("div");roleDiv.className="input-field col s12",roleDiv.appendChild(roleSelection);var roles=["user","author","editor","admin"];roles.forEach(function(e){var t=document.createElement("option");t.value=e,t.innerText=e,roleSelection.appendChild(t)});var table=document.getElementById("usertable"),newRoles=[];function search(e){e&&e.preventDefault();var t="/api/user/search?search="+document.getElementById("search-field").value;return fetch(t).then(function(e){return e.json()}).then(function(e){for(;1<table.childNodes.length;)table.removeChild(table.lastChild);e.users.forEach(function(t){var e=document.createElement("tr"),n=document.createElement("td");n.innerText=t.firstname+" "+t.lastname;var l=document.createElement("td");l.innerText=t.email;var r=document.createElement("td");r.innerText=t.role;var a=document.createElement("td");a.appendChild(roleDiv.cloneNode(!0)),a.firstChild.firstChild.childNodes.forEach(function(e){e.getAttribute("value")===t.role&&e.setAttribute("selected",!0)}),e.appendChild(l),e.appendChild(n),e.appendChild(r),e.appendChild(a),table.appendChild(e),newRoles.push({id:t._id,roleSelect:a.firstChild.firstChild})});var t=document.querySelectorAll("select");M.FormSelect.init(t,{})}),!1}function sendNewValues(){var t=[];newRoles.forEach(function(e){t.push({id:e.id,role:e.roleSelect.value})});fetch("/api/user/roles",{method:"PUT",body:JSON.stringify({roles:t}),headers:{Accept:"application/json, text/plain, /","Content-Type":"application/json"}}).then(function(e){200==e.status?(M.toast({html:"Update success."}),search()):M.toast({html:"Update failed."})})}