# Inventario DS-160 — relevamiento completo
 
Extraído del formulario en vivo (sesión de pruebas) el 2026-08-20, 2026-08-21
y 2026-09-03.
Formato de cada línea: `id~tipo~postback~detalle~visibilidad~etiqueta`
El `id` va **sin** el prefijo `ctl00_SiteContentPlaceHolder_FormView1_`.
 
## Hechos confirmados sobre el DS-160
 
- **Los `rbl` son contenedores `<table>`.** Los inputs reales son `id + "_0"` (`value="Y"`)
  e `id + "_1"` (`value="N"`). La app debe hacer `.click()` sobre el input, nunca escribir
  sobre el `id` base.
- **Meses y días son NÚMEROS, sin cero a la izquierda.** Meses: `1`…`12`. Días: `1`…`31`.
  **Corregido el 2026-09-08** leyendo los `<option>` del formulario en vivo: enero es
  `value="1"` con texto visible `JAN`, diciembre es `value="12"`, el día 1 es `value="1"` y el
  día 9 es `value="9"`. El relevamiento original anotó el **texto visible** creyendo que era el
  `value`, y por eso este archivo y el plan decían `JAN`…`DEC` y `01`…`31`. Ese error hacía que
  **ninguna fecha del formulario llenara el mes**: se detectó en la prueba real de `Travel` y
  afectaba también a nacimiento, pasaporte, empleos, educación y visas.
- **`node=Family` no es una pantalla.** Redirige a `complete_family1.aspx?node=Relatives`.
  Padre, madre y familiares inmediatos están todos en `Relatives`. Total: **18 pantallas**.
- **Las listas de países son cuatro distintas:** nacionalidad del solicitante (212),
  nacionalidad del cónyuge / país de servicio militar (213), residencia permanente
  (253), lugar de nacimiento (281), más la de autoridad emisora de pasaporte (217)
  — **todas volcadas completas**, ver los `catalogo_paises_*.md`. El de lugar de
  nacimiento desagrega México en sus 32 estados y agrega `XAS` (At Sea), `XIR`
  (In the Air) y `STBR` (St. Barthelemy), que no están en los otros dos. La de 213
  es exactamente la de 212 **más `USA|UNITED STATES OF AMERICA`**.
- Los repetidores solo traen la fila `ctl00` **en una solicitud nueva**; las demás
  requieren "Add Another".
- **Cada fila de un repetidor dibuja su propio botón "Add Another"**, con id
  `<prefijo>_ctlNN_InsertButton…` (visto en `Travel`: `dtlTravelLoc_ctl00_InsertButtonTravelLoc`
  y `dtlTravelLoc_ctl01_InsertButtonTravelLoc` conviviendo). Hay que pulsar el de la
  **última** fila; los anteriores insertan en medio. En `Travel` además convive con
  `dlPrincipalAppTravel_ctl00_InsertButtonAlias`, que es de otro repetidor.
- **Las filas agregadas se guardan en el servidor.** Al volver a la misma pantalla del
  mismo cliente las filas de la pasada anterior siguen ahí, así que antes de pulsar
  "Add Another" hay que contar los slots presentes o se duplican.
- **`ceac.state.gov` está detrás de Cloudflare:** la URL trae `__cf_chl_rt_tk`, así que
  el `node=` hay que buscarlo entre los parámetros, no comparando la URL completa.
- Navegar entre pantallas dispara un diálogo "Leave site?"; hay que forzar la navegación.
- **La detección de `disparaPostback` por atributo `onclick`/`onchange` no siempre es
  confiable.** Se confirmaron varios casos donde la opción marcada realmente sí recarga la
  página (aparecen campos nuevos) aunque su `onclick` no contenga `__doPostBack` — visto en
  `rblMailingAddrSame`, `rblAddPhone`, `rblAddEmail` y `rblAddSocial` de `AddressPhone`. Ver
  el hallazgo detallado en esa sección. Recomendación: no confiar solo en inspección
  estática; verificar cambios en el DOM tras el clic.
- **Ahora se conoce una causa concreta de esa falta de fiabilidad** (hallada en
  `SecurityandBackground5`): ASP.NET solo pone `__doPostBack` en la opción del radio que
  **cambiaría** el estado visible. Con el radio en "No", `_0` lleva `__doPostBack` y `_1`
  no; con el radio en "Yes", `_0` lo pierde. Como el extractor lee el atributo del input
  `_0`, **un radio ya respondido "Yes" se reporta `postback=false` siendo falso**. Para un
  veredicto fiable hay que leer los dos inputs del grupo o diffear el DOM.
- **Hay dos clases distintas de postback.** Los de `WorkEducation1-3` son recargas
  completas de página (borran los globales de `window`, obligan a reinyectar el extractor
  desde `sessionStorage`). El de `rblAttWoReimb` en `SecurityandBackground5` es un postback
  **asíncrono** de ASP.NET AJAX (`Sys.WebForms.PageRequestManager`): inyecta controles
  nuevos en el DOM sin recargar, `performance.timeOrigin` no cambia y los globales de
  `window` sobreviven.
- Muchos radios "Sí/No" que en el mapeo actual llevan `disparaPostback: true` en realidad
  **no recargan la página** — el bloque condicional ya existe en el DOM y solo se
  muestra/oculta con CSS del lado del cliente. Confirmado en `TravelCompanions`
  (`rblOtherPersonsTravelingWithYou`), en varios radios de `PreviousUSTravel` y en **30 de
  los 31 radios** de las cinco pantallas de Security and Background. Antes de fijar
  `disparaPostback` en el mapeo definitivo, revisar campo por campo en vez de asumir
  `true` para todos los `rbl`.
- **`ctl00_ddlLanguage` no es un campo del formulario.** Es el selector de idioma de los
  tooltips del sitio: vive fuera de `FormView1` (sin el prefijo) y el extractor lo recoge
  en todas las pantallas. Excluirlo del conteo de controles.
## Pantallas completadas (18 de 18)
 
### Personal1
 
```
NODE=Personal1  url=/GenNIV/General/complete/complete_personal.aspx?node=Personal1
ddlAPP_GENDER~sel~~C3_MF~~Sex
ddlAPP_MARITAL_STATUS~sel~PB~C9_MC~~Marital Status
ddlDOBDay~sel~~C32_0102~~Date of Birth (day)
ddlDOBMonth~sel~~C13_JANFEB~~Date of Birth (month)
ddlAPP_POB_CNTRY~sel~~C281_AFGHALB~~Place of Birth Country/Region
tbxAPP_SURNAME~txt~~33~~Surnames
tbxAPP_GIVEN_NAME~txt~~33~~Given Names
tbxAPP_FULL_NAME_NATIVE~txt~~100~~Full Name in Native Alphabet
tbxDOBYear~txt~~4~~Date of Birth (year)
tbxAPP_POB_CITY~txt~~20~~Place of Birth City
tbxAPP_POB_ST_PROVINCE~txt~~20~~Place of Birth State/Province
rblOtherNames~rad~~_0=Y,_1=N~~Have you ever used other names
rblTelecodeQuestion~rad~~_0=Y,_1=N~~Do you have a telecode
cbexAPP_FULL_NAME_NATIVE_NA~chk~~~~Does Not Apply/Technology Not Available
cbexAPP_POB_ST_PROVINCE_NA~chk~~~~Does Not Apply
```
 
### Personal2
 
