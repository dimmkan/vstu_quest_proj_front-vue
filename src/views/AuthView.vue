<template>
  <div class="flex justify-content-center root-panel">
    <Panel class="w-3 h-15rem">
      <template #header>
        <div class="flex w-full justify-content-center">
          Авторизация
        </div>
      </template>
      <form class="form" @submit.prevent="handleSubmit">
        <div class="field">
          <div class="flex justify-content-between">
            <label for="login">Логин: </label>
            <InputText style="width:250px" id="login" type="username" v-model="login" class="login-input"
              :class="{ 'p-invalid': invalid_login }" />
          </div>
        </div>
        <div class="field">
          <div class="flex justify-content-between mt-2">
            <label for="password">Пароль: </label>
            <Password inputStyle="width:250px" id="password" v-model="password" toggleMask :class="{ 'p-invalid': invalid_password }"></Password>
          </div>
        </div>

        <div class="flex justify-content-center mt-2" v-if="auth_error">
          <small id="auth-error" style="color:red"> Неверный логин или пароль! </small>
        </div>

        <div class="flex justify-content-center mt-4">
          <Button label="Войти" type="submit" />
        </div>
      </form>
    </Panel>
  </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});


export default {
  data() {
    return {
      login: '',
      password: '',
      invalid_login: false,
      invalid_password: false,
      auth_error: false,
    }
  },


  methods: {
    handleSubmit() {
      if (!this.validateInput()) return;

      instance.post('/auth/login',
        {
          login: this.login,
          password: this.password
        }
      ).then((response) => {
        const resIsAuth = !!response.data.access_token;
        if (resIsAuth) {
          const payload = jwt_decode(response.data.access_token);
          this.localStorage.payload = payload;
          this.$router.push('/candidates');
        } else {
          this.invalid_login = true;
          this.invalid_password = true;
          this.auth_error = true;

          setTimeout(() => {
            this.invalid_login = false;
            this.invalid_password = false;
            this.auth_error = false;
          }, 3000);
        }
      }
      ).catch((error) => {
        console.log(error);
      }
      )
    },

    validateInput() {
      if (this.login === '') {
        this.invalid_login = true;
        setTimeout(() => {
          this.invalid_login = false;
        }, 5000);
        return false;
      }

      if (this.password === '') {
        this.invalid_password = true;
        setTimeout(() => {
          this.invalid_password = false;
        }, 5000);
        return false;
      }

      return true;
    },
  },
};
</script>

<style scoped>
.p-panel {
  border-radius: 5px;
  border-color: var(--teal-700);
}

.p-panel-content {
  background-color: #ffffff;
}

.login-input {
  width: 235px;
}

.root-panel {
  margin-top: 10%;
}
</style>