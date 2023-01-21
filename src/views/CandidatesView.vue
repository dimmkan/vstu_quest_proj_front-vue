<template>
  <DataTable ref="dt" :value="candidates" :paginator="true" class="p-datatable-candidates p-datatable-sm mt-3" :rows="5"
    dataKey="id" :rowHover="true" v-model:filters="filters" filterDisplay="menu" :loading="loading"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 15]" currentPageReportTemplate="Показаны с {first} по {last} из {totalRecords} записей"
    :globalFilterFields="['fio']" responsiveLayout="scroll">
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <div>
          <h4 class="m-0">Список кандидатов</h4>
        </div>
        <div>
          <Button v-if="getRole" class="p-button-rounded" icon="pi pi-external-link" label="Сохранить в CSV" @click="exportCSV($event)" />
          <Button v-if="getRole" label="Добавить" icon="pi pi-plus" class="p-button-rounded ml-1"
            @click="showCreateModal = true" />
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex justify-content-center">
        <span>
          <h5>По вашему запросу ничего не найдено...</h5>
        </span>
      </div>
    </template>
    <template #loading>
      Загрузка данных. Пожалуйста, дождитесь окончания загрузки...
    </template>
    <Column field="id" header="ID" dataType="numeric" sortable>
      <template #body="{ data }">
        {{ data.id }}
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по ID" />
      </template>
    </Column>
    <Column field="fio" header="ФИО" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.fio }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по ФИО" />
      </template>
    </Column>
    <Column field="birthday" header="Дата рождения" sortable dataType="date">
      <template #body="{ data }">
        {{ formatDate(data.birthday) }}
      </template>
    </Column>
    <Column field="birthplace" header="Место рождения" sortable>
      <template #body="{ data }">
        <span class="image-text">{{ data.birthplace }}</span>
      </template>
    </Column>
    <Column field="passport" header="Паспорт" sortable>
      <template #body="{ data }">
        <span class="image-text">{{ data.passport }}</span>
      </template>
    </Column>
    <Column field="position" header="Должность" sortable>
      <template #body="{ data }">
        <span class="image-text">{{ data.position }}</span>
      </template>
    </Column>
    <Column field="department" header="Подразделение" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.department }}</span>
      </template>
    </Column>
    <Column field="checkStartDate" header="Дата начала проверки" sortable dataType="date">
      <template #body="{ data }">
        {{ formatDate(data.checkStartDate) }}
      </template>
    </Column>
    <Column field="checkEndDate" header="Дата окончания проверки" sortable dataType="date">
      <template #body="{ data }">
        {{ formatDate(data.checkEndDate) }}
      </template>
    </Column>
    <Column field="checkResult" header="Результат проверки">
      <template #body="{ data }">
        <span class="image-text">{{ data.checkResult }}</span>
      </template>
    </Column>
    <Column field="checkStatus" header="Проверка проведена" filterMatchMode="contains">
      <template #body="{ data }">
        <Tag :severity="data.checkStatus ? 'success' : 'danger'">{{ data.checkStatus ? "Да" : "Нет" }}</Tag>
      </template>
    </Column>
    <Column field="checkComment" header="Комментарий сотрудника СБ">
      <template #body="{ data }">
        <span class="image-text">{{ data.checkComment }}</span>
      </template>
    </Column>
    <Column field="endResult" header="Окончательный итог">
      <template #body="{ data }">
        <span class="image-text">{{ data.endResult }}</span>
      </template>
    </Column>
    <Column headerStyle="width: 4rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
      <template #body="{ data }">
        <Button type="button" icon="pi pi-cog" @click="editCandidate(data)"></Button>
      </template>
    </Column>
    <Column header="Анкета" headerStyle="width: 8rem; text-align: center"
      bodyStyle="text-align: center; overflow: visible">
      <template #body="{ data }">
        <FileUpload v-if="!data.questionnariesName" mode="basic" name="file" :maxFileSize="1000000" :customUpload="true"
          @uploader="uploadQuestionnaries($event, data.id)" :multiple="false" :auto="true" chooseLabel="Загрузить" />
        <div class="flex flex-space-between">
          <Tag style="cursor:pointer" v-if="data.questionnariesName" :value="data.questionnariesName"
            @click="downloadQuestionnaries(data.id)">
          </Tag>
          <Button v-if="data.questionnariesName" icon="pi pi-times"
            class="p-button-rounded p-button-danger p-button-text" @click="deleteQuestionnaries(data.id)" />
        </div>
      </template>
    </Column>
    <Column header="Трудовая книжка" headerStyle="width: 8rem; text-align: center"
      bodyStyle="text-align: center; overflow: visible">
      <template #body="{ data }">
        <FileUpload v-if="!data.workbookName" mode="basic" name="file" :maxFileSize="1000000" :customUpload="true"
          @uploader="uploadWorkbook($event, data.id)" :multiple="false" :auto="true" chooseLabel="Загрузить" />
        <div class="flex flex-space-between">
          <Tag style="cursor:pointer" v-if="data.workbookName" :value="data.workbookName"
            @click="downloadWorkbook(data.id)"></Tag>
          <Button v-if="data.workbookName" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text"
            @click="deleteWorkbook(data.id)" />
        </div>
      </template>
    </Column>
  </DataTable>
  <candidate-view :candidate="editedCandidate" :showComponent="showModal" v-if="showModal"
    @close-modal="showModal = false; editedCandidate = null"></candidate-view>
  <create-candidate-view :candidate="{}" :showComponent="showCreateModal" v-if="showCreateModal"
    @close-modal="showCreateModal = false"></create-candidate-view>