```
NODE=Personal2  url=/GenNIV/General/complete/complete_personalcont.aspx?node=Personal2
ddlAPP_NATL~sel~PB~paises(212)~~Country/Region of Origin (Nationality)
tbxAPP_NATIONAL_ID~txt~~20~~National Identification Number
tbxAPP_SSN1~txt~~3~~U.S. Social Security Number (parte 1)
tbxAPP_SSN2~txt~~2~~U.S. SSN (parte 2)
tbxAPP_SSN3~txt~~4~~U.S. SSN (parte 3)
tbxAPP_TAX_ID~txt~~20~~U.S. Taxpayer ID Number
rblAPP_OTH_NATL_IND~rad~PB~_0=Y,_1=N~~Do you hold any other nationality
rblPermResOtherCntryInd~rad~PB~_0=Y,_1=N~~Are you a permanent resident of another country
cbexAPP_NATIONAL_ID_NA~chk~~~~Does Not Apply
cbexAPP_SSN_NA~chk~~~~Does Not Apply
cbexAPP_TAX_ID_NA~chk~~~~Does Not Apply
--- CONDICIONALES ---
dtlOTHER_NATL_ctl00_ddlOTHER_NATL~sel~~paises(212)~~Otra nacionalidad [rblAPP_OTH_NATL_IND=Y]
dtlOTHER_NATL_ctl00_rblOTHER_PPT_IND~rad~PB~_0=Y,_1=N~~Tiene pasaporte de esa nacionalidad
dtlOTHER_NATL_ctl00_tbxOTHER_PPT_NUM~txt~~~~Numero de ese pasaporte [rblOTHER_PPT_IND=Y]
dtlOthPermResCntry_ctl00_ddlOthPermResCntry~sel~~paises(253)~~Pais residencia permanente [rblPermResOtherCntryInd=Y]
NOTA: solo existe ctl00 en ambos repetidores; filas extra requieren "Add Another".
```
 
### Travel
 
```
NODE=Travel  url=/GenNIV/General/complete/complete_travel.aspx?node=Travel
dlPrincipalAppTravel_ctl00_ddlPurposeOfTrip~sel~PB~n26~~Purpose of Trip to the U.S.
dlPrincipalAppTravel_ctl00_ddlOtherPurpose~sel~PB~n4~~Specify (depende del anterior)
ddlWhoIsPaying~sel~PB~n6~~Person/Entity Paying for Your Trip
--- RAMA A: rblSpecificTravel = Y (planes concretos) ---
ddlARRIVAL_US_DTEDay / ddlARRIVAL_US_DTEMonth / tbxARRIVAL_US_DTEYear~fecha~~~~Date of Arrival
tbxArriveCity~txt~~20~~Arrival City
tbxArriveFlight~txt~~20~~Arrival Flight (opcional)
ddlDEPARTURE_US_DTEDay / ddlDEPARTURE_US_DTEMonth / tbxDEPARTURE_US_DTEYear~fecha~~~~Date of Departure
tbxDepartCity~txt~~20~~Departure City
tbxDepartFlight~txt~~20~~Departure Flight (opcional)
dtlTravelLoc_ctl00_tbxSPECTRAVEL_LOCATION~txt~~40~~Location (repetidor, solo ctl00)
tbxStreetAddress1~txt~~40~~Street Address (Line 1) hospedaje
tbxStreetAddress2~txt~~40~~Street Address (Line 2) hospedaje
tbxCity~txt~~20~~City hospedaje
ddlTravelState~sel~~n57~~State hospedaje
tbZIPCode~txt~~10~~ZIP Code hospedaje   <-- OJO: "tbZIPCode", sin la x
--- RAMA B: rblSpecificTravel = N (sin planes concretos) ---
ddlTRAVEL_DTEDay / ddlTRAVEL_DTEMonth / tbxTRAVEL_DTEYear~fecha~~~~Intended Date of Arrival
tbxTRAVEL_LOS~txt~~~~Intended Length of Stay (valor)
ddlTRAVEL_LOS_CD~sel~~Y|M|W|D|H~~Intended Length of Stay (unidad)
--- CONDICIONAL: ddlWhoIsPaying = O (Other Person) ---
tbxPayerSurname, tbxPayerGivenName, tbxPayerPhone, tbxPAYER_EMAIL_ADDR,
ddlPayerRelationship (7 opciones, ya volcado), rblPayerAddrSameAsInd (_0=Y,_1=N)
rblSpecificTravel~rad~PB~_0=Y,_1=N~~Have you made specific travel plans?
```
 
### TravelCompanions
 
```
NODE=TravelCompanions  url=/GenNIV/General/complete/complete_travelcompanions.aspx?node=TravelCompanions
dlTravelCompanions_ctl00_tbxSurname~txt~~33~~Surnames of Person Traveling With You
dlTravelCompanions_ctl00_tbxGivenName~txt~~33~~Given Names of Person Traveling With You
dlTravelCompanions_ctl00_ddlTCRelationship~sel~~8~~Relationship with Person
rblOtherPersonsTravelingWithYou~rad~~_0=Y,_1=N~~Are there other persons traveling with you?
rblGroupTravel~rad~PB~_0=Y,_1=N~~Are you traveling as part of a group or organization? [NUEVO, no está en el mapeo]
--- Si rblGroupTravel=Y (reemplaza todo el bloque de acompañantes) ---
tbxGroupName~txt~~75~~Group Name [NUEVO, no está en el mapeo ni en el modelo de datos]
```
Detalle completo, incluidos los 5 slots del repetidor de acompañantes y el
catálogo `ddlTCRelationship` (P/S/C/R/F/B/O), en `TravelCompanions.md`.
 
### PreviousUSTravel
 
```
NODE=PreviousUSTravel  url=/GenNIV/General/complete/complete_previousustravel.aspx?node=PreviousUSTravel
rblPREV_US_TRAVEL_IND~rad~~_0=Y,_1=N~~Have you ever been in the U.S.?
rblPREV_US_DRIVER_LIC_IND~rad~PB~_0=Y,_1=N~~Do you or did you ever hold a U.S. Driver's License?
rblPREV_VISA_IND~rad~~_0=Y,_1=N~~Have you ever been issued a U.S. Visa?
rblPREV_VISA_SAME_TYPE_IND~rad~~_0=Y,_1=N~~Are you applying for the same type of visa?
rblPREV_VISA_SAME_CNTRY_IND~rad~~_0=Y,_1=N~~Are you applying in the same country/location...?
rblPREV_VISA_TEN_PRINT_IND~rad~~_0=Y,_1=N~~Have you been ten-printed?
rblPREV_VISA_LOST_IND~rad~PB~_0=Y,_1=N~~Has your U.S. Visa ever been lost or stolen?
rblPREV_VISA_CANCELLED_IND~rad~PB~_0=Y,_1=N~~Has your U.S. Visa ever been cancelled or revoked?
rblPREV_VISA_REFUSED_IND~rad~PB~_0=Y,_1=N~~Have you ever been refused a U.S. Visa...?
rblIV_PETITION_IND~rad~PB~_0=Y,_1=N~~Has anyone ever filed an immigrant petition on your behalf...?
dtlPREV_US_VISIT_ctl0N_ddlPREV_US_VISIT_LOS_CD~sel~~6~~Length of stay (unidad, mismo catálogo que ddlTRAVEL_LOS_CD)
--- CONDICIONALES (revelados al marcar Y) ---
dtlUS_DRIVER_LICENSE_ctl00_tbxUS_DRIVER_LICENSE~txt~~20~~Driver's License Number [pendiente numeroLicenciaConducirEEUU]
dtlUS_DRIVER_LICENSE_ctl00_ddlUS_DRIVER_LICENSE_STATE~sel~~57~~State of Driver's License [pendiente estadoLicenciaConducirEEUU]
dtlUS_DRIVER_LICENSE_ctl00_cbxUS_DRIVER_LICENSE_NA~chk~~~~Do Not Know [NUEVO, sin variable]
tbxPREV_VISA_LOST_YEAR~txt~~4~~Year [pendiente anioVisaEEUUPerdidaORobada]
tbxPREV_VISA_LOST_EXPL~txtarea~~4000~~Explain [pendiente motivoVisaEEUUPerdidaORobada]
tbxPREV_VISA_CANCELLED_EXPL~txtarea~~4000~~Explain [pendiente razonVisaEEUUCanceladaORevocada]
tbxPREV_VISA_REFUSED_EXPL~txtarea~~4000~~Explain [pendiente detallesVisaNegada]
tbxIV_PETITION_EXPL~txtarea~~4000~~Explain [pendiente razonPeticionInmigracion]
```
Los 20 controles del estado inicial (visitas anteriores, fecha última visa,
etc.) y el detalle completo en `PreviousUSTravel.md`.
 
