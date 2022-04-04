<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="10" md="12" class="py-3">
        <h3 class="pb-2">Password Policies</h3>

        <b-alert :show="alert.dismissCountDown" dismissible fade :variant="alert.class" @dismissed="alert.dismissCountDown=0" >
          <p>{{ alert.message }}</p>
        </b-alert>

        <b-overlay :show="loadingIndicator" rounded="sm">
          <b-card>
            <b-card class="mb-4">
              <b-button variant="secondary" class="float-right" v-b-tooltip.hover title="Refresh list" @click="getPwdPolicyList()"><b-icon icon="arrow-repeat" /></b-button>
            </b-card>

            <b-table striped hover :items="pwdPolicies" :fields="tableFields" :busy="tableLoading">
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

              <template #cell(status)="data">
                <b-badge variant="success" v-if="data.item.status" class="mr-2 mb-2">Enabled</b-badge>
                <b-badge variant="danger" v-else class="mr-2 mb-2">Disabled</b-badge>
              </template>

              <!-- A virtual composite column -->
              <template #cell(action)="data">
                <b-button pill variant="warning" size="sm" v-b-tooltip.hover title="Update policy" @click="editPwdPolicy(data.item)"><b-icon icon="pencil" /></b-button>
              </template>
            </b-table>

            <!-- Edit modal -->
            <b-modal v-model="pwdPolicyDialog" title="Update Password Policy" @hide="clearPwdPolicyData()">
              <b-form :validated="formValidation" novalidate>
                <b-form-group label="ID:" label-for="id">
                  <b-form-input id="user_id" v-model="pwdPolicyData.id" type="text" readonly />
                </b-form-group>

                <b-form-group label="Name:" label-for="name">
                  <b-form-input id="name" v-model="pwdPolicyData.name" type="text" readonly />
                </b-form-group>

                <b-form-group label="Description:" label-for="desc">
                  <b-form-textarea id="email" v-model="pwdPolicyData.description" rows="3" readonly />
                </b-form-group>

                <b-form-group label="Value:" label-for="value" v-if="pwdPolicyData.valueFlag">
                  <b-form-input id="value" v-model="input.value.value" type="text" required />
                  <div class="invalid-feedback">
                    {{ input.value.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Status:" label-for="status">
                  <b-form-checkbox v-model="input.status.value" value="1" unchecked-value="0">{{ (input.status.value == true) ? "Enabled" : "Disabled"}}</b-form-checkbox>
                  <div class="invalid-feedback">
                    {{ input.status.errMsg }}
                  </div>
                </b-form-group>
              </b-form>

              <template #modal-footer>
                <div class="float-right">
                  <b-button variant="primary" class="ml-2" @click="updatePwdPolicy(pwdPolicyData)">Update</b-button>
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
import { getPwdPolicies, updatePwdPolicy } from '@/api/pwdPolicies'

export default {
  name: "PasswordPolicyManagement",

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
          key: 'name',
          label: 'Name',
          sortable: true
        },
        {
          key: 'desc',
          label: 'Description',
          sortable: true
        },
        {
          key: 'value',
          label: 'Value',
          sortable: true
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true
        },
        {
          key: 'action',
          label: 'Action',
          sortable: false
        },
      ],
      pwdPolicies: [],
      tableLoading: true,
      filters: {},
      
      pwdPolicyData: {},
      pwdPolicyDialog: false,
      displayConfirmation: false,

      input: {
        value: { value: '', errMsg: null },
        status: { value: '', errMsg: null }
      },
    }
  },
  created() {
    var flashMessage = this.$session.flash.get("flash-message")
    if(flashMessage) {
      this.$bvToast.toast(flashMessage, { autoHideDelay: 5000, variant: this.$session.flash.get("flash-class"), solid: true })
    }

    this.getPwdPolicyList()
  },
  methods: {
    getPwdPolicyList() {
      this.tableLoading = true

      try {
        getPwdPolicies()
          .then((res) => {
            if (res.data.total == 0) {
              this.isLoadNull = true
            }

            this.pwdPolicies = res.data.data
          })
          .catch(() => {
            this.$bvToast.toast("Failed to get password policy list", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.tableLoading = false)
      } catch (e) {
        console.error(e)
      }
    },

    editPwdPolicy(pwdPolicy) {
      this.clearPwdPolicyData()
      this.pwdPolicyData = Object.assign({}, pwdPolicy)
      this.input.value.value = pwdPolicy.value
      this.input.status.value = pwdPolicy.status
      this.pwdPolicyData.valueFlag = pwdPolicy.value
      this.pwdPolicyDialog = true
    },

    async updatePwdPolicy(pwdPolicy) {
      this.loadingIndicator = true

      if(pwdPolicy.valueFlag) {
        if(!this.input.value.value) {
          this.input.value.errMsg = "The value parameter must not be empty"
          return
        }
      }

      var reqObj = {
        value: this.input.value.value,
        status: this.input.status.value
      }

      try {
        await updatePwdPolicy(pwdPolicy.id, reqObj)
          .then((res) => {
            this.pwdPolicyDialog = false
            this.clearPwdPolicyData()

            if (res.data.status) {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })
              this.getPwdPolicyList()
            } else {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
            }
          })
          .catch((e) => {
            if(e.response.status && e.response.status == 422) {
              this.$bvToast.toast(e.response.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })

              if(e.response.data.errors) {
                var errObj = e.response.data.errors
                this.input.value.errMsg = errObj.value ? errObj.value[0] : null
                this.input.status.errMsg = errObj.status ? errObj.status[0] : null
              }
            } else {
              this.$bvToast.toast("Failed to update password policy.", { autoHideDelay: 5000, variant: "danger", solid: true })
            }
          })
          .finally(() => this.loadingIndicator = false)
      } catch (e) {
        console.error(e)
      }

      window.scrollTo(0,0)
    },

    clearPwdPolicyData() {
      this.pwdPolicyData = {}

      this.input = {
        value: { value: '', errMsg: null },
        status: { value: '', errMsg: null }
      }
    }
  }
}
</script>
