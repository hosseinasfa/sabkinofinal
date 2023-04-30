<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div
            id="particles-js"
            :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
        ></div>
        <q-btn
            color="white"
            class="absolute-top-right"
            flat
            round
            @click="$q.dark.toggle()"
            :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <q-card
            class="login-form"
            v-bind:style="
            $q.platform.is.mobile ? { width: '80%' } : { width: '30%' }
          "
        >
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">پنل مدیریت</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <!-- <q-input
                filled
                v-model="phone"
                label="نام کاربری"
                lazy-rules
              /> -->

              <q-input
                  type="text"
                  filled
                  v-model="username"
                  label="نام کاربری"
                  lazy-rules
              />

              <q-input
                  type="password"
                  filled
                  v-model="password"
                  label="رمز عبور"
                  lazy-rules
              />

              <div>
                
                <q-btn
                    label="ورود به حساب کاربری"
                    type="button"
                    color="primary"
                    class="full-width"
                    @click="loginNotify"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript"></script>
<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    loginNotify() {
      if(this.username.length <= 0){
        this.$q.notify({
          message: "نام کاربری خود را وارد کنید",
          color: "warning",
          position: "top",
        });
      }
      else if(this.password.length <= 0)
      {
        this.$q.notify({
          message: "رمز عبور خود را وارد کنید",
          color: "warning",
          position: "top",
        });
      } else if(this.username.length === 11){
        this.$axios
            .post("userPanel/checkPhone", {
              phone: this.username,
              password: this.password,
            }).then((response) => {
              console.log("phone",response)
           var tok = response.data.data.token
          console.log(response.data.status)
          if(response.data.status === true) {
            localStorage.setItem("token", tok);
            this.$router.push({
              path: "/"
            });
            this.$q.notify({
              message: "با موفقیت وارد شدید",
              color: "positive",
            });

          }else{

            this.$q.notify({
              message: "رمز عبور اشتباه",
              color: "negative",
              position: "top",
              icon: "report_problem",
            });
          }
          // localStorage.setItem("token", "company");
          // console.log(response);

          // this.$router.push({
          //   path: "/"
          // });
          // this.$q.notify({
          //   message: "با موفقیت وارد شدید",
          // });

          // response.data.data.items.forEach((row, index) => {
          //   row.index = index + 1;
          // });
          // this.table.data = response.data.data.items;
          // this.table.loading = false;
        })
            .catch(() => {
              console.log('test :::::::::::::::::');
              this.$q.notify({
                color: "negative",
                position: "top",
                message: "Loading failed",
                icon: "report_problem",
              });
            });
      }else{
        this.$axios
            .post("auth/auth-panel/verify", {
              enName: this.username,
              password: this.password,
            }).then((response) => {
          var tok = response.data.data.token
          console.log(response.data.status)
          if(response.data.status === true) {
            localStorage.setItem("token", tok);
            this.$router.push({
              path: "/"
            });
            this.$q.notify({
              message: "با موفقیت وارد شدید",
              color: "positive",
            });

          }else{

            this.$q.notify({
              message: "رمز عبور اشتباه",
              color: "negative",
              position: "top",
              icon: "report_problem",
            });
          }
          // localStorage.setItem("token", "company");
          // console.log(response);

          // this.$router.push({
          //   path: "/"
          // });
          // this.$q.notify({
          //   message: "با موفقیت وارد شدید",
          // });

          // response.data.data.items.forEach((row, index) => {
          //   row.index = index + 1;
          // });
          // this.table.data = response.data.data.items;
          // this.table.loading = false;
        })
            .catch(() => {
              console.log('test :::::::::::::::::');
              this.$q.notify({
                color: "negative",
                position: "top",
                message: "Loading failed",
                icon: "report_problem",
              });
            });
      }


      // if (this.username == "admin" && this.password == "admin") {
      //
      //   this.$router.push({
      //     path: "/"
      //   });
      //   this.$q.notify({
      //     message: "با موفقیت وارد شدید",
      //   });
      // }


    },
  },
  mounted() {
    localStorage.clear();
  },
};
</script>

<style>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(
      145deg,
      rgba(0, 0, 0, 1) 15%,
      rgba(0, 118, 109, 1) 70%
  );
}
.dark_gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}
.login-form {
  position: absolute;
}
</style>