### AddressPhone
 
```
NODE=AddressPhone  url=/GenNIV/General/complete/complete_contact.aspx?node=AddressPhone
tbxAPP_ADDR_LN1~txt~~40~~Street Address (Line 1)
tbxAPP_ADDR_LN2~txt~~40~~Street Address (Line 2) [NUEVO, falta en el mapeo]
tbxAPP_ADDR_CITY~txt~~20~~City
tbxAPP_ADDR_STATE~txt~~20~~State/Province
tbxAPP_ADDR_POSTAL_CD~txt~~10~~Postal Zone/ZIP Code
ddlCountry~sel~~253~~Country/Region (Home Address) [NUEVO, falta en el mapeo]
tbxAPP_HOME_TEL~txt~~15~~Primary Phone Number
tbxAPP_MOBILE_TEL~txt~~15~~Secondary Phone Number
tbxAPP_BUS_TEL~txt~~15~~Work Phone Number [NUEVO, sin variable]
tbxAPP_EMAIL_ADDR~txt~~50~~Email Address
rblMailingAddrSame~rad~PB(real)~_0=Y,_1=N~~Is your Mailing Address the same as your Home Address? [NUEVO]
rblAddPhone~rad~PB~_0=Y,_1=N~~Have you used any other phone numbers in the last five years?
rblAddEmail~rad~PB~_0=Y,_1=N~~Have you used any other email addresses in the last five years?
rblAddSocial~rad~PB~_0=Y,_1=N~~...OTHER websites or applications... to create or share content? [NUEVO]
   <-- CORREGIDO 2026-09-08: NO controla dtlSocial. El bloque dtlSocial (las plataformas
       conocidas) esta SIEMPRE visible y al menos una es obligatoria. rblAddSocial revela un
       bloque aparte para "otras plataformas", que no se releva porque va fijo en "N".
dtlSocial_ctl00/01_ddlSocialMedia~sel~PB~22~~Social Media Provider/Platform
dtlSocial_ctl00/01_tbxSocialMediaIdent~txt~~50~~Social Media Identifier
--- Si rblMailingAddrSame=N (bloque paralelo completo) ---
tbxMAILING_ADDR_LN1/LN2/CITY/STATE/POSTAL_CD, ddlMailCountry(253)  [NUEVO, sin variables]
--- Si rblAddPhone=Y ---
dtlAddPhone_ctl00_tbxAddPhoneInfo~txt~~15~~Additional Phone Number [pendiente telefonosAnteriores]
--- Si rblAddEmail=Y ---
dtlAddEmail_ctl00_tbxAddEmailInfo~txt~~40~~Additional Email Address [pendiente correosAnteriores]
```
Detalle completo, incluidos los checkboxes "Does Not Apply", en
`AddressPhone.md`.
 
### Relatives
 
```
NODE=Relatives  url=/GenNIV/General/complete/complete_family1.aspx?node=Relatives
NOTA: node=Family redirige aqui. complete_familymain.aspx NO existe como pantalla.
ddlFathersDOBDay~sel~~C32_0102~~Father Date of Birth (day)
ddlFathersDOBMonth~sel~~C13_JANFEB~~Father Date of Birth (month)
ddlMothersDOBDay~sel~~C32_0102~~Mother Date of Birth (day)
ddlMothersDOBMonth~sel~~C13_JANFEB~~Mother Date of Birth (month)
tbxFATHER_SURNAME~txt~~33~~Father Surnames
tbxFATHER_GIVEN_NAME~txt~~33~~Father Given Names
tbxFathersDOBYear~txt~~4~~Father Date of Birth (year)
tbxMOTHER_SURNAME~txt~~33~~Mother Surnames
tbxMOTHER_GIVEN_NAME~txt~~33~~Mother Given Names
tbxMothersDOBYear~txt~~4~~Mother Date of Birth (year)
rblFATHER_LIVE_IN_US_IND~rad~PB~_0=Y,_1=N~~Is your father in the U.S.?
rblMOTHER_LIVE_IN_US_IND~rad~PB~_0=Y,_1=N~~Is your mother in the U.S.?
rblUS_IMMED_RELATIVE_IND~rad~PB~_0=Y,_1=N~~Do you have any immediate relatives in the US
rblUS_OTHER_RELATIVE_IND~rad~~_0=Y,_1=N~~Do you have any other relatives in the US
cbxFATHER_SURNAME_UNK_IND~chk~~~~Do Not Know
cbxFATHER_GIVEN_NAME_UNK_IND~chk~~~~Do Not Know
cbxFATHER_DOB_UNK_IND~chk~~~~Do Not Know
cbxMOTHER_SURNAME_UNK_IND~chk~~~~Do Not Know
cbxMOTHER_GIVEN_NAME_UNK_IND~chk~~~~Do Not Know
cbxMOTHER_DOB_UNK_IND~chk~~~~Do Not Know
--- CONDICIONALES (revelados al marcar Y) ---
ddlFATHER_US_STATUS~sel~~C5_SC~~Father status  [rblFATHER_LIVE_IN_US_IND=Y]
ddlMOTHER_US_STATUS~sel~~C5_SC~~Mother status  [rblMOTHER_LIVE_IN_US_IND=Y]
dlUSRelatives_ctl00_tbxUS_REL_SURNAME~txt~~~~Relative surnames  [rblUS_IMMED_RELATIVE_IND=Y]
dlUSRelatives_ctl00_tbxUS_REL_GIVEN_NAME~txt~~~~Relative given names
dlUSRelatives_ctl00_ddlUS_REL_TYPE~sel~~C5_SF~~Relationship
dlUSRelatives_ctl00_ddlUS_REL_STATUS~sel~~C5_SC~~Relative status
NOTA: solo existe ctl00; las filas 2-5 requieren "Add Another".
```
 
### PptVisa
 
```
NODE=PptVisa  url=/GenNIV/General/complete/Passport_Visa_Info.aspx?node=PptVisa
tbxPPT_NUM~txt~~20~~Passport/Travel Document Number [NUEVO, sin variable]
tbxPPT_BOOK_NUM~txt~~20~~Passport Book Number [NUEVO, sin variable]
tbxPPT_ISSUED_IN_CITY~txt~~25~~City (emisión)
tbxPPT_ISSUED_IN_STATE~txt~~25~~State/Province (emisión) [NUEVO]
tbxPPT_ISSUEDYear~txt~~4~~Issuance Date (year) [NUEVO]
tbxPPT_EXPIREYear~txt~~4~~Expiration Date (year) [NUEVO]
ddlPPT_TYPE~sel~PB~6~~Passport/Travel Document Type [NUEVO, ya volcado]
ddlPPT_ISSUED_CNTRY~sel~~217~~Country/Authority that Issued Passport (catálogo de 217, ya volcado) [NUEVO]
ddlPPT_ISSUED_IN_CNTRY~sel~~253~~Country/Region donde se emitió físicamente (mismo tamaño que residencia permanente) [NUEVO]
ddlPPT_ISSUED_DTEDay / ddlPPT_ISSUED_DTEMonth~sel~~~~Issuance Date (día/mes) [NUEVO]
ddlPPT_EXPIRE_DTEDay / ddlPPT_EXPIRE_DTEMonth~sel~~~~Expiration Date (día/mes) [NUEVO]
cbexPPT_BOOK_NUM_NA~chk~~~~Does Not Apply [NUEVO]
cbxPPT_EXPIRE_NA~chk~PB~~~No Expiration [NUEVO]
rblLOST_PPT_IND~rad~PB~_0=Y,_1=N~~Have you ever lost a passport or had one stolen?
--- CONDICIONAL: rblLOST_PPT_IND = Y ---
dtlLostPPT_ctl00_tbxLOST_PPT_NUM~txt~~20~~Passport/Travel Document Number [pendiente numeroPasaportePerdidoORobado]
dtlLostPPT_ctl00_tbxLOST_PPT_EXPL~txtarea~~4000~~Explain [pendiente explicacionPasaportePerdidoORobado]
dtlLostPPT_ctl00_ddlLOST_PPT_NATL~sel~~217~~Country/Authority [pendiente paisAutoridadPasaportePerdidoORobado, mismo catálogo 217]
dtlLostPPT_ctl00_cbxLOST_PPT_NUM_UNKN_IND~chk~PB~~~Do Not Know [NUEVO, sin variable]
```
Detalle completo en `PptVisa.md`.
 
