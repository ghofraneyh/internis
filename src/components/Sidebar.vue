<script setup lang="ts">
interface Props {
  userInitial?: string;
  userName?: string;
  userRole?: string;
  isConnected?: boolean;
}

withDefaults(defineProps<Props>(), {
  userInitial: "U",
  userName: "Utilisateur",
  userRole: "COMPTE ADMINISTRATEUR",
  isConnected: true,
});

const emit = defineEmits<{
  logout: [];
}>();

const handleLogout = () => {
  emit("logout");
};

const menuItems = [
  {
    title: "Tableau de bord",
    icon: "mdi-view-dashboard",
    route: "/dashboard",
    routeName: "Dashboard",
  },
  {
    title: "Missions",
    icon: "mdi-briefcase",
    route: "/missions",
    routeName: "Missions",
  },
];
</script>

<template>
  <v-navigation-drawer permanent width="320" class="bg-blue-darken-2">
    <!-- Profil utilisateur -->
    <v-card flat class="bg-blue-darken-2 pa-6 text-center">
      <v-avatar size="80" color="white" class="mb-4">
        <span class="text-h4 font-weight-bold text-blue-darken-2">
          {{ userInitial }}
        </span>
      </v-avatar>

      <v-card-title class="text-white text-h6 font-weight-medium pa-0 mb-1">
        {{ userName }}
      </v-card-title>

      <v-card-subtitle class="text-blue-lighten-3 pa-0 mb-3">
        {{ userRole }}
      </v-card-subtitle>
    </v-card>

    <v-divider class="bg-blue-darken-1 mb-4"></v-divider>

    <!-- Menu de navigation -->
    <v-list class="bg-transparent" density="compact">
      <v-list-subheader class="text-white font-weight-medium px-4 py-2">
        Menu
      </v-list-subheader>

      <v-list-item
        v-for="item in menuItems"
        :key="item.route"
        :to="item.route"
        :active="$route.name === item.routeName"
        class="mx-2 mb-1 rounded-lg"
        :class="{ 'bg-blue-darken-1': $route.name === item.routeName }"
        variant="text"
      >
        <template #prepend>
          <v-icon
            :color="$route.name === item.routeName ? 'white' : 'blue-lighten-3'"
            size="20"
          >
            {{ item.icon }}
          </v-icon>
        </template>

        <v-list-item-title
          :class="
            $route.name === item.routeName
              ? 'text-white'
              : 'text-blue-lighten-3'
          "
          class="font-weight-medium"
        >
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-spacer></v-spacer>

    <!-- Bouton de déconnexion -->
    <v-card flat class="bg-transparent pa-4">
      <v-btn @click="handleLogout" block variant="outlined" size="small">
        <v-icon start size="16" class="mr-2"> mdi-logout </v-icon>
        <span class="text-sm normal-case"> Se déconnecter </span>
      </v-btn>
    </v-card>
  </v-navigation-drawer>
</template>

<style scoped>
.v-list-item--active {
  background-color: rgb(30 58 138) !important;
}

.v-list-item:hover {
  background-color: rgba(59, 130, 246, 0.1) !important;
}
</style>
