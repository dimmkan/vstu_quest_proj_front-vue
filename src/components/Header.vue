
<template>
  <div>
    <Menubar :model="items" class="justify-content-between">
      <template #start>
        <h3>Анкеты кандидатов</h3>
      </template>
      <template #item="{item}">
        <Button v-if="isAuth" :label="'Пользователь: ' + localStorage.payload.login" class="p-button-link" @click="displayModal = true"/>
        <router-link :to="item.to" custom v-slot="{navigate, isActive}" v-if="isAuth">
          <Button
            :style="isActive ? 'color: var(--orange-700); text-decoration: underline solid var(--orange-700) !important' : 'none'"
            :label="item.label" :icon="item.icon" @click="navigate" class="p-button-link" />
        </router-link>
      </template>
    </Menubar>
    <Dialog :header="`Смена пароля`" v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '40vw' }" :modal="true">

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="newPassword">Новый пароль: </label>
        <InputText type="password" id="newPassword" v-model="newPassword" />
      </div>
    </div>

    <div class="flex justify-content-center mt-2" v-if="error">
      <small id="error" style="color:red"> {{ `Ошибка выполнения запроса - ${this.errorMessage}` }}</small>
    </div>

    <template #footer>
      <Button label="Изменить и закрыть" icon="pi pi-check" @click="saveAndCloseModal" class="p-button-text" />
    </template>
  </Dialog>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import CandidateService from '@/services/CandidateService.js';

export default {
  components: {
    RouterLink,
  },

  created() {
    this.candidateService = new CandidateService();
  },

  data() {
    return {
      items: [
        {
          label: 'Выход',
          icon: 'pi pi-fw pi-power-off',
          to: '/logout',
        }
      ],
      newPassword: '',
      displayModal: false,
      errorMessage: '',
      error: false,
    }
  },

  methods: {
    logout(event) {
      console.log(event);
    },
    async saveAndCloseModal() {
      try {
        await this.candidateService.changePassword(this.newPassword);
        this.displayModal = false;
        this.newPassword = '';
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        setTimeout(() => {
          this.error = false;
          this.errorMessage = '';
        }, 5000);
      }
    },
  },

  computed: {
    isAuth() {
      return this.localStorage.payload?.isAuth;
    },
  },
}
</script>

<style scoped>
h3 {
  color: var(--teal-700)
}

.p-inputtext {
  min-width: 65%;
}
</style>