### USContact
 
```
NODE=USContact  url=/GenNIV/General/complete/complete_uscontact.aspx?node=USContact
NOTA: pantalla sin radios ni condicionales, todo siempre visible. mapeo_ds160_1.json
tiene esta pantalla con "campos": [] — hay que crear el grupo completo.
tbxUS_POC_SURNAME~txt~~33~~Surnames
tbxUS_POC_GIVEN_NAME~txt~~33~~Given Names
tbxUS_POC_ORGANIZATION~txt~~33~~Organization Name
tbxUS_POC_ADDR_LN1~txt~~40~~U.S. Street Address (Line 1)
tbxUS_POC_ADDR_LN2~txt~~40~~U.S. Street Address (Line 2)
tbxUS_POC_ADDR_CITY~txt~~20~~City
tbxUS_POC_ADDR_POSTAL_CD~txt~~10~~ZIP Code
tbxUS_POC_HOME_TEL~txt~~15~~Phone Number
tbxUS_POC_EMAIL_ADDR~txt~~50~~Email Address
ddlUS_POC_REL_TO_APP~sel~PB~8~~Relationship to You (catálogo ya volcado)
ddlUS_POC_ADDR_STATE~sel~~57~~State (mismo catálogo que ddlTravelState)
cbxUS_POC_NAME_NA~chk~PB~~~Do Not Know (nombre)
cbxUS_POC_ORG_NA_IND~chk~PB~~~Do Not Know (organización)
cbexUS_POC_EMAIL_ADDR_NA~chk~~~~Does Not Apply
```
Detalle completo en `USContact.md`.
 
### Spouse
 
```
NODE=Spouse  url=/GenNIV/General/complete/complete_family2.aspx?node=Spouse
NOTA: la pantalla solo existe si ddlAPP_MARITAL_STATUS = M (u otro estado con cónyuge).
tbxSpouseSurname~txt~~33~~Spouse's Surnames
tbxSpouseGivenName~txt~~33~~Spouse's Given Names
tbxDOBYear~txt~~4~~Spouse's Date of Birth (year)
tbxSpousePOBCity~txt~~20~~City (Spouse's Place of Birth) [NUEVO]
ddlDOBDay / ddlDOBMonth~sel~~~~Spouse's Date of Birth (día/mes)
ddlSpouseNatDropDownList~sel~~213~~Spouse's Nationality (212 del solicitante + USA, ya volcado y diffeado)
ddlSpousePOBCountry~sel~~281~~Country (Spouse's Place of Birth, mismo tamaño que lugar de nacimiento del solicitante) [NUEVO]
ddlSpouseAddressType~sel~PB~6~~Spouse's Address: H|Same as Home M|Same as Mailing U|Same as US Contact D|Do Not Know O|Other
cbexSPOUSE_POB_CITY_NA~chk~~~~Do Not Know [NUEVO]
--- CONDICIONAL: ddlSpouseAddressType = O (Other) ---
tbxSPOUSE_ADDR_LN1/LN2/CITY/STATE/POSTAL_CD~txt~~~~Dirección del cónyuge (otra) [pendiente direccionConyugeOtro]
ddlSPOUSE_ADDR_CNTRY~sel~~253~~Country/Region [pendiente direccionConyugeOtro, mismo catálogo que residencia permanente]
cbexSPOUSE_ADDR_STATE_NA / cbexSPOUSE_ADDR_POSTAL_CD_NA~chk~~~~Does Not Apply
```
**Importante:** el `_verificar` del mapeo sobre "igual que la del
solicitante" queda resuelto — el valor es `"H"`, no `""`. Detalle completo
en `Spouse.md`.
 
### WorkEducation1
 
```
NODE=WorkEducation1  url=/GenNIV/General/complete/complete_workeducation1.aspx?node=WorkEducation1
ddlPresentOccupation~sel~PB(real)~23~~Primary Occupation (catálogo NUEVO, ya volcado)
tbxEmpSchName~txt~~75~~Present Employer or School Name
tbxEmpSchAddr1~txt~~40~~Street Address (Line 1)
tbxEmpSchAddr2~txt~~40~~Street Address (Line 2) [NUEVO, sin variable]
tbxEmpSchCity~txt~~20~~City
tbxWORK_EDUC_ADDR_STATE~txt~~20~~State/Province
tbxWORK_EDUC_ADDR_POSTAL_CD~txt~~10~~Postal Zone/ZIP Code
tbxWORK_EDUC_TEL~txt~~15~~Phone Number
ddlEmpSchCountry~sel~~253~~Country/Region [NUEVO, sin variable]
ddlEmpDateFromDay / ddlEmpDateFromMonth / tbxEmpDateFromYear~fecha~~~~Start Date
tbxCURR_MONTHLY_SALARY~txt~~15~~Monthly Income in Local Currency (if employed)
tbxDescribeDuties~txtarea~~4000~~Briefly describe your duties:
cbxWORK_EDUC_ADDR_STATE_NA / cbxWORK_EDUC_ADDR_POSTAL_CD_NA / cbxCURR_MONTHLY_SALARY_NA~chk~~~~Does Not Apply
--- CONDICIONAL: segun el valor de ddlPresentOccupation ---
tbxExplainOtherPresentOccupation~txtarea~~4000~~ddlPresentOccupation=O -> "Specify Other";
                                                ddlPresentOccupation=N -> "Explain"
NOTA: con H (HOMEMAKER) o RT (RETIRED) NO existe ningun campo salvo el propio select.
      Con N desaparece todo el bloque de empleador.
```
Detalle completo, incluida la tabla de ramas, en `WorkEducation1.md`.
 
### WorkEducation2
 
