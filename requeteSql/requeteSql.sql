/*Requete sql*/

INSERT INTO public.annales (year, subject, series, session, type, subject_pdf_url, correction_pdf_url)
VALUES 
(
  2026, 
  'Mathématiques', 
  'Générale', 
  'Métropole - Crétéil - Paris - Versailles', 
  'Sujet officiel + Corrigé', 
  '/annales/2026/brevet-mathematiques-metropole-2026-sujet.pdf', 
  '/annales/2026/brevet-mathematiques-metropole-2026-correction.pdf' 
);

/*Suppression des chapitres d'une catégorie*/
delete from chapters
where category in ('Physique-Chimie,SVT,Technologie');

/*Insertion des chapitres liés à la science*/
-- 1. Supprimer tous les doublons ou réinitialiser les chapitres de sciences
DELETE FROM chapters WHERE subject = 'sciences';

-- 2. Réinsérer proprement les 10 chapitres uniques de sciences
INSERT INTO chapters (title, category, description, order_index, subject) VALUES
-- Physique-Chimie
('Constitution et transformations de la matière', 'Physique-Chimie', 'Atomes, ions, molécules, réactions et mesures du pH.', 1, 'sciences'),
('Mouvements et interactions', 'Physique-Chimie', 'Vitesse, forces, pesanteur et principe d''inertie.', 2, 'sciences'),
('L''énergie et ses conversions', 'Physique-Chimie', 'Formes d''énergie, circuits électriques et bilans énergétiques.', 3, 'sciences'),
('Ondes et signaux', 'Physique-Chimie', 'Propriétés des sons, de la lumière et signaux de communication.', 4, 'sciences'),

-- SVT
('La planète Terre et l''environnement', 'SVT', 'Risques naturels, ressources, climats et dynamiques des écosystèmes.', 5, 'sciences'),
('Le vivant et son évolution', 'SVT', 'Génétique, biodiversité, sélection naturelle et histoire de la Terre.', 6, 'sciences'),
('Le corps humain et la santé', 'SVT', 'Fonctionnement du système nerveux, immunité, reproduction et santé.', 7, 'sciences'),

-- Technologie
('Design, innovation et créativité', 'Technologie', 'Cycle de vie des objets, écoconception et design d''objets.', 8, 'sciences'),
('Objets techniques et société', 'Technologie', 'Impacts des innovations technologiques sur notre mode de vie.', 9, 'sciences'),
('Modélisation et programmation', 'Technologie', 'Algorithmique, capteurs, actionneurs et automatismes programmables.', 10, 'sciences');