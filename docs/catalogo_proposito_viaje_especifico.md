# Catálogo anidado — Propósito específico del viaje (`ddlOtherPurpose`)
 
**Campo:** `ctl00_SiteContentPlaceHolder_FormView1_dlPrincipalAppTravel_ctl00_ddlOtherPurpose`
— pantalla `Travel`. Depende de `ddlPurposeOfTrip` (ver
`catalogo_proposito_viaje.md`): al cambiar el padre, el campo dispara un
postback y recarga las opciones de este select hijo. No tiene variable
propia asignada en `mapeo_ds160_1.json` todavía — es el detalle específico
dentro de cada categoría de `categoriaMotivoViaje`.
 
Construido recorriendo programáticamente los 25 valores reales de
`ddlPurposeOfTrip` (se excluye el placeholder `-- PLEASE SELECT A VISA
CLASS --`, que no dispara opciones hijas). Formato por línea:
`value|texto en inglés (DS-160)|traducción al español`. El option
placeholder de cada hijo (`|PLEASE SELECT|(sin seleccionar)`) se omite en
cada bloque salvo indicación.
 
---
 
## B — TEMP. BUSINESS OR PLEASURE VISITOR (B)
 
```
B1-B2|BUSINESS OR TOURISM (TEMPORARY VISITOR) (B1/B2)|Negocios o turismo (visitante temporal) (B1/B2)
B1-CF|BUSINESS/CONFERENCE (B1)|Negocios/conferencia (B1)
B2-TM|TOURISM/MEDICAL TREATMENT (B2)|Turismo/tratamiento médico (B2)
```
 
## A — FOREIGN GOVERNMENT OFFICIAL (A)
 
```
A1-AM|AMBASSADOR OR PUBLIC MINISTER (A1)|Embajador o ministro público (A1)
A1-CH|CHILD OF AN A1 (A1)|Hijo/hija de un A1 (A1)
A1-DP|CAREER DIPLOMAT/CONSULAR OFFICER (A1)|Diplomático de carrera/funcionario consular (A1)
A1-SP|SPOUSE OF AN A1 (A1)|Cónyuge de un A1 (A1)
A2-CH|CHILD OF AN A2 (A2)|Hijo/hija de un A2 (A2)
A2-EM|FOREIGN OFFICIAL/EMPLOYEE (A2)|Funcionario/empleado extranjero (A2)
A2-SP|SPOUSE OF AN A2 (A2)|Cónyuge de un A2 (A2)
A3-CH|CHILD OF AN A3 (A3)|Hijo/hija de un A3 (A3)
A3-EM|PERSONAL EMP. OF AN A1 OR A2 (A3)|Empleado personal de un A1 o A2 (A3)
A3-SP|SPOUSE OF AN A3 (A3)|Cónyuge de un A3 (A3)
```
 
## C — ALIEN IN TRANSIT (C)
 
```
C1-D|CREWMEMBER IN TRANSIT (C1/D)|Tripulante en tránsito (C1/D)
C1-TR|TRANSIT (C1)|Tránsito (C1)
C2-UN|TRANSIT TO U.N. HEADQUARTERS (C2)|Tránsito a la sede de la ONU (C2)
C3-CH|CHILD OF A C3 (C3)|Hijo/hija de un C3 (C3)
C3-EM|PERSONAL EMP. OF A C3 (C3)|Empleado personal de un C3 (C3)
C3-FR|FOREIGN OFFICIAL IN TRANSIT (C3)|Funcionario extranjero en tránsito (C3)
C3-SP|SPOUSE OF A C3 (C3)|Cónyuge de un C3 (C3)
C4-NO|NONCITIZEN IN TRANSIT LIGHTERING OP. (C4)|No ciudadano en tránsito, operación de aligeramiento (C4)
C4-D3|LIGHTERING CREWMEMBER IN TRANSIT (C4/D3)|Tripulante de aligeramiento en tránsito (C4/D3)
```
 
## CNMI — CNMI WORKER OR INVESTOR (CW/E2C)
 
```
CW1-CW1|CNMI TEMPORARY WORKER (CW1)|Trabajador temporal de las CNMI (CW1)
CW2-CH|CHILD OF CW1 (CW2)|Hijo/hija de un CW1 (CW2)
CW2-SP|SPOUSE OF CW1 (CW2)|Cónyuge de un CW1 (CW2)
E2C-E2C|CNMI LONG TERM INVESTOR (E2C)|Inversionista de largo plazo de las CNMI (E2C)
```
 
## D — CREWMEMBER (D)
 
```
D-D|CREWMEMBER (D)|Tripulante (D)
D3-LI|LIGHTERING CREWMEMBER (D3)|Tripulante de aligeramiento (D3)
```
 
## E — TREATY TRADER OR INVESTOR (E)
 