</template>

<script>
import CandidateService from '@/services/CandidateService.js';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CandidateView from './CandidateView.vue';
import CreateCandidateView from './CreateCandidateView.vue';

const API_URL = import.meta.env.VITE_API_URL;

export default {
  beforeRouteLeave(to, from, next) {
    if (to.redirectedFrom && to.redirectedFrom.name === 'logout') {
      this.localStorage.payload = null;
    }
    next()
  },

  created() {
    this.candidateService = new CandidateService();
  },

  mounted() {
    this.reloadCandidateList();
  },

  components: {
    CandidateView,
    CreateCandidateView,
  },

  data() {
    return {
      candidates: null,
      filters: {
        'id': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'fio': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      },
      loading: true,
      showModal: false,
      showCreateModal: false,
      editedCandidate: null,
    }
  },

  watch: {
    showModal: {
      handler(newValue) {
        if (!newValue) {
          this.reloadCandidateList();
        }
      }
    },

    showCreateModal: {
      handler(newValue) {
        if (!newValue) {
          this.reloadCandidateList();
        }
      }
    },
  },

  methods: {
    formatDate(value) {
      const time = new Date(value);
      return time.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },

    reloadCandidateList() {
      this.candidateService.getCandidates().then(data => {
        this.candidates = data;
        this.loading = false;
      });
    },

    editCandidate(candidate) {
      this.editedCandidate = candidate;
      this.showModal = true;
    },

    downloadQuestionnaries(id) {
      const url = `${API_URL}/candidates/downloadquest/${id}`;
      window.location.href = url;
    },

    uploadQuestionnaries(event, id) {
      this.candidateService.uploadQuestionnaries(event.files[0], id).then(() => {
        this.reloadCandidateList();
      });
    },

    deleteQuestionnaries(id) {
      this.candidateService.deleteQuestionnaries(id).then(() => this.reloadCandidateList()).catch(console.log);
    },

    downloadWorkbook(id) {
      const url = `${API_URL}/candidates/downloadworkbook/${id}`;
      window.location.href = url;
    },

    uploadWorkbook(event, id) {
      this.candidateService.uploadWorkbook(event.files[0], id).then(() => {
        this.reloadCandidateList();
      });
    },

    deleteWorkbook(id) {
      this.candidateService.deleteWorkbook(id).then(() => this.reloadCandidateList()).catch(console.log);
    },

    exportCSV() {
      this.$refs.dt.exportCSV();
    }
  },

  computed: {
    getRole() {
      return this.localStorage.payload.roles === 'security' ? false : true;
    },
  },

};
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
  .p-paginator-current {
    margin-left: auto;
  }
}

::v-deep(.p-progressbar) {
  height: .5rem;
  background-color: #D8DADC;

  .p-progressbar-value {
    background-color: #607D8B;
  }
}

::v-deep(.p-datepicker) {
  min-width: 25rem;

  td {
    font-weight: 400;
  }
}

::v-deep(.p-datatable.p-datatable-customers) {
  .p-datatable-header {
    padding: 1rem;
    text-align: left;
    font-size: 1.5rem;
  }

  .p-paginator {
    padding: 1rem;
  }

  .p-datatable-thead>tr>th {
    text-align: left;
  }

  .p-datatable-tbody>tr>td {
    cursor: auto;
  }

  .p-dropdown-label:not(.p-placeholder) {
    text-transform: uppercase;
  }
}
</style>