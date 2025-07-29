// Übersetzungen
const translations = {
  de: {
    title: 'Kubikpreis-Rechner für Holzarten',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    section1: '1. Neue Holzart speichern',
    holzartPlaceholder: 'Holzart (z.B. Eiche)',
    preisPlaceholder: 'Preis pro m³ (€)',
    addWood: 'Holzart hinzufügen',
    section2: '2. Holzart auswählen & berechnen',
    quantityPlaceholder: 'Menge in m³',
    calcSave: 'Berechnen & speichern',
    section3: 'Zwischengespeicherte Berechnungen',
    customerPlaceholder: 'Kundenname',
    exportText: 'Export als Text',
    exportPdf: 'Export als PDF',
    clearAll: 'Alles löschen',
    resetWood: 'Alle Holzarten löschen',
    alerts: {
      invalidWood: 'Bitte gültige Holzart und Preis eingeben.',
      selectWood: 'Bitte zuerst eine Holzart auswählen.',
      invalidQty:   'Bitte eine gültige Menge eingeben.',
      confirmDeleteCalc: 'Möchtest du alle gemerkten Berechnungen löschen?',
      confirmDeleteWood: prop => `"${prop.name}" wirklich löschen?`,
      confirmResetWood:  'Willst du wirklich alle Holzarten löschen?'
    },
    messages: {
      added:    wood => `➕ ${wood.name} mit ${wood.amount.toFixed(2)} m³ gespeichert (${wood.total.toFixed(2)} €)`,
      selected: wood => `Ausgewählt: ${wood.name} (${wood.price.toFixed(2)} €/m³)`
    },
    table: {
      noItems: '<em>Keine Positionen ausgewählt.</em>',
      subtotal: subtotal => `Zwischensumme: ${subtotal.toFixed(2)} €`,
      pdfTitle:   'Kubikpreis-Berechnungen',
      customerLabel: 'Kunde: ', dateLabel: 'Datum: ', signature: 'Unterschrift:'
    }
  },
  en: {
    title: 'Cubic Price Calculator for Wood Types',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    section1: '1. Save New Wood Type',
    holzartPlaceholder: 'Wood Type (e.g., Oak)',
    preisPlaceholder:    'Price per m³ (€)',
    addWood: 'Add Wood Type',
    section2: '2. Select Wood Type & Calculate',
    quantityPlaceholder: 'Quantity in m³',
    calcSave: 'Calculate & Save',
    section3: 'Stored Calculations',
    customerPlaceholder: 'Customer Name',
    exportText: 'Export as Text',
    exportPdf: 'Export as PDF',
    clearAll: 'Clear All',
    resetWood: 'Delete All Wood Types',
    alerts: {
      invalidWood:    'Please enter a valid wood type and price.',
      selectWood:     'Please select a wood type first.',
      invalidQty:     'Please enter a valid quantity.',
      confirmDeleteCalc: 'Do you want to delete all stored calculations?',
      confirmDeleteWood: prop => `Delete "${prop.name}"?`,
      confirmResetWood:  'Do you really want to delete all wood types?'
    },
    messages: {
      added:    wood => `➕ ${wood.name} with ${wood.amount.toFixed(2)} m³ saved (${wood.total.toFixed(2)} €)`,
      selected: wood => `Selected: ${wood.name} (${wood.price.toFixed(2)} €/m³)`
    },
    table: {
      noItems: '<em>No positions selected.</em>',
      subtotal: subtotal => `Subtotal: ${subtotal.toFixed(2)} €`,
      pdfTitle:   'Cubic Price Calculations',
      customerLabel: 'Customer: ', dateLabel: 'Date: ', signature: 'Signature:'
    }
  }
};

let currentLang = 'de';
let woodTypes   = JSON.parse(localStorage.getItem('holzarten')) || [];
let calculations = JSON.parse(localStorage.getItem('berechnungen')) || [];
let selectedIndex = null;

// DOM-Elemente
const langSelect    = document.getElementById('langSelect');
const holzInput     = document.getElementById('holzart');
const preisInput    = document.getElementById('preis');
const addHolzBtn    = document.getElementById('addHolzBtn');
const holzList      = document.getElementById('holzList');
const auswahlInfo   = document.getElementById('auswahlInfo');
const kubikInput    = document.getElementById('kubik');
const calcSaveBtn   = document.getElementById('calcSaveBtn');
const ausgabe       = document.getElementById('ausgabe');
const merkListe     = document.getElementById('merkListe');
const zwSum         = document.getElementById('zwischensummeAnzeigen');
const posList       = document.getElementById('positionenAuflistung');
const kundenName    = document.getElementById('kundenName');
const exportTextBtn = document.getElementById('exportTextBtn');
const exportPdfBtn  = document.getElementById('exportPdfBtn');
const clearAllBtn   = document.getElementById('clearAllBtn');
const resetHolzBtn  = document.getElementById('resetHolzBtn');
const darkToggle    = document.getElementById('darkModeToggle');
const toggleIcon    = document.getElementById('toggleIcon');
const toggleLabel   = document.getElementById('toggleLabel');

