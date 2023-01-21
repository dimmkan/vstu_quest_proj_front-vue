<template>
  <Dialog :header="`ID кандидата: ${localCandidate.id}`" v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '40vw' }" :modal="true">

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="id">ID: </label>
        <InputText id="id" v-model="localCandidate.id" disabled />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="fio">ФИО: </label>
        <InputText :disabled="localStorage.payload.roles === 'security'" id="fio" v-model="localCandidate.fio" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="birthday">Дата рождения: </label>
        <Calendar :disabled="localStorage.payload.roles === 'security'" baseZIndex="999" inputId="birthday" v-model="localCandidate.birthday" dateFormat="dd-mm-yy" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="birthplace">Место рождения: </label>
        <InputText :disabled="localStorage.payload.roles === 'security'" id="birthplace" v-model="localCandidate.birthplace" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="passport">Паспорт: </label>
        <InputText :disabled="localStorage.payload.roles === 'security'" id="passport" v-model="localCandidate.passport" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="position">Должность: </label>
        <InputText :disabled="localStorage.payload.roles === 'security'" id="position" v-model="localCandidate.position" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="department">Подразделение: </label>
        <InputText :disabled="localStorage.payload.roles === 'security'" id="department" v-model="localCandidate.department" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="checkStartDate">Дата начала проверки: </label>
        <Calendar :disabled="localStorage.payload.roles === 'kadry'" baseZIndex="999" inputId="checkStartDate" v-model="localCandidate.checkStartDate" dateFormat="dd-mm-yy" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="checkEndDate">Дата окончания проверки: </label>
        <Calendar :disabled="localStorage.payload.roles === 'kadry'" baseZIndex="999" inputId="checkEndDate" v-model="localCandidate.checkEndDate" dateFormat="dd-mm-yy" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="checkResult">Результат проверки: </label>
        <InputText :disabled="localStorage.payload.roles === 'kadry'" id="checkResult" v-model="localCandidate.checkResult" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="checkStatus">Проверка проведена: </label>
        <Dropdown :disabled="localStorage.payload.roles === 'kadry'" v-model="localCandidate.checkStatus" :options="statuses" optionLabel="name" optionValue="code"
          placeholder="Выберите статус" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="checkComment">Комментарий сотрудника СБ: </label>
        <InputText :disabled="localStorage.payload.roles === 'kadry'" id="checkComment" v-model="localCandidate.checkComment" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="endResult">Окончательный итог: </label>
        <InputText :disabled="localStorage.payload.roles === 'security'" id="endResult" v-model="localCandidate.endResult" />
      </div>
    </div>

    <div class="flex justify-content-center mt-2" v-if="error">
      <small id="error" style="color:red"> {{ `Ошибка выполнения запроса - ${this.errorMessage}` }}</small>
    </div>

    <template #footer>
      <Button label="Удалить запись" icon="pi pi-times" @click="deleteAndCloseModal"
        class="p-button-danger p-button-text" />
      <Button label="Сохранить" icon="pi pi-check" @click="saveWithoutCloseModal" class="p-button-help p-button-text" />
      <Button label="Сохранить и закрыть" icon="pi pi-check" @click="saveAndCloseModal" class="p-button-text" />
    </template>
  </Dialog>
</template>

<script>
import CandidateService from '@/services/CandidateService.js';

export default {
  props: {
    candidate: Object,
    showComponent: Boolean,
  },

  created() {
    this.candidateService = new CandidateService();
  },

  data() {
    return {
      displayModal: this.showComponent,
      errorMessage: '',
      error: false,
      localCandidate: this.candidate,
      statuses: [
        { name: 'Нет', code: 0 },
        { name: 'Да', code: 1 }
      ],
    }
  },

  watch: {
    displayModal: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue === false) {
          this.$emit('close-modal');
        }
      },
    },
    eds: {
      handler(newValue, oldValue) {
        if (newValue === undefined) {
          console.log(oldValue);
          this.localCandidate = oldValue;
          return;
        }
        this.localCandidate = newValue;
      }
    }
  },

  methods: {
    async saveAndCloseModal() {
      try {
        await this.candidateService.updateCandidate(this.localCandidate);
        this.displayModal = false;
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        setTimeout(() => {
          this.error = false;
          this.errorMessage = '';
        }, 5000);
      }
    },
    async saveWithoutCloseModal() {
      try {
        await this.candidateService.updateCandidate(this.localCandidate);
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        setTimeout(() => {
          this.error = false;
          this.errorMessage = '';
        }, 5000);
      }
    },
    async deleteAndCloseModal() {
      try {
        await this.candidateService.deleteCandidate(this.localCandidate.id);
        this.displayModal = false;
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
};
</script>

<style scoped lang="scss">
.p-button {
  margin: 0.3rem .5rem;
  min-width: 10rem;
}

p {
  margin: 0;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-dialog .p-button {
  min-width: 6rem;
}
.p-calendar {
  min-width: 65%;
}

.p-inputtext {
  min-width: 65%;
}

.p-dropdown {
  min-width: 65%;
}
</style>