```
NODE=WorkEducation2  url=/GenNIV/General/complete/complete_workeducation2.aspx?node=WorkEducation2
rblPreviouslyEmployed~rad~PB(real)~_0=Y,_1=N~~Were you previously employed?
rblOtherEduc~rad~PB(real)~_0=Y,_1=N~~Have you attended any educational institutions...?
   <-- OJO: el mapeo lo ubica en WorkEducation3. Esta AQUI.
--- Si rblPreviouslyEmployed=Y (repetidor dtlPrevEmpl, solo ctl00) ---
dtlPrevEmpl_ctl00_tbEmployerName~txt~~75~~Employer Name [pendiente empleadorAnterior]
dtlPrevEmpl_ctl00_tbEmployerStreetAddress1/2~txt~~40~~Employer Street Address [pendiente direccionTrabajoAnterior]
dtlPrevEmpl_ctl00_tbEmployerCity~txt~~20~~City [pendiente ciudadTrabajoAnterior]
dtlPrevEmpl_ctl00_tbxPREV_EMPL_ADDR_STATE~txt~~20~~State/Province [pendiente provinciaTrabajoAnterior]
dtlPrevEmpl_ctl00_tbxPREV_EMPL_ADDR_POSTAL_CD~txt~~10~~Postal Zone/ZIP Code [pendiente codigoPostalTrabajoAnterior]
dtlPrevEmpl_ctl00_DropDownList2~sel~~253~~Country/Region   <-- id autogenerado, sin semantica
dtlPrevEmpl_ctl00_tbEmployerPhone~txt~~15~~Telephone Number [pendiente telefonoTrabajoAnterior]
dtlPrevEmpl_ctl00_tbJobTitle~txt~~75~~Job Title [pendiente cargoAnterior]
dtlPrevEmpl_ctl00_tbSupervisorSurname~txt~~33~~Supervisor's Surname [pendiente apellidosSupervisorAnterior]
dtlPrevEmpl_ctl00_tbSupervisorGivenName~txt~~33~~Supervisor's Given Names [pendiente nombreSupervisorAnterior]
dtlPrevEmpl_ctl00_ddlEmpDateFromDay/Month + tbxEmpDateFromYear~fecha~~~~[pendiente fechaInicioTrabajoAnterior]
dtlPrevEmpl_ctl00_ddlEmpDateToDay/Month + tbxEmpDateToYear~fecha~~~~[pendiente fechaFinTrabajoAnterior]
dtlPrevEmpl_ctl00_tbDescribeDuties~txtarea~~4000~~[pendiente descripcionTrabajoAnterior]
dtlPrevEmpl_ctl00_cbxPREV_EMPL_ADDR_STATE_NA / ..._POSTAL_CD_NA~chk~PB~~~Does Not Apply
dtlPrevEmpl_ctl00_cbxSupervisorSurname_NA / ..._GivenName_NA~chk~PB~~~Do Not Know
--- Si rblOtherEduc=Y (repetidor dtlPrevEduc, solo ctl00) ---
dtlPrevEduc_ctl00_tbxSchoolName~txt~~75~~Name of Institution [pendiente institucionUniversitaria]
dtlPrevEduc_ctl00_tbxSchoolAddr1/2~txt~~40~~Street Address [pendiente direccionEducacion]
dtlPrevEduc_ctl00_tbxSchoolCity~txt~~20~~City [pendiente ciudadEducacion]
dtlPrevEduc_ctl00_tbxEDUC_INST_ADDR_STATE~txt~~20~~State/Province [pendiente provinciaEducacion]
dtlPrevEduc_ctl00_tbxEDUC_INST_POSTAL_CD~txt~~10~~Postal Zone/ZIP Code [pendiente codigoPostalEducacion]
dtlPrevEduc_ctl00_ddlSchoolCountry~sel~~253~~Country/Region [NUEVO, sin variable]
dtlPrevEduc_ctl00_tbxSchoolCourseOfStudy~txt~~66~~Course of Study [pendiente nombreCarrera]
dtlPrevEduc_ctl00_ddlSchoolFromDay/Month + tbxSchoolFromYear~fecha~~~~[pendiente fechaInicioEducacion]
dtlPrevEduc_ctl00_ddlSchoolToDay/Month + tbxSchoolToYear~fecha~~~~[pendiente fechaFinEducacion]
dtlPrevEduc_ctl00_cbxEDUC_INST_ADDR_STATE_NA / ..._POSTAL_CD_NA~chk~PB~~~Does Not Apply
```
Detalle completo en `WorkEducation2.md`.
 
### WorkEducation3
 
```
NODE=WorkEducation3  url=/GenNIV/General/complete/complete_workeducation3.aspx?node=WorkEducation3
NOTA: esta pantalla NO trata de educacion. El mapeo la titula "Educacion" y le
asigna 10 pendientes de institucion educativa: TODOS pertenecen a WorkEducation2.
rblCLAN_TRIBE_IND~rad~PB(real)~_0=Y,_1=N~~Do you belong to a clan or tribe? [NUEVO, sin variable]
dtlLANGUAGES_ctl00_tbxLANGUAGE_NAME~txt~~66~~Language Name (INCONDICIONAL, siempre visible)
rblCOUNTRIES_VISITED_IND~rad~PB(real)~_0=Y,_1=N~~Have you traveled to any countries/regions...?
rblORGANIZATION_IND~rad~PB(real)~_0=Y,_1=N~~Have you belonged to... any organization? [NUEVO, sin variable]
rblSPECIALIZED_SKILLS_IND~rad~NO-PB~_0=Y,_1=N~~Specialized skills or training? [NUEVO, sin variable]
rblMILITARY_SERVICE_IND~rad~PB(real)~_0=Y,_1=N~~Have you ever served in the military? [NUEVO, sin variable]
rblINSURGENT_ORG_IND~rad~NO-PB~_0=Y,_1=N~~Paramilitary/rebel/insurgent group? [NUEVO, sin variable]
--- CONDICIONALES ---
tbxCLAN_TRIBE_NAME~txt~~80~~Clan or Tribe Name [rblCLAN_TRIBE_IND=Y]
dtlCountriesVisited_ctl00_ddlCOUNTRIES_VISITED~sel~~253~~Country/Region [rblCOUNTRIES_VISITED_IND=Y, sin variable]
dtlMILITARY_SERVICE_ctl00_ddlMILITARY_SVC_CNTRY~sel~PB~213~~Name of Country/Region (mismo catálogo que ddlSpouseNatDropDownList, ya volcado)
dtlMILITARY_SERVICE_ctl00_tbxMILITARY_SVC_BRANCH/RANK/SPECIALTY~txt~~40~~Branch / Rank / Specialty
dtlMILITARY_SERVICE_ctl00_ddlMILITARY_SVC_FROMDay/Month + tbxMILITARY_SVC_FROMYear~fecha~~~~Date of Service From
dtlMILITARY_SERVICE_ctl00_ddlMILITARY_SVC_TODay/Month + tbxMILITARY_SVC_TOYear~fecha~~~~Date of Service To
tbxSPECIALIZED_SKILLS_EXPL~txtarea~~4000~~Explain (YA en el DOM, solo se muestra por CSS)
tbxINSURGENT_ORG_EXPL~txtarea~~4000~~Explain (YA en el DOM, solo se muestra por CSS)
```
Detalle completo en `WorkEducation3.md`.
 
### SecurityandBackground1
 
```
NODE=SecurityandBackground1  url=/GenNIV/General/complete/complete_securityandbackground1.aspx?node=SecurityandBackground1
6 controles: 3 radios + 3 textarea. Ningun radio dispara postback; los 3 textarea
ya estan en el DOM y solo cambian de visibilidad.
rblDisease~rad~NO-PB~_0=Y,_1=N~~Do you have a communicable disease of public health significance?
tbxDisease~txtarea~~4000~~Explain [unica variable mapeada de las 5 pantallas: detalleEnfermedadContagiosa]
rblDisorder~rad~NO-PB~_0=Y,_1=N~~Mental or physical disorder that poses a threat...? [NUEVO, sin variable]
tbxDisorder~txtarea~~4000~~Explain [NUEVO, sin variable]
rblDruguser~rad~NO-PB~_0=Y,_1=N~~Are you or have you ever been a drug abuser or addict? [NUEVO, sin variable]
tbxDruguser~txtarea~~4000~~Explain [NUEVO, sin variable]
```
Detalle completo, con el texto integro de las preguntas, en
`relevamiento_SecurityandBackground1.md`.
 
### SecurityandBackground2
 
```
NODE=SecurityandBackground2  url=/GenNIV/General/complete/complete_securityandbackground2.aspx?node=SecurityandBackground2
14 controles: 7 radios + 7 textarea. Pantalla ENTERA sin mapear ("campos": []).
Ningun radio dispara postback.
rblArrested / tbxArrested~~4000~~Arrested or convicted for any offense or crime...?
rblControlledSubstances / tbxControlledSubstances~~4000~~Violated any law relating to controlled substances?
rblProstitution / tbxProstitution~~4000~~Prostitution or unlawful commercialized vice...?
rblMoneyLaundering / tbxMoneyLaundering~~4000~~Involved in money laundering?
rblHumanTrafficking / tbxHumanTrafficking~~4000~~Committed a human trafficking offense?
rblAssistedSevereTrafficking / tbxAssistedSevereTrafficking~~4000~~Aided a severe human trafficking offense?
rblHumanTraffickingRelated / tbxHumanTraffickingRelated~~4000~~Spouse/son/daughter of a trafficker who benefited?
```
Detalle completo en `relevamiento_SecurityandBackground2.md`.
 
### SecurityandBackground3
 
