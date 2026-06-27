window.addEventListener("load", () => {
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
});
/* ========================= FIREBASE ========================= */

const firebaseConfig = {
apiKey: "AIzaSyBQPREm4Wy-TJVEzmSVO207C4JS6srjcjI",
authDomain: "btech-snacks-cafe.firebaseapp.com",
projectId: "btech-snacks-cafe",
storageBucket: "btech-snacks-cafe.firebasestorage.app",
messagingSenderId: "777445142124",
appId: "1:777445142124:web:847d3958377b5529b47249"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ========================= CART ========================= */

let cart = [];

/* ========================= LOADER ========================= */

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    document.body.style.overflow = "auto";

    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);

    }, 300);

});
/* ========================= CLOCK ========================= */

function updateClock(){
let el = document.getElementById("clock");
if(!el) return;

let time = new Date().toLocaleTimeString("en-US",{
hour:"2-digit",
minute:"2-digit",
second:"2-digit",
hour12:true
}).toUpperCase();

el.innerHTML = "🕒 " + time;
}
setInterval(updateClock,1000);
updateClock();

/* ========================= CHANGING TEXT ========================= */

let texts = [
"Best Place For Students ❤️",
"Coding + Coffee = Heaven ☕",
"Late Night Study Cafe 📚",
"Fast WiFi & Tasty Food ⚡"
];

let i = 0;
setInterval(()=>{
let el = document.getElementById("changingText");
if(!el) return;

i = (i + 1) % texts.length;
el.innerHTML = texts[i];
},3000);

/* ========================= SEARCH ========================= */

let search = document.getElementById("search");

if(search){
search.addEventListener("input",(e)=>{
let filter = e.target.value.toLowerCase();

document.querySelectorAll(".card").forEach(card=>{
let title = card.querySelector("h2");
if(!title) return;

card.style.display =
title.innerText.toLowerCase().includes(filter)
? "block"
: "none";
});
});
}

/* ========================= QUANTITY + CART ========================= */

function increaseQty(button){
let input = button.parentElement.querySelector("input");
input.value = Number(input.value || 0) + 1;
updateAutoCart(button);
}

function decreaseQty(button){
let input = button.parentElement.querySelector("input");
input.value = Math.max(0, Number(input.value || 0) - 1);
updateAutoCart(button);
}

/* ========================= AUTO CART ========================= */

function updateAutoCart(button){

let card = button.closest(".card");
if(!card) return;

let item = card.querySelector("h2")?.innerText.trim();

// better price extraction
let priceText = card.querySelector("p")?.innerText.replace(/[^0-9]/g,"");
let price = Number(priceText);

let qty = Number(card.querySelector(".quantity-box input")?.value || 0);

// remove old entry
cart = cart.filter(p => p.item !== item);

// add updated
if(qty > 0){
cart.push({item, price, qty});
}

updateCart();
}

/* ========================= CART UI ========================= */


function updateCart(){

let box = document.getElementById("cartItems");
let totalBox = document.getElementById("cartTotal");
let cartCount = document.getElementById("cartCount");

if(!box || !totalBox) return;

box.innerHTML = "";

let total = 0;

/* CART COUNT UPDATE */

if(cartCount){
cartCount.innerText = cart.length;
}

/* EMPTY CART */

if(cart.length === 0){

box.innerHTML = `
<p class="empty-cart">
Cart Is Empty 😢
</p>
`;

totalBox.innerHTML = "Total: ₹0";
return;

}

/* CART ITEMS */

cart.forEach((p,i)=>{

total += p.price * p.qty;

box.innerHTML += `
<div class="cart-item">

<h3>${p.item} × ${p.qty}</h3>

<h3>₹${p.price * p.qty}</h3>

<button onclick="removeCartItem(${i})">
Remove
</button>

</div>
`;

});

/* TOTAL */

totalBox.innerHTML = "Total: ₹" + total;

}



/* ========================= REMOVE ITEM ========================= */

function removeCartItem(i){
cart.splice(i,1);
updateCart();

/* ⭐ THIS IS THE FIX ⭐ */
resetQuantityUI();

showToast("Item Removed","error");
}
/* ========================= POPUP OPEN ========================= */

function openPopup(){
document.getElementById("orderPopup").style.display="flex";

document.querySelectorAll("#orderPopup input").forEach(i=>{
i.value = 0;
});

document.getElementById("totalPrice").innerText = "Total: ₹0";
}

/* ========================= POPUP CLOSE (RESET FIX) ========================= */