```
E1-CH|CHILD OF AN E1 (E1)|Hijo/hija de un E1 (E1)
E1-EX|EXECUTIVE/MGR/ESSENTIAL EMP (E1)|Ejecutivo/gerente/empleado esencial (E1)
E1-SP|SPOUSE OF AN E1 (E1)|Cónyuge de un E1 (E1)
E1-TR|TREATY TRADER (E1)|Comerciante por tratado (E1)
E2-CH|CHILD OF AN E2 (E2)|Hijo/hija de un E2 (E2)
E2-EX|EXECUTIVE/MGR/ESSENTIAL EMP (E2)|Ejecutivo/gerente/empleado esencial (E2)
E2-SP|SPOUSE OF AN E2 (E2)|Cónyuge de un E2 (E2)
E2-TR|TREATY INVESTOR (E2)|Inversionista por tratado (E2)
E3D-CH|CHILD OF AN E3 (E3D)|Hijo/hija de un E3 (E3D)
E3D-SP|SPOUSE OF AN E3 (E3D)|Cónyuge de un E3 (E3D)
```
 
## F — ACADEMIC OR LANGUAGE STUDENT (F)
 
```
F1-F1|STUDENT (F1)|Estudiante (F1)
F2-CH|CHILD OF AN F1 (F2)|Hijo/hija de un F1 (F2)
F2-SP|SPOUSE OF AN F1 (F2)|Cónyuge de un F1 (F2)
```
 
## G — INTERNATIONAL ORGANIZATION REP./EMP. (G)
 
```
G1-CH|CHILD OF A G1 (G1)|Hijo/hija de un G1 (G1)
G1-G1|PRINCIPAL REPRESENTATIVE (G1)|Representante principal (G1)
G1-SP|SPOUSE OF A G1 (G1)|Cónyuge de un G1 (G1)
G1-ST|STAFF OF PRINCIPAL REPRESENTATIVE (G1)|Personal del representante principal (G1)
G2-CH|CHILD OF A G2 (G2)|Hijo/hija de un G2 (G2)
G2-RP|REPRESENTATIVE (G2)|Representante (G2)
G2-SP|SPOUSE OF A G2 (G2)|Cónyuge de un G2 (G2)
G3-CH|CHILD OF A G3 (G3)|Hijo/hija de un G3 (G3)
G3-RP|NON-RECOGNIZED/-MEMBER COUNTRY REP(G3)|Representante de país no reconocido/no miembro (G3)
G3-SP|SPOUSE OF A G3 (G3)|Cónyuge de un G3 (G3)
G4-CH|CHILD OF AN G4 (G4)|Hijo/hija de un G4 (G4)
G4-G4|INTERNATIONAL ORG. EMPLOYEE (G4)|Empleado de organización internacional (G4)
G4-SP|SPOUSE OF A G4 (G4)|Cónyuge de un G4 (G4)
G5-CH|CHILD OF A G5 (G5)|Hijo/hija de un G5 (G5)
G5-EM|PERSONAL EMP. OF A G1, 2, 3, OR 4 (G5)|Empleado personal de un G1, 2, 3 o 4 (G5)
G5-SP|SPOUSE OF A G5 (G5)|Cónyuge de un G5 (G5)
```
 
## H — TEMPORARY WORKER (H)
 
```
H1B-H1B|SPECIALTY OCCUPATION (H1B)|Ocupación especializada (H1B)
H1B1-CHL|CHILEAN SPEC. OCCUPATION (H1B1)|Ocupación especializada chilena (H1B1)
H1B1-SGP|SINGAPOREAN SPEC. OCCUPATION (H1B1)|Ocupación especializada singapurense (H1B1)
H1C-NR|NURSE IN SHORTAGE AREA (H1C)|Enfermero/a en área con escasez de personal (H1C)
H2A-AG|AGRICULTURAL WORKER (H2A)|Trabajador agrícola (H2A)
H2B-NA|NONAGRICULTURAL WORKER (H2B)|Trabajador no agrícola (H2B)
H3-TR|TRAINEE (H3)|Aprendiz/capacitando (H3)
H4-CH|CHILD OF AN H (H4)|Hijo/hija de un H (H4)
H4-SP|SPOUSE OF AN H (H4)|Cónyuge de un H (H4)
```
 
## I — FOREIGN MEDIA REPRESENTATIVE (I)
 
```
I-CH|CHILD OF AN I (I)|Hijo/hija de un I (I)
I-FR|FOREIGN MEDIA REPRESENTATIVE (I)|Representante de medios extranjeros (I)
I-SP|SPOUSE OF AN I (I)|Cónyuge de un I (I)
```
 
## J — EXCHANGE VISITOR (J)
 
```
J1-J1|EXCHANGE VISITOR (J1)|Visitante de intercambio (J1)
J2-CH|CHILD OF A J1 (J2)|Hijo/hija de un J1 (J2)
J2-SP|SPOUSE OF A J1 (J2)|Cónyuge de un J1 (J2)
```
 