```
NODE=SecurityandBackground3  url=/GenNIV/General/complete/complete_securityandbackground3.aspx?node=SecurityandBackground3
24 controles: 12 radios + 12 textarea. Es la pantalla mas larga de la seccion y
esta ENTERA sin mapear. Ningun radio dispara postback.
OJO: el mapeo declara aqui rblDeport y tbxDeport_EXPL. NO estan en esta pantalla:
estan en SecurityandBackground4.
rblIllegalActivity / tbxIllegalActivity~~4000~~Espionage, sabotage, export control violations...?
rblTerroristActivity / tbxTerroristActivity~~4000~~Terrorist activities?
rblTerroristSupport / tbxTerroristSupport~~4000~~Financial assistance to terrorists?
rblTerroristOrg / tbxTerroristOrg~~4000~~Member of a terrorist organization?
rblTerroristRel / tbxTerroristRel~~4000~~Spouse/son/daughter of a terrorist?
rblGenocide / tbxGenocide~~4000~~Genocide?
rblTorture / tbxTorture~~4000~~Torture?
rblExViolence / tbxExViolence~~4000~~Extrajudicial or political killings?
rblChildSoldier / tbxChildSoldier~~4000~~Recruitment or use of child soldiers?
rblReligiousFreedom / tbxReligiousFreedom~~4000~~Violations of religious freedom as a government official?
rblPopulationControls / tbxPopulationControls~~4000~~Coercive population controls?
rblTransplant / tbxTransplant~~4000~~Coercive transplantation of human organs?
```
Detalle completo en `relevamiento_SecurityandBackground3.md`.
 
### SecurityandBackground4
 
```
NODE=SecurityandBackground4  url=/GenNIV/General/complete/complete_securityandbackground4.aspx?node=SecurityandBackground4
10 controles: 5 radios + 5 textarea. Ningun radio dispara postback.
rblRemovalHearing / tbxRemovalHearing~~4000~~Subject of a removal or deportation hearing? [NUEVO, sin variable]
rblImmigrationFraud / tbxImmigrationFraud~~4000~~Immigration benefit by fraud or misrepresentation? [NUEVO, sin variable]
rblFailToAttend / tbxFailToAttend~~4000~~Failed to attend a hearing on removability? [NUEVO, sin variable]
rblVisaViolation / tbxVisaViolation~~4000~~Unlawfully present / overstayed / violated visa terms? [NUEVO, sin variable]
rblDeport / tbxDeport_EXPL~~4000~~Ever been removed or deported from any country?
   <-- el mapeo los ubica en SecurityandBackground3. Estan AQUI.
   <-- tbxDeport_EXPL rompe la convencion rbl->tbx de toda la seccion (sufijo _EXPL).
```
Detalle completo en `relevamiento_SecurityandBackground4.md`.
 
### SecurityandBackground5
 
```
NODE=SecurityandBackground5  url=/GenNIV/General/complete/complete_securityandbackground5.aspx?node=SecurityandBackground5
8 controles: 4 radios + 4 textarea (7 en el estado inicial). Pantalla ENTERA sin mapear.
rblChildCustody / tbxChildCustody~~4000~~Withheld custody of a U.S. citizen child...?
rblVotingViolation / tbxVotingViolation~~4000~~Voted in the United States in violation of any law?
rblRenounceExp / tbxRenounceExp~~4000~~Renounced U.S. citizenship to avoid taxation?
rblAttWoReimb~rad~PB(real, asincrono)~_0=Y,_1=N~~Attended a public school without reimbursing it?
tbxAttWoReimb~txtarea~~4000~~Explain
   <-- UNICO condicional real de las 5 pantallas: tbxAttWoReimb NO existe en el DOM
       hasta marcar "Yes"; el servidor lo inyecta por postback asincrono (ASP.NET AJAX,
       sin recarga de pagina). Al volver a "No" el control desaparece.
```
Detalle completo en `relevamiento_SecurityandBackground5.md`.
 
## Catálogos capturados
 
Los 19 catálogos del formulario están volcados en archivos propios
`catalogo_*.md`, con formato `value|texto en inglés|traducción al español`.
 
| Catálogo | Campo(s) | Opc. | Archivo |
|---|---|---|---|
| sexo | `ddlAPP_GENDER` | 3 | `catalogo_sexo.md` |
| estadoCivil | `ddlAPP_MARITAL_STATUS` (PB) | 9 | `catalogo_estado_civil.md` |
| paisesNacionalidad | `ddlAPP_NATL`, `dtlOTHER_NATL_ctl00_ddlOTHER_NATL` | 212 | `catalogo_paises_nacionalidad.md` |
| paisesNacionalidadConyuge | `ddlSpouseNatDropDownList`, `ddlMILITARY_SVC_CNTRY` | 213 | `catalogo_paises_nacionalidad_conyuge.md` |
| paisesResidencia | `ddlOthPermResCntry`, `ddlCountry`, `ddlEmpSchCountry`, `DropDownList2`, `ddlSchoolCountry`, `ddlCOUNTRIES_VISITED`, `ddlSPOUSE_ADDR_CNTRY`, `ddlPPT_ISSUED_IN_CNTRY`, `ddlMailCountry` | 253 | `catalogo_paises_residencia_permanente.md` |
| paisesNacimiento | `ddlAPP_POB_CNTRY`, `ddlSpousePOBCountry` | 281 | `catalogo_paises_lugar_nacimiento.md` |
| paisesAutoridadPasaporte | `ddlPPT_ISSUED_CNTRY`, `ddlLOST_PPT_NATL` | 217 | `catalogo_paises_autoridad_pasaporte.md` |
| propositoViaje | `ddlPurposeOfTrip` (PB) | 26 | `catalogo_proposito_viaje.md` |
| propositoViajeEspecifico | `ddlOtherPurpose` (anidado del anterior) | 1-21 | `catalogo_proposito_viaje_especifico.md` |
| quienPaga | `ddlWhoIsPaying` (PB) | 6 | `catalogo_quien_paga.md` |
| relacionPagador | `ddlPayerRelationship` | 7 | `catalogo_relacion_pagador.md` |
| unidadDuracion | `ddlTRAVEL_LOS_CD`, `ddlPREV_US_VISIT_LOS_CD` | 6 | `catalogo_unidad_duracion.md` |
| estadosEEUU | `ddlTravelState`, `ddlUS_POC_ADDR_STATE`, `ddlUS_DRIVER_LICENSE_STATE` | 57 | `catalogo_estados_eeuu.md` |
| relacionAcompanante | `ddlTCRelationship` | 8 | `catalogo_relacion_acompanante.md` |
| relacionContactoEEUU | `ddlUS_POC_REL_TO_APP` (PB) | 8 | `catalogo_relacion_contacto_eeuu.md` |
| tipoDocumentoPasaporte | `ddlPPT_TYPE` (PB) | 6 | `catalogo_tipo_documento_pasaporte.md` |
| estatusEEUU | `ddlFATHER_US_STATUS`, `ddlMOTHER_US_STATUS`, `ddlUS_REL_STATUS` | 5 | `catalogo_estatus_eeuu.md` |
| parentescoFamiliarEEUU | `ddlUS_REL_TYPE` | 5 | `catalogo_parentesco_familiar_eeuu.md` |
| ocupacionActual | `ddlPresentOccupation` (PB) | 23 | `catalogo_ocupacion_actual.md` |
 
Catálogos sin archivo propio porque son triviales:
 
```
C13_JANFEB   mes:   1|JAN  2|FEB  3|MAR  4|APR  5|MAY  6|JUN
                     7|JUL  8|AUG  9|SEP  10|OCT 11|NOV 12|DEC
                     (VALUE numerico sin cero a la izquierda; el texto visible es JAN..DEC)
C32_0102     dia:   1..31  (VALUE numerico sin cero a la izquierda)
RADIOS       siNo:  _0=Y  _1=N   (el id base es un TABLE contenedor)
ddlSocialMedia (plataforma de redes sociales, AddressPhone): 22 opciones, no volcado.
ddlSpouseAddressType (Spouse): 6 opciones — H|Same as Home, M|Same as Mailing,
  U|Same as US Contact, D|Do Not Know, O|Other.
```
 
