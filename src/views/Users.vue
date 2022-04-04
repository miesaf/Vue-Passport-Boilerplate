<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="10" md="12" class="py-3">
        <h3 class="pb-2">User Management</h3>

        <b-alert :show="alert.dismissCountDown" dismissible fade :variant="alert.class" @dismissed="alert.dismissCountDown=0" >
          <p>{{ alert.message }}</p>
        </b-alert>

        <b-overlay :show="loadingIndicator" rounded="sm">
          <b-card>
            <b-card class="mb-4">
              <b-button variant="success" @click="addUser()"><b-icon icon="plus" /> Add User</b-button>
              <b-button variant="secondary" class="float-right" v-b-tooltip.hover title="Refresh list" @click="getUserList()"><b-icon icon="arrow-repeat" /></b-button>
            </b-card>

            <b-table striped hover :items="users" :fields="tableFields" :busy="tableLoading">
              <template #table-busy>
                <div class="text-center text-secondary my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>&nbsp;&nbsp;&nbsp;Loading . . . </strong>
                </div>
              </template>

              <!-- A virtual column -->
              <template #cell(index)="data">
                {{ data.index + 1 }}
              </template>

              <!-- A virtual composite column -->
              <template #cell(action)="data">
                <b-button pill variant="info" size="sm" class="mr-1" v-b-tooltip.hover title="View user" @click="viewUser(data.item.id)"><b-icon icon="eye" /></b-button>
                <b-button pill variant="warning" size="sm" class="mr-1" v-b-tooltip.hover title="Edit user" @click="editUser(data.item.id)"><b-icon icon="pencil" /></b-button>
                <b-button pill variant="danger" size="sm" v-b-tooltip.hover title="Delete user" @click="delUserConfirmation(data.item)"><b-icon icon="trash" /></b-button>
              </template>
            </b-table>

            <!-- View modal -->
            <b-modal v-model="userDialog" title="User Details" @hide="clearUserData()">
              <b-form>
                <b-form-group label="User ID:" label-for="user_id">
                  <b-form-input id="user_id" v-model="userData.user_id" type="text" readonly />
                </b-form-group>

                <b-form-group label="Name:" label-for="name">
                  <b-form-input id="name" v-model="userData.name" type="text" readonly />
                </b-form-group>

                <b-form-group label="Email:" label-for="email">
                  <b-form-input id="email" v-model="userData.email" type="text" readonly />
                </b-form-group>

                <b-form-group label="Roles:" label-for="roles">
                  <p><b-badge variant="primary" v-for="role in userData.roles" :key="role.id" class="mr-2 mb-2">{{ role.name }}</b-badge></p>
                </b-form-group>

                <b-form-group label="Role Permissions:" label-for="permissions">
                  <p><b-badge variant="warning" v-for="permission in userData.rolePermissions" :key="permission.id" class="mr-2 mb-2">{{ permission }}</b-badge></p>
                </b-form-group>

                <b-form-group label="Extra Permissions:" label-for="extra_permissions">
                  <p v-if="userData.extraPermissions.length"><b-badge variant="warning" v-for="permission in userData.extraPermissions" :key="permission.id" class="mr-2 mb-2">{{ permission }}</b-badge></p>
                  <b-form-input id="last_login" v-else value="No extra permission assigned" type="text" readonly />
                </b-form-group>

                <b-form-group label="Last Login:" label-for="last_login">
                  <b-form-input id="last_login" v-if="userData.current_signin" v-model="userData.current_signin" type="text" readonly />
                  <b-form-input id="last_login" v-else value="This user had never logged in" type="text" readonly />
                </b-form-group>

                <b-form-group label="Account Status:" label-for="status">
                  <p><b-badge variant="success" v-if="userData.is_active" class="mr-2 mb-2"><b-icon icon="check-circle" /> Active</b-badge></p>
                  <p><b-badge variant="warning" v-if="!userData.is_active" class="mr-2 mb-2"><b-icon icon="dash-circle" /> Disabled</b-badge></p>
                  <p><b-badge variant="danger" v-if="userData.is_locked" class="mr-2 mb-2"><b-icon icon="lock" /> Locked</b-badge></p>
                </b-form-group>
              </b-form>

              <template #modal-footer>
                <div class="float-right">
                  <b-button variant="warning" @click="editUser(userData.id)"><b-icon icon="pencil" /> Edit</b-button>
                  <b-button variant="danger" class="ml-2" @click="delUserConfirmation(userData)"><b-icon icon="trash" /> Delete</b-button>
                </div>
              </template>
            </b-modal>

            <!-- Add/Edit modal -->
            <b-modal v-model="addUserDialog" :title="(editUserDialog ? 'Update' : 'Register') + ' User'" class="p-fluid" @hide="clearUserData()">
              <b-form :validated="formValidation" novalidate>
                <b-form-group label="User ID:" label-for="user_id">
                  <b-form-input id="user_id" v-model="input.userId.value" type="text" required />
                  <div class="invalid-feedback">
                    {{ input.userId.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Name:" label-for="name">
                  <b-form-input id="name" v-model="input.name.value" type="text" required />
                  <div class="invalid-feedback">
                    {{ input.name.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Email:" label-for="email">
                  <b-form-input id="email" v-model="input.email.value" type="email" required />
                  <div class="invalid-feedback">
                    {{ input.email.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Roles:" label-for="roles">
                  <b-form-select id="roles" v-model="input.roles.value" :options="options.roles" multiple required />
                  <div class="invalid-feedback">
                    {{ input.roles.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Extra Permissions:" label-for="extra_permissions">
                  <b-form-select id="roles" v-model="input.permissions.value" :options="options.permissions" multiple />
                  <div class="invalid-feedback">
                    {{ input.permissions.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Status:" label-for="status">
                  <b-form-select id="roles" v-model="input.status.value" :options="options.status" required />
                  <div class="invalid-feedback">
                    {{ input.status.errMsg }}
                  </div>
                </b-form-group>
              </b-form>

              <template #modal-footer>
                <div class="float-right">
                  <b-button variant="primary" v-if="!editUserDialog" @click="submitNewUser()">Submit</b-button>
                  <b-button variant="primary" v-if="editUserDialog" class="ml-2" @click="submitUserUpdate()">Update</b-button>
                </div>
              </template>
            </b-modal>

            <!-- Delete confirmation modal -->
            <b-modal v-model="deleteUserDialog" title="Delete User" @hide="clearUserData()">
              <b-row>
                <b-col cols="2">
                  <b-icon icon="exclamation-triangle-fill" variant="warning" class="mr-3" font-scale="3"></b-icon>
                </b-col>
                <b-col cols="10">
                  <span>Are you sure you want to delete <b>{{ userData.name }}</b>?</span>
                </b-col>
              </b-row>

              <template #modal-footer>
                <div class="float-right">
                  <b-button variant="secondary" @click="cancelDelUser()">Cancel</b-button>
                  <b-button variant="danger" class="ml-2" @click="delUser(userData)">Delete</b-button>
                </div>
              </template>
            </b-modal>
          </b-card>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { getUsers, getUser, storeUser, updateUser, deleteUser } from '@/api/user'

export default {
  name: "UserManagement",

  data() {
    return {
      alert: {
        message: '',
        class: '',
        dismissCountDown: 0
      },
      loadingIndicator: false,
      formValidation: false,

      tableFields: [
        {
          key: 'index',
          label: 'No.',
          sortable: true
        },
        {
          key: 'user_id',
          label: 'User ID',
          sortable: true
        },
        {
          key: 'name',
          label: 'Name',
          sortable: true
        },
        {
          key: 'email',
          label: 'Email',
          sortable: true
        },
        {
          key: 'action',
          label: 'Action',
          sortable: false
        },
      ],
      users: [],
      tableLoading: true,
      filters: {},

      userData: {
        rolePermissions: [],
        extraPermissions: []
      },
      userDialog: false,
      deleteUserDialog: false,
      displayConfirmation: false,

      addUserDialog: false,
      editUserDialog: false,
      input: {
        userId: { value: '', errMsg: null },
        name: { value: '', errMsg: null },
        email: { value: '', errMsg: null },
        roles: { value: [], errMsg: null },
        permissions: { value: [], errMsg: null },
        status: { value: [], errMsg: null }
      },

      options: {
        roles: [],
        permissions: [],
        status: []
      }
    }
  },

  computed: {
    isCustomer: function () {
      return this.input.roles.value.find(element => element.text == 'Customer')
    }
  },

  created() {
    var flashMessage = this.$session.flash.get("flash-message")
    if(flashMessage) {
      this.$bvToast.toast(flashMessage, { autoHideDelay: 5000, variant: this.$session.flash.get("flash-class"), solid: true })
    }

    this.$store.getters.options.roles.forEach(element => {
      this.options.roles.push({ value: element.text, text: element.text })
    })

    this.$store.getters.options.permissions.forEach(element => {
      this.options.permissions.push({ value: element.text, text: element.text })
    })

    this.$store.getters.options.status.forEach(element => {
      this.options.status.push({ value: element.value, text: element.text })
    })

    this.getUserList()
  },
  
  methods: {
    getUserList() {
      this.tableLoading = true

      try {
        getUsers()
          .then((res) => {
            if (res.data.total == 0) {
              this.isLoadNull = true
            }

            this.users = res.data.data
          })
          .catch(() => {
            this.$bvToast.toast("Failed to get user list", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.tableLoading = false)
      } catch (e) {
        console.error(e)
        this.$bvToast.toast("Failed to get user list", { autoHideDelay: 5000, variant: "danger", solid: true })
      }
    },

    addUser() {
      try {
        this.clearUserData()
        this.editUserDialog = false
        this.addUserDialog = true
      } catch (e) {
        this.$bvToast.toast("Failed to display register user form", { autoHideDelay: 5000, variant: "danger", solid: true })
      }
    },

    submitNewUser() {
      // Form Validation
      var doSubmit = true
      doSubmit = this.inputValidation(doSubmit)

      // Submit
      if (doSubmit) {
        this.loadingIndicator = true

        var newUserObj = {
          user_id: this.input.userId.value,
          name: this.input.name.value,
          email: this.input.email.value,
          roles: this.input.roles.value,
          permissions: this.input.permissions.value,
          status: this.input.status.value
        }

        try {
          storeUser(newUserObj)
            .then((res) => {
              if (res.data.status) {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })

                this.getUserList()
                this.addUserDialog = false
              } else {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
              }
            })
            .catch((e) => {
              if(e.response.status && e.response.status == 422) {
                this.$bvToast.toast(e.response.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })

                if(e.response.data.errors) {
                  var errObj = e.response.data.errors
                  this.input.user_id.errMsg = errObj.user_id ? errObj.user_id[0] : null
                  this.input.name.errMsg = errObj.name ? errObj.name[0] : null
                  this.input.email.errMsg = errObj.email ? errObj.email[0] : null
                  this.input.roles.errMsg = errObj.roles ? errObj.roles[0] : null
                  this.input.permissions.errMsg = errObj.permissions ? errObj.permissions[0] : null
                  this.input.status.errMsg = errObj.status ? errObj.status[0] : null
                }
              } else {
                this.$bvToast.toast("User registration failed due to network error.", { autoHideDelay: 5000, variant: "danger", solid: true })
              }
            })
            .finally(() => this.loadingIndicator = false)
        } catch (e) {
          console.error(e)
          this.loadingIndicator = false
        }
      }

      window.scrollTo(0,0)
    },

    editUser(id) {
      this.loadingIndicator = true
      this.userDialog = false
      this.clearUserData()

      try {
        this.editUserDialog = true

        getUser(id)
          .then((res) => {
            if(res.data.status) {
              const data = res.data.data
              this.userData.id = data.id

              this.input.userId.value = data.user_id
              this.input.name.value = data.name
              this.input.email.value = data.email

              // Populate roles selections
              var roles = []
              data.roles.forEach(element => { roles.push(element.name)})
              this.input.roles.value = roles

              // Populate permissions selections
              var permissions = []
              data.permissions.forEach(element => { permissions.push(element.name) })
              this.input.permissions.value = permissions

              // Populate status selections
              this.input.status.value = data.is_active

              this.addUserDialog = true
            } else {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
            }
          })
          .catch(() => {
            this.$bvToast.toast("Failed to get user details", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.loadingIndicator = false)
      } catch (e) {
        this.$bvToast.toast("Failed to display edit user form", { autoHideDelay: 5000, variant: "danger", solid: true })
      }
    },

    submitUserUpdate() {
      this.loadingIndicator = true

      // Form Validation
      var doSubmit = true
      doSubmit = this.inputValidation(doSubmit)

      // Submit
      if (doSubmit) {
        var updateUserObj = {
          user_id: this.input.userId.value,
          name: this.input.name.value,
          email: this.input.email.value,
          roles: this.input.roles.value,
          permissions: this.input.permissions.value,
          status: this.input.status.value
        }

        try {
          updateUser(this.userData.id, updateUserObj)
            .then((res) => {
              if (res.data.status) {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })

                this.getUserList()
                this.addUserDialog = false
              } else {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
              }
            })
            .catch((e) => {
              if(e.response.status && e.response.status == 422) {
                this.$bvToast.toast(e.response.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })

                if(e.response.data.errors) {
                  var errObj = e.response.data.errors
                  this.input.user_id.errMsg = errObj.user_id ? errObj.user_id[0] : null
                  this.input.name.errMsg = errObj.name ? errObj.name[0] : null
                  this.input.email.errMsg = errObj.email ? errObj.email[0] : null
                  this.input.roles.errMsg = errObj.roles ? errObj.roles[0] : null
                  this.input.permissions.errMsg = errObj.permissions ? errObj.permissions[0] : null
                  this.input.status.errMsg = errObj.status ? errObj.status[0] : null
                }
              } else {
                this.$bvToast.toast("User failed to update due to network error.", { autoHideDelay: 5000, variant: "danger", solid: true })
              }
            })
            .finally(() => this.loadingIndicator = false)
        } catch (e) {
          console.error(e)
          this.loadingIndicator = false
        }
      }
    },

    viewUser(userID) {
      this.loadingIndicator = true

      try {
        getUser(userID)
          .then((res) => {
            if(res.data.status) {
              const data = res.data.data

              this.userData = data

              var permissions = []
              data.roles.forEach(element => { element.permissions.forEach(element2 => { permissions.push(element2.name) }) })
              this.userData.rolePermissions = permissions

              var extraPermissions = []
              data.permissions.forEach(element => { extraPermissions.push(element.name) })
              this.userData.extraPermissions = extraPermissions

              this.userData.accountStatus = data.is_active ? 'Active' : 'Disabled'
              this.userData.accountStatusClass = data.is_active ? 'p-tag-success' : 'p-tag-warning'

              this.userDialog = true
            } else {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
            }
          }).catch(() => {
            this.$bvToast.toast("Failed to get user details", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.loadingIndicator = false)
      } catch (e) {
        console.error(e)
      }
    },

    delUser(user) {
      this.loadingIndicator = true

      try {
        deleteUser(user.id)
          .then((res) => {
            this.deleteUserDialog = false
            this.userDialog = false
            this.clearUserData()

            if (res.data.status) {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })

              this.getUserList()
            } else {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
            }
          })
          .catch(() => {
            this.$bvToast.toast("Failed to delete user", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.loadingIndicator = false)
      } catch (e) {
        console.error(e)
        this.$bvToast.toast("Failed to delete user", { autoHideDelay: 5000, variant: "danger", solid: true })
      }

      window.scrollTo(0,0)
    },

    delUserConfirmation(user) {
      this.userData.id = user.id
      this.userData.name = user.name
      this.deleteUserDialog = true
    },

    cancelDelUser() {
      this.deleteUserDialog = false
      this.$bvToast.toast("The user " + this.userData.name + " was not deleted", { autoHideDelay: 5000, variant: "warning", solid: true })
      this.userDialog ? null : this.clearUserData()
    },

    clearUserData() {
      this.userData = {
        rolePermissions: [],
        extraPermissions: []
      }

      this.formValidation = false

      this.input = {
        userId: { value: '', errMsg: null },
        name: { value: '', errMsg: null },
        email: { value: '', errMsg: null },
        roles: { value: [], errMsg: null },
        permissions: { value: [], errMsg: null },
        status: { value: [], errMsg: null }
      }
    },

    inputValidation(doSubmit) {
      this.formValidation = true

      // Form Validation
      this.input.userId.errMsg = null
      this.input.name.errMsg = null
      this.input.email.errMsg = null
      this.input.roles.errMsg = null
      this.input.permissions.errMsg = null
      this.input.status.errMsg = null

      if (!this.input.userId.value) {
        doSubmit = false
        this.input.userId.errMsg = "User ID must not be empty"
      }

      if (!this.input.name.value) {
        doSubmit = false
        this.input.name.errMsg = "Name must not be empty"
      }

      if (!this.input.email.value) {
        doSubmit = false
        this.input.email.errMsg = "Email must not be empty"
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(this.input.email.value)) {
        doSubmit = false
        this.input.email.errMsg = "Invalid email format entered"
      }

      if (this.input.status.value.length == 0) {
        doSubmit = false
        this.input.status.errMsg = "Please select a status"
      }

      return doSubmit
    }
  }
}
</script>