// Speicher-Helfer
const saveWood = () => localStorage.setItem('holzarten', JSON.stringify(woodTypes));
const saveCalc = () => localStorage.setItem('berechnungen', JSON.stringify(calculations));

// Initialisierung
window.addEventListener('DOMContentLoaded', () => {
  // Theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.add(savedTheme);
  document.body.classList.toggle('light', savedTheme !== 'dark');
  updateDarkToggleLabel();

  // Sprache
  currentLang = localStorage.getItem('lang')
    || (navigator.language.startsWith('en') ? 'en' : 'de');
  langSelect.value = currentLang;
  applyTranslation();

  updateList();
  updateCalcList();
  updateSubtotal();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
});

// Sprache wechseln
langSelect.addEventListener('change', () => {
  currentLang = langSelect.value;
  localStorage.setItem('lang', currentLang);
  applyTranslation();
});

function applyTranslation() {
  const t = translations[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el =>
    el.textContent = t[el.getAttribute('data-i18n')]
  );
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el =>
    el.placeholder = t[el.getAttribute('data-i18n-placeholder')]
  );
  updateDarkToggleLabel();
}

function updateDarkToggleLabel() {
  const t = translations[currentLang];
  const isDark = document.body.classList.contains('dark');
  toggleIcon.textContent  = isDark ? '🌞' : '🌙';
  toggleLabel.textContent = isDark ? t.lightMode : t.darkMode;
}

// Liste der Holzarten
function updateList() {
  holzList.innerHTML = '';
  woodTypes.forEach((w,i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = `${w.name} - ${w.preis.toFixed(2)} €/m³`;
    btn.onclick = () => selectWood(i);
    const del = document.createElement('button');
    del.textContent = '🗑️';
    del.className = 'delete-btn';
    del.onclick = () => deleteWood(i);
    li.append(btn, del);
    holzList.append(li);
  });
}

function addWoodType() {
  const name  = holzInput.value.trim();
  const price = parseFloat(preisInput.value);
  if (!name || isNaN(price)) {
    alert(translations[currentLang].alerts.invalidWood);
    return;
  }
  woodTypes.push({ name, preis: price });
  saveWood();
  updateList();
  holzInput.value = '';
  preisInput.value = '';
}

function selectWood(i) {
  selectedIndex = i;
  const w = woodTypes[i];
  auswahlInfo.innerText = translations[currentLang].messages.selected({ name: w.name, price: w.preis });
}

// Berechnung & Speichern
function calculateAndSave() {
  if (selectedIndex === null) {
    alert(translations[currentLang].alerts.selectWood);
    return;
  }
  const amount = parseFloat(kubikInput.value);
  if (isNaN(amount) || amount <= 0) {
    alert(translations[currentLang].alerts.invalidQty);
    return;
  }
  const w = woodTypes[selectedIndex];
  const total = w.preis * amount;
  calculations.push({ name: w.name, amount, price: w.preis, total });
  saveCalc();
  updateCalcList();
  updateSubtotal();
  ausgabe.innerText = translations[currentLang].messages.added({ name: w.name, amount, total });
}