## K — FIANCÉ(E) OR SPOUSE OF A U.S. CITIZEN (K)
 
```
K1-K1|FIANCÉ(E) OF A U.S. CITIZEN (K1)|Prometido(a) de ciudadano estadounidense (K1)
K2-K2|CHILD OF A K1 (K2)|Hijo/hija de un K1 (K2)
K3-K3|SPOUSE OF A U.S. CITIZEN (K3)|Cónyuge de ciudadano estadounidense (K3)
K4-K4|CHILD OF A K3 (K4)|Hijo/hija de un K3 (K4)
```
 
## L — INTRACOMPANY TRANSFEREE (L)
 
```
L1-L1|INTRACOMPANY TRANSFEREE (L1)|Transferido dentro de la misma empresa (L1)
L2-CH|CHILD OF A L1 (L2)|Hijo/hija de un L1 (L2)
L2-SP|SPOUSE OF A L1 (L2)|Cónyuge de un L1 (L2)
```
 
## M — VOCATIONAL/NONACADEMIC STUDENT (M)
 
```
M1-M1|STUDENT (M1)|Estudiante (M1)
M2-CH|CHILD OF M1 (M2)|Hijo/hija de un M1 (M2)
M2-SP|SPOUSE OF M1 (M2)|Cónyuge de un M1 (M2)
M3-M3|COMMUTER STUDENT (M3)|Estudiante fronterizo/conmutante (M3)
```
 
## N — OTHER (N)
 
```
N8-CH|CHILD OF A N8 (N9)|Hijo/hija de un N8 (N9)
N8-N8|PARENT OF CERTAIN SPECIAL IMMIGRANT (N8)|Padre/madre de cierto inmigrante especial (N8)
```
 
**Nota:** la etiqueta de `N8-CH` viene tal cual del DS-160, con
inconsistencia propia del formulario entre el código del hijo (`N8-CH`) y
el código entre paréntesis del texto (`N9`); no es un error de esta
captura.
 
## NATO — NATO STAFF (NATO)
 
```
NATO1-CH|CHILD OF NATO 1 (NATO1)|Hijo/hija de NATO1 (NATO1)
NATO1-PR|PRINCIPAL REPRESENTATIVE (NATO1)|Representante principal (NATO1)
NATO1-SP|SPOUSE OF NATO1 (NATO1)|Cónyuge de NATO1 (NATO1)
NATO2-CH|CHILD OF NATO2 (NATO2)|Hijo/hija de NATO2 (NATO2)
NATO2-RP|REPRESENTATIVE (NATO2)|Representante (NATO2)
NATO2-SP|SPOUSE OF NATO2 (NATO2)|Cónyuge de NATO2 (NATO2)
NATO3-CH|CHILD OF NATO3 (NATO3)|Hijo/hija de NATO3 (NATO3)
NATO3-SP|SPOUSE OF NATO3 (NATO3)|Cónyuge de NATO3 (NATO3)
NATO3-ST|CLERICAL STAFF (NATO3)|Personal administrativo/de oficina (NATO3)
NATO4-CH|CHILD OF NATO4 (NATO4)|Hijo/hija de NATO4 (NATO4)
NATO4-OF|OFFICIAL (NATO4)|Funcionario (NATO4)
NATO4-SP|SPOUSE OF NATO4 (NATO4)|Cónyuge de NATO4 (NATO4)
NATO5-CH|CHILD OF NATO5 (NATO5)|Hijo/hija de NATO5 (NATO5)
NATO5-EX|EXPERT (NATO5)|Experto (NATO5)
NATO5-SP|SPOUSE OF NATO5 (NATO5)|Cónyuge de NATO5 (NATO5)
NATO6-CH|CHILD OF NATO6 (NATO6)|Hijo/hija de NATO6 (NATO6)
NATO6-SP|SPOUSE OF NATO6 (NATO6)|Cónyuge de NATO6 (NATO6)
NATO6-ST|CIVILIAN STAFF (NATO6)|Personal civil (NATO6)
NATO7-CH|CHILD OF NATO7 (NATO7)|Hijo/hija de NATO7 (NATO7)
NATO7-EM|PERSONAL EMP. OF NATO1-NATO6 (NATO7)|Empleado personal de NATO1 a NATO6 (NATO7)
NATO7-SP|SPOUSE OF NATO7 (NATO7)|Cónyuge de NATO7 (NATO7)
```
 
## O — ALIEN WITH EXTRAORDINARY ABILITY (O)
 
