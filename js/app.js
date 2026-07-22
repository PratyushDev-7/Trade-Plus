let transactions = [];

function loadCSV() {

const file =
document.getElementById("csvFile").files[0];

if(!file){
alert("Upload CSV");
return;
}

const reader = new FileReader();

reader.onload = function(e){

const rows =
e.target.result.split("\n");

transactions = [];

rows.slice(1).forEach(row=>{

const cols = row.split(",");

if(cols.length >= 3){

transactions.push({
date: cols[0],
merchant: cols[1],
amount: parseFloat(cols[2])
});

}

});

analyze();

};

reader.readAsText(file);
}

function analyze(){

let total = 0;

const categories = {
Food:0,
Shopping:0,
Travel:0,
Other:0
};

transactions.forEach(tx=>{

total += tx.amount;

const merchant =
tx.merchant.toLowerCase();

if(
merchant.includes("zomato") ||
merchant.includes("swiggy")
){
categories.Food += tx.amount;
}
else if(
merchant.includes("amazon") ||
merchant.includes("flipkart")
){
categories.Shopping += tx.amount;
}
else if(
merchant.includes("uber") ||
merchant.includes("ola")
){
categories.Travel += tx.amount;
}
else{
categories.Other += tx.amount;
}

});

document.getElementById("totalSpend")
.innerHTML = "₹" + total.toFixed(0);

const savings = total * 0.20;

document.getElementById("savings")
.innerHTML = "₹" + savings.toFixed(0);

const sip = savings * 0.50;

document.getElementById("sip")
.innerHTML = "₹" + sip.toFixed(0);

const score =
calculateCreditScore(total);

document.getElementById("credit")
.innerHTML = score;

drawChart(categories);

generateInsights(categories,total);
}

function calculateCreditScore(total){

if(total < 10000) return 820;
if(total < 30000) return 790;
if(total < 50000) return 760;
return 720;
}

let chart;

function drawChart(data){

const ctx =
document.getElementById("expenseChart");

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{

type:"doughnut",

data:{
labels:Object.keys(data),

datasets:[{
data:Object.values(data)
}]
}

});

}

function generateInsights(categories,total){

const list =
document.getElementById("insightList");

list.innerHTML = "";

const insights = [];

const highest =
Object.entries(categories)
.sort((a,b)=>b[1]-a[1])[0];

insights.push(
`Highest spending category: ${highest[0]}`
);

if(categories.Shopping > total*0.30){

insights.push(
"Shopping expenses are unusually high."
);

}

if(categories.Food < total*0.15){

insights.push(
"Food spending appears well controlled."
);

}

insights.push(
`Suggested monthly SIP: ₹${(total*0.10).toFixed(0)}`
);

insights.forEach(item=>{

const li =
document.createElement("li");

li.innerText = item;

list.appendChild(li);

});

}
