import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import reactiveStorage from "vue-reactive-storage";

import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import Password from 'primevue/password';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row';                     //optional for row
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import Tag from 'primevue/tag';
import FileUpload from 'primevue/fileupload';
import Dropdown from 'primevue/dropdown';

import 'primevue/resources/themes/saga-green/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.use(reactiveStorage, {
  "payload": null,
});

app.component('Menubar', Menubar);
app.component('InputText', InputText);
app.component('Button', Button);
app.component('Panel', Panel);
app.component('Password', Password);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Dialog', Dialog);
app.component('Calendar', Calendar);
app.component('Tag', Tag);
app.component('FileUpload', FileUpload);
app.component('Dropdown', Dropdown);

app.mount('#app')
