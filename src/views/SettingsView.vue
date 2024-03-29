<template>
   <settings-layout>
      <v-list
         density="compact"
         class="py-0 bg-transparent rounded-t-lg"
      >
         <app-setting
            v-for="setting in settings"
            :setting='setting'
            class='menu-item-setting'
            :key="setting.title"
            @click="showSettingSheet(setting.title)"
         ></app-setting>
      </v-list>
      <v-bottom-sheet v-model="sheet">
         <v-card
            height='490'
            class='pa-0 rounded-t-lg bg-grey-lighten-3'
         >
            <v-card-title class='py-7 mb-1 text-center text-white text-h5'>
               {{ category }}
            </v-card-title>
            <v-list
               class='pa-0 ma-5 bg-transparent rounded-t-lg'
            >
               <v-list-item
                  v-for='item in filteredItems'
                  class='text-h6 bg-white pa-5 pr-3 my-border'
                  :class="`${item.showSwitch ? 'py-1' : 'py-4'}`"
                  @click='item.routing'
               >
                  {{ item.title}} {{ item.value }}
                  <template v-if='item.showSwitch' v-slot:append>
                     <v-switch
                        v-model='switchValue'
                        hide-details
                        :inset='true'
                     ></v-switch>
                  </template>
                  <template v-if='item.icon' v-slot:append>
                     <v-icon :icon="item.icon"></v-icon>
                  </template>
               </v-list-item>
            </v-list>
         </v-card>
      </v-bottom-sheet>

      <v-bottom-sheet v-model='changePasswordSheet'>
         <v-card title='Змінити пароль'>
            <v-card-text>
               <v-text-field label='Старий пароль'  v-model='passwords.oldPassword' type='password'></v-text-field>
               <v-text-field label='Новий пароль'  v-model='passwords.newPassword' type='password'></v-text-field>
            </v-card-text>
            <v-card-actions class='d-flex justify-center'>
               <v-btn color='primary' class='w-100' @click='changePasswordFun()'>Змінити</v-btn>
            </v-card-actions>
         </v-card>
      </v-bottom-sheet>
   </settings-layout>
</template>

<script lang='ts' setup>
import SettingsLayout from '@/layouts/SettingsLayout.vue'
import AppSetting from '@/components/AppSetting.vue'
import {reactive, ref} from 'vue'
import {useUserStore} from '@/stores'
import {storeToRefs} from 'pinia'
interface SettingItem {
   title: string
   category: string
   value?: string
   showSwitch: boolean
   icon: string
   routing?: Function
}

interface ChangePassword {
   oldPassword: string,
   newPassword: string
}


const settings = [
   {title: 'Аккаунт', icon: 'mdi-account-outline'},
   {title: 'Повідомлення', icon: 'mdi-bell-outline'},
   {title: 'Вигляд', icon: 'mdi-eye-outline'},
   {title: 'Приватність', icon: 'mdi-lock-outline'},
   {title: 'Написати відгук', icon: 'mdi-comment-quote-outline'},
   {title: 'Політика', icon: 'mdi-information-slab-box-outline'},
]

const switchValue = ref(false)

const sheet = ref(false)
const changePasswordSheet = ref(false)
const category = ref('')

const userStore = useUserStore()
const {currentUser} = storeToRefs(userStore)


const filteredItems = ref<SettingItem[]>([])

const showSettingSheet = (settingCategory: string) => {
   category.value = settingCategory
   sheet.value = !sheet.value
   filteredItems.value = settingsItems.filter(item => item.category === category.value)
}

const passwords: ChangePassword = reactive({
   oldPassword: '',
   newPassword: ''
})

const changePasswordFun = async () => {
  await userStore.changePassword(passwords)
   changePasswordSheet.value = false
}

const openSheetChangePassword = () => {
   changePasswordSheet.value = true
   sheet.value = false
}

const settingsItems: SettingItem[] = [
   {title: `Ім'я:`, category: 'Аккаунт', value: currentUser?.value?.name, showSwitch: false, icon: ''},
   {title: 'Email:', category: 'Аккаунт', value: currentUser?.value?.email, showSwitch: false, icon: ''},
   {title: 'Змінити пароль', category: 'Аккаунт', value: '', showSwitch: false, icon: 'mdi-chevron-right', routing: openSheetChangePassword},
   {title: 'Вийти з аккаунту', category: 'Аккаунт', value: '', showSwitch: false, icon: 'mdi-chevron-right', routing: userStore.logout},
   {title: 'Сповіщати', category: 'Повідомлення', value: '', showSwitch: true, icon: ''},
]

</script>

<style lang='scss' scoped>
.my-border {
   border-bottom: 3px solid rgba(128, 128, 128, 0.4);
   margin: 5px;
   border-radius: 15px;
}

.v-card-title {
   background-color: #135DD8;
}
.menu-item-setting{
   margin: 5px;
   border-radius: 15px;
}
</style>