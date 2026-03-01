// Booking popup open/close
function openBookingForm(){ document.getElementById("bookingPopup").classList.add("show"); }
function closeBookingForm(){ document.getElementById("bookingPopup").classList.remove("show"); }
function openSuccessPopup(){ 
  document.getElementById("successPopup").classList.add("show"); 
  setTimeout(closeSuccessPopup, 3000);
}
function closeSuccessPopup(){ document.getElementById("successPopup").classList.remove("show"); }

// Disable past dates
const dateInput = document.getElementById("time");
dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

// +91 fixed mobile input
const mobileInput = document.getElementById("mobile");
mobileInput.addEventListener("focus", () => {
  if(mobileInput.value === "") mobileInput.value = "+91 ";
  mobileInput.setSelectionRange(mobileInput.value.length, mobileInput.value.length);
});
mobileInput.addEventListener("input", () => {
  let digits = mobileInput.value.replace(/\D/g, "");
  if(!digits.startsWith("91")) digits = "91" + digits.substring(2);
  digits = digits.substring(2,12);
  mobileInput.value = "+91 " + digits;
});

// Google Maps Director + User
let directorMap, userMap, autocomplete, userMarker;
function initMaps(){
  // Director Map
  const directorLocation = {lat:25.420678, lng:82.977197};
  directorMap = new google.maps.Map(document.getElementById("directorMap"), {zoom:16, center:directorLocation});
  new google.maps.Marker({position:directorLocation, map:directorMap, title:"Director Location"});

  // User Address Map (hidden map)
  const defaultLocation = {lat:25.42, lng:82.97};
  const mapDiv = document.createElement("div");
  mapDiv.style.height="0"; mapDiv.style.width="0";
  document.body.appendChild(mapDiv);
  userMap = new google.maps.Map(mapDiv, {zoom:14, center:defaultLocation});

  const addressInput = document.getElementById("address");
  autocomplete = new google.maps.places.Autocomplete(addressInput, {types:['geocode']});
  autocomplete.addListener('place_changed', ()=>{
    const place = autocomplete.getPlace();
    if(!place.geometry) return;
    const loc = place.geometry.location;
    if(!userMarker) userMarker = new google.maps.Marker({position:loc, map:userMap});
    else userMarker.setPosition(loc);
    userMap.setCenter(loc); userMap.setZoom(16);
    addressInput.dataset.lat = loc.lat(); addressInput.dataset.lng = loc.lng();
  });
}

// Booking form validation + WhatsApp
function confirmBooking(){
  document.querySelectorAll(".error").forEach(e=>e.innerText="");
  let name = document.getElementById("name").value.trim();
  let mobile = document.getElementById("mobile").value.replace(/\D/g,"");
  let eventType = document.getElementById("eventType").value;
  let address = document.getElementById("address").value.trim();
  let time = document.getElementById("time").value;
  let isValid=true;
  if(name.length<2){document.getElementById("nameError").innerText="Please enter valid name"; isValid=false;}
  if(mobile.length!==12){document.getElementById("mobileError").innerText="Enter valid 10 digit mobile number"; isValid=false;}
  if(eventType===""){document.getElementById("eventTypeError").innerText="Select event type"; isValid=false;}
  if(address.length<5){document.getElementById("addressError").innerText="Please enter valid address"; isValid=false;}
  if(!time){document.getElementById("dateError").innerText="Please select event date"; isValid=false;}
  if(!isValid) return;

  const lat = document.getElementById("address").dataset.lat || "";
  const lng = document.getElementById("address").dataset.lng || "";
  const message = `🎧 New DJ Booking - SK Sound
Name: ${name}
Mobile: ${mobile}
Event Type: ${eventType}
Address: ${address}
Latitude: ${lat}
Longitude: ${lng}
Event Time: ${time}`;

  const phone = "916388655605";
  const win = window.open("https://wa.me/"+phone+"?text="+encodeURIComponent(message), "_blank");
  if(win) openSuccessPopup();

  // Reset form
  document.getElementById("name").value=""; mobileInput.value="+91 ";
  document.getElementById("eventType").value="";
  document.getElementById("address").value=""; document.getElementById("address").dataset.lat=""; document.getElementById("address").dataset.lng="";
  document.getElementById("time").value=""; closeBookingForm();
}