function closePopup(){
let p = document.getElementById("orderPopup");
if(p) p.style.display="none";

// reset popup inputs only
document.querySelectorAll("#orderPopup input").forEach(i=>{
i.value = 0;
});

let t = document.getElementById("totalPrice");
if(t) t.innerHTML = "Total: ₹0";
}

/* ========================= POPUP TOTAL ========================= */
function updatePopupTotal(){

let tea = Number(document.getElementById("teaQty")?.value || 0) * 10;
let coffee = Number(document.getElementById("coffeeQty")?.value || 0) * 15;
let coldcoffee = Number(document.getElementById("coldcoffeeQty")?.value || 0) * 60;
let fries = Number(document.getElementById("friesQty")?.value || 0) * 40;
let vadapav = Number(document.getElementById("vadapavQty")?.value || 0) * 15;
let maggie = Number(document.getElementById("maggieQty")?.value || 0) * 35;
let samosa = Number(document.getElementById("samosaQty")?.value || 0) * 15;
let poha = Number(document.getElementById("pohaQty")?.value || 0) * 15;
let pasta = Number(document.getElementById("pastaQty")?.value || 0) * 35;
let misal = Number(document.getElementById("misalQty")?.value || 0) * 60;

let total =
tea + coffee + coldcoffee + fries + vadapav +
maggie + samosa + poha + pasta + misal;

let hour = new Date().getHours();
if(hour >= 23 || hour < 8){
total += 10;
}

document.getElementById("totalPrice").innerText = "Total: ₹" + total;
}

/* ========================= WHATSAPP ORDER ========================= */

