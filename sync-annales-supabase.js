const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ⚙️ Remplace par tes identifiants Supabase (ou utilise process.env.SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY)
const SUPABASE_URL = 'https://cpntxhtmwhdsqpcyrmhb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbnR4aHRtd2hkc3FwY3lybWhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDE2NjM2OSwiZXhwIjoyMTA1NzQyMzY5fQ._a3l-OqZTLZ46khMpo_ArRzLsVRTZ1M2fZDJyQ8ggY8'; // Utilise la clé service_role pour autoriser les écritures

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncAnnales() {
    // Chemin absolu vers ton dossier contenant les annales
    const rootDir = path.join(__dirname, 'public', 'annales'); 

    if (!fs.existsSync(rootDir)) {
        console.error(`❌ Le dossier ${rootDir} est introuvable.`);
        return;
    }

    // Fonction récursive pour scanner tous les sous-dossiers et récupérer les fichiers .pdf
    function scanDirectory(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(scanDirectory(filePath));
            } else if (file.toLowerCase().endsWith('.pdf')) {
                results.push(filePath);
            }
        });
        return results;
    }

    console.log("📂 Analyse du dossier /annales en cours...");
    const files = scanDirectory(rootDir);
    const mapAnnales = {};

    files.forEach(file => {
        const relativePath = '/annales/' + path.relative(rootDir, file).replace(/\\/g, '/');
        const filename = path.basename(file).toLowerCase();
        
        // 1. Extraction de l'année (ex: 2024)
        const yearMatch = filename.match(/20\d{2}/);
        const year = yearMatch ? parseInt(yearMatch[0], 10) : 2023;
        
        // 2. Détection Sujet ou Correction
        const isCorrection = filename.includes('correction');

        // 3. Détection de la Série (Générale ou Professionnelle)
        let series = 'Générale';
        if (filename.includes('professionnelle')) {
            series = 'Professionnelle';
        }

        // 4. Détection de la Matière et de l'Aménagement
        let subject = 'francais-dictee';
        if (filename.includes('mathematiques') || filename.includes('maths')) {
            subject = 'mathematiques';
        }
        
        if (filename.includes('amenagee') || filename.includes('aménagée')) {
            subject += '-amenagee';
        }

        // 5. Détection de la Session (Normale ou Remplacement)
        let sessionType = 'Métropole';
        if (filename.includes('remplacement')) {
            sessionType = 'Remplacement - Métropole';
        } else if (filename.includes('metropole')) {
            sessionType = 'Métropole';
        }
        const session = `${sessionType} - Session ${year}`;

        // Clé unique basée sur l'année, la matière, la série et la session pour regrouper sujet + correction
        const cleanBaseName = filename
            .replace(/-(sujet|correction)\.pdf$/i, '')
            .replace(/20\d{2}/, '')
            .replace(/générale|professionnelle|amenagee|metropole|remplacement/g, '')
            .replace(/[-_]+/g, '-')
            .replace(/^-|-$/g, '');

        const key = `${year}-${subject}-${series}-${sessionType}-${cleanBaseName}`;

        if (!mapAnnales[key]) {
            mapAnnales[key] = {
                year,
                subject,
                series,
                session,
                type: 'Examen DNB',
                subject_pdf_url: null,
                correction_pdf_url: null
            };
        }

        if (isCorrection) {
            mapAnnales[key].correction_pdf_url = relativePath;
        } else {
            mapAnnales[key].subject_pdf_url = relativePath;
        }
    });

    const records = Object.values(mapAnnales);
    console.log(`🔄 Synchronisation de ${records.length} entrées vers Supabase...`);

    // Insertion avec Upsert de Supabase
    for (const item of records) {
        const { error } = await supabase
            .from('annales')
            .upsert(item, { 
                onConflict: 'year,subject,series', // Assure-toi que la contrainte unique est bien active
                ignoreDuplicates: false 
            });

        if (error) {
            console.error(`❌ Erreur pour l'entrée ${item.year} - ${item.subject} (${item.series}) :`, error.message);
        }
    }

    console.log("✅ Synchronisation Supabase terminée avec succès !");
}

syncAnnales().catch(err => {
    console.error("❌ Erreur critique :", err);
});