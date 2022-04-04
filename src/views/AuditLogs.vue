<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="10" md="12" class="py-3">
        <h3 class="pb-2">Audit Logs</h3>

        <b-alert :show="alert.dismissCountDown" dismissible fade :variant="alert.class" @dismissed="alert.dismissCountDown=0" >
          <p>{{ alert.message }}</p>
        </b-alert>

        <b-overlay :show="loadingIndicator" rounded="sm">
          <b-card>
            <b-card class="mb-4">
              <b-button variant="secondary" class="float-right ml-2" @click="getAuditLogList()"><b-icon icon="arrow-repeat" /></b-button>
              <!-- <b-button variant="primary" class="float-right" @click="toggleSearch()"><b-icon icon="search" /> Search</b-button> -->
            </b-card>

            <b-table striped hover :items="auditLogs" :fields="tableFields" :busy="tableLoading">
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
                <b-button pill variant="info" size="sm" class="mr-1" @click="viewAuditLog(data.item.id)"><b-icon icon="eye" /></b-button>
              </template>
            </b-table>

            <!-- View modal -->
            <b-modal v-model="auditDialog" title="Audit Log Details" size="xl" hide-footer>
              <b-form>
                <b-form-group label="ID:" label-for="id">
                  <b-form-input id="id" v-model="auditData.id" type="text" readonly />
                </b-form-group>

                <b-form-group label="User ID:" label-for="user_id">
                  <b-form-input id="user_id" v-model="auditData.user_id" type="text" readonly />
                </b-form-group>

                <b-form-group label="Request Time:" label-for="req_time">
                  <b-form-input id="req_time" v-model="auditData.req_time" type="text" readonly />
                </b-form-group>

                <b-form-group label="Category:" label-for="category">
                  <b-form-input id="category" v-model="auditData.category" type="text" readonly />
                </b-form-group>

                <b-form-group label="Vardata:" label-for="vardata">
                  <pre class="mt-3 mb-0">{{ auditData.vardata }}</pre>
                </b-form-group>
              </b-form>
            </b-modal>
          </b-card>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { getAuditLogs, getAuditLog, searchAuditLogs } from '@/api/auditLog'

export default {
  name: "AuditLog",

  data() {
    return {
      alert: {
        message: '',
        class: '',
        dismissCountDown: 0
      },
      loadingIndicator: false,

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
          key: 'req_time',
          label: 'Request Time',
          sortable: true
        },
        {
          key: 'category',
          label: 'Category',
          sortable: true
        },
        {
          key: 'action',
          label: 'Action',
          sortable: false
        },
      ],
      auditLogs: [],
      tableLoading: true,
      filters: {},

      auditData: {},
      auditDialog: false,

      isListSearch: false,
      displaySearch: false,
      searchData: {
        startDate: { value: '', errMsg: null },
        endDate: { value: '', errMsg: null },
        vardata: { value: '', errMsg: null }
      }
    }
  },

  created() {
    var flashMessage = this.$session.flash.get("flash-message")
    if(flashMessage) {
      this.$bvToast.toast(flashMessage, { autoHideDelay: 5000, variant: this.$session.flash.get("flash-class"), solid: true })
    }

    this.getAuditLogList()
  },

  methods: {
    refreshList() {
      if(this.isListSearch) {
        this.search()
      } else {
        this.getAuditLogList()
      }
    },

    getAuditLogList() {
      this.tableLoading = true

      try {
        getAuditLogs()
          .then((res) => {
            if (res.data.total == 0) {
              this.isLoadNull = true
            }

            this.auditLogs = res.data.data
          })
          .catch(() => {
            this.$bvToast.toast("Failed to get audit log list", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.tableLoading = false)
      } catch (e) {
        console.error(e)
        this.$bvToast.toast("Failed to get audit log list", { autoHideDelay: 5000, variant: "danger", solid: true })
      }
    },

    search() {
      this.isLoadNull = false
      this.tableLoading = true

      try {
        var reqObj = {}

        if(this.searchData.startDate.value) {
          reqObj.start_date = this.searchData.startDate.value
        }

        if(this.searchData.endDate.value) {
          reqObj.end_date = this.searchData.endDate.value
        }

        if(this.searchData.vardata.value) {
          reqObj.vardata = this.searchData.vardata.value
        }

        searchAuditLogs(reqObj)
          .then((res) => {
            this.isListSearch = true

            if (res.data.total == 0) {
              this.isLoadNull = true
            }

            this.auditLogs = res.data.data
          })
          .catch(() => {
            this.$bvToast.toast("Failed to search audit log", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.tableLoading = false)
      } catch (e) {
        console.error(e)
        this.$bvToast.toast("Failed to search audit log", { autoHideDelay: 5000, variant: "danger", solid: true })
      }
    },

    viewAuditLog(id) {
      this.loadingIndicator = true

      try {
        getAuditLog(id)
          .then((res) => {
            if(res.data.status) {
              const data = res.data.data

              this.auditData = data
              this.auditDialog = true
            } else {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
            }
          })
          .catch(() => {
            this.$bvToast.toast("Failed to get audit log detail", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.loadingIndicator = false)
      } catch (e) {
        console.error(e)
        this.$bvToast.toast("Failed to get audit log detail", { autoHideDelay: 5000, variant: "danger", solid: true })
      }
    },

    toggleSearch() {
      this.displaySearch = !this.displaySearch
    },
  }
}
</script>