function placeCartOrder(){

if(cart.length === 0){
showToast("Cart Is Empty","error");
return;
}

let msg = `🍽️ *BTech Snacks Cafe Order*

━━━━━━━━━━━━━━

🛒 *Order Items:*

`;

let total = 0;

cart.forEach(p=>{
msg += `${p.item} - ₹${p.price} × ${p.qty} = ₹${p.price * p.qty}\n`;
total += p.price * p.qty;
});

msg += `
━━━━━━━━━━━━━━

💰 *Total Amount: ₹${total}*

━━━━━━━━━━━━━━

🕒 *Offline Cafe Timing:*
8 AM To 11 PM

🌐 *Online Orders:*
24×7 Available

🙏 Please confirm my order`;

let phone = "918767027966";

window.open(
`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
"_blank"
);

cart = [];
updateCart();

document.querySelectorAll(".quantity-box input").forEach(i=>{
i.value = 0;
});

showToast("Order Sent ❤️");
}
/* ========================= TOAST ========================= */

function showToast(msg,type="success"){

let t = document.getElementById("toast");
if(!t) return;

t.innerHTML = msg;
t.className = "show";

if(type==="error") t.classList.add("toast-error");
else t.classList.add("toast-success");

setTimeout(()=>{
t.classList.remove("show");
},3000);
}

/* ========================= SCROLL REVEAL ========================= */

window.addEventListener("scroll",()=>{
document.querySelectorAll(".reveal").forEach(el=>{
if(el.getBoundingClientRect().top < window.innerHeight - 100){
el.classList.add("active");
}
});
});

/* ========================= TOP BUTTON ========================= */

let topBtn = document.querySelector(".top-btn");

if(topBtn){
window.addEventListener("scroll",()=>{
topBtn.classList.toggle("show", window.scrollY > 300);
});

topBtn.addEventListener("click",()=>{
window.scrollTo({top:0,behavior:"smooth"});
});
}

/* ========================= DARK MODE ========================= */

let modeBtn = document.getElementById("modeBtn");

if(modeBtn){
modeBtn.addEventListener("click",()=>{
document.body.classList.toggle("light-mode");
});
}

/* ========================= FEEDBACK ========================= */

function sendFeedback(){

let name = document.getElementById("name")?.value;
let message = document.getElementById("message")?.value;
let rating = document.getElementById("rating")?.value;

if(!name || !message){
showToast("Fill All Fields","error");
return;
}

db.collection("reviews").add({
name,
message,
stars:"⭐".repeat(rating),
time:Date.now()
});

showToast("Feedback Sent ❤️");

document.getElementById("name").value = "";
document.getElementById("message").value = "";
document.getElementById("rating").value = "5";
}


/* ========================= LOAD REVIEWS ========================= */

let allReviews = [];
let showingAllReviews = false;

function loadReviews(){

let box = document.getElementById("reviewContainer");
if(!box) return;

db.collection("reviews")
.orderBy("time","desc")
.onSnapshot(snapshot=>{

allReviews = [];

snapshot.forEach(doc=>{
allReviews.push(doc.data());
});

renderReviews();

});

}

/* ========================= RENDER REVIEWS ========================= */

function renderReviews(){

let box = document.getElementById("reviewContainer");
if(!box) return;

box.innerHTML = "";

let reviewsToShow = showingAllReviews
? allReviews
: allReviews.slice(0,4);

reviewsToShow.forEach(r=>{

box.innerHTML += `
<div class="review-card">
<h2>${r.name}</h2>
<p>${r.message}</p>
<h3>${r.stars}</h3>
</div>
`;

});

/* VIEW MORE BUTTON */

if(!showingAllReviews && allReviews.length > 4){

box.innerHTML += `
<button id="viewMoreBtn"
onclick="showMoreReviews()">
View More Reviews
</button>
`;

}

}

/* ========================= SHOW MORE ========================= */

function showMoreReviews(){

showingAllReviews = true;
renderReviews();

}


loadReviews();
function changeQty(id,change){

let input = document.getElementById(id);
if(!input) return;

input.value = Math.max(0, Number(input.value || 0) + change);

updatePopupTotal();
}
function sendWhatsAppOrder() {

const items = [
{ name:"Tea", id:"teaQty", price:10 },
{ name:"Coffee", id:"coffeeQty", price:15 },
{ name:"Cold Coffee", id:"coldcoffeeQty", price:60 },
{ name:"Fries", id:"friesQty", price:40 },
{ name:"Vadapav", id:"vadapavQty", price:15 },
{ name:"Maggie", id:"maggieQty", price:35 },
{ name:"Samosa", id:"samosaQty", price:15 },
{ name:"Poha", id:"pohaQty", price:15 },
{ name:"Pasta", id:"pastaQty", price:35 },
{ name:"Misal", id:"misalQty", price:60 }
];

let total = 0;
let itemsText = "";
let hasItems = false;

items.forEach(item=>{

let qty = Number(document.getElementById(item.id)?.value || 0);

if(qty > 0){

hasItems = true;

let itemTotal = qty * item.price;

total += itemTotal;

itemsText += `${item.name} - ₹${item.price} × ${qty} = ₹${itemTotal}\n\n`;

}

});

if(!hasItems){

showToast("Please Select Items","error");

return;

}

let hour = new Date().getHours();

if(hour >= 23 || hour < 8){
total += 10;
}

let message = `☕ BTech Snacks Cafe Order

━━━━━━━━━━━━━━

🛒 Order Items:

${itemsText}

━━━━━━━━━━━━━━

💰 Total Amount: ₹${total}

━━━━━━━━━━━━━━

🕒 Offline Cafe Timing:
8 AM To 11 PM

🌐 Online Orders:
24×7 Available

✅ Please confirm my order`;

let phone = "918767027966";

let url =
"https://wa.me/" +
phone +
"?text=" +
encodeURIComponent(message);

window.open(url,"_blank");

showToast("Order Sent ❤️");

closePopup();

}
function openCartPanel(){
document.getElementById("cartPanel").classList.add("open");
document.querySelector(".cart-overlay")?.classList.add("show");
}

function closeCartPanel(){
document.getElementById("cartPanel").classList.remove("open");
document.querySelector(".cart-overlay")?.classList.remove("show");
}
function updateCartFromUI(button){

let card = button.closest(".card");
if(!card) return;

let name = card.querySelector("h2")?.innerText;
let price = parseInt(card.querySelector("p")?.innerText.match(/\d+/));
let qty = parseInt(card.querySelector("input")?.value || 0);

// remove old item
cart = cart.filter(p => p.item !== name);

// add new if qty > 0
if(qty > 0){
cart.push({
item: name,
price: price,
qty: qty
});
}

updateCart();
resetQuantityUI();
}
loadReviews();

window.dispatchEvent(new Event("scroll"));
setTimeout(()=>{
let loader = document.querySelector(".loader");
if(loader){
loader.style.display="none";
}
},4000);
function resetQuantityUI(){

document.querySelectorAll(".card").forEach(card=>{

let itemName = card.querySelector("h2")?.innerText;

let cartItem = cart.find(p => p.item === itemName);

let input = card.querySelector(".quantity-box input");

if(input){

input.value = cartItem ? cartItem.qty : 0;

}

});

}