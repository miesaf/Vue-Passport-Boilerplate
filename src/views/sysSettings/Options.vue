<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="10" md="12" class="py-3">
        <h3 class="pb-2">Option Management</h3>

        <b-alert :show="alert.dismissCountDown" dismissible fade :variant="alert.class" @dismissed="alert.dismissCountDown=0" >
          <p>{{ alert.message }}</p>
        </b-alert>

        <b-overlay :show="loadingIndicator" rounded="sm">
          <b-card>
            <b-card class="mb-4">
              <b-button variant="success" @click="addOption()"><b-icon icon="plus" /> Add Option</b-button>
              <b-button variant="secondary" class="float-right" v-b-tooltip.hover title="Refresh list" @click="getOptionList()"><b-icon icon="arrow-repeat" /></b-button>
            </b-card>

            <b-table striped hover :items="optMgts" :fields="tableFields" :busy="tableLoading">
              <template #table-busy>
                <div class="text-center text-secondary my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>&nbsp;&nbsp;&nbsp;Loading . . . </strong>
                </div>
              </template>

              <!-- A virtual composite column -->
              <template #cell(action)="data">
                <b-button pill variant="info" size="sm" class="mr-1" v-b-tooltip.hover title="View option" @click="viewOption(data.item.id)"><b-icon icon="eye" /></b-button>
                <b-button pill variant="warning" size="sm" class="mr-1" v-b-tooltip.hover title="Edit option" @click="editOption(data.item.id)"><b-icon icon="pencil" /></b-button>
                <b-button pill variant="danger" size="sm" v-b-tooltip.hover title="Delete option" @click="delOptionConfirmation(data.item)"><b-icon icon="trash" /></b-button>
              </template>
            </b-table>

            <!-- View modal -->
            <b-modal v-model="optionDialog" title="Option Details" @hide="clearOptionData()">
              <b-form>
                <b-form-group label="ID:" label-for="id">
                  <b-form-input id="id" v-model="optionData.id" type="text" readonly />
                </b-form-group>

                <b-form-group label="Category:" label-for="category">
                  <b-form-input id="category" v-model="optionData.category" type="text" readonly />
                </b-form-group>

                <b-form-group label="Code:" label-for="code">
                  <b-form-input id="code" v-model="optionData.code" type="text" readonly />
                </b-form-group>

                <b-form-group label="Display:" label-for="display">
                  <b-form-input id="display" v-model="optionData.display" type="text" readonly />
                </b-form-group>

                <b-form-group label="Description:" label-for="desc" v-if="optionData.description">
                  <b-form-textarea id="desc" v-model="optionData.description" rows="3" readonly />
                </b-form-group>

                <b-form-group label="Flag:" label-for="flag" v-if="optionData.flag">
                  <b-form-input id="flag" v-model="optionData.flag" type="text" readonly />
                </b-form-group>
              </b-form>

              <template #modal-footer>
                <div class="float-right">
                  <b-button variant="warning" @click="editOption(optionData.id)"><b-icon icon="pencil" /> Edit</b-button>
                  <b-button variant="danger" class="ml-2" @click="delOptionConfirmation(optionData)"><b-icon icon="trash" /> Delete</b-button>
                </div>
              </template>
            </b-modal>

            <!-- Add/Edit modal -->
            <b-modal v-model="addOptionDialog" :title="(editOptionDialog ? 'Update' : 'Add') + ' Option'" class="p-fluid" @hide="clearOptionData()">
              <b-form :validated="formValidation" novalidate>
                <b-form-group label="Category:" label-for="category">
                  <b-form-select id="category" v-model="input.category.value" :options="options.category" required />
                  <div class="invalid-feedback">
                    {{ input.category.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="New Category:" label-for="new_category" v-if="input.category.value == 'New category'">
                  <b-form-input id="new_category" v-model="input.newCategory.value" type="text" required />
                  <div class="invalid-feedback">
                    {{ input.newCategory.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Code:" label-for="code">
                  <b-form-input id="code" v-model="input.code.value" type="text" required />
                  <div class="invalid-feedback">
                    {{ input.code.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Display:" label-for="display">
                  <b-form-input id="display" v-model="input.display.value" type="text" required />
                  <div class="invalid-feedback">
                    {{ input.display.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Description:" label-for="desc">
                  <b-form-textarea id="desc" v-model="input.desc.value" rows="3" />
                  <div class="invalid-feedback">
                    {{ input.desc.errMsg }}
                  </div>
                </b-form-group>

                <b-form-group label="Flag:" label-for="flag">
                  <b-form-input id="flag" v-model="input.flag.value" type="text" />
                  <div class="invalid-feedback">
                    {{ input.flag.errMsg }}
                  </div>
                </b-form-group>
              </b-form>

              <template #modal-footer>
                <div class="float-right">
                  <b-button variant="primary" v-if="!editOptionDialog" @click="submitNewOption()">Submit</b-button>
                  <b-button variant="primary" v-if="editOptionDialog" class="ml-2" @click="submitOptionUpdate()">Update</b-button>
                </div>
              </template>
            </b-modal>

            <!-- Delete confirmation modal -->
            <b-modal v-model="deleteOptionDialog" title="Delete Option" @hide="clearOptionData()">
              <b-row>
                <b-col cols="2">
                  <b-icon icon="exclamation-triangle-fill" variant="warning" class="mr-3" font-scale="3"></b-icon>
                </b-col>
                <b-col cols="10">
                  <span>Are you sure you want to delete this option?<br/><br/>
                    Category: <b>{{ optionData.category }}</b><br/>
                    Code: <b>{{ optionData.code }}</b><br/>
                    Display: <b>{{ optionData.display }}</b>
                  </span>
                </b-col>
              </b-row>

              <template #modal-footer>
                <div class="float-right">
                  <b-button variant="secondary" @click="cancelDelOption()">Cancel</b-button>
                  <b-button variant="danger" class="ml-2" @click="delOption(optionData.id)">Delete</b-button>
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
import { getOptions, getOption, getCategories, storeOption, updateOption, deleteOption } from '@/api/option'

export default {
  name: "OptionManagement",

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
          key: 'id',
          label: 'ID',
          sortable: true
        },
        {
          key: 'category',
          label: 'Category',
          sortable: true
        },
        {
          key: 'code',
          label: 'Code',
          sortable: true
        },
        {
          key: 'display',
          label: 'Display',
          sortable: true
        },
        {
          key: 'flag',
          label: 'Flag',
          sortable: true
        },
        {
          key: 'action',
          label: 'Action',
          sortable: false
        },
      ],
      optMgts: [],
      tableLoading: true,
      filters: {},

      optionData: {},
      optionDialog: false,
      deleteOptionDialog: false,
      displayConfirmation: false,

      addOptionDialog: false,
      editOptionDialog: false,
      input: {
        category: { value: '', errMsg: null },
        newCategory: { value: '', errMsg: null },
        code: { value: '', errMsg: null },
        display: { value: '', errMsg: null },
        desc: { value: '', errMsg: null },
        flag: { value: '', errMsg: null }
      },
      selectedAutoValue: null,
      categoryFiltered: [],

      options: {
        category: []
      }
    }
  },
  created() {
    var flashMessage = this.$session.flash.get("flash-message")
    if(flashMessage) {
      this.$bvToast.toast(flashMessage, { autoHideDelay: 5000, variant: this.$session.flash.get("flash-class"), solid: true })
    }

    this.getOptionList()
  },
  methods: {
    getOptionList() {
      this.tableLoading = true

      try {
        getOptions()
          .then((res) => {
            this.optMgts = res.data.data
          })
          .catch(() => {
            this.$bvToast.toast("Failed to fetch option list", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.tableLoading = false )
      } catch (e) {
        console.error(e)
        this.$bvToast.toast("Failed to fetch option list", { autoHideDelay: 5000, variant: "danger", solid: true })
      }
    },

    async getCategoryList() {
      this.loadingIndicator = await true
      this.options.category = []
      this.options.category.push({ value: "New category", text: "New category" })

      try {
        await getCategories()
          .then((res) => {
            if (res.data.status) {
              res.data.data.forEach(element => {
                this.options.category.push({ value: element, text: element })
              })
            } else {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
            }
          })
          .catch(() => {
            this.$bvToast.toast("Failed to fetch option categories due to network error.", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.loadingIndicator = false)
      } catch (e) {
        console.error(e)
        await this.$bvToast.toast("Failed to fetch option categories due to network error.", { autoHideDelay: 5000, variant: "danger", solid: true })
      }
    },

    searchCategory(event) {
      setTimeout(() => {
        if (!event.query.trim().length) {
          this.categoryFiltered = [...this.options.category]
        }
        else {
          this.categoryFiltered = this.options.category.filter((category) => {
            return category.name.toLowerCase().startsWith(event.query.toLowerCase())
          })
        }
      }, 250)
    },

    async addOption() {
      try {
        await this.getCategoryList()
        this.editOptionDialog = await false
        this.addOptionDialog = await true
      } catch (e) {
        this.addOptionDialog = false
        this.$bvToast.toast("Failed to display add option form", { autoHideDelay: 5000, variant: "danger", solid: true })
      }
    },

    submitNewOption() {
      // Form Validation
      var doSubmit = true
      doSubmit = this.inputValidation(doSubmit)

      // Submit
      if (doSubmit) {
        this.loadingIndicator = true

        if(this.input.category.value == 'New category') {
          this.input.category.value = this.input.newCategory.value
        }

        var newOptionObj = {
          category: this.input.category.value,
          code: this.input.code.value,
          display: this.input.display.value,
          description: this.input.desc.value,
          flag: this.input.flag.value
        }

        try {
          storeOption(newOptionObj)
            .then((res) => {
              if (res.data.status) {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })

                this.getOptionList()
                this.addOptionDialog = false
              } else {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
              }
            })
            .catch((e) => {
              if(e.response.status && e.response.status == 422) {
                this.$bvToast.toast(e.response.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })

                if(e.response.data.errors) {
                  var errObj = e.response.data.errors
                  this.input.category.errMsg = errObj.category ? errObj.category[0] : null
                  this.input.code.errMsg = errObj.code ? errObj.code[0] : null
                  this.input.display.errMsg = errObj.display ? errObj.display[0] : null
                  this.input.desc.errMsg = errObj.description ? errObj.description[0] : null
                  this.input.flag.errMsg = errObj.flag ? errObj.flag[0] : null
                }
              } else {
                this.$bvToast.toast("Failed to add new option due to network error.", { autoHideDelay: 5000, variant: "danger", solid: true })
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

    editOption(id) {
      this.loadingIndicator = false

      try {
        this.getCategoryList()
        this.editOptionDialog = true

        getOption(id)
          .then((res) => {
            if(res.data.status) {
              const data = res.data.data
              this.optionData = data

              this.input.category.value = data.category
              this.input.code.value = data.code
              this.input.display.value = data.display
              this.input.desc.value = data.description
              this.input.flag.value = data.flag

              this.addOptionDialog = true
            } else {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
            }
          })
          .catch(() => {
            this.$bvToast.toast("Failed to load the option to be edited", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.loadingIndicator = false)
      } catch (e) {
        this.$bvToast.toast("Failed to display edit option form", { autoHideDelay: 5000, variant: "danger", solid: true })
      }

      window.scrollTo(0,0)
    },

    submitOptionUpdate() {
      // Form Validation
      var doSubmit = true
      doSubmit = this.inputValidation(doSubmit)

      // Submit
      if (doSubmit) {
        this.loadingIndicator = true

        if(this.input.category.value == 'New category') {
          this.input.category.value = this.input.newCategory.value
        }

        var newOptionObj = {
          category: this.input.category.value,
          code: this.input.code.value,
          display: this.input.display.value,
          description: this.input.desc.value,
          flag: this.input.flag.value
        }

        try {
          updateOption(this.optionData.id, newOptionObj)
            .then((res) => {
              if (res.data.status) {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })

                this.getOptionList()
                this.addOptionDialog = false
              } else {
                this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
              }
            })
            .catch((e) => {
              if(e.response.status && e.response.status == 422) {
                this.$bvToast.toast(e.response.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })

                if(e.response.data.errors) {
                  var errObj = e.response.data.errors
                  this.input.category.errMsg = errObj.category ? errObj.category[0] : null
                  this.input.code.errMsg = errObj.code ? errObj.code[0] : null
                  this.input.display.errMsg = errObj.display ? errObj.display[0] : null
                  this.input.desc.errMsg = errObj.description ? errObj.description[0] : null
                  this.input.flag.errMsg = errObj.flag ? errObj.flag[0] : null
                }
              } else {
                this.$bvToast.toast("Failed to update option due to network error.", { autoHideDelay: 5000, variant: "danger", solid: true })
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

    viewOption(id) {
      this.loadingIndicator = true

      try {
        getOption(id)
          .then((res) => {
            if(res.data.status) {
              const data = res.data.data

              this.optionData = data
              this.optionDialog = true
            } else {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
            }

            this.loadingIndicator = false
          })
          .catch(() => {
            this.$bvToast.toast("Failed to load option details", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.loadingIndicator = false)
      } catch (e) {
        console.error(e)
      }
    },

    async delOption(id) {
      this.loadingIndicator = true

      try {
        await deleteOption(id)
          .then((res) => {
            this.deleteOptionDialog = false
            this.optionDialog = false
            this.clearOptionData()

            if (res.data.status) {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "success", solid: true })

              this.getOptionList()
            } else {
              this.$bvToast.toast(res.data.message, { autoHideDelay: 5000, variant: "danger", solid: true })
            }
          })
          .catch(() => {
            this.$bvToast.toast("Failed to delete option", { autoHideDelay: 5000, variant: "danger", solid: true })
          })
          .finally(() => this.loadingIndicator = false)
      } catch (e) {
        console.error(e)
        this.$bvToast.toast("Failed to delete option due to network error", { autoHideDelay: 5000, variant: "danger", solid: true })
      }

      window.scrollTo(0,0)
    },

    delOptionConfirmation(option) {
      this.optionData.id = option.id
      this.optionData.category = option.category
      this.optionData.code = option.code
      this.optionData.display = option.display
      this.deleteOptionDialog = true
    },

    cancelDelOption() {
      this.deleteOptionDialog = false
      this.$bvToast.toast("The option was not deleted", { autoHideDelay: 3000, variant: "warning", solid: true })
      this.optionDialog ? null : this.clearOptionData()
    },

    clearOptionData() {
      this.optionData = {}

      this.formValidation = false

      this.input = {
        category: { value: '', errMsg: null },
        newCategory: { value: '', errMsg: null },
        code: { value: '', errMsg: null },
        display: { value: '', errMsg: null },
        desc: { value: '', errMsg: null },
        flag: { value: '', errMsg: null }
      }
    },

    inputValidation(doSubmit) {
      this.formValidation = true

      // Form Validation
      this.input.category.errMsg = null
      this.input.code.errMsg = null
      this.input.display.errMsg = null
      this.input.desc.errMsg = null
      this.input.flag.errMsg = null

      if (!this.input.category.value) {
        this.input.category.errMsg = "Category is required."
        doSubmit = false
      } else if (this.input.category.value == 'New category' && !this.input.newCategory.value) {
        this.input.newCategory.errMsg = "New category name is required."
        doSubmit = false
      }

      if (!this.input.code.value) {
        this.input.code.errMsg = "Code is required."
        doSubmit = false
      }

      if (!this.input.display.value) {
        this.input.display.errMsg = "Display is required."
        doSubmit = false
      }

      return doSubmit
    }
  }
}
</script>
