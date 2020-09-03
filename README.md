## po/iw CAS

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=poiw-org_cas&metric=alert_status)](https://sonarcloud.io/dashboard?id=poiw-org_cas)

## Τι είναι;

Επειδή πολλές φορές, τα προγράμματα που κάνουμε απαιτούν κάποια είδους αυθεντικοποίηση, γράψαμε
μια υλοποίηση του πρωτοκόλλου CAS 2.0 (όχι ολόκληρου. Υλοποιούμε κατα καιρούς επιπλέον μέρη του πρωτόκολλου όταν το απαιτούν
τα πρότζεκτ μας) για δική μας διευκόλυνση. 

Με λίγα λόγια: Ένας λογαριασμός, ένα login UI, λιγότερος προγραμματισμός και χειρισμός διαπιστευτηρίων για τα project της ομάδας.

## Πως το τρέχω;

Το project είναι γραμμένο σε Next.js (React Framework) και συνδέεται σε MongoDB με ενα environment variable MONGODB_URL.
Αφού κάνεις git clone και αφού αποκτήσεις πρόσβαση σε κάποια db (δική σου ή της ομάδας), τρέξε:
```
yarn install #για να εγκαταστήσεις τα dependancies.
yarn dev #για να τρέξεις το πρόγραμμα σε development mode
```
