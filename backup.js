import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Créer le dossier de sauvegarde s'il n'existe pas
if (!fs.existsSync('backup')) {
  fs.mkdirSync('backup');
}

// Liste des fichiers et dossiers à exclure
const excludes = [
  'node_modules',
  'dist',
  '.git',
  'backup',
  '.DS_Store',
  'package-lock.json'
].map(item => `--exclude=${item}`).join(' ');

// Nom du fichier de sauvegarde avec la date
const date = new Date().toISOString().split('T')[0];
const backupFile = path.join('backup', `renescens-${date}.tar.gz`);

// Commande pour créer l'archive
const command = `tar -czf ${backupFile} ${excludes} .`;

// Exécuter la commande
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erreur lors de la création de la sauvegarde: ${error}`);
    return;
  }
  console.log(`Sauvegarde créée avec succès: ${backupFile}`);
});