```
O1-EX|EXTRAORDINARY ABILITY (O1)|Habilidad extraordinaria (O1)
O2-AL|ALIEN ACCOMPANYING/ASSISTING (O2)|Extranjero que acompaña/asiste (O2)
O3-CH|CHILD OF O1 OR O2 (O3)|Hijo/hija de un O1 u O2 (O3)
O3-SP|SPOUSE OF O1 OR O2 (O3)|Cónyuge de un O1 u O2 (O3)
```
 
## P — INTERNATIONALLY RECOGNIZED ALIEN (P)
 
```
P1-P1|INTERNATIONALLY RECOGNIZED ALIEN (P1)|Extranjero internacionalmente reconocido (P1)
P2-P2|ARTIST/ENTERTAINER EXCHANGE PROG. (P2)|Artista/animador de programa de intercambio (P2)
P3-P3|ARTIST/ENTERTAINER IN CULTURAL PROG. (P3)|Artista/animador de programa cultural (P3)
P4-CH|CHILD OF P1, P2 OR P3 (P4)|Hijo/hija de un P1, P2 o P3 (P4)
P4-SP|SPOUSE OF P1, P2 OR P3 (P4)|Cónyuge de un P1, P2 o P3 (P4)
```
 
## Q — CULTURAL EXCHANGE VISITOR (Q)
 
```
Q1-Q1|CULTURAL EXCHANGE VISITOR (Q1)|Visitante de intercambio cultural (Q1)
```
 
## R — RELIGIOUS WORKER (R)
 
```
R1-R1|RELIGIOUS WORKER (R1)|Trabajador religioso (R1)
R2-CH|CHILD OF R1 (R2)|Hijo/hija de un R1 (R2)
R2-SP|SPOUSE OF R1 (R2)|Cónyuge de un R1 (R2)
```
 
## S — INFORMANT OR WITNESS (S)
 
```
S7-S7|FAMILY MEMBER OF AN INFORMANT (S7)|Familiar de un informante (S7)
```
 
**Nota:** de las subcategorías S habituales (S5/S6/S7), el DS-160 solo
ofreció `S7` en esta captura; no se descarta que otras dependan de un
factor externo al select (p. ej. tipo de solicitud) no reproducido aquí.
 
## T — VICTIM OF TRAFFICKING (T)
 
```
T1-T1|VICTIM OF TRAFFICKING (T1)|Víctima de trata de personas (T1)
T2-SP|SPOUSE OF T1 (T2)|Cónyuge de un T1 (T2)
T3-CH|CHILD OF T1 (T3)|Hijo/hija de un T1 (T3)
T4-PR|PARENT OF T1 (T4)|Padre/madre de un T1 (T4)
T5-SB|SIBLING OF T1 (T5)|Hermano/hermana de un T1 (T5)
T6-CB|ADULT/MINOR CHILD OF A DERIV BEN OF A T1 (T6)|Hijo/hija adulto o menor de un beneficiario derivado de un T1 (T6)
```
 
## TD/TN — NAFTA PROFESSIONAL (TD/TN)
 
```
TD-CH|CHILD OF TN (TD)|Hijo/hija de un TN (TD)
TD-SP|SPOUSE OF TN (TD)|Cónyuge de un TN (TD)
```
 
**Nota:** el hijo no ofrece una opción propia para el titular `TN`
(profesional TLCAN) — solo para sus dependientes (`TD-CH`, `TD-SP`).
 
## U — VICTIM OF CRIMINAL ACTIVITY (U)
 
```
U1-U1|VICTIM OF CRIME (U1)|Víctima de un delito (U1)
U2-SP|SPOUSE OF U1 (U2)|Cónyuge de un U1 (U2)
U3-CH|CHILD OF U1 (U3)|Hijo/hija de un U1 (U3)
U4-PR|PARENT OF U1 (U4)|Padre/madre de un U1 (U4)
U5-SB|SIBLING OF U1 (U5)|Hermano/hermana de un U1 (U5)
```
 
## PAROLE-BEN — PAROLE BENEFICIARY (PARCIS)
 
```
PRL-PARCIS|PARCIS (USCIS APPROVED PAROLE)|PARCIS (libertad condicional aprobada por USCIS)
```
 
---
 
## Notas generales
 
- Todos los 25 valores reales de `ddlPurposeOfTrip` (más el placeholder,
  que no aplica) fueron recorridos programáticamente
  (`sel.value = X; sel.dispatchEvent(new Event('change', {bubbles:true}))`
  + espera de postback), confirmando el valor efectivamente aplicado en
  cada paso antes de leer las opciones resultantes de `ddlOtherPurpose`.
- El tamaño de cada sub-catálogo es muy variable: desde 1 opción (`Q`, `S`)
  hasta 21 (`NATO`).
- Ningún sub-valor de `ddlOtherPurpose` tiene todavía variable propia en
  `mapeo_ds160_1.json`; se sugiere modelarlo como
  `propositoEspecificoViaje`, dependiente de `categoriaMotivoViaje`.