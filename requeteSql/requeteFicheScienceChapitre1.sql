/*Insertion des fiches pour les cours de physique chimi*/
UPDATE chapters 
SET content = E'## I. La structure de l''atome et de la matière

### 1. Constitution de l''atome
* **L''atome** : Toute la matière qui nous entoure est composée d''atomes. Un atome est constitué d''un **noyau** central (très dense, chargé positivement) autour duquel gravitent des **électrons** (chargés négativement).
* **Neutralité électrique** : Un atome possède autant de charges positives dans son noyau (les protons) que de charges négatives (les électrons). Il est donc électriquement neutre.

### 2. Le numéro atomique
* **Définition (*Z*)** : Il indique le nombre de protons présents dans le noyau de l''atome. Par exemple, l''atome de carbone a pour numéro *Z* = 6.

---

## II. Qu''est-ce qu''un ion ?

### 1. Définition générale
* Un ion est un atome (ou un groupe d''atomes) qui a gagné ou perdu un ou plusieurs électrons.

### 2. Les types d''ions
* **Anion** : Ion chargé **négativement** (l''atome a **gagné** un ou plusieurs électrons). Exemple : l''ion chlorure (Cl⁻).
* **Cation** : Ion chargé **positivement** (l''atome a **perdu** un ou plusieurs électrons). Exemple : l''ion sodium (Na⁺) ou l''ion cuivre (Cu²⁺).

### 3. Test d''identification
* On peut identifier certains ions en solution grâce à des réactions de précipitation (par exemple, l''ajout de soude NaOH permet de détecter l''ion cuivre par la formation d''un précipité bleu).

---

## III. Le pH et l''acidité / basicité des solutions

### 1. L''échelle de pH
* Elle varie de **0 à 14** et permet de mesurer l''acidité ou la basicité d''une solution aqueuse.
  * **Solution acide** : pH < 7 (plus le pH est bas, plus l''acidité est forte). Les solutions acides contiennent des ions hydrogène (H⁺).
  * **Solution neutre** : pH = 7 (l''eau pure par exemple).
  * **Solution basique** : pH > 7 (plus le pH est haut, plus la basicité est forte). Les solutions basiques contiennent des ions hydroxyde (HO⁻).

### 2. Mesure du pH
* On mesure le pH à l''aide d''un **pH-mètre** ou de papier pH (qui change de couleur selon le milieu).

---

## IV. Transformations physiques vs. Transformations chimiques

### 1. Transformation physique
* Modification de l''état de la matière (changement d''état : fusion, solidification, vaporisation) sans modifier la nature des substances. *Aucune nouvelle espèce chimique n''est créée.*

### 2. Transformation chimique
* Processus au cours duquel des espèces chimiques (les **réactifs**) disparaissent pour donner de nouvelles espèces chimiques (les **produits**).
  * **Conservation de la masse** : Au cours d''une transformation chimique, la masse totale se conserve (les atomes se réorganisent mais rien ne se crée, rien ne se perd).
  * **Équation de réaction** : Modélisation mathématique de la transformation où le nombre d''atomes de chaque élément doit être le même de chaque côté de la flèche.'
WHERE subject = 'sciences' AND order_index = 1;