**Trampas de los catálogos de parentesco:** hay cuatro catálogos distintos de
"relación", con letras que significan cosas distintas en cada uno.
 
| value | `ddlTCRelationship` | `ddlPayerRelationship` | `ddlUS_POC_REL_TO_APP` | `ddlUS_REL_TYPE` |
|---|---|---|---|---|
| `P` | PARENT | PARENT | EMPLOYER | — |
| `C` | CHILD | CHILD | FRIEND | CHILD |
| `F` | FRIEND | FRIEND | — | FIANCÉ/FIANCÉE |
| `B` | BUSINESS ASSOCIATE | — | — | SIBLING |
| `S` | SPOUSE | SPOUSE | — | SPOUSE |
| `R` | OTHER RELATIVE | OTHER RELATIVE | — | — |
 
Security and Background 1-5: **ningún catálogo**. Las 5 pantallas son solo
radios Sí/No y textarea de 4000 caracteres; el único select es
`ctl00_ddlLanguage`, que no pertenece al formulario.
 
## Pantallas pendientes (0)
 
Ninguna. Las 18 pantallas del DS-160 quedaron relevadas.
 
## Catálogos pendientes de volcar
 
Ninguno. El diff pendiente de las listas de 213 contra la de 212 quedó
resuelto el 2026-09-03: **la diferencia es una sola entrada,
`USA|UNITED STATES OF AMERICA`**, insertada entre `GRBR` y `URU`. Se verificó
además que `ddlSpouseNatDropDownList` (Spouse) y
`dtlMILITARY_SERVICE_ctl00_ddlMILITARY_SVC_CNTRY` (WorkEducation3) son el
mismo catálogo, valor por valor.
 
Único catálogo no volcado por baja prioridad: `ddlSocialMedia` (22 opciones,
plataformas de redes sociales, en `AddressPhone`).
 
## Hallazgos que afectan el modelo de datos
 
- `tbZIPCode` (código postal del hospedaje) **no lleva la `x`** que llevan los demás `tbx`.
- Campos del DS-160 sin variable en la plantilla: nombre en alfabeto nativo, telecode,
  ciudad/estado/país de nacimiento del solicitante, SSN en tres partes, bloque completo
  del pagador cuando `ddlWhoIsPaying = O`, y los checkboxes "Do Not Know" /
  "Does Not Apply".
- Resueltos: `otraNacionalidad` → `dtlOTHER_NATL_ctl00_ddlOTHER_NATL`;
  `paisResidenciaPermanente` → `dtlOthPermResCntry_ctl00_ddlOthPermResCntry`;
  `fechaLlegadaPrevista` / `valorDuracionEstadiaPrevista` /
  `unidadDuracionEstadiaPrevista` → rama `rblSpecificTravel = N`.
- **Resueltos en TravelCompanions:** ninguno de los 2 `pendientes` de esa pantalla
  (`cantidadViajeros`, `relacionViaje`) tiene un `id` directo — ver conclusión abajo.
  Se descubrieron 2 campos nuevos sin modelar: `rblGroupTravel` y `tbxGroupName`
  (mutuamente excluyentes con el repetidor de acompañantes).
- **Resueltos en PreviousUSTravel:** los 7 `pendientes` de esa pantalla
  (`numeroLicenciaConducirEEUU`, `estadoLicenciaConducirEEUU`,
  `motivoVisaEEUUPerdidaORobada`, `anioVisaEEUUPerdidaORobada`,
  `razonVisaEEUUCanceladaORevocada`, `razonPeticionInmigracion`,
  `detallesVisaNegada`) — todos con `id` confirmado, ver tabla arriba.
- **Resueltos en AddressPhone:** los 2 `pendientes` de esa pantalla
  (`telefonosAnteriores` → `dtlAddPhone_ctl00_tbxAddPhoneInfo`, `correosAnteriores` →
  `dtlAddEmail_ctl00_tbxAddEmailInfo`). Se descubrieron 6+ campos nuevos sin modelar:
  `tbxAPP_ADDR_LN2`, `tbxAPP_BUS_TEL`, `ddlCountry` (país del domicilio, 253 opciones),
  todo el bloque de dirección postal (`rblMailingAddrSame` + 6 campos), y
  `rblAddSocial` (revela el bloque de *otras* plataformas; **no** controla `dtlSocial`, que
  esta siempre visible — corregido el 2026-09-08).
- **Resueltos en PptVisa:** los 3 `pendientes` de pasaporte perdido/robado
  (`numeroPasaportePerdidoORobado`, `paisAutoridadPasaportePerdidoORobado`,
  `explicacionPasaportePerdidoORobado`). La pantalla está masivamente
  sub-mapeada: número de pasaporte, número de libro, tipo de documento,
  país/autoridad emisora, ciudad/estado/país de emisión física y fechas
  completas de emisión/expiración no tienen variable en `mapeo_ds160_1.json`.
  Hay **dos campos de país distintos** que no deben confundirse:
  `ddlPPT_ISSUED_CNTRY` (autoridad emisora, 217 opciones) vs.
  `ddlPPT_ISSUED_IN_CNTRY` (lugar físico de emisión, 253 opciones). Se
  confirma que `tieneVisaActiva`, `paisVisa` y `fechaEmisionVisa` no tienen
  equivalente en ninguna pantalla explorada — refuerza la sospecha de
  `plan_asistente_formularios_v4.md` de que deberían eliminarse del modelo.
- **USContact estaba completamente sin mapear** (`"campos": []` en
  `mapeo_ds160_1.json`, sin `pendientes` declarados). Se relevaron sus 14
  controles; falta crear el grupo de variables completo (nombre, apellido,
  organización, dirección, teléfono, correo, relación con el solicitante).
  `ddlUS_POC_ADDR_STATE` reutiliza el catálogo de 57 estados de `Travel`.
