-- Exemple d'insertion des questions pour le chapitre 1 de sciences (order_index = 1)
-- Assure-toi d'adapter l'ID du chapitre selon ta base (ex: chapter_id = 36 ou l'ID correspondant)
INSERT INTO chapter_questions (chapter_id, question, options, correct_answer, explanation) VALUES
(
  36,
  'De quoi est principalement constitué un atome ?',
  ARRAY['Uniquement d''électrons', 'Un noyau central et des électrons qui gravitent autour', 'Uniquement de protons positifs', 'Un noyau sans charge'],
  'Un noyau central et des électrons qui gravitent autour',
  'Un atome est formé d''un noyau central dense et positif, entouré d''électrons chargés négativement.'
),
(
  36,
  'Qu''appelle-t-on un anion ?',
  ARRAY['Un atome neutre', 'Un ion chargé positivement', 'Un ion chargé négativement', 'Un atome sans électrons'],
  'Un ion chargé négativement',
  'Un anion est un atome (ou groupe d''atomes) qui a gagné un ou plusieurs électrons, devenant ainsi négatif.'
),
(
  36,
  'Quelle est la valeur du pH d''une solution neutre à 25°C ?',
  ARRAY['pH = 0', 'pH = 7', 'pH = 14', 'pH < 7'],
  'pH = 7',
  'Une solution neutre (comme l''eau pure) a un pH égal à 7. En dessous c''est acide, au-dessus c''est basique.'
),
(
  36,
  'Au cours d''une transformation chimique, que se passe-t-il pour la masse totale ?',
  ARRAY['Elle diminue', 'Elle augmente', 'Elle se conserve', 'Elle disparaît'],
  'Elle se conserve',
  'La masse totale se conserve toujours lors d''une transformation chimique (rien ne se perd, rien ne se crée).'
);
INSERT INTO chapter_questions (chapter_id, question, options, correct_answer, explanation) VALUES
-- Thème 1 : L'atome et la matière (Questions 1 à 10)
(36, 'De quoi est principalement constitué un atome ?', ARRAY['D''un noyau central et d''électrons', 'Uniquement de neutrons', 'D''un nuage de protons uniquement', 'De molécules liées'], 'D''un noyau central et d''électrons', 'Un atome est composé d''un noyau central très dense (protons et neutrons) et d''électrons qui gravitent autour.'),
(36, 'Quelle est la charge électrique du noyau d''un atome ?', ARRAY['Négative', 'Positive', 'Neutre (nulle)', 'Variable'], 'Positive', 'Le noyau contient des protons qui sont chargés positivement, ce qui rend le noyau globalement positif.'),
(36, 'Pourquoi un atome est-il électriquement neutre ?', ARRAY['Il a autant de protons que d''électrons', 'Il n''a aucune charge', 'Il a autant de neutrons que de protons', 'Il possède plus d''électrons que de protons'], 'Il a autant de protons que d''électrons', 'Le nombre de charges positives (protons) compense exactement le nombre de charges négatives (électrons).'),
(36, 'Que représente le numéro atomique Z ?', ARRAY['Le nombre de nucléons', 'Le nombre de protons', 'Le nombre de neutrons', 'La masse de l''atome'], 'Le nombre de protons', 'Le numéro atomique Z indique le nombre exact de protons présents dans le noyau de l''atome.'),
(36, 'Quel est le numéro atomique (Z) de l''atome de carbone ?', ARRAY['Z = 4', 'Z = 6', 'Z = 8', 'Z = 12'], 'Z = 6', 'L''atome de carbone possède 6 protons, son numéro atomique est donc Z = 6.'),
(36, 'Où se concentre l''essentiel de la masse d''un atome ?', ARRAY['Dans les électrons', 'Dans le noyau', 'Uniformément dans tout l''atome', 'Dans le vide'], 'Dans le noyau', 'Le noyau est extrêmement dense et concentre plus de 99,9 % de la masse de l''atome.'),
(36, 'Quelle est la charge d''un électron ?', ARRAY['Positive', 'Négative', 'Neutre', 'Dépend de l''atome'], 'Négative', 'Les électrons portent une charge électrique élémentaire négative.'),
(36, 'Qu,appelle-t-on les constituants du noyau (protons et neutrons) ?', ARRAY['Des électrons', 'Des nucléons', 'Des ions', 'Des isotopes'], 'Des nucléons', 'Les protons et les neutrons se trouvent dans le noyau, on les appelle collectivement les nucléons.'),
(36, 'Quel est le symbole de l''élément hydrogène ?', ARRAY['H', 'He', 'Hy', 'Hd'], 'H', 'Le symbole chimique de l''hydrogène est H (Z = 1).'),
(36, 'L''espace entre le noyau et les électrons est principalement constitué de :', ARRAY['Matière solide', 'Vide', 'Air', 'Gaz comprimé'], 'Vide', 'L''atome a une structure essentiellement constituée de vide (structure lacunaire).'),

-- Thème 2 : Les ions (Questions 11 à 20)
(36, 'Qu''est-ce qu''un ion ?', ARRAY['Un atome qui n''a pas de noyau', 'Un atome ou un groupe d''atomes ayant gagné ou perdu des électrons', 'Uniquement un atome radioactif', 'Une molécule sans électrons'], 'Un atome ou un groupe d''atomes ayant gagné ou perdu des électrons', 'Un ion se forme lorsqu''un atome (ou un groupe d''atomes) gagne ou perd un ou plusieurs électrons.'),
(36, 'Qu''appelle-t-on un anion ?', ARRAY['Un ion chargé positivement', 'Un ion chargé négativement', 'Un atome neutre', 'Un ion sans électrons'], 'Un ion chargé négativement', 'Un anion est un ion qui a gagné un ou plusieurs électrons, il est donc chargé négativement.'),
(36, 'Qu''appelle-t-on un cation ?', ARRAY['Un ion chargé positivement', 'Un ion chargé négativement', 'Un atome neutre', 'Un gaz rare'], 'Un ion chargé positivement', 'Un cation est un ion qui a perdu un ou plusieurs électrons, il devient donc positif.'),
(36, 'Quel est le nom de l''ion chlorure de formule Cl⁻ ?', ARRAY['Un cation', 'Un anion', 'Une molécule', 'Un atome neutre'], 'Un anion', 'L''ion chlorure porte une charge négative, c''est un anion.'),
(36, 'Quel test permet de mettre en évidence l''ion cuivre (Cu²⁺) en solution ?', ARRAY['Ajout de soude (NaOH) -> précipité bleu', 'Ajout de nitrate d''argent -> précipité blanc', 'Test à l''eau de chaux -> trouble', 'Flamme verte'], 'Ajout de soude (NaOH) -> précipité bleu', 'L''ajout de solution d''hydroxyde de sodium (soude) provoque l''apparition d''un précipité gélatineux bleu en présence d''ions cuivre.'),
(36, 'Quel test permet de mettre en évidence l''ion chlorure (Cl⁻) en solution ?', ARRAY['Ajout de soude (NaOH)', 'Ajout de nitrate d''argent (Ag⁺ + NO₃⁻) -> précipité blanc qui noircit à la lumière', 'Ajout d''acide chlorhydrique', 'Test au sulfate de cuivre anhydre'], 'Ajout de nitrate d''argent (Ag⁺ + NO₃⁻) -> précipité blanc qui noircit à la lumière', 'Le test caractéristique des ions chlorure se fait avec le nitrate d''argent, formant un précipité blanc.'),
(36, 'Un atome de sodium (Na) perd un électron pour donner l''ion Na⁺. De quel type d''ion s''agit-il ?', ARRAY['Un anion', 'Un cation', 'Un isotope', 'Une molécule'], 'Un cation', 'En perdant un électron, le sodium a plus de protons que d''électrons, c''est un cation.'),
(36, 'L''ion ferrique a pour formule Fe³⁺. A-t-il gagné ou perdu des électrons ?', ARRAY['Il a gagné 3 électrons', 'Il a perdu 3 électrons', 'Il n''a pas bougé', 'Il a gagné 3 protons'], 'Il a perdu 3 électrons', 'Une charge positive 3+ signifie qu''il y a un déficit de 3 électrons (perte de 3 électrons).'),
(36, 'La formule chimique de l''ion sulfate est :', ARRAY['SO₄²⁻', 'NO₃⁻', 'CO₃²⁻', 'Cl⁻'], 'SO₄²⁻', 'L''ion sulfate est un ion polyatomique de formule SO₄²⁻.'),
(36, 'Les solutions ioniques sont-elles conductrices d''électricité ?', ARRAY['Oui, grâce au mouvement des ions', 'Non, jamais', 'Uniquement si elles sont chauffées', 'Seulement le sel solide'], 'Oui, grâce au mouvement des ions', 'Le courant électrique dans une solution aqueuse est assuré par le déplacement des ions.'),

-- Thème 3 : Le pH et l'acidité / basicité (Questions 21 à 30)
(36, 'Entre quelles valeurs varie l''échelle de pH en solution aqueuse ?', ARRAY['De 0 à 7', 'De 1 à 10', 'De 0 à 14', 'De -1 à 1'], 'De 0 à 14', 'L''échelle de pH courante pour les solutions aqueuses s''étend de 0 à 14.'),
(36, 'Quelle est la valeur du pH pour une solution neutre (comme l''eau pure) ?', ARRAY['pH = 0', 'pH = 7', 'pH = 14', 'pH = 5'], 'pH = 7', 'Une solution neutre a toujours un pH égal à 7 à 25°C.'),
(36, 'Comment caractérise-t-on une solution dont le pH est inférieur à 7 ?', ARRAY['Elle est basique', 'Elle est neutre', 'Elle est acide', 'Elle est saturée'], 'Elle est acide', 'Un pH inférieur à 7 caractérise une solution acide.'),
(36, 'Quels ions sont responsables de l''acidité d''une solution ?', ARRAY['Les ions hydroxyde HO⁻', 'Les ions hydrogène H⁺', 'Les ions sodium Na⁺', 'Les ions chlorure Cl⁻'], 'Les ions hydrogène H⁺', 'Plus la concentration en ions hydrogène H⁺ est élevée, plus la solution est acide.'),
(36, 'Quels ions sont responsables de la basicité d''une solution ?', ARRAY['Les ions hydrogène H⁺', 'Les ions hydroxyde HO⁻', 'Les ions oxygène O²⁻', 'Les ions potassium K⁺'], 'Les ions hydroxyde HO⁻', 'Les solutions basiques se caractérisent par la présence majoritaire d''ions hydroxyde HO⁻.'),
(36, 'Que se passe-t-il pour le pH d''une solution acide si on la dilue (si on ajoute de l''eau) ?', ARRAY['Le pH diminue et se rapproche de 0', 'Le pH augmente et se rapproche de 7', 'Le pH ne change pas', 'Le pH passe directement à 14'], 'Le pH augmente et se rapproche de 7', 'En diluant un acide, la solution devient moins acide, donc son pH se rapproche de la neutralité (7).'),
(36, 'Quel instrument de mesure permet d''obtenir une valeur précise du pH ?', ARRAY['Un pèse-lettre', 'Un pH-mètre', 'Un thermomètre', 'Un ohmmètre'], 'Un pH-mètre', 'Le pH-mètre électronique permet de mesurer précisément le pH d''une solution.'),
(36, 'Le papier pH change de couleur au contact d''une solution. Comment détermine-t-on la valeur ?', ARRAY['En le goûtant', 'En comparant la couleur à une échelle de teintes de référence', 'En mesurant sa température', 'En le pesant'], 'En comparant la couleur à une échelle de teintes de référence', 'On lit le pH en associant la couleur obtenue sur le papier à l''abaque de référence fourni.'),
(36, 'Une solution de pH égal à 12 est :', ARRAY['Très acide', 'Légèrement acide', 'Neutre', 'Basique'], 'Basique', 'Un pH supérieur à 7 indique un milieu basique (ou alcalin).'),
(36, 'Que peut-on dire d''une solution de pH = 2 par rapport à une solution de pH = 5 ?', ARRAY['Elle est moins acide', 'Elle est plus acide', 'Elles ont la même acidité', 'Elle est basique'], 'Elle est plus acide', 'Plus le pH est bas (proche de 0), plus l''acidité est forte.'),

-- Thème 4 : Transformations physiques et chimiques (Questions 31 à 40)
(36, 'Qu''est-ce qu''une transformation physique ?', ARRAY['Une transformation qui crée de nouvelles espèces chimiques', 'Une transformation qui modifie l''état ou la forme sans changer la nature de la matière', 'Une réaction explosive', 'Une combustion complète'], 'Une transformation qui modifie l''état ou la forme sans changer la nature de la matière', 'Une transformation physique (comme les changements d''état) ne modifie pas les molécules de la substance.'),
(36, 'Qu''appelle-t-on les substances de départ dans une transformation chimique ?', ARRAY['Les produits', 'Les réactifs', 'Les catalyseurs', 'Les solvants'], 'Les réactifs', 'Les réactifs sont les espèces chimiques qui consomment ou réagissent au cours de la transformation.'),
(36, 'Qu''appelle-t-on les substances obtenues à la fin d''une transformation chimique ?', ARRAY['Les réactifs', 'Les résidus', 'Les produits', 'Les isotopes'], 'Les produits', 'Les produits sont les nouvelles espèces chimiques formées par la réaction.'),
(36, 'Que dit la loi de Lavoisier sur la masse lors d''une transformation chimique ?', ARRAY['La masse totale diminue', 'La masse totale augmente', 'La masse totale se conserve', 'La masse se transforme en énergie pure'], 'La masse totale se conserve', 'Au cours d''une transformation chimique, la masse totale des réactifs consommés est égale à celle des produits formés.'),
(36, 'La fusion de la glace est une transformation :', ARRAY['Chimique', 'Physique', 'Nucléaire', 'Biologique'], 'Physique', 'Passer de l''état solide à l''état liquide est un changement d''état, donc une transformation physique.'),
(36, 'La combustion du charbon dans le dioxygène est une transformation :', ARRAY['Physique', 'Chimique', 'Thermique uniquement', 'Mécanique'], 'Chimique', 'Il y a création de nouvelles substances (comme le dioxyde de carbone) à partir des réactifs (carbon et dioxygène).'),
(36, 'Dans une équation de réaction chimique, que doit-on respecter impérativement ?', ARRAY['Le nombre d''atomes de chaque élément de chaque côté', 'Uniquement le volume des liquides', 'La couleur des flacons', 'Le nombre de molécules total'], 'Le nombre d''atomes de chaque élément de chaque côté', 'Rien ne se perd, rien ne se crée : les atomes se réorganisent, l''équation doit donc être équilibrée.'),
(36, 'Quel est le réactif indispensable pour qu''une combustion ait lieu (en plus du combustible) ?', ARRAY['Le diazote', 'Le dioxygène', 'L''argon', 'L''hydrogène'], 'Le dioxygène', 'Le dioxygène est le comburant indispensable pour entretenir la plupart des combustions.'),
(36, 'La vaporisation (passage de l''état liquide à l''état gazeux) absorbe ou libère de l''énergie ?', ARRAY['Elle absorbe de l''énergie thermique', 'Elle libère de la lumière', 'Elle ne consomme rien', 'Elle refroidit instantanément l''univers'], 'Elle absorbe de l''énergie thermique', 'Un changement d''état vers le gaz (vaporisation, fusion) nécessite un apport d''énergie (chaleur).'),
(36, 'Quelle est la formule chimique du dioxyde de carbone produit lors d''une combustion du carbone ?', ARRAY['CO', 'CO2', 'C2O', 'O2C'], 'CO2', 'Le dioxyde de carbone est composé d''un atome de carbone et de deux atomes d''oxygène, d''où CO2.');