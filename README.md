# HyperCommerce Buyer

Connecteur web de la boutique client. Le catalogue, le stock et les commandes sont les mêmes que ceux du comptoir vendeur.

Ce dépôt reprend la structure d’un storefront (pages, layouts, composants, store, langue, routes, connecteur). Ce n’est pas le code commercial Flutter / Laravel d’HyperCommerce.

## Arborescence

Le fichier `ARBORESCENCE.txt` liste chaque fichier du projet.

```text
src/connector/buyer.ts          modules acheteur
src/connector/modules.ts        modules vendeur et contrat
src/connector/seed.ts           données de démonstration
src/connector/types.ts          types partagés
src/pages/StorePage.tsx         expérience acheteur
src/routes/store.tsx            route du store
src/store/seller.ts             catalogue, panier, favoris, commandes
src/layouts/SellerLayout.tsx    comptoir vendeur
src/pages/                     écrans du comptoir
```

## Parcours acheteur

- Découvrir : recherche, catégories, filtre par boutique
- Boutiques : vitrine de chaque point de vente
- Favoris : liste à reprendre
- Panier : retrait dans une boutique ouverte
- Suivi : statut renvoyé par le comptoir

Une commande passée dans le store apparaît dans les commandes du vendeur.

## Référence publique

La boutique client de démonstration de l’éditeur est distincte de ce connecteur : https://hypercommerce-web.eshopweb.store/
