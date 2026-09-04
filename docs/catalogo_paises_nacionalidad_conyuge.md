# Catálogo de países — Nacionalidad del cónyuge (`ddlSpouseNatDropDownList`)

**Campos que lo usan** (ambos con exactamente las mismas 213 opciones,
verificado valor por valor):

| id completo | Pantalla | Variable del mapeo |
|---|---|---|
| `ctl00_SiteContentPlaceHolder_FormView1_ddlSpouseNatDropDownList` | `Spouse` | `nacionalidadConyuge` |
| `ctl00_SiteContentPlaceHolder_FormView1_dtlMILITARY_SERVICE_ctl0N_ddlMILITARY_SVC_CNTRY` | `WorkEducation3` | (sin variable — servicio militar) |

**Condición para verlo:** la pantalla `Spouse` solo existe si
`ddlAPP_MARITAL_STATUS` = `M` (u otro estado con cónyuge). El select de
servicio militar requiere `rblMILITARY_SERVICE_IND = Y`.

213 opciones (incluye el placeholder). **Diff resuelto contra `ddlAPP_NATL`
(212 opciones):** las dos listas son idénticas salvo por una sola entrada,
`USA|UNITED STATES OF AMERICA`, insertada entre `GRBR` (UNITED KINGDOM) y
`URU` (URUGUAY). Es decir: nacionalidad del solicitante = 212 (sin EE. UU.),
nacionalidad del cónyuge y país de servicio militar = 212 + EE. UU. = 213.

Formato: `value|texto en inglés (DS-160)|traducción al español`.

```
|- Select One -|(sin seleccionar)
AFGH|AFGHANISTAN|Afganistán
ALB|ALBANIA|Albania
ALGR|ALGERIA|Argelia
ANDO|ANDORRA|Andorra
ANGL|ANGOLA|Angola
ANGU|ANGUILLA|Anguila
ANTI|ANTIGUA AND BARBUDA|Antigua y Barbuda
ARG|ARGENTINA|Argentina
ARM|ARMENIA|Armenia
ASTL|AUSTRALIA|Australia
AUST|AUSTRIA|Austria
AZR|AZERBAIJAN|Azerbaiyán
BAMA|BAHAMAS|Bahamas
BAHR|BAHRAIN|Baréin
BANG|BANGLADESH|Bangladés
BRDO|BARBADOS|Barbados
BYS|BELARUS|Bielorrusia
BELG|BELGIUM|Bélgica
BLZ|BELIZE|Belice
BENN|BENIN|Benín
BERM|BERMUDA|Bermudas
BHU|BHUTAN|Bután
BOL|BOLIVIA|Bolivia
BIH|BOSNIA-HERZEGOVINA|Bosnia y Herzegovina
BOT|BOTSWANA|Botsuana
BRZL|BRAZIL|Brasil
BRNI|BRUNEI|Brunéi
BULG|BULGARIA|Bulgaria
BURK|BURKINA FASO|Burkina Faso
BURM|BURMA|Birmania (Myanmar)
BRND|BURUNDI|Burundi
CBDA|CAMBODIA|Camboya
CMRN|CAMEROON|Camerún
CAN|CANADA|Canadá
CAVI|CABO VERDE|Cabo Verde
CAYI|CAYMAN ISLANDS|Islas Caimán
CAFR|CENTRAL AFRICAN REPUBLIC|República Centroafricana
CHAD|CHAD|Chad
CHIL|CHILE|Chile
CHIN|CHINA|China
COL|COLOMBIA|Colombia
COMO|COMOROS|Comoras
COD|CONGO, DEMOCRATIC REPUBLIC OF THE|Congo, República Democrática del
CONB|CONGO, REPUBLIC OF THE|Congo, República del
CSTR|COSTA RICA|Costa Rica
IVCO|COTE D`IVOIRE|Costa de Marfil
HRV|CROATIA|Croacia
CUBA|CUBA|Cuba
CYPR|CYPRUS|Chipre
CZEC|CZECH REPUBLIC|República Checa
DEN|DENMARK|Dinamarca
DJI|DJIBOUTI|Yibuti
DOMN|DOMINICA|Dominica
DOMR|DOMINICAN REPUBLIC|República Dominicana
ECUA|ECUADOR|Ecuador
EGYP|EGYPT|Egipto
ELSL|EL SALVADOR|El Salvador
EGN|EQUATORIAL GUINEA|Guinea Ecuatorial
ERI|ERITREA|Eritrea
EST|ESTONIA|Estonia
SZLD|ESWATINI|Esuatini
ETH|ETHIOPIA|Etiopía
FIJI|FIJI|Fiyi
FIN|FINLAND|Finlandia
FRAN|FRANCE|Francia
GABN|GABON|Gabón
GAM|GAMBIA, THE|Gambia
GEO|GEORGIA|Georgia
GER|GERMANY|Alemania
GHAN|GHANA|Ghana
GIB|GIBRALTAR|Gibraltar
GRC|GREECE|Grecia
GREN|GRENADA|Granada
GUAT|GUATEMALA|Guatemala
GNEA|GUINEA|Guinea
GUIB|GUINEA - BISSAU|Guinea-Bisáu
GUY|GUYANA|Guyana
HAT|HAITI|Haití
VAT|HOLY SEE (VATICAN CITY)|Santa Sede (Ciudad del Vaticano)
HOND|HONDURAS|Honduras
HOKO|HONG KONG BNO|Hong Kong BNO
HNK|HONG KONG SAR|Hong Kong RAE
HUNG|HUNGARY|Hungría
ICLD|ICELAND|Islandia
IND|INDIA|India
IDSA|INDONESIA|Indonesia
IRAN|IRAN|Irán
IRAQ|IRAQ|Irak
IRE|IRELAND|Irlanda
ISRL|ISRAEL|Israel
ITLY|ITALY|Italia
JAM|JAMAICA|Jamaica
JPN|JAPAN|Japón
JORD|JORDAN|Jordania
KAZ|KAZAKHSTAN|Kazajistán
KENY|KENYA|Kenia
KIRI|KIRIBATI|Kiribati
PRK|KOREA, DEMOCRATIC REPUBLIC OF (NORTH)|Corea del Norte
KOR|KOREA, REPUBLIC OF (SOUTH)|Corea del Sur
KSV|KOSOVO|Kosovo
KUWT|KUWAIT|Kuwait
KGZ|KYRGYZSTAN|Kirguistán
LAOS|LAOS|Laos
LATV|LATVIA|Letonia
LEBN|LEBANON|Líbano
LES|LESOTHO|Lesoto
LIBR|LIBERIA|Liberia
LBYA|LIBYA|Libia
LCHT|LIECHTENSTEIN|Liechtenstein
LITH|LITHUANIA|Lituania
LXM|LUXEMBOURG|Luxemburgo
MAC|MACAU|Macao
MKD|MACEDONIA, NORTH|Macedonia del Norte
MADG|MADAGASCAR|Madagascar
MALW|MALAWI|Malaui
MLAS|MALAYSIA|Malasia
MLDV|MALDIVES|Maldivas
MALI|MALI|Malí
MLTA|MALTA|Malta
RMI|MARSHALL ISLANDS|Islas Marshall
MAUR|MAURITANIA|Mauritania
MRTS|MAURITIUS|Mauricio
MEX|MEXICO|México
FSM|MICRONESIA|Micronesia
MLD|MOLDOVA|Moldavia
MON|MONACO|Mónaco
MONG|MONGOLIA|Mongolia
MTG|MONTENEGRO|Montenegro
MONT|MONTSERRAT|Montserrat
MORO|MOROCCO|Marruecos
MOZ|MOZAMBIQUE|Mozambique
NAMB|NAMIBIA|Namibia
NAU|NAURU|Nauru
NEP|NEPAL|Nepal
NETH|NETHERLANDS|Países Bajos
NZLD|NEW ZEALAND|Nueva Zelanda
NIC|NICARAGUA|Nicaragua
NIR|NIGER|Níger
NRA|NIGERIA|Nigeria
NORW|NORWAY|Noruega
OMAN|OMAN|Omán
PKST|PAKISTAN|Pakistán
PALA|PALAU|Palaos
PAL|PALESTINIAN AUTHORITY|Autoridad Palestina
PAN|PANAMA|Panamá
PNG|PAPUA NEW GUINEA|Papúa Nueva Guinea
PARA|PARAGUAY|Paraguay
PERU|PERU|Perú
PHIL|PHILIPPINES|Filipinas
PITC|PITCAIRN ISLANDS|Islas Pitcairn
POL|POLAND|Polonia
PORT|PORTUGAL|Portugal
QTAR|QATAR|Catar
ROM|ROMANIA|Rumania
RUS|RUSSIA|Rusia
RWND|RWANDA|Ruanda
WSAM|SAMOA|Samoa
SMAR|SAN MARINO|San Marino
STPR|SAO TOME AND PRINCIPE|Santo Tomé y Príncipe
SARB|SAUDI ARABIA|Arabia Saudita
SENG|SENEGAL|Senegal
SBA|SERBIA|Serbia
SEYC|SEYCHELLES|Seychelles
SLEO|SIERRA LEONE|Sierra Leona
SING|SINGAPORE|Singapur
SVK|SLOVAKIA|Eslovaquia
SVN|SLOVENIA|Eslovenia
SLMN|SOLOMON ISLANDS|Islas Salomón
SOMA|SOMALIA|Somalia
SAFR|SOUTH AFRICA|Sudáfrica
SSDN|SOUTH SUDAN|Sudán del Sur
SPN|SPAIN|España
SRL|SRI LANKA|Sri Lanka
SHEL|ST. HELENA|Santa Elena
STCN|ST. KITTS AND NEVIS|San Cristóbal y Nieves
SLCA|ST. LUCIA|Santa Lucía
STVN|ST. VINCENT AND THE GRENADINES|San Vicente y las Granadinas
XXX|STATELESS|Apátrida
SUDA|SUDAN|Sudán
SURM|SURINAME|Surinam
SWDN|SWEDEN|Suecia
SWTZ|SWITZERLAND|Suiza
SYR|SYRIA|Siria
TWAN|TAIWAN|Taiwán
TJK|TAJIKISTAN|Tayikistán
TAZN|TANZANIA|Tanzania
THAI|THAILAND|Tailandia
TMOR|TIMOR-LESTE|Timor Oriental
TOGO|TOGO|Togo
TONG|TONGA|Tonga
TRIN|TRINIDAD AND TOBAGO|Trinidad y Tobago
TNSA|TUNISIA|Túnez
TRKY|TURKEY|Turquía
TKM|TURKMENISTAN|Turkmenistán
TCIS|TURKS AND CAICOS ISLANDS|Islas Turcas y Caicos
TUV|TUVALU|Tuvalu
UGAN|UGANDA|Uganda
UKR|UKRAINE|Ucrania
UAE|UNITED ARAB EMIRATES|Emiratos Árabes Unidos
GRBR|UNITED KINGDOM|Reino Unido
USA|UNITED STATES OF AMERICA|Estados Unidos de América
URU|URUGUAY|Uruguay
UZB|UZBEKISTAN|Uzbekistán
VANU|VANUATU|Vanuatu
VENZ|VENEZUELA|Venezuela
VTNM|VIETNAM|Vietnam
BRVI|VIRGIN ISLANDS, BRITISH|Islas Vírgenes Británicas
WAFT|WALLIS AND FUTUNA ISLANDS|Wallis y Futuna
SSAH|WESTERN SAHARA|Sahara Occidental
YEM|YEMEN|Yemen
ZAMB|ZAMBIA|Zambia
ZIMB|ZIMBABWE|Zimbabue
```

**Nota:** el texto de `IVCO` contiene un acento grave (`` ` ``) en el DS-160
("COTE D`IVOIRE"), no un apóstrofo normal — se transcribe tal cual aparece en
el HTML.
