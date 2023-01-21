<template>
  <DataTable :value="edses" :paginator="true" class="p-datatable-users mt-3" :rows="5" dataKey="id" :rowHover="true"
    v-model:filters="filters" filterDisplay="menu" :loading="loading"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 15]" currentPageReportTemplate="Показаны с {first} по {last} из {totalRecords} записей"
    :globalFilterFields="['id', 'organigation', 'certificateSerial']" responsiveLayout="scroll">
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <div>
          <h4 class="m-0">Сертификаты ЭЦП</h4>
        </div>
        <div>
          <Button label="Добавить" icon="pi pi-plus" class="p-button-rounded" @click="showCreateModal=true"/>
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
    <Column field="organization" header="Организация" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.organization }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по организации" />
      </template>
    </Column>
    <Column field="position" header="Должность" sortable>
      <template #body="{ data }">
        <span class="image-text">{{ data.position }}</span>
      </template>
    </Column>
    <Column field="fullname" header="ФИО" sortable>
      <template #body="{ data }">
        <span class="image-text">{{ data.fullname }}</span>
      </template>
    </Column>
    <Column field="inn" header="ИНН организации" sortable>
      <template #body="{ data }">
        <span class="image-text">{{ data.inn }}</span>
      </template>
    </Column>
    <Column field="certificateSerial" header="Серийный номер" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.certificateSerial }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по номеру" />
      </template>
    </Column>
    <Column field="vendor" header="Поставщик">
      <template #body="{ data }">
        <span class="image-text">{{ data.vendor }}</span>
      </template>
    </Column>
    <Column field="usageType" header="Тип" filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.usageType }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по типу" />
      </template>
    </Column>
    <Column field="fromDate" header="Действует с" sortable dataType="date">
      <template #body="{ data }">
        {{ formatDate(data.fromDate) }}
      </template>
    </Column>
    <Column field="toDate" header="Действует по" sortable dataType="date">
      <template #body="{ data }">
        {{ formatDate(data.toDate) }}
      </template>
    </Column>
    <Column field="comment" header="Комментарий">
      <template #body="{ data }">
        <span class="image-text">{{ data.comment }}</span>
      </template>
    </Column>
    <Column field="accountId" header="ID аккаунта">
      <template #body="{ data }">
        <span class="image-text">{{ data.accountId }}</span>
      </template>
    </Column>
    <Column headerStyle="width: 4rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
      <template #body="{ data }">
        <Button type="button" icon="pi pi-cog" @click="editEds(data)"></Button>
      </template>
    </Column>
    <Column headerStyle="width: 4rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
      <template #body="{ data }">
        <FileUpload v-if="!data.fileName" mode="basic" name="file" :maxFileSize="1000000" :customUpload="true"
          @uploader="uploadFile($event, data.id)" :multiple="false" :auto="true" chooseLabel="Загрузить" />
        <Tag v-if="data.fileName" :value="data.fileName" @click="downloadFile(data.id)"></Tag>
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <Button v-if="data.fileName" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text"
          @click="deleteFile(data.id)" />
      </template>
    </Column>
  </DataTable>
  <eds-view :eds="editedEds" :showComponent="showModal" v-if="showModal"
    @close-modal="showModal = false; editedEds = null"></eds-view>
  <create-eds-view :eds="{}" :showComponent="showCreateModal" v-if="showCreateModal"
    @close-modal="showCreateModal = false"></create-eds-view>
</template>

<script>
//import CandidateService from '@/services/CandidateService.js';
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
    //this.edsService = new EdsService();
  },

  mounted() {
    //this.reloadEdsList();
  },

  components: {
    CandidateView,
    CreateCandidateView,
  },

  data() {
    return {
      edses: null,
      filters: {
        'id': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'organigation': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'certificateSerial': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'usageType': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      },
      loading: true,
      showModal: false,
      showCreateModal: false,
      editedEds: null,
    }
  },

  watch: {
    showModal: {
      handler(newValue) {
        if (!newValue) {
          this.reloadEdsList();
        }
      }
    },

    showCreateModal: {
      handler(newValue) {
        if (!newValue) {
          this.reloadEdsList();
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

    reloadEdsList() {
      this.edsService.getEdses().then(data => {
        this.edses = data;
        this.loading = false;
      });
    },

    editEds(eds) {
      this.editedEds = eds;
      this.showModal = true;
    },

    downloadFile(id) {
      const url = `${API_URL}/eds/downloadfile/${id}`;
      window.location.href = url;
    },

    uploadFile(event, id) {
      this.edsService.uploadFile(event.files[0], id).then(() => {
        this.reloadEdsList();
      });
    },

    deleteFile(id) {
      this.edsService.deleteFile(id).then(() => this.reloadEdsList()).catch(console.log);
    }
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