- **Resuelto en Spouse:** el `pendiente` `direccionConyugeOtro`, como grupo
  de 7 controles (`tbxSPOUSE_ADDR_LN1/LN2/CITY/STATE/POSTAL_CD`,
  `ddlSPOUSE_ADDR_CNTRY` de 253 opciones, más 2 checkboxes "Does Not
  Apply"), visible solo si `ddlSpouseAddressType = O`. Se resuelve también
  el `_verificar` pendiente de esa pantalla: el valor "igual que la del
  solicitante" es `"H"`, no `""`. `ddlSpouseNatDropDownList` (213 opciones)
  quedó volcado y diffeado: es el catálogo de nacionalidad del solicitante
  (212) **más Estados Unidos**.
- **Resueltos en WorkEducation1:** ninguno. El único `pendiente` de la
  pantalla, `cargoActual`, **no tiene control**: el DS-160 no pregunta el
  cargo actual en ninguna parte. El único campo de puesto del formulario es
  `dtlPrevEmpl_ctl00_tbJobTitle`, y corresponde al empleo *anterior*
  (`WorkEducation2`). Hay que eliminar la variable o volcarla dentro de
  `tbxDescribeDuties`. Se confirma que `ddlPresentOccupation` dispara
  postback real (`_verificar` resuelto) y que la pantalla es fuertemente
  condicional: con `H` (HOMEMAKER) o `RT` (RETIRED) **no existe ninguno** de
  los 10 campos que el mapeo declara como fijos, y con `N` (NOT EMPLOYED)
  tampoco. Catálogo nuevo `ddlPresentOccupation` (23 opciones), volcado.
- **Resueltos en WorkEducation2:** los 12 `pendientes` de la pantalla
  (`empleadorAnterior`, `cargoAnterior`, `direccionTrabajoAnterior`,
  `ciudadTrabajoAnterior`, `provinciaTrabajoAnterior`,
  `codigoPostalTrabajoAnterior`, `telefonoTrabajoAnterior`,
  `nombreSupervisorAnterior`, `apellidosSupervisorAnterior`,
  `descripcionTrabajoAnterior`, `fechaInicioTrabajoAnterior`,
  `fechaFinTrabajoAnterior`), todos en el repetidor `dtlPrevEmpl_ctl00_`.
  **Además se resuelven aquí 8 de los 10 `pendientes` que el mapeo declara
  en WorkEducation3**, porque el bloque educativo (`dtlPrevEduc`) está en
  esta pantalla, no en la siguiente. `rblOtherEduc` también está aquí:
  el mapeo lo ubica mal. `_verificar` resuelto: `rblPreviouslyEmployed` y
  `rblOtherEduc` disparan postback real.
- **Resueltos en WorkEducation3:** ninguno de los 10 `pendientes` que el
  mapeo le asigna, porque **están todos en la pantalla equivocada** (ver
  arriba). De esos 10, `institucionBachillerato` y `telefonoEducacion` no
  tienen control en ninguna pantalla: el DS-160 usa un único repetidor para
  toda la educación secundaria y superior (no distingue bachillerato de
  universidad, son filas distintas del mismo repetidor) y no pide teléfono
  de la institución. Sí se confirman `idiomas` →
  `dtlLANGUAGES_ctl00_tbxLANGUAGE_NAME` (incondicional) e `historialViajes`
  → `rblCOUNTRIES_VISITED_IND`, aunque el país visitado en sí
  (`dtlCountriesVisited_ctl00_ddlCOUNTRIES_VISITED`) queda sin variable.
  La pantalla trae **seis bloques enteros sin modelar**: clan/tribu,
  organizaciones, habilidades especializadas, servicio militar (11 campos),
  grupos insurgentes y el país visitado.
- **Resueltos en SecurityandBackground1-5: ninguno.** Las cinco pantallas
  declaran `"pendientes": []` en `mapeo_ds160_1.json`, así que no había nada
  que resolver. Lo que aparece es lo contrario: **62 controles relevados (31
  radios + 31 textarea) contra 4 campos mapeados**. Solo
  `SecurityandBackground1` y `SecurityandBackground3` tienen `campos`
  declarados, y los de la 3 están en la pantalla equivocada. Las pantallas 2,
  4 y 5 tienen `"campos": []`. Faltan **29 pares indicador+explicación** en el
  modelo de datos:
  - **SB1 (2 pares nuevos):** `rblDisorder`/`tbxDisorder`,
    `rblDruguser`/`tbxDruguser`.
  - **SB2 (7 pares, pantalla entera):** `rblArrested`,
    `rblControlledSubstances`, `rblProstitution`, `rblMoneyLaundering`,
    `rblHumanTrafficking`, `rblAssistedSevereTrafficking`,
    `rblHumanTraffickingRelated`.
  - **SB3 (12 pares, pantalla entera):** `rblIllegalActivity`,
    `rblTerroristActivity`, `rblTerroristSupport`, `rblTerroristOrg`,
    `rblTerroristRel`, `rblGenocide`, `rblTorture`, `rblExViolence`,
    `rblChildSoldier`, `rblReligiousFreedom`, `rblPopulationControls`,
    `rblTransplant`.
  - **SB4 (4 pares nuevos):** `rblRemovalHearing`, `rblImmigrationFraud`,
    `rblFailToAttend`, `rblVisaViolation`.
  - **SB5 (4 pares, pantalla entera):** `rblChildCustody`,
    `rblVotingViolation`, `rblRenounceExp`, `rblAttWoReimb`.
- **Segundo caso de pantalla equivocada en el mapeo:** `rblDeport` y
  `tbxDeport_EXPL` (variables `deportadoDePais` y `detallesDeportacion`)
  están declarados en `SecurityandBackground3` y viven en
  **`SecurityandBackground4`**. Los ids son correctos; el `node`/`url` no.
  Mismo error que `rblOtherEduc`, declarado en `WorkEducation3` y ubicado en
  `WorkEducation2`.
- **Dos `_verificar` desmentidos en esta sección:** el mapeo marca `rblDisease`
  y `rblDeport` con `disparaPostback: true`. **Ninguno de los dos dispara
  postback**; sus textarea ya están en el DOM y solo cambian de visibilidad.
- **Convención de ids de Security and Background:** cada pregunta es un par
  `rbl<Nombre>` + `tbx<Nombre>`, con el textarea de `maxLength = 4000` ya
  presente en el DOM. **Dos excepciones**, ambas relevantes para el código que
  genere ids: `tbxDeport_EXPL` (lleva sufijo `_EXPL`) y `tbxAttWoReimb` (no
  existe en el DOM hasta marcar "Yes").
- **`rblAttWoReimb` es el único condicional real de las cinco pantallas.** La
  app tiene que marcar "Yes", esperar el postback asíncrono y recién entonces
  escribir en `tbxAttWoReimb`. En los otros 30 pares el textarea se puede
  llenar sin tocar el radio.
- **`disparaPostback` mixto dentro de una misma pantalla, confirmado otra
  vez.** En `WorkEducation3`, `rblCLAN_TRIBE_IND`,
  `rblCOUNTRIES_VISITED_IND`, `rblORGANIZATION_IND` y
  `rblMILITARY_SERVICE_IND` recargan de verdad, mientras que
  `rblSPECIALIZED_SKILLS_IND` y `rblINSURGENT_ORG_IND` solo cambian
  visibilidad por CSS con el textarea ya presente en el DOM. Mismo patrón
  que en `PreviousUSTravel` y que en `SecurityandBackground5`
  (`rblAttWoReimb` sí, los otros tres no).
- **Trampa nueva de nomenclatura:** `dtlPrevEmpl_ctl00_DropDownList2` es el
  país del empleador anterior. Lleva el id autogenerado por ASP.NET, sin
  `CNTRY`, sin `Country`, sin nada buscable. Ningún filtro por nombre lo
  encuentra. Es el caso más extremo de la trampa "filtros por nombre de id".
- **Los cuatro catálogos de "relación" no son intercambiables** (tabla en la
  sección de catálogos). El código que traduzca una relación del modelo de
  datos al DS-160 tiene que elegir el catálogo por campo, no por concepto:
  `F` significa FRIEND en tres de ellos y FIANCÉ en `ddlUS_REL_TYPE`, y `B`
  significa BUSINESS ASSOCIATE en uno y SIBLING en otro.
- **Nota de método:** en `WorkEducation1-3` cada postback **borra los
  globales de `window`**, así que el patrón `window.__antes` de la sección 5
  del método no sobrevive al clic. Se resolvió persistiendo el extractor y
  los snapshots en `sessionStorage` y reinyectándolo con `eval` tras cada
  recarga. `sessionStorage` es por pestaña: al abrir una pestaña nueva hay
  que reinyectar el extractor desde cero. En `SecurityandBackground5` se
  comprobó que **no todos los postbacks se comportan así**: el de
  `rblAttWoReimb` es asíncrono (ASP.NET AJAX) y los globales sobreviven. El
  truco de `sessionStorage` sigue siendo la opción segura porque cubre los dos
  casos.
- **Nota de método (nueva):** el campo `postback` del extractor lee el atributo
  del input `_0` del grupo. ASP.NET solo pone `__doPostBack` en la opción que
  cambiaría el estado visible, así que **un radio ya respondido "Yes" reporta
  `postback=false` aunque sí dispare postback**. Verificado en
  `rblAttWoReimb`. Para un veredicto fiable: leer los dos inputs del grupo, o
  diffear el DOM tras el clic.
- **Nota de método (2026-09-03):** al volcar catálogos condicionales sobre la
  solicitud de pruebas hay que **restaurar el estado original** de los radios
  y selects que se tocaron (`rblSpecificTravel`, `ddlWhoIsPaying`,
  `rblFATHER/MOTHER_LIVE_IN_US_IND`, `rblUS_IMMED_RELATIVE_IND`,
  `rblMILITARY_SERVICE_IND`), porque cada postback envía el formulario al
  servidor y puede modificar los datos guardados de la solicitud.