# Catálogo — Categoría del propósito de viaje (`ddlPurposeOfTrip`)
 
**Campo:** `ctl00_SiteContentPlaceHolder_FormView1_dlPrincipalAppTravel_ctl00_ddlPurposeOfTrip`
— pantalla `Travel` ("Purpose of Trip to the U.S."). Mapeado en
`mapeo_ds160_1.json` a la variable `categoriaMotivoViaje`. Dispara postback:
al cambiar recarga la página y determina las opciones de
`ddlOtherPurpose` (ver `catalogo_proposito_viaje_especifico.md`).
 
26 opciones (incluye el placeholder). Formato:
`value|texto en inglés (DS-160)|traducción al español`.
 
```
|PLEASE SELECT A VISA CLASS|(sin seleccionar)
A|FOREIGN GOVERNMENT OFFICIAL (A)|Funcionario de gobierno extranjero (A)
B|TEMP. BUSINESS OR PLEASURE VISITOR (B)|Visitante temporal de negocios o placer (B)
C|ALIEN IN TRANSIT (C)|Extranjero en tránsito (C)
CNMI|CNMI WORKER OR INVESTOR (CW/E2C)|Trabajador o inversionista de las CNMI (CW/E2C)
D|CREWMEMBER (D)|Tripulante (D)
E|TREATY TRADER OR INVESTOR (E)|Comerciante o inversionista por tratado (E)
F|ACADEMIC OR LANGUAGE STUDENT (F)|Estudiante académico o de idiomas (F)
G|INTERNATIONAL ORGANIZATION REP./EMP. (G)|Representante/empleado de organización internacional (G)
H|TEMPORARY WORKER (H)|Trabajador temporal (H)
I|FOREIGN MEDIA REPRESENTATIVE (I)|Representante de medios extranjeros (I)
J|EXCHANGE VISITOR (J)|Visitante de intercambio (J)
K|FIANCÉ(E) OR SPOUSE OF A U.S. CITIZEN (K)|Prometido(a) o cónyuge de ciudadano estadounidense (K)
L|INTRACOMPANY TRANSFEREE (L)|Transferido dentro de la misma empresa (L)
M|VOCATIONAL/NONACADEMIC STUDENT (M)|Estudiante vocacional/no académico (M)
N|OTHER (N)|Otro (N)
NATO|NATO STAFF (NATO)|Personal de la OTAN (NATO)
O|ALIEN WITH EXTRAORDINARY ABILITY (O)|Extranjero con habilidad extraordinaria (O)
P|INTERNATIONALLY RECOGNIZED ALIEN (P)|Extranjero internacionalmente reconocido (P)
Q|CULTURAL EXCHANGE VISITOR (Q)|Visitante de intercambio cultural (Q)
R|RELIGIOUS WORKER (R)|Trabajador religioso (R)
S|INFORMANT OR WITNESS (S)|Informante o testigo (S)
T|VICTIM OF TRAFFICKING (T)|Víctima de trata de personas (T)
TD/TN|NAFTA PROFESSIONAL (TD/TN)|Profesional del TLCAN (TD/TN)
U|VICTIM OF CRIMINAL ACTIVITY (U)|Víctima de actividad criminal (U)
PAROLE-BEN|PAROLE BENEFICIARY (PARCIS)|Beneficiario de libertad condicional humanitaria (PARCIS)
```
 
El catálogo anidado dependiente (`ddlOtherPurpose`, propósito específico
por cada una de estas 26 categorías) está en
`catalogo_proposito_viaje_especifico.md`.