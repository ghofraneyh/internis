# BaseDialog - Composant de Dialogue Réutilisable

Le composant `BaseDialog` est un composant de dialogue réutilisable basé sur Vuetify qui offre une interface cohérente et personnalisable pour différents types de dialogues dans l'application.

## Fonctionnalités

- **Types de dialogue prédéfinis** : form, confirm, info, warning, error
- **Personnalisation complète** : couleurs, icônes, textes, dimensions
- **Gestion des événements** : confirm, cancel, close
- **Responsive** : s'adapte aux différentes tailles d'écran
- **Accessible** : support du clavier et de la navigation

## Utilisation de Base

```vue
<template>
  <BaseDialog
    v-model="dialogVisible"
    title="Mon Dialogue"
    type="confirm"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <p>Contenu du dialogue</p>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/BaseDialog.vue';
import { ref } from 'vue';

const dialogVisible = ref(false);

const handleConfirm = () => {
  console.log('Confirmé');
  dialogVisible.value = false;
};

const handleCancel = () => {
  console.log('Annulé');
  dialogVisible.value = false;
};
</script>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `modelValue` | `boolean` | - | Contrôle la visibilité du dialogue |
| `title` | `string` | `''` | Titre du dialogue |
| `subtitle` | `string` | `''` | Sous-titre du dialogue |
| `type` | `'form' \| 'confirm' \| 'info' \| 'warning' \| 'error'` | `'form'` | Type de dialogue |
| `width` | `string \| number` | `500` | Largeur du dialogue |
| `maxWidth` | `string \| number` | `'90vw'` | Largeur maximale |
| `persistent` | `boolean` | `false` | Empêche la fermeture en cliquant à l'extérieur |
| `fullscreen` | `boolean` | `false` | Affiche en plein écran |
| `scrollable` | `boolean` | `false` | Permet le défilement du contenu |
| `loading` | `boolean` | `false` | Affiche un état de chargement |
| `confirmText` | `string` | `'Confirmer'` | Texte du bouton de confirmation |
| `cancelText` | `string` | `'Annuler'` | Texte du bouton d'annulation |
| `showActions` | `boolean` | `true` | Affiche les boutons d'action |
| `confirmColor` | `string` | `'primary'` | Couleur du bouton de confirmation |
| `cancelColor` | `string` | `'grey'` | Couleur du bouton d'annulation |
| `confirmIcon` | `string` | `'mdi-check'` | Icône du bouton de confirmation |
| `cancelIcon` | `string` | `'mdi-close'` | Icône du bouton d'annulation |

## Événements

| Événement | Description |
|-----------|-------------|
| `update:modelValue` | Émis quand la visibilité change |
| `confirm` | Émis quand l'utilisateur confirme |
| `cancel` | Émis quand l'utilisateur annule |

## Types de Dialogue

### Form
Pour les formulaires et contenus complexes :
```vue
<BaseDialog
  v-model="dialogVisible"
  title="Nouveau Projet"
  type="form"
  :width="600"
  confirm-text="Sauvegarder"
  @confirm="saveProject"
>
  <!-- Contenu du formulaire -->
</BaseDialog>
```

### Confirm
Pour les confirmations d'action :
```vue
<BaseDialog
  v-model="dialogVisible"
  title="Confirmer la suppression"
  type="confirm"
  confirm-text="Supprimer"
  confirm-color="error"
  @confirm="deleteItem"
>
  <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
</BaseDialog>
```

### Info
Pour les messages informatifs :
```vue
<BaseDialog
  v-model="dialogVisible"
  title="Information"
  type="info"
  confirm-text="Compris"
  @confirm="closeDialog"
>
  <p>Votre action a été effectuée avec succès.</p>
</BaseDialog>
```

### Warning
Pour les avertissements :
```vue
<BaseDialog
  v-model="dialogVisible"
  title="Attention"
  type="warning"
  confirm-text="Continuer"
  @confirm="proceed"
>
  <p>Cette action peut avoir des conséquences importantes.</p>
</BaseDialog>
```

### Error
Pour les erreurs :
```vue
<BaseDialog
  v-model="dialogVisible"
  title="Erreur"
  type="error"
  confirm-text="OK"
  @confirm="closeDialog"
>
  <p>Une erreur s'est produite lors du traitement.</p>
</BaseDialog>
```

## Composants Spécialisés

### ProjetFormDialog
Composant spécialisé pour les formulaires de projet utilisant BaseDialog :

```vue
<ProjetFormDialog
  v-model="dialogVisible"
  :projet="projetEnEdition"
  :loading="loading"
  @save="sauvegarderProjet"
/>
```

### ConfirmDeleteDialog
Composant spécialisé pour les confirmations de suppression :

```vue
<ConfirmDeleteDialog
  v-model="dialogVisible"
  title="Confirmer la suppression"
  message="Êtes-vous sûr de vouloir supprimer"
  :item-name="itemToDelete?.nom"
  @confirm="deleteItem"
/>
```

## Exemples d'Utilisation

Voir le fichier `ExampleDialogs.vue` pour des exemples complets d'utilisation dans différents contextes.

## Personnalisation

Le composant BaseDialog est conçu pour être hautement personnalisable tout en gardant une interface cohérente. Vous pouvez :

- Personnaliser les couleurs et icônes selon le type de dialogue
- Ajuster les dimensions selon le contenu
- Ajouter des validations personnalisées
- Gérer les états de chargement
- Implémenter des comportements spécifiques via les événements