function updateCalcList() {
  merkListe.innerHTML = '';
  calculations.forEach((e,i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${e.name}</strong><br>
      ${e.amount.toFixed(2)} m³ × ${e.price.toFixed(2)} € = 
      <strong>${e.total.toFixed(2)} €</strong>
      <button class="delete-btn" onclick="deleteCalc(${i})">🗑️</button>
    `;
    merkListe.append(li);
  });
}

function updateSubtotal() {
  const sum = calculations.reduce((a,c) => a + c.total, 0);
  zwSum.innerText = translations[currentLang].table.subtotal(sum);
  posList.innerHTML = calculations.map(e =>
    `- ${e.name}: ${e.amount.toFixed(2)} m³ → ${e.total.toFixed(2)} €`
  ).join('<br>') || translations[currentLang].table.noItems;
}

function deleteCalc(i) {
  calculations.splice(i,1);
  saveCalc();
  updateCalcList();
  updateSubtotal();
}

function clearAllCalc() {
  if (confirm(translations[currentLang].alerts.confirmDeleteCalc)) {
    calculations = [];
    saveCalc();
    updateCalcList();
    updateSubtotal();
  }
}

function deleteWood(i) {
  if (confirm(translations[currentLang].alerts.confirmDeleteWood(woodTypes[i]))) {
    woodTypes.splice(i,1);
    saveWood();
    updateList();
    auswahlInfo.innerText = '';
    ausgabe.innerText     = '';
    selectedIndex = null;
  }
}

function resetWoodTypes() {
  if (confirm(translations[currentLang].alerts.confirmResetWood)) {
    localStorage.removeItem('holzarten');
    woodTypes = [];
    updateList();
    auswahlInfo.innerText = '';
    ausgabe.innerText     = '';
    selectedIndex = null;
  }
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark');
  document.body.classList.toggle('light', !isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateDarkToggleLabel();
}

// Globale Funktionen für inline-Buttons
window.deleteCalc = deleteCalc;
window.deleteWood = deleteWood;

// Event-Listener
darkToggle.addEventListener('click', toggleDarkMode);
addHolzBtn.addEventListener('click', addWoodType);
calcSaveBtn.addEventListener('click', calculateAndSave);
clearAllBtn.addEventListener('click', clearAllCalc);
resetHolzBtn.addEventListener('click', resetWoodTypes);
exportTextBtn.addEventListener('click', exportAsText);
exportPdfBtn.addEventListener('click', exportAsPDF);

// Export-Funktionen
async function exportAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const t = translations[currentLang].table;
  const customer = kundenName.value.trim();
  const date = new Date();
  const dateStr = date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

  doc.setFontSize(16);
  doc.text(t.pdfTitle, 10, 15);
  doc.setFontSize(12);
  if (customer) doc.text(t.customerLabel + customer, 10, 25);
  doc.text(t.dateLabel + dateStr, 10, customer ? 33 : 25);

  doc.autoTable({
    startY: customer ? 42 : 34,
    head: [["#", currentLang==='de'?'Holzart':'Wood', currentLang==='de'?'Menge (m³)':'Qty (m³)', currentLang==='de'?'Einzelpreis (€)':'Price (€)', currentLang==='de'?'Gesamt (€)':'Total (€)']],
    body: calculations.map((e,i)=>[
      i+1, e.name, e.amount.toFixed(2), e.price.toFixed(2), e.total.toFixed(2)
    ]),
    styles: { fontSize:10, cellPadding:3 },
    headStyles: { fillColor:[25,118,210], textColor:255, halign:'center' },
    columnStyles: { 0:{halign:'center',cellWidth:10},2:{halign:'right'},3:{halign:'right'},4:{halign:'right'} }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  const sum = calculations.reduce((a,c)=>a+c.total,0);
  doc.setFont(undefined,'bold');
  doc.text((currentLang==='de'?'Gesamtsumme: ':'Total: ') + sum.toFixed(2) + ' €', 10, finalY);
  doc.setFont(undefined,'normal');
  doc.text(t.signature, 10, finalY + 20);
  doc.line(40, finalY + 20, 120, finalY + 20);

  doc.save(`kubikpreis_${customer || 'berechnung'}.pdf`);
}

async function exportAsText() {
  const t = translations[currentLang].table;
  const customer = kundenName.value.trim();
  const date = new Date();
  const dateStr = date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

  let text = t.pdfTitle + '\n\n';
  if (customer) text += t.customerLabel + customer + '\n';
  text += t.dateLabel + dateStr + '\n\n';
  text += '#\t' + (currentLang==='de'?'Holzart':'Wood') + '\t' + (currentLang==='de'?'Menge (m³)':'Qty (m³)') + '\t' + (currentLang==='de'?'Einzelpreis (€)':'Price (€)') + '\t' + (currentLang==='de'?'Gesamt (€)':'Total (€)') + '\n';

  calculations.forEach((e,i) => {
    text += `${i+1}\t${e.name}\t${e.amount.toFixed(2)}\t${e.price.toFixed(2)}\t${e.total.toFixed(2)}\n`;
  });

  const sum = calculations.reduce((a,c)=>a+c.total,0);
  text += '\n' + (currentLang==='de'?'Gesamtsumme: ':'Total: ') + sum.toFixed(2) + ' €\n';

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `kubikpreis_${customer || 'berechnung'}.txt`;
  link.click();
}
