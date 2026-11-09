const value = name => document.querySelector(`input[name="${name}"]:checked`)?.value || "";
function toggleSection(section, visible) {
  section.hidden = !visible;
  section.querySelectorAll("input, textarea").forEach(control => {
    control.disabled = !visible;
    if (!visible) { if (control.type === "radio" || control.type === "checkbox") control.checked = false; else control.value = ""; }
  });
}
const form=document.getElementById("rsvp-form"), attendingFields=document.getElementById("attending-fields"), declineNote=document.getElementById("decline-note"), adultFields=document.getElementById("adult-fields"), childrenFields=document.getElementById("children-fields"), allergenFields=document.getElementById("allergen-fields"), busFields=document.getElementById("bus-fields");
function updateForm(){
 const attendance=value("attendance"), yes=attendance==="Sí";
 toggleSection(attendingFields,yes); toggleSection(declineNote,attendance==="No");
 const party=value("partyType"); toggleSection(adultFields,yes&&party==="Voy acompañado/a"); toggleSection(childrenFields,yes&&party==="Voy acompañado/a y con niños");
 const hasAllergens=value("allergens")==="Sí"; toggleSection(allergenFields,yes&&hasAllergens); toggleSection(busFields,yes&&value("bus")==="Sí");
 document.getElementById("adult-name").required=yes&&party==="Voy acompañado/a";
 document.getElementById("adult-with-children").required=yes&&party==="Voy acompañado/a y con niños";
 document.getElementById("child-one").required=yes&&party==="Voy acompañado/a y con niños";
 document.getElementById("allergen-details").required=yes&&hasAllergens;
}
form.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener("change",updateForm)); updateForm();
form.addEventListener("submit",event=>{event.preventDefault();const msg=document.getElementById("message"),attendance=value("attendance");
 if(!document.getElementById("guest-name").value.trim()){msg.textContent="Por favor, introduce tu nombre y apellidos.";return;}
 if(!attendance){msg.textContent="Por favor, indica si asistirás a la boda.";return;}
 if(attendance==="Sí"){
  if(!value("partyType")){msg.textContent="Por favor, indica si vienes solo/a, acompañado/a o acompañado/a con niños.";return;}
  const party=value("partyType");
  const requiredNames = party==="Voy acompañado/a" ? ["adult-name"] : party==="Voy acompañado/a y con niños" ? ["adult-with-children","child-one"] : [];
  if(requiredNames.some(id=>!document.getElementById(id).value.trim())){msg.textContent="Por favor, completa los nombres de las personas que te acompañan.";return;}
  if(!value("allergens")||!value("bus")){msg.textContent="Por favor, completa las preguntas de alérgenos y autobús.";return;}
  if(value("allergens")==="Sí"&&!document.getElementById("allergen-details").value.trim()){msg.textContent="Por favor, indica qué alérgenos o menú especial necesitáis.";return;}
  if(value("bus")==="Sí"&&!value("busStop")){msg.textContent="Por favor, selecciona el punto de salida del autobús.";return;}
 }
 msg.textContent="¡Gracias por responder! Esta maqueta todavía no envía ni guarda las respuestas. Conectaremos el sistema RSVP antes de publicar la